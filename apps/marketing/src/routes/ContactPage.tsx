import { useState, type FormEvent, type ReactNode } from 'react';
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { siteContent } from '../data/content';
import { SectionHeading } from '../components/SectionHeading';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { FaqItem } from '../components/FaqItem';
import { Reveal } from '../components/Reveal';

interface FormState {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

const EMPTY_FORM: FormState = { name: '', phone: '', email: '', subject: '', message: '' };

export function ContactPage() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [sent, setSent] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = 'Please enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Please enter a valid email.';
    if (!form.message.trim()) next.message = "Please add a short message so we know how to help.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    // There's no backend endpoint to receive this yet, so submission opens
    // the visitor's email client pre-filled with what they entered — a real
    // outcome, rather than a form that silently goes nowhere.
    const subject = encodeURIComponent(form.subject || `Message from ${form.name}`);
    const body = encodeURIComponent(
      `${form.message}\n\n---\nName: ${form.name}\nPhone: ${form.phone || 'Not provided'}\nEmail: ${form.email}`,
    );
    window.location.href = `mailto:${siteContent.email}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      <Reveal>
        <SectionHeading eyebrow="Contact" title="Talk to us" description="We usually reply the same day." />
      </Reveal>

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal className="rounded-2xl bg-navy-900 p-8 text-white">
          <img src="/logo-icon.png" alt="" className="h-11 w-11" />
          <h2 className="mt-5 text-xl font-bold">We're here to help</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            Questions about a visit, a service, or coverage in your area — reach us any of these ways.
          </p>

          <div className="mt-7 space-y-4 text-sm">
            <a href={`tel:${siteContent.phoneHref}`} className="flex items-center gap-3 text-white/90 hover:text-white">
              <Phone size={16} aria-hidden="true" /> {siteContent.phoneDisplay}
            </a>
            <a
              href={`https://wa.me/${siteContent.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-white/90 hover:text-white"
            >
              <MessageCircle size={16} aria-hidden="true" /> WhatsApp us
            </a>
            <a href={`mailto:${siteContent.email}`} className="flex items-center gap-3 text-white/90 hover:text-white">
              <Mail size={16} aria-hidden="true" /> {siteContent.email}
            </a>
            <p className="flex items-center gap-3 text-white/90">
              <Clock size={16} aria-hidden="true" /> {siteContent.officeHours}
            </p>
            <p className="flex items-center gap-3 text-white/90">
              <MapPin size={16} aria-hidden="true" /> Serving select areas of {siteContent.city}
            </p>
          </div>
        </Reveal>

        <Reveal delay={100} className="rounded-2xl border border-line bg-white p-8 shadow-soft">
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center py-10 text-center">
              <p className="text-lg font-semibold text-navy-900">Opening your email app…</p>
              <p className="mt-2 max-w-sm text-sm text-ink-600">
                If it didn't open automatically, email us directly at{' '}
                <a href={`mailto:${siteContent.email}`} className="font-medium text-teal-600">
                  {siteContent.email}
                </a>
                .
              </p>
              <Button className="mt-6" variant="secondary" onClick={() => { setForm(EMPTY_FORM); setSent(false); }}>
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name" htmlFor="name" error={errors.name}>
                  <Input id="name" value={form.name} onChange={(e) => update('name', e.target.value)} autoComplete="name" />
                </Field>
                <Field label="Phone (optional)" htmlFor="phone">
                  <Input id="phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} autoComplete="tel" />
                </Field>
              </div>
              <Field label="Email" htmlFor="email" error={errors.email} className="mt-5">
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  autoComplete="email"
                />
              </Field>
              <Field label="Subject (optional)" htmlFor="subject" className="mt-5">
                <Input id="subject" value={form.subject} onChange={(e) => update('subject', e.target.value)} />
              </Field>
              <Field label="Message" htmlFor="message" error={errors.message} className="mt-5">
                <textarea
                  id="message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                  className="w-full rounded-md border border-line px-3 py-2 text-sm shadow-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                />
              </Field>
              <Button type="submit" className="mt-6 w-full">
                Send message
              </Button>
              <p className="mt-3 text-center text-xs text-ink-400">
                This opens your email app with your message pre-filled — we don't have live chat support yet.
              </p>
            </form>
          )}
        </Reveal>
      </div>

      <Reveal delay={160} className="mx-auto mt-20 max-w-2xl">
        <SectionHeading eyebrow="Support" title="A few quick answers" center />
        <div className="mt-6">
          {siteContent.faqs.slice(0, 3).map((faq) => (
            <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </Reveal>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  error,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-navy-900">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
