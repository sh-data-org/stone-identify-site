import { marked, Renderer } from 'marked';
import sanitizeHtml from 'sanitize-html';
import assets from '../../../content/assets.json';
const escape = (value: string) =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character] ?? character;
  });
export function renderArticle(markdown: string) {
  const headings: { id: string; title: string }[] = [];
  const renderer = new Renderer();
  renderer.heading = function ({ depth, tokens }) {
    const text = this.parser.parseInline(tokens);
    const level = Math.max(2, depth);
    if (level !== 2) return `<h${level}>${text}</h${level}>`;
    const id = `section-${headings.length + 1}`;
    headings.push({ id, title: sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} }) });
    return `<h2 id="${id}">${text}</h2>`;
  };
  renderer.paragraph = function ({ tokens }) {
    const content = this.parser.parseInline(tokens);
    return tokens.length === 1 && tokens[0]?.type === 'image' ? content : `<p>${content}</p>`;
  };
  renderer.image = ({ href, text }) => {
    const asset = assets.find((image) => image.path === href && image.reviewed);
    if (!asset) return '';
    return `<figure class="inline-photo"><img src="${escape(asset.path)}" alt="${escape(text || asset.alt)}" width="960" height="640" loading="lazy"><figcaption>${escape(text || asset.alt)} · <a href="${escape(asset.sourceUrl)}">${escape(asset.credit)}</a> · ${escape(asset.license)} · <a href="/credits">License details</a></figcaption></figure>`;
  };
  const html = sanitizeHtml(marked.parse(markdown, { async: false, renderer }), {
    allowedTags: [
      'p',
      'h2',
      'h3',
      'h4',
      'ul',
      'ol',
      'li',
      'strong',
      'em',
      'blockquote',
      'a',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'code',
      'pre',
      'hr',
      'br',
      'figure',
      'figcaption',
      'img',
    ],
    allowedAttributes: {
      a: ['href', 'title', 'rel'],
      h2: ['id'],
      figure: ['class'],
      img: ['src', 'alt', 'width', 'height', 'loading'],
    },
    allowedSchemes: ['https', 'http'],
    exclusiveFilter: (frame) =>
      frame.tag === 'img' &&
      !assets.some((asset) => asset.reviewed && asset.path === frame.attribs.src),
    transformTags: { a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }) },
  });
  return { html, headings };
}
export function renderMarkdown(markdown: string): string {
  return renderArticle(markdown).html;
}
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
