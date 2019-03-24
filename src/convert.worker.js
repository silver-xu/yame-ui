import * as showdown from 'showdown';
const registerWebworker = require('webworker-promise/lib/register');
const showdownHighlight = require('showdown-highlight');
const xss = require('xss');

const xssOptions = {
    whiteList: {
        a: ['href', 'title', 'target'],
        h1: ['id'],
        h2: ['id'],
        h3: ['id'],
        h4: ['id'],
        p: [],
        ul: [],
        ol: [],
        li: [],
        table: [],
        th: [],
        tr: [],
        td: [],
        thead: [],
        tbody: [],
        b: [],
        i: [],
        em: [],
        pre: [],
        code: [],
        span: [],
        strong: [],
        blockquote: []
    }
};

const converter = new showdown.Converter({
    tables: true,
    smoothLivePreview: true,
    strikethrough: true,
    requireSpaceBeforeHeadingText: true,
    disableForced4SpacesIndentedSublists: true,
    extensions: [showdownHighlight]
});

registerWebworker(async (message, emit) => {
    const dangerousHtml = converter.makeHtml(message);

    return xss(dangerousHtml, xssOptions);
});
