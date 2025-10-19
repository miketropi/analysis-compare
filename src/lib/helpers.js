export const textareaToHtml = (content) => {
  if (typeof content !== 'string') return '';
  return content
    .split('\n')
    .map(line => `<p>${line.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`)
    .join('');
}

export function filterTextContent(content) {
  if (typeof content !== 'string') return '';
  // Remove HTML tags
  let text = content.replace(/<[^>]*>/g, '');
  // Remove spaces (including tabs, newlines, & non-breaking spaces)
  text = text.replace(/\s+/g, '');
  // Decode HTML entities for most common chars
  text = text.replace(/&nbsp;/gi, '')
             .replace(/&lt;/gi, '<')
             .replace(/&gt;/gi, '>')
             .replace(/&amp;/gi, '&')
             .replace(/&quot;/gi, '"')
             .replace(/&#39;/gi, "'");
  return text;
}

/**
 * Highlight matching paragraphs between two contents.
 * - By default it ESCAPES HTML (safe for showing code).
 * - If preserveHtml = true and DOMParser exists (browser), it will keep HTML and wrap <mark>.
 *
 * Returns [html1, html2]
 *
 * @param {string} content1
 * @param {string} content2
 * @param {object} opts
 * @param {boolean} opts.preserveHtml - false by default (escape HTML)
 */
export function highlightMatchingParagraphs(content1, content2, opts = {}) {
  const preserveHtml = Boolean(opts.preserveHtml);

  const splitParagraphs = str =>
    typeof str !== 'string'
      ? []
      : str
          .split(/\n+/)       // nhóm theo block newline
          .map(line => line.trim())
          .filter(Boolean);

  // remove tags for matching; keep only textual content for comparison
  const stripTags = txt => (typeof txt === 'string' ? txt.replace(/<[^>]*>/g, '') : '');

  // normalize whitespace for reliable matching
  const normalize = txt =>
    (typeof txt === 'string' ? txt : '')
      .replace(/\s+/g, ' ')
      .trim();

  // escape HTML for safe display
  const escapeHtml = txt =>
    (txt == null ? '' : String(txt))
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const paras1 = splitParagraphs(content1);
  const paras2 = splitParagraphs(content2);

  // Build normalized sets based on stripped text (so <code> tags don't break matching)
  const norm1 = paras1.map(p => normalize(stripTags(p)));
  const norm2 = paras2.map(p => normalize(stripTags(p)));

  const set1 = new Set(norm1.filter(Boolean));
  const set2 = new Set(norm2.filter(Boolean));
  const intersection = new Set([...set1].filter(x => set2.has(x)));

  // When preserveHtml = true and DOMParser available, keep HTML and wrap <mark>
  const canUseDomParser = typeof DOMParser !== 'undefined' && typeof document !== 'undefined';

  const wrapParagraphForDisplay = (originalParagraph) => {
    const key = normalize(stripTags(originalParagraph));
    const isMatch = intersection.has(key);

    if (preserveHtml && canUseDomParser) {
      // We will wrap the entire paragraph HTML with <mark> when matched
      // Use a container to avoid injecting unsafe content into global document
      // NOTE: this will preserve inner tags.
      const parser = new DOMParser();
      // parse as HTML fragment inside a wrapper div
      const doc = parser.parseFromString(`<div>${originalParagraph}</div>`, 'text/html');
      const wrapper = doc.body.firstElementChild; // the div we added
      if (!wrapper) {
        // fallback to escaped output
        const escaped = escapeHtml(originalParagraph);
        return isMatch ? `<p><mark>${escaped}</mark></p>` : `<p>${escaped}</p>`;
      }
      // serialize innerHTML; do not escape because preserveHtml = true
      const inner = wrapper.innerHTML;
      return isMatch ? `<p><mark>${inner}</mark></p>` : `<p>${inner}</p>`;
    } else {
      // safe default: escape HTML to show code literally
      const escaped = escapeHtml(originalParagraph);
      return isMatch ? `<p><mark>${escaped}</mark></p>` : `<p>${escaped}</p>`;
    }
  };

  const html1 = paras1.map(wrapParagraphForDisplay).join('');
  const html2 = paras2.map(wrapParagraphForDisplay).join('');

  return [html1, html2];
}

/**
 * Remove all attributes from all tags in an HTML string, preserving only tag names and content.
 * Returns a string of cleaned HTML.
 * If running in browser, uses DOMParser; otherwise, uses a regex fallback for simple cases.
 */
export const removeAllAttributesFromHtml = (content) => {
  if (typeof DOMParser !== 'undefined' && typeof document !== 'undefined') {
    // Use DOMParser in browser environment
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${content}</div>`, 'text/html');
    function cleanNode(node) {
      if (node.nodeType === 1) { // ELEMENT_NODE
        // Remove all attributes
        for (let i = node.attributes.length - 1; i >= 0; i--) {
          node.removeAttribute(node.attributes[i].name);
        }
        // Recursively clean child nodes
        for (let i = 0; i < node.childNodes.length; i++) {
          cleanNode(node.childNodes[i]);
        }
      } else if (node.nodeType === 9) { // DOCUMENT_NODE
        cleanNode(node.documentElement);
      } else if (node.nodeType === 11) { // DOCUMENT_FRAGMENT_NODE
        for (let i = 0; i < node.childNodes.length; i++) {
          cleanNode(node.childNodes[i]);
        }
      }
    }
    const container = doc.body.firstElementChild;
    if (container) {
      cleanNode(container);
      return container.innerHTML;
    }
    return content; // fallback
  } else {
    // Regex fallback: this will not handle all edge cases (like nested '<' or '>' in attrs)
    // but works for most simple HTML.
    return content.replace(/<(\w+)([^>]*?)>/g, '<$1>');
  }
}
