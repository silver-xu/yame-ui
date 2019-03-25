const registerWebworker = require('webworker-promise/lib/register');
const hljs = require('highlight.js');
const MarkdownHeadingId = require('markdown-it-named-headings');
const md = require('markdown-it')({
    linkify: true,
    highlight: function(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (__) {}
        }

        return '';
    }
}).use(MarkdownHeadingId);

registerWebworker(async (message, _) => {
    return md.render(message);
});
