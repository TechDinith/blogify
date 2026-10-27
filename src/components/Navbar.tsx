import { Link, NavLink } from "react-router-dom";
import { Moon, Sun, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30"
        : "text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))]/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white font-bold">
            B
          </span>
          <span className="text-lg font-bold tracking-tight">Blogify</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/explore" className={navLinkClass}>
            Explore
          </NavLink>
          {user && (
            <NavLink to="/create" className={navLinkClass}>
              New Post
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="btn-ghost p-2"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full"
                />
                <span className="text-sm font-medium">{user.name}</span>
              </Link>
              <button onClick={logout} className="btn-ghost p-2" aria-label="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/login" className="btn-ghost">
                Log in
              </Link>
              <Link to="/register" className="btn-primary">
                Sign up
              </Link>
            </div>
          )}

          <button
            className="btn-ghost p-2 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-[rgb(var(--border))] px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            <NavLink to="/" className={navLinkClass} end onClick={() => setOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/explore" className={navLinkClass} onClick={() => setOpen(false)}>
              Explore
            </NavLink>
            {user ? (
              <>
                <NavLink to="/create" className={navLinkClass} onClick={() => setOpen(false)}>
                  New Post
                </NavLink>
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="btn-ghost justify-start"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost justify-start" onClick={() => setOpen(false)}>
                  Log in
                </Link>
                <Link to="/register" className="btn-primary justify-start" onClick={() => setOpen(false)}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
