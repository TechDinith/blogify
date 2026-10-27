const Footer = () => (
  <footer className="border-t border-[rgb(var(--border))] py-8">
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-[rgb(var(--muted))] md:flex-row">
      <p>© {new Date().getFullYear()} Blogify. All rights reserved.</p>
      <div className="flex gap-4">
        <a href="https://github.com" className="hover:text-brand-600" target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href="#" className="hover:text-brand-600">
          About
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
