/* eslint-disable no-param-reassign */
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';

const markdown = MarkdownIt({
  html: true,
  breaks: true,
  xhtmlOut: true,
  langPrefix: 'dmodlg-',
});

export default class MarkDown {
  constructor(public text: string) {}

  render() {
    const content = this._escapeMarkdown(this.text);
    const renderedMD = markdown.render(content);
    const safe = this._processHtml(renderedMD);
    return safe;
  }

  static getTagsList() {
    return [
      'b',
      'i',
      'em',
      'strong',
      'span',
      'p',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'u',
      'hr',
      'br',
      'code',
      'pre',
      'section',
      'ul',
      'small',
      'a',
    ];
  }

  _processHtml(dirty: string) {
    const clean = sanitizeHtml(dirty, {
      allowedTags: MarkDown.getTagsList(),
      allowedAttributes: {
        '*': ['style'],
        a: ['href', 'role', 'data-to', 'data-linking'],
      },
      transformTags: {
        a(tagName, attribs) {
          return {
            attribs: {
              'data-to': attribs.href,
              role: 'button',
              'data-linking': `${/^https:\/\/[^ ]{1,}$/.test(attribs.href)}`,
            },
            tagName: 'a',
          };
        },
      },
      allowedStyles: {
        '*': {
          color: [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/, /^\w+$/],
          'font-size': [/^\d+(?:px|em|%|rem)$/],
          'border-radius': [/^\d+(?:px|em|%|rem)$/],
          'background-color': [
            /^#(0x)?[0-9a-f]+$/i,
            /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
            /^\w+$/,
          ],
          'text-align': [/^(left|right|center|end|start|inherit|initial|unset)$/],
        },
      },
      parser: {
        lowerCaseTags: true,
      },
    });

    return clean;
  }

  _escapeMarkdown(str: string): string {
    return str.replace(/!\[.*\]\(.*\)/g, _ =>
      // eslint-disable-next-line no-useless-escape
      _.replace(/[\[\]]/g, __ => `\\${__}`).replace(/[\(\)]/g, ___ => `\\${___}`)
    );
  }
}
