const registerWebworker = require('webworker-promise/lib/register');
const hljs = require('highlight.js');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt({
    linkify: true,
    highlight: function(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (__) {}
        }

        return '';
    }
});

registerWebworker(async (message, emit) => {
    return md.render(message);
});
