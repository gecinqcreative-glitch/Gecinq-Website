import Link from 'next/link';

/** Mini footer : coordonnées + liens + mentions. */
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 px-5 py-14 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xl font-bold uppercase tracking-[-0.03em]">
            GECINQ CREATIVE
          </div>
          <div className="caps mt-2 text-[10px] text-ink/45">
            Studio créatif — Lausanne (CH)
          </div>
        </div>
        <div className="flex flex-col gap-4 md:items-end">
          <a
            href="mailto:gecinqcreative@gmail.com"
            className="text-sm text-ink/70 transition-colors hover:text-ink"
          >
            gecinqcreative@gmail.com
          </a>
          <nav className="flex gap-6">
            <Link href="/projets" className="caps text-[10px] text-ink/50 hover:text-ink">
              Projets
            </Link>
            <Link
              href="/qui-nous-sommes"
              className="caps text-[10px] text-ink/50 hover:text-ink"
            >
              Studio
            </Link>
            <Link href="/contact" className="caps text-[10px] text-ink/50 hover:text-ink">
              Contact
            </Link>
          </nav>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-6xl text-[10px] text-ink/30">
        © {year} GECINQ CREATIVE — Tous droits réservés.
      </div>
    </footer>
  );
}
