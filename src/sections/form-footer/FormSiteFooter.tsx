import { NavAnchorLink } from "@/components/ui/NavAnchorLink";
import { navLinks, site } from "@/lib/site";

export function FormSiteFooter() {
  return (
    <footer className="mt-16 border-t border-preloader-fg/12 pt-10 md:mt-20 md:pt-12">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-10">
        <div>
          <p className="font-display text-[clamp(1.5rem,4vw,2.25rem)] font-medium tracking-[-0.03em] text-preloader-fg">
            {site.name}
          </p>
          <p className="mt-3 max-w-[28rem] text-[11px] leading-relaxed tracking-normal text-preloader-fg/55 md:text-xs">
            {site.disclaimer}
          </p>
        </div>
        <nav
          className="flex flex-wrap gap-x-6 gap-y-2"
          aria-label="Footer"
        >
          {navLinks.map((link) => (
            <NavAnchorLink
              key={link.href}
              href={link.href}
              className="text-[11px] font-medium tracking-normal text-preloader-fg/55 transition-colors duration-300 hover:text-accent-bright"
            >
              {link.label}
            </NavAnchorLink>
          ))}
        </nav>
      </div>
    </footer>
  );
}
