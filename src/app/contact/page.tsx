"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "@/components/gallery/Logo";

// ⚠️ Remplace par ta vraie adresse / tes vrais liens.
const CONTACT_EMAIL = "bonjour@gecinq.studio";
const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/" },
  { label: "LinkedIn", href: "https://linkedin.com/" },
  { label: "Vimeo", href: "https://vimeo.com/" },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Projet — ${name || "Contact"}`);
    const body = encodeURIComponent(
      `${message}\n\n— ${name}${email ? ` (${email})` : ""}`,
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <main className="page">
      <header className="page-top">
        <Link href="/" className="ov-logo" aria-label="Gecinq — accueil">
          <Logo className="ov-logo-svg" />
        </Link>
        <Link href="/" className="page-back">
          ← Work
        </Link>
      </header>

      <section className="page-hero">
        <p className="page-eyebrow">Contact</p>
        <h1 className="page-h1">Parlons de votre projet.</h1>
        <p className="page-lead">
          Une idée, un brief, une envie&nbsp;? Écris-nous — on répond vite.
        </p>
        <a className="contact-mail" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
      </section>

      <section className="page-section contact-grid">
        <form className="contact-form" onSubmit={onSubmit}>
          <label className="field">
            <span>Nom</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </label>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>
          <label className="field">
            <span>Message</span>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="cta-btn">
            Envoyer →
          </button>
        </form>

        <aside className="contact-side">
          <h2 className="page-h2">Ailleurs</h2>
          <ul className="social-list">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </main>
  );
}
