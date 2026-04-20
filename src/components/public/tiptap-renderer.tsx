import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import type {
  TiptapBlock,
  TiptapDoc,
  TiptapInline,
  TiptapListItem,
  TiptapMark,
  TiptapText,
} from "./mock-articles";

/**
 * TiptapRenderer — pure server component that turns a Tiptap JSON document
 * into semantic React output. Styled with Tailwind utilities only (no
 * typography plugin required). Headings receive slugified `id`s so the ToC
 * component can jump to them, and `scroll-margin-top` keeps them below the
 * sticky navbar.
 *
 * Keep this file dependency-light — consumed by both the public article page
 * and (later) admin preview.
 */
interface TiptapRendererProps {
  content: TiptapDoc;
  /** Optional node to inject after the first H2 — used for in-content CTAs. */
  afterFirstH2?: ReactNode;
  className?: string;
}

export function TiptapRenderer({
  content,
  afterFirstH2,
  className,
}: TiptapRendererProps) {
  if (!content?.content?.length) return null;

  let firstH2Rendered = false;

  const nodes: ReactNode[] = [];
  content.content.forEach((block, index) => {
    nodes.push(
      <BlockNode key={`block-${index}`} block={block} index={index} />,
    );
    // Inject the provided CTA immediately after the first H2 heading.
    if (
      afterFirstH2 &&
      !firstH2Rendered &&
      block.type === "heading" &&
      block.attrs.level === 2
    ) {
      firstH2Rendered = true;
      nodes.push(<div key={`after-h2-${index}`}>{afterFirstH2}</div>);
    }
  });

  return (
    <article
      className={[
        // Base typography — Thai body line-height 1.75 for comfortable reading.
        "space-y-5 text-base leading-[1.75] text-[color:var(--color-body)]",
        className ?? "",
      ].join(" ")}
    >
      {nodes}
    </article>
  );
}

// ---------------------------------------------------------------------------
// Block-level rendering

function BlockNode({ block }: { block: TiptapBlock; index: number }) {
  switch (block.type) {
    case "heading":
      return renderHeading(block);
    case "paragraph":
      return renderParagraph(block);
    case "bulletList":
      return (
        <ul className="my-3 list-disc space-y-2 pl-6 marker:text-[color:var(--color-primary)]">
          {block.content.map((li, i) => (
            <ListItemNode key={i} item={li} />
          ))}
        </ul>
      );
    case "orderedList":
      return (
        <ol className="my-3 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[color:var(--color-primary)]">
          {block.content.map((li, i) => (
            <ListItemNode key={i} item={li} />
          ))}
        </ol>
      );
    case "image":
      return (
        <figure className="my-8 overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-alt-bg)]">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={block.attrs.src}
              alt={block.attrs.alt ?? ""}
              fill
              sizes="(min-width: 1024px) 768px, 100vw"
              className="object-cover"
            />
          </div>
          {block.attrs.title && (
            <figcaption className="px-4 py-2 text-center text-xs text-[color:var(--color-muted)]">
              {block.attrs.title}
            </figcaption>
          )}
        </figure>
      );
    case "blockquote":
      return (
        <blockquote className="my-6 border-l-4 border-[color:var(--color-primary)] bg-[color:var(--color-light-bg)] px-5 py-4 text-[15px] italic text-[color:var(--color-heading)]">
          {block.content?.map((inner, i) => (
            <BlockNode key={i} block={inner} index={i} />
          ))}
        </blockquote>
      );
    case "codeBlock":
      return (
        <pre className="my-4 overflow-x-auto rounded-lg bg-[color:var(--color-heading)] p-4 text-sm text-white">
          <code>
            {block.content?.map((c, i) => (
              <span key={i}>{c.text}</span>
            ))}
          </code>
        </pre>
      );
    default:
      return null;
  }
}

function renderHeading(
  block: Extract<TiptapBlock, { type: "heading" }>,
) {
  const text = getPlainText(block.content ?? []);
  const id = slugify(text);
  const inlineNodes = renderInlines(block.content ?? []);

  // Force level 1 headings to H2 — the page already owns the H1 (article
  // title) and shipping two H1s is bad for SEO.
  const effectiveLevel = block.attrs.level === 1 ? 2 : block.attrs.level;

  const common = "scroll-mt-24 text-[color:var(--color-heading)]";
  if (effectiveLevel === 2) {
    return (
      <h2
        id={id}
        className={`mt-10 text-2xl font-bold leading-tight md:text-[28px] ${common}`}
      >
        {inlineNodes}
      </h2>
    );
  }
  if (effectiveLevel === 3) {
    return (
      <h3
        id={id}
        className={`mt-8 text-xl font-semibold leading-snug md:text-[22px] ${common}`}
      >
        {inlineNodes}
      </h3>
    );
  }
  return (
    <h4 id={id} className={`mt-6 text-lg font-semibold ${common}`}>
      {inlineNodes}
    </h4>
  );
}

function renderParagraph(block: Extract<TiptapBlock, { type: "paragraph" }>) {
  if (!block.content || block.content.length === 0) return <p className="h-4" />;
  return (
    <p className="text-[15px] leading-[1.85] md:text-base">
      {renderInlines(block.content)}
    </p>
  );
}

function ListItemNode({ item }: { item: TiptapListItem }) {
  return (
    <li className="text-[15px] leading-[1.75] md:text-base">
      {item.content?.map((inner, i) => {
        // Collapse nested paragraph into inline content so the <li> doesn't
        // render with an extra block gap.
        if (inner.type === "paragraph") {
          return (
            <span key={i}>
              {renderInlines(inner.content ?? [])}
            </span>
          );
        }
        return <BlockNode key={i} block={inner} index={i} />;
      })}
    </li>
  );
}

// ---------------------------------------------------------------------------
// Inline rendering

function renderInlines(inlines: TiptapInline[]): ReactNode {
  return inlines.map((node, i) => (
    <InlineNode key={i} node={node} index={i} />
  ));
}

function InlineNode({ node, index }: { node: TiptapInline; index: number }) {
  if (node.type !== "text") return null;
  return applyMarks(node, index);
}

function applyMarks(node: TiptapText, key: number): ReactNode {
  const marks = node.marks ?? [];
  let output: ReactNode = node.text;

  for (const mark of marks) {
    output = wrapWithMark(mark, output, key);
  }
  return <span key={key}>{output}</span>;
}

function wrapWithMark(
  mark: TiptapMark,
  child: ReactNode,
  key: number,
): ReactNode {
  switch (mark.type) {
    case "bold":
      return (
        <strong key={key} className="font-semibold text-[color:var(--color-heading)]">
          {child}
        </strong>
      );
    case "italic":
      return <em key={key}>{child}</em>;
    case "link": {
      const { href, target, rel } = mark.attrs;
      const isExternal =
        /^https?:\/\//.test(href) && !href.includes("besttutorthailand.com");
      if (isExternal) {
        return (
          <a
            key={key}
            href={href}
            target={target ?? "_blank"}
            rel={rel ?? "noopener noreferrer"}
            className="font-medium text-[color:var(--color-primary)] underline decoration-[color:var(--color-primary)]/40 underline-offset-2 hover:decoration-[color:var(--color-primary)]"
          >
            {child}
          </a>
        );
      }
      return (
        <Link
          key={key}
          href={href}
          className="font-medium text-[color:var(--color-primary)] underline decoration-[color:var(--color-primary)]/40 underline-offset-2 hover:decoration-[color:var(--color-primary)]"
        >
          {child}
        </Link>
      );
    }
    default:
      return child;
  }
}

// ---------------------------------------------------------------------------
// Public utilities — used by pages to build ToC + estimate read time.

/** Flatten Tiptap content to extract H2/H3 headings for a ToC sidebar. */
export function extractTocFromContent(
  content: TiptapDoc,
): Array<{ id: string; text: string; level: 2 | 3 }> {
  const items: Array<{ id: string; text: string; level: 2 | 3 }> = [];
  for (const block of content.content) {
    if (block.type !== "heading") continue;
    // Treat H1 as H2 (same coercion applied in the renderer).
    const level = block.attrs.level === 1 ? 2 : block.attrs.level;
    if (level !== 2 && level !== 3) continue;
    const text = getPlainText(block.content ?? []).trim();
    if (!text) continue;
    items.push({ id: slugify(text), text, level });
  }
  return items;
}

/** Estimate read time in minutes — assumes 200 WPM with a 2-min minimum. */
export function estimateReadTime(content: TiptapDoc): number {
  const text = extractAllText(content);
  // Thai text has no word boundaries; count characters and map to words.
  const words = Math.max(1, Math.round(text.length / 4));
  const minutes = Math.max(2, Math.round(words / 200));
  return minutes;
}

// ---------------------------------------------------------------------------
// Internal utilities

function getPlainText(inlines: readonly TiptapInline[]): string {
  return inlines.map((n) => (n.type === "text" ? n.text : "")).join("");
}

function extractAllText(content: TiptapDoc): string {
  const buf: string[] = [];
  const walk = (blocks: readonly TiptapBlock[]) => {
    for (const block of blocks) {
      switch (block.type) {
        case "heading":
        case "paragraph":
          buf.push(getPlainText(block.content ?? []));
          break;
        case "bulletList":
        case "orderedList":
          for (const li of block.content) {
            if (li.content) walk(li.content);
          }
          break;
        case "blockquote":
          if (block.content) walk(block.content);
          break;
        case "codeBlock":
          buf.push(getPlainText(block.content ?? []));
          break;
        case "image":
          break;
      }
    }
  };
  walk(content.content);
  return buf.join(" ");
}

/**
 * Slugify heading text into an anchor id. Handles Thai by falling back to a
 * sanitized lowercased string with non-word characters replaced by hyphens.
 * Collisions are acceptable in practice (headings in one article rarely
 * duplicate), but we keep this deterministic for ToC pairing.
 */
function slugify(text: string): string {
  const normalized = text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]+/gu, "")
    .replace(/\s+/g, "-");
  return normalized.length > 0 ? normalized : "section";
}
