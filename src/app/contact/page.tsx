'use client';

import { useState } from 'react';
import Link from 'next/link';
import SplitText from '@/components/ui/SplitText';
import Footer from '@/components/ui/Footer';

const PROJECT_TYPES = [
  'Vidéo / Photo',
  'Web',
  'Social media',
  'Branding',
  'Motion design',
];

type Status = 'idle' | 'loading' | 'success' | 'error';
const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export default function ContactPage() {
  const [types, setTypes] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const toggleType = (t: string) =>
    setTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    // validation client
    if (types.length === 0)
      return setError('Choisis au moins un type de projet.');
    if (!name.trim()) return setError('Ton nom est requis.');
    if (!isValidEmail(email)) return setError('Adresse email invalide.');
    if (!message.trim()) return setError('Décris brièvement ton projet.');

    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ types, name, email, company, message }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Erreur lors de l’envoi.');
      }
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Erreur lors de l’envoi.');
    }
  }

  const inputCls =
    'w-full border-b border-white/20 bg-transparent py-2 text-sm text-ink placeholder:text-white/30 outline-none transition-colors focus:border-white/60';

  if (status === 'success') {
    return (
      <main className="enter min-h-screen bg-paper px-5 pb-24 pt-28 sm:pt-36 md:pt-44">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-4xl font-bold uppercase tracking-[-0.04em] md:text-5xl">
            Merci !
          </h1>
          <p className="mt-4 text-sm text-ink/70">
            Ta demande de devis est bien partie. On revient vers toi très vite.
          </p>
          <Link
            href="/"
            className="caps mt-8 inline-block text-[11px] text-ink/60 underline-offset-4 hover:underline"
          >
            ← Retour à l’accueil
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="enter min-h-screen bg-paper px-5 pb-24 pt-28 sm:pt-36 md:pt-44">
      <div className="mx-auto max-w-xl">
        <header className="mb-12">
          <div className="caps mb-3 text-[10px] text-ink/50">Contact</div>
          <h1 className="text-5xl font-bold uppercase leading-[0.95] tracking-[-0.04em] md:text-6xl">
            <SplitText text="Prendre rendez-vous" />
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/60">
            Parle-nous de ton projet : on revient vers toi avec une proposition
            adaptée. Tous les champs marqués sont requis.
          </p>

          {/* contact direct */}
          <div className="mt-8">
            <div className="caps mb-1 text-[10px] text-ink/45">Email</div>
            <a
              href="mailto:gecinqcreative@gmail.com"
              className="text-sm text-ink transition-opacity hover:opacity-60"
            >
              gecinqcreative@gmail.com
            </a>
          </div>
        </header>

        <form onSubmit={onSubmit} className="space-y-10">
          {/* types de projet — chips multi-sélection */}
          <fieldset>
            <legend className="caps mb-3 text-[10px] text-ink/50">
              Type(s) de projet *
            </legend>
            <div className="flex flex-wrap gap-2">
              {PROJECT_TYPES.map((t) => {
                const on = types.includes(t);
                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() => toggleType(t)}
                    aria-pressed={on}
                    className={`rounded-none border px-4 py-2 text-xs transition-colors ${
                      on
                        ? 'border-ink bg-ink text-paper'
                        : 'border-white/25 text-ink/80 hover:border-white/60'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <label className="block">
              <span className="caps mb-1 block text-[10px] text-ink/50">
                Nom *
              </span>
              <input
                className={inputCls}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ton nom"
                autoComplete="name"
              />
            </label>
            <label className="block">
              <span className="caps mb-1 block text-[10px] text-ink/50">
                Email *
              </span>
              <input
                className={inputCls}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="toi@exemple.com"
                autoComplete="email"
              />
            </label>
            <label className="block">
              <span className="caps mb-1 block text-[10px] text-ink/50">
                Société (optionnel)
              </span>
              <input
                className={inputCls}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Nom de la société"
              />
            </label>
          </div>

          <label className="block">
            <span className="caps mb-1 block text-[10px] text-ink/50">
              Message / brief *
            </span>
            <textarea
              className={`${inputCls} min-h-[120px] resize-y`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Décris ton projet, tes objectifs, ton échéance…"
            />
          </label>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="caps rounded-none bg-ink px-7 py-3 text-[11px] text-paper transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {status === 'loading' ? 'Envoi…' : 'Envoyer la demande'}
            </button>
            <Link
              href="/"
              className="caps text-[10px] text-ink/50 hover:text-ink"
            >
              Annuler
            </Link>
          </div>
        </form>
      </div>
      <Footer />
    </main>
  );
}
