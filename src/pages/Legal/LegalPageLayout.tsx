import { Container } from '@/components/layout/Container';
import { Page } from '@/components/layout/Page';
import { PageHeader } from '@/components/layout/PageHeader';

export interface LegalSection {
  id: string;
  heading: string;
  paragraphs: string[];
  list?: string[];
}

export interface LegalPageLayoutProps {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

/**
 * Shared shell for /terms and /privacy. Content is structured placeholder text
 * with a stable heading hierarchy so real legal copy can be dropped in without
 * touching layout.
 */
export function LegalPageLayout({ title, updated, intro, sections }: LegalPageLayoutProps) {
  return (
    <Page atmosphere="legal">
      <PageHeader eyebrow={`Last updated ${updated}`} title={title} description={intro} size="narrow" />

      <Container size="narrow">
        <div className="grid gap-10 lg:grid-cols-[180px_minmax(0,1fr)]">
          <nav aria-label="Sections" className="hidden lg:block">
            <ol className="sticky top-[calc(var(--header-h)+24px)] list-none space-y-2 p-0">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="flex gap-2 text-[12.5px] leading-snug text-void-400 transition-colors hover:text-void-100"
                  >
                    <span className="font-mono text-void-600">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-12">
            {sections.map((section, index) => (
              <section key={section.id} id={section.id} className="scroll-mt-28">
                <h2 className="flex gap-3 text-[17px]">
                  <span className="font-mono text-[13px] text-void-600">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {section.heading}
                </h2>
                <div className="mt-3 space-y-3">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 32)} className="text-[13.5px] leading-relaxed text-void-300">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.list && (
                  <ul className="mt-4 list-none space-y-2 border-l border-white/8 pl-4 p-0">
                    {section.list.map((item) => (
                      <li key={item.slice(0, 32)} className="text-[13px] leading-relaxed text-void-300">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <p className="border-t border-white/7 pt-6 text-[12px] leading-relaxed text-void-500">
              This document is structured placeholder content for a demonstration project. It is not
              legal advice and should be replaced with counsel-reviewed terms before any real
              commercial use.
            </p>
          </div>
        </div>
      </Container>
    </Page>
  );
}
