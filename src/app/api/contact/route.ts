import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export type QuotePayload = {
  types: string[]; // types de projet sélectionnés
  name: string;
  email: string;
  company?: string;
  budget?: string;
  message: string;
};

// Destinataire du mail (modifiable via env CONTACT_TO).
const TO = process.env.CONTACT_TO || 'gecinqcreative@gmail.com';
// Expéditeur : domaine vérifié Resend, ou l'adresse de test onboarding@resend.dev
// (celle-ci n'envoie qu'à l'adresse du compte Resend → parfait pour se notifier).
const FROM = process.env.CONTACT_FROM || 'GECINQ CREATIVE <onboarding@resend.dev>';

const esc = (s: string) =>
  s.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c]!);

// ─────────────────────────────────────────────────────────────────────────────
// ENVOI DU MAIL vers gecinqcreative@gmail.com via Resend.
// Nécessite RESEND_API_KEY (voir .env.local.example). Sans clé : log seulement.
// ─────────────────────────────────────────────────────────────────────────────
async function sendQuoteRequest(p: QuotePayload): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log('[contact] (pas de RESEND_API_KEY) demande de devis :', p);
    return;
  }
  const resend = new Resend(key);
  const html = `
    <h2>Nouvelle demande de devis</h2>
    <p><strong>Type(s) :</strong> ${esc(p.types.join(', '))}</p>
    <p><strong>Nom :</strong> ${esc(p.name)}</p>
    <p><strong>Email :</strong> ${esc(p.email)}</p>
    ${p.company ? `<p><strong>Société :</strong> ${esc(p.company)}</p>` : ''}
    <p><strong>Message :</strong></p>
    <p style="white-space:pre-wrap">${esc(p.message)}</p>
  `;
  const { error } = await resend.emails.send({
    from: FROM,
    to: TO,
    replyTo: p.email, // répondre directement au client
    subject: `Devis — ${p.name} (${p.types.join(', ')})`,
    html,
  });
  if (error) throw new Error(error.message);
}

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export async function POST(req: Request) {
  let body: Partial<QuotePayload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const types = Array.isArray(body.types) ? body.types.filter(Boolean) : [];
  const name = (body.name ?? '').trim();
  const email = (body.email ?? '').trim();
  const message = (body.message ?? '').trim();

  // validation simple : champs requis + email valide
  if (!name || !email || !message || types.length === 0) {
    return NextResponse.json(
      { error: 'Merci de remplir les champs requis.' },
      { status: 400 },
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: 'Adresse email invalide.' },
      { status: 400 },
    );
  }

  try {
    await sendQuoteRequest({
      types,
      name,
      email,
      company: body.company?.trim() || undefined,
      budget: body.budget?.trim() || undefined,
      message,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[contact] échec de l’envoi :', e);
    return NextResponse.json(
      { error: 'Envoi impossible pour le moment. Réessaie plus tard.' },
      { status: 500 },
    );
  }
}
