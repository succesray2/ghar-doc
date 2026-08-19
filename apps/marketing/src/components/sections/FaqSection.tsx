import { siteContent } from '../../data/content';
import { Section } from '../Section';
import { SectionHeading } from '../SectionHeading';
import { FaqItem } from '../FaqItem';
import { Reveal } from '../Reveal';

export function FaqSection() {
  return (
    <Section id="faq">
      <Reveal>
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" center />
      </Reveal>
      <Reveal delay={80} className="mx-auto mt-10 max-w-2xl">
        {siteContent.faqs.map((f) => (
          <FaqItem key={f.question} question={f.question} answer={f.answer} />
        ))}
      </Reveal>
    </Section>
  );
}
