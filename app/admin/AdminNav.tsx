import Link from "next/link";

type AdminNavProps = {
  collapsed?: boolean;
};

type AdminLink = {
  href: string;
  label: string;
  icon: string;
};

type AdminSection = {
  title: string;
  links: AdminLink[];
};

const adminSections: AdminSection[] = [
  {
    title: "Overview",
    links: [
      { href: "/admin", label: "Dashboard", icon: "grid" },
      { href: "/admin/profiles", label: "Profiles", icon: "user" },
    ],
  },
  {
    title: "Content",
    links: [
      { href: "/admin/images", label: "Images", icon: "image" },
      { href: "/admin/captions", label: "Captions", icon: "text" },
      {
        href: "/admin/caption-requests",
        label: "Caption requests",
        icon: "inbox",
      },
      {
        href: "/admin/caption-examples",
        label: "Caption examples",
        icon: "bookmark",
      },
      { href: "/admin/terms", label: "Terms", icon: "book" },
    ],
  },
  {
    title: "Humor engine",
    links: [
      { href: "/admin/humor-flavors", label: "Humor flavors", icon: "spark" },
      { href: "/admin/humor-flavor-steps", label: "Humor steps", icon: "stack" },
      { href: "/admin/humor-flavor-mix", label: "Humor mix", icon: "sliders" },
    ],
  },
  {
    title: "LLM ops",
    links: [
      { href: "/admin/llm-providers", label: "LLM providers", icon: "plug" },
      { href: "/admin/llm-models", label: "LLM models", icon: "cpu" },
      {
        href: "/admin/llm-prompt-chains",
        label: "LLM prompt chains",
        icon: "link",
      },
      { href: "/admin/llm-responses", label: "LLM responses", icon: "chat" },
    ],
  },
  {
    title: "Access",
    links: [
      {
        href: "/admin/allowed-signup-domains",
        label: "Allowed domains",
        icon: "globe",
      },
      {
        href: "/admin/whitelisted-emails",
        label: "Whitelisted emails",
        icon: "mail",
      },
    ],
  },
];

function NavIcon({ name }: { name: string }) {
  switch (name) {
    case "grid":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" />
          <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor" />
          <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor" />
          <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" />
        </svg>
      );
    case "user":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <circle cx="12" cy="8" r="4" fill="currentColor" />
          <path d="M4 20c1.6-4 14.4-4 16 0" fill="currentColor" />
        </svg>
      );
    case "image":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" fill="none" strokeWidth="2" />
          <circle cx="9" cy="10" r="2" fill="currentColor" />
          <path d="M4 18l5-5 4 4 3-3 4 4" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      );
    case "text":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path d="M4 6h16M4 12h12M4 18h10" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      );
    case "inbox":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path d="M4 4h16v12H4z" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M4 16h5l2 3h2l2-3h5" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      );
    case "bookmark":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path d="M6 4h12v16l-6-4-6 4z" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      );
    case "book":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path d="M5 4h7v16H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M12 4h7a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-7" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path d="M12 3l2.2 5.2 5.2 2.2-5.2 2.2L12 18l-2.2-5.2-5.2-2.2 5.2-2.2z" fill="currentColor" />
        </svg>
      );
    case "stack":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path d="M12 4l8 4-8 4-8-4z" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M4 12l8 4 8-4" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M4 16l8 4 8-4" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      );
    case "sliders":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path d="M4 7h16M4 17h16" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="9" cy="7" r="2" fill="currentColor" />
          <circle cx="15" cy="17" r="2" fill="currentColor" />
        </svg>
      );
    case "plug":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path d="M8 3v6M16 3v6" stroke="currentColor" strokeWidth="2" />
          <path d="M6 9h12v4a6 6 0 0 1-12 0z" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M12 15v6" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case "cpu":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <rect x="7" y="7" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case "link":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path d="M9 7H7a5 5 0 0 0 0 10h2" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M15 7h2a5 5 0 0 1 0 10h-2" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M8 12h8" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case "chat":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path d="M4 5h16v10H7l-3 3z" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      );
    case "globe":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      );
    case "mail":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      );
    default:
      return null;
  }
}

export default function AdminNav({ collapsed = false }: AdminNavProps) {
  return (
    <nav className={collapsed ? "space-y-3" : "space-y-5"}>
      {collapsed ? (
        <div className="grid gap-2">
          {adminSections.flatMap((section) =>
            section.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 text-[#151515] transition hover:border-black/30 hover:bg-white"
                aria-label={link.label}
                title={link.label}
              >
                <NavIcon name={link.icon} />
              </Link>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4 text-xs text-[#6b5f57]">
          {adminSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#6b5f57]">
                {section.title}
              </p>
              <div className="grid gap-1">
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 rounded-lg px-2 py-1 text-[11px] uppercase tracking-[0.2em] text-[#151515] transition hover:bg-white/80"
                  >
                    <span className="text-[#6b5f57]">
                      <NavIcon name={link.icon} />
                    </span>
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}
