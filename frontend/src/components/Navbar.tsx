import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between mb-6">
      {/* LOGO + Title */}
      <div className="flex items-center gap-4">
        <img src="/logo.svg" alt="logo" className="h-10 w-auto" />
        <div>
          <h1 className="text-2xl app-title">HelpDesk Assistant</h1>
          <p className="text-sm app-subtitle">Voice-powered troubleshooting</p>
        </div>
      </div>

      {/* NAV LINKS */}
      <div className="hidden sm:flex gap-4 items-center">
        <Link className="btn btn-primary" href="/">
          Home
        </Link>
        <Link className="btn btn-primary" href="/history">
          History
        </Link>
        <Link className="btn btn-ghost" href="/devices">
          Devices
        </Link>
      </div>
    </nav>
  );
}
