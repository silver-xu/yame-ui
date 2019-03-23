import * as showdown from 'showdown';
import registerPromiseWorker from 'promise-worker/register';

// tslint:disable-next-line:no-var-requires
const showdownHighlight = require('showdown-highlight');
// tslint:disable-next-line:no-var-requires
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

registerPromiseWorker(message => {
    const dangerousHtml = converter.makeHtml(message);
    console.log(dangerousHtml);
    return xss(dangerousHtml, xssOptions);
});
