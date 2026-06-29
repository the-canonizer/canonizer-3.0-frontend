import { ReactNode } from "react";

import styles from "./skillGuide.module.scss";

import CodeBlock from "./CodeBlock";

// A focused markdown renderer for the vendored OpenClaw SKILL.md guide.
// Supports: frontmatter stripping, ATX headings, fenced code blocks,
// ordered/unordered lists, and inline **bold**, `code` and [links](url).
// The content is vendored and controlled, so we only handle what it uses.

const INLINE_RE = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  INLINE_RE.lastIndex = 0;
  while ((match = INLINE_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    const key = `${keyPrefix}-i${i++}`;

    if (token.startsWith("`")) {
      nodes.push(
        <code key={key} className={styles.inlineCode}>
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("**")) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else {
      const link = /\[([^\]]+)\]\(([^)]+)\)/.exec(token);
      if (link) {
        nodes.push(
          <a key={key} href={link[2]} target="_blank" rel="noopener noreferrer">
            {link[1]}
          </a>
        );
      }
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

function stripFrontmatter(md: string): string {
  if (!md.startsWith("---")) return md;
  const end = md.indexOf("\n---", 3);
  if (end === -1) return md;
  const after = md.indexOf("\n", end + 1);
  return after === -1 ? "" : md.slice(after + 1);
}

export function renderMarkdown(rawMarkdown: string): ReactNode[] {
  const md = stripFrontmatter(rawMarkdown);
  const lines = md.split("\n");
  const blocks: ReactNode[] = [];
  let key = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Blank line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Fenced code block
    if (line.trim().startsWith("```")) {
      const lang = line.trim().slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      blocks.push(
        <CodeBlock key={`b${key++}`} code={codeLines.join("\n")} lang={lang} />
      );
      continue;
    }

    // Heading
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const Tag = `h${level}` as any;
      blocks.push(
        <Tag key={`b${key++}`} className={styles[`h${level}`]}>
          {renderInline(heading[2], `h${key}`)}
        </Tag>
      );
      i++;
      continue;
    }

    // Unordered list
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={`b${key++}`} className={styles.list}>
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item, `ul${key}-${idx}`)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push(
        <ol key={`b${key++}`} className={styles.list}>
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item, `ol${key}-${idx}`)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Paragraph (consecutive non-blank, non-special lines)
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].trim().startsWith("```") &&
      !/^(#{1,6})\s+/.test(lines[i]) &&
      !/^[-*]\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i])
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    blocks.push(
      <p key={`b${key++}`} className={styles.paragraph}>
        {renderInline(paraLines.join(" "), `p${key}`)}
      </p>
    );
  }

  return blocks;
}
