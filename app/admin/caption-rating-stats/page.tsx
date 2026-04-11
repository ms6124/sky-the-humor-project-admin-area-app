import Link from "next/link";
import { Suspense } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import LookbackForm from "./LookbackForm";

export const dynamic = "force-dynamic";

type RatingRow = {
  caption_id: string | null;
  vote_value: number | null;
  created_datetime_utc: string | null;
  profile_id: string | null;
};

async function TimeToFirstVoteCard({
  ratingRows,
  ratingWindowDays,
}: {
  ratingRows: RatingRow[];
  ratingWindowDays: number;
}) {
  const supabase = await createSupabaseServerClient();
  const captionFirstVoteMap = new Map<string, string>();
  for (const vote of ratingRows) {
    if (!vote.caption_id || !vote.created_datetime_utc) {
      continue;
    }
    const existing = captionFirstVoteMap.get(vote.caption_id);
    if (!existing || vote.created_datetime_utc < existing) {
      captionFirstVoteMap.set(vote.caption_id, vote.created_datetime_utc);
    }
  }
  const captionIds = Array.from(captionFirstVoteMap.keys());
  const chunkSize = 100;
  const captionCreatedRows: Array<{ id: string; created_datetime_utc: string | null }> =
    [];
  for (let index = 0; index < captionIds.length; index += chunkSize) {
    const chunk = captionIds.slice(index, index + chunkSize);
    const { data, error } = await supabase
      .from("captions")
      .select("id, created_datetime_utc")
      .in("id", chunk);
    if (error) {
      throw new Error(error.message);
    }
    if (data) {
      captionCreatedRows.push(...data);
    }
  }
  const captionCreatedMap = new Map(
    captionCreatedRows.map((caption) => [caption.id, caption.created_datetime_utc])
  );
  const hoursToFirstVote: number[] = [];
  for (const [captionId, firstVote] of captionFirstVoteMap.entries()) {
    const createdAt = captionCreatedMap.get(captionId);
    if (!createdAt) {
      continue;
    }
    const diffMs = new Date(firstVote).getTime() - new Date(createdAt).getTime();
    if (Number.isFinite(diffMs) && diffMs >= 0) {
      hoursToFirstVote.push(diffMs / (60 * 60 * 1000));
    }
  }
  hoursToFirstVote.sort((a, b) => a - b);
  const medianHoursToFirstVote = (() => {
    if (hoursToFirstVote.length === 0) {
      return null;
    }
    const mid = Math.floor(hoursToFirstVote.length / 2);
    if (hoursToFirstVote.length % 2 === 0) {
      return (hoursToFirstVote[mid - 1] + hoursToFirstVote[mid]) / 2;
    }
    return hoursToFirstVote[mid];
  })();

  return (
    <div className="rounded-3xl border border-black/10 bg-white/85 p-5 shadow-md">
      <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
        Time to first vote ({ratingWindowDays}d)
      </p>
      <p className="mt-3 text-2xl font-semibold text-[#151515]">
        {medianHoursToFirstVote !== null
          ? `${Math.round(medianHoursToFirstVote)}h`
          : "N/A"}
      </p>
      <p className="mt-2 text-xs text-[#6b5f57]">
        Median time from creation
      </p>
    </div>
  );
}

function TimeToFirstVoteFallback({ ratingWindowDays }: { ratingWindowDays: number }) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white/85 p-5 shadow-md">
      <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
        Time to first vote ({ratingWindowDays}d)
      </p>
      <p className="mt-3 text-2xl font-semibold text-[#151515]">…</p>
      <p className="mt-2 text-xs text-[#6b5f57]">Calculating</p>
    </div>
  );
}

type CaptionRatingStatsPageProps = {
  searchParams?: {
    window?: string | string[];
  };
};

export default async function CaptionRatingStatsPage({
  searchParams,
}: CaptionRatingStatsPageProps) {
  const supabase = await createSupabaseServerClient();
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const windowParam = Array.isArray(resolvedSearchParams?.window)
    ? resolvedSearchParams?.window[0]
    : resolvedSearchParams?.window;
  const requestedWindow = Number.parseInt(windowParam ?? "30", 10);
  const minWindowDays = 7;
  const maxWindowDays = 90;
  const ratingWindowDays = Number.isFinite(requestedWindow)
    ? Math.min(Math.max(requestedWindow, minWindowDays), maxWindowDays)
    : 30;
  const ratingSince = new Date(
    Date.now() - ratingWindowDays * 24 * 60 * 60 * 1000
  ).toISOString();

  const fetchRatingVotes = async () => {
    const pageSize = 1000;
    let offset = 0;
    const allVotes: Array<{
      caption_id: string | null;
      vote_value: number | null;
      created_datetime_utc: string | null;
      profile_id: string | null;
    }> = [];

    while (true) {
      const { data, error } = await supabase
        .from("caption_votes")
        .select("caption_id, vote_value, created_datetime_utc, profile_id")
        .gte("created_datetime_utc", ratingSince)
        .range(offset, offset + pageSize - 1);

      if (error) {
        throw new Error(error.message);
      }

      if (!data || data.length === 0) {
        break;
      }

      allVotes.push(...data);
      if (data.length < pageSize) {
        break;
      }
      offset += pageSize;
    }

    return allVotes;
  };
  const ratingVotes = await fetchRatingVotes();
  const { count: captionsTotalCount } = await supabase
    .from("captions")
    .select("id", { count: "exact", head: true });

  const ratingRows = (ratingVotes as RatingRow[]) ?? [];
  const captionRatings = new Map<
    string,
    { positives: number; negatives: number; total: number }
  >();
  const raterCounts = new Map<string, number>();
  let ratingCount = 0;
  let positiveCount = 0;
  let negativeCount = 0;
  for (const vote of ratingRows) {
    if (!vote.caption_id || typeof vote.vote_value !== "number") {
      continue;
    }
    if (vote.profile_id) {
      raterCounts.set(
        vote.profile_id,
        (raterCounts.get(vote.profile_id) ?? 0) + 1
      );
    }
    ratingCount += 1;
    if (vote.vote_value > 0) {
      positiveCount += 1;
    } else if (vote.vote_value < 0) {
      negativeCount += 1;
    }
    const current = captionRatings.get(vote.caption_id);
    if (current) {
      if (vote.vote_value > 0) {
        current.positives += 1;
      } else if (vote.vote_value < 0) {
        current.negatives += 1;
      }
      current.total += 1;
    } else {
      captionRatings.set(vote.caption_id, {
        positives: vote.vote_value > 0 ? 1 : 0,
        negatives: vote.vote_value < 0 ? 1 : 0,
        total: 1,
      });
    }
  }
  const ratedCaptionIds = Array.from(captionRatings.keys());
  const minVotesForRanking = 3;
  const ratingAverages = ratedCaptionIds
    .map((captionId) => {
      const rating = captionRatings.get(captionId);
      if (!rating) {
        return null;
      }
      return {
        captionId,
        netScore: rating.positives - rating.negatives,
        total: rating.total,
        positives: rating.positives,
        negatives: rating.negatives,
      };
    })
    .filter(
      (
        entry
      ): entry is {
        captionId: string;
        netScore: number;
        total: number;
        positives: number;
        negatives: number;
      } => Boolean(entry)
    )
    .filter((entry) => entry.total >= minVotesForRanking);
  ratingAverages.sort((a, b) => {
    if (b.netScore !== a.netScore) {
      return b.netScore - a.netScore;
    }
    return b.total - a.total;
  });
  const topRated = ratingAverages.slice(0, 3);
  const lowRated = ratingAverages.slice(-3).reverse();
  const mostRated = [...ratingAverages]
    .sort((a, b) => {
      if (b.total !== a.total) {
        return b.total - a.total;
      }
      return b.netScore - a.netScore;
    })
    .slice(0, 3);
  const rankingIds = Array.from(
    new Set(
      [...topRated, ...lowRated, ...mostRated].map((entry) => entry.captionId)
    )
  );
  const { data: rankedCaptions } =
    rankingIds.length > 0
      ? await supabase
          .from("captions")
          .select("id, content")
          .in("id", rankingIds)
      : { data: [] };
  const rankedCaptionMap = new Map(
    (rankedCaptions ?? []).map((caption) => [caption.id, caption.content])
  );
  const netScoreTotal = positiveCount - negativeCount;
  const ratingsPerCaption =
    captionRatings.size > 0
      ? (ratingCount / captionRatings.size).toFixed(1)
      : "0.0";
  const coveragePercent =
    captionsTotalCount && captionsTotalCount > 0
      ? Math.round((captionRatings.size / captionsTotalCount) * 100)
      : 0;
  const topRater = Array.from(raterCounts.entries()).reduce<{
    profileId: string;
    count: number;
  } | null>((acc, [profileId, count]) => {
    if (!acc || count > acc.count) {
      return { profileId, count };
    }
    return acc;
  }, null);
  const { data: topRaterProfile } = topRater
    ? await supabase
        .from("profiles")
        .select("first_name, last_name, email")
        .eq("id", topRater.profileId)
        .maybeSingle()
    : { data: null };
  const topRaterLabel = topRaterProfile
    ? `${topRaterProfile.first_name ?? ""} ${
        topRaterProfile.last_name ?? ""
      }`.trim() || topRaterProfile.email || topRater?.profileId
    : topRater?.profileId;
  const topRaterStreak = (() => {
    if (!topRater) {
      return 0;
    }
    const daySet = new Set<string>();
    for (const vote of ratingRows) {
      if (vote.profile_id !== topRater.profileId || !vote.created_datetime_utc) {
        continue;
      }
      const dayKey = vote.created_datetime_utc.slice(0, 10);
      daySet.add(dayKey);
    }
    const days = Array.from(daySet)
      .map((day) => new Date(`${day}T00:00:00Z`).getTime())
      .sort((a, b) => a - b);
    let longest = 0;
    let current = 0;
    let prevDay: number | null = null;
    for (const day of days) {
      if (prevDay !== null && day - prevDay === 24 * 60 * 60 * 1000) {
        current += 1;
      } else {
        current = 1;
      }
      if (current > longest) {
        longest = current;
      }
      prevDay = day;
    }
    return longest;
  })();
  const startDate = new Date();
  startDate.setUTCDate(startDate.getUTCDate() - (ratingWindowDays - 1));
  startDate.setUTCHours(0, 0, 0, 0);
  const dailyCounts = Array.from({ length: ratingWindowDays }, (_, index) => {
    const day = new Date(startDate);
    day.setUTCDate(startDate.getUTCDate() + index);
    const label = day.toISOString().slice(5, 10);
    return { date: day, label, count: 0 };
  });
  for (const vote of ratingRows) {
    if (!vote.created_datetime_utc) {
      continue;
    }
    const voteDate = new Date(vote.created_datetime_utc);
    voteDate.setUTCHours(0, 0, 0, 0);
    const dayIndex = Math.round(
      (voteDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)
    );
    if (dayIndex >= 0 && dayIndex < dailyCounts.length) {
      dailyCounts[dayIndex].count += 1;
    }
  }
  const maxDailyCount = Math.max(1, ...dailyCounts.map((day) => day.count));

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
            Caption ratings
          </p>
          <h2 className="text-3xl font-semibold text-[#151515]">
            Audience scorecard
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/captions"
            className="rounded-full border border-black/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#151515] transition hover:border-black/30 hover:bg-white/70"
          >
            Captions
          </Link>
          <Link
            href="/admin"
            className="rounded-full border border-black/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#151515] transition hover:border-black/30 hover:bg-white/70"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <LookbackForm
        initialDays={ratingWindowDays}
        minDays={minWindowDays}
        maxDays={maxWindowDays}
      />

      <section className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: `Ratings (${ratingWindowDays}d)`,
              value: ratingCount,
              note: "Total votes recorded",
            },
            {
              label: `Captions rated (${ratingWindowDays}d)`,
              value: captionRatings.size,
              note: "Unique captions with votes",
            },
            {
              label: `Net score (${ratingWindowDays}d)`,
              value: netScoreTotal,
              note: "Positives minus negatives",
            },
            {
              label: `Votes per caption (${ratingWindowDays}d)`,
              value: ratingsPerCaption,
              note: "Engagement depth",
            },
            {
              label: `Top voter (${ratingWindowDays}d)`,
              value: topRater?.count ?? 0,
              note: topRaterLabel ?? "No votes yet",
            },
            {
              label: `Top voter streak (${ratingWindowDays}d)`,
              value: topRaterStreak,
              note: "Longest consecutive-day streak",
            },
            {
              label: `Ratings coverage (${ratingWindowDays}d)`,
              value: `${coveragePercent}%`,
              note: "Captions with at least 1 vote",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-black/10 bg-white/85 p-5 shadow-md"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
                {stat.label}
              </p>
              <p className="mt-3 text-2xl font-semibold text-[#151515]">
                {stat.value}
              </p>
              <p className="mt-2 text-xs text-[#6b5f57]">{stat.note}</p>
            </div>
          ))}
          <Suspense
            fallback={<TimeToFirstVoteFallback ratingWindowDays={ratingWindowDays} />}
          >
            <TimeToFirstVoteCard
              ratingRows={ratingRows}
              ratingWindowDays={ratingWindowDays}
            />
          </Suspense>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "Top rated captions",
              entries: topRated,
            },
            {
              title: "Lowest rated captions",
              entries: lowRated,
            },
            {
              title: "Most rated captions",
              entries: mostRated,
            },
          ].map((block) => (
            <div
              key={block.title}
              className="rounded-3xl border border-black/10 bg-white/85 p-5 shadow-md"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
                {block.title}
              </p>
              {block.entries.length === 0 ? (
                <p className="mt-3 text-sm text-[#6b5f57]">
                  Not enough ratings yet (min {minVotesForRanking} votes).
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {block.entries.map((entry) => (
                    <div
                      key={entry.captionId}
                      className="rounded-2xl border border-black/10 bg-white p-3"
                    >
                      <p className="text-sm font-semibold text-[#151515]">
                        {rankedCaptionMap.get(entry.captionId) ||
                          entry.captionId}
                      </p>
                      <div className="mt-2 text-xs text-[#6b5f57]">
                        {(() => {
                          const positivePercent = Math.round(
                            (entry.positives / entry.total) * 100
                          );
                          const negativePercent = Math.round(
                            (entry.negatives / entry.total) * 100
                          );
                          return `${entry.total} votes · ${positivePercent}% positive · ${negativePercent}% negative`;
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="rounded-3xl border border-black/10 bg-white/85 p-5 shadow-md">
          <p className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
            Engagement velocity
          </p>
          <p className="mt-2 text-sm text-[#6b5f57]">
            Votes per day (last {ratingWindowDays} days)
          </p>
          <div className="mt-4 flex h-40 items-end gap-1">
            {dailyCounts.map((day) => (
              <div
                key={day.label}
                title={`${day.label}: ${day.count} votes`}
                className="flex-1 rounded-t-md bg-[#151515]/10"
                style={{
                  height: `${Math.round((day.count / maxDailyCount) * 100)}%`,
                }}
              />
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[10px] uppercase tracking-[0.2em] text-[#6b5f57]">
            <span>{dailyCounts[0]?.label}</span>
            <span>{dailyCounts[dailyCounts.length - 1]?.label}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
