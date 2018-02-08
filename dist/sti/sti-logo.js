/*! Built with http://stenciljs.com */
const { h, Context } = window.sti;

import { autobind, StiInjectorInstance } from './chunk1.js';

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
class StiMain {
    constructor() {
        this.isDarkTheme = false;
        StiInjectorInstance.register(this.elementInfoChangeHandler);
    }
    componentWillLoad() {
        this.isDarkTheme = chrome && chrome.devtools && chrome.devtools.panels && chrome.devtools.panels.themeName === 'dark';
    }
    elementInfoChangeHandler(debugInfo) {
        this.debugInfo = debugInfo;
    }
    hostData() {
        return {
            class: {
                darkTheme: this.isDarkTheme
            }
        };
    }
    render() {
        if (!this.debugInfo) {
            return null;
        }
        return [
            (h("h1", { class: 'app-header' },
                h("sti-logo", null),
                h("span", { class: 'logo-badge' }, "INSPECTOR"))),
            (h("sti-debug-group", { heading: 'Component Info', category: 'cmp', items: this.debugInfo.cmp, info: this.debugInfo.info })),
            (h("sti-debug-group", { heading: 'Component Props', category: 'props', items: this.debugInfo.props, info: this.debugInfo.info }))
        ];
    }
    static get is() { return "sti-main"; }
    static get properties() { return { "debugInfo": { "state": true }, "isDarkTheme": { "state": true } }; }
    static get style() { return "/* http://meyerweb.com/eric/tools/css/reset/\n   v2.0 | 20110126\n   License: none (public domain)\n*/\n\nhtml, body, div, span, applet, object, iframe,\nh1, h2, h3, h4, h5, h6, p, blockquote, pre,\na, abbr, acronym, address, big, cite, code,\ndel, dfn, em, img, ins, kbd, q, s, samp,\nsmall, strike, strong, sub, sup, tt, var,\nb, u, i, center,\ndl, dt, dd, ol, ul, li,\nfieldset, form, label, legend,\ntable, caption, tbody, tfoot, thead, tr, th, td,\narticle, aside, canvas, details, embed,\nfigure, figcaption, footer, header, hgroup,\nmenu, nav, output, ruby, section, summary,\ntime, mark, audio, video {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  font-size: 100%;\n  font: inherit;\n  vertical-align: baseline;\n}\n/* HTML5 display-role reset for older browsers */\narticle, aside, details, figcaption, figure,\nfooter, header, hgroup, menu, nav, section {\n  display: block;\n}\nbody {\n  line-height: 1;\n}\nol, ul {\n  list-style: none;\n}\nblockquote, q {\n  quotes: none;\n}\nblockquote:before, blockquote:after,\nq:before, q:after {\n  content: '';\n  content: none;\n}\ntable {\n  border-collapse: collapse;\n  border-spacing: 0;\n}\n\n/*! normalize.css v5.0.0 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Change the default font family in all browsers (opinionated).\n * 2. Correct the line height in all browsers.\n * 3. Prevent adjustments of font size after orientation changes in\n *    IE on Windows Phone and in iOS.\n */\n\nhtml {\n  font-family: sans-serif; /* 1 */\n  line-height: 1.15; /* 2 */\n  -ms-text-size-adjust: 100%; /* 3 */\n  -webkit-text-size-adjust: 100%; /* 3 */\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * 1. Change the font styles in all browsers (opinionated).\n * 2. Remove the margin in Firefox and Safari.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: sans-serif; /* 1 */\n  font-size: 100%; /* 1 */\n  line-height: 1.15; /* 1 */\n  margin: 0; /* 2 */\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton,\ninput { /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton,\nselect { /* 1 */\n  text-transform: none;\n}\n\n/**\n * 1. Prevent a WebKit bug where (2) destroys native `audio` and `video`\n *    controls in Android 4.\n * 2. Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton,\nhtml [type=\"button\"], /* 1 */\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button; /* 2 */\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * Change the border, margin, and padding in all browsers (opinionated).\n */\n\nfieldset {\n  border: 1px solid #c0c0c0;\n  margin: 0 2px;\n  padding: 0.35em 0.625em 0.75em;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\nlegend {\n  box-sizing: border-box; /* 1 */\n  color: inherit; /* 2 */\n  display: table; /* 1 */\n  max-width: 100%; /* 1 */\n  padding: 0; /* 3 */\n  white-space: normal; /* 1 */\n}\n\n/**\n * 1. Add the correct display in IE 9-.\n * 2. Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\nprogress {\n  display: inline-block; /* 1 */\n  vertical-align: baseline; /* 2 */\n}\n\n/**\n * Remove the default vertical scrollbar in IE.\n */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10-.\n * 2. Remove the padding in IE 10-.\n */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box; /* 1 */\n  padding: 0; /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/**\n * Remove the inner padding and cancel buttons in Chrome and Safari on macOS.\n */\n\n[type=\"search\"]::-webkit-search-cancel-button,\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n\nsti-main .app-header {\n  background: #f4f4f4;\n  padding: 5px 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\nsti-main .logo-badge {\n  margin-left: 5px;\n  font-weight: 600;\n  font-size: 15px;\n  letter-spacing: -1px;\n  color: #16161d;\n}\n\nsti-main .not-found {\n  font-style: italic;\n  font-size: 10px;\n}\n\nsti-main .custom-attribute {\n  margin-bottom: 4px;\n}\n\nsti-main .custom-attribute .attribute-name {\n  color: saddlebrown;\n}\n\nsti-main .custom-attribute .block-token {\n  color: gray;\n}\n\nsti-main .custom-attribute .attribute-name,\nsti-main .custom-attribute .block-token {\n  font-size: 12px;\n  display: inline;\n  font-family: monospace;\n}\n\n.dark .app-header {\n  background: #2a2a2a;\n}\n\n.dark .not-found {\n  color: #989898;\n}\n\n.dark .custom-attribute .attribute-name {\n  color: #ef9565;\n}"; }
}
__decorate([
    autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StiMain.prototype, "elementInfoChangeHandler", null);

class StiLogo {
    render() {
        return (h("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 1120 280' },
            h("path", { class: 'path', d: 'M375.8 165.2c7 6.6 17.6 12.9 28.9 12.9 6.6 0 10.6-2.1 12.7-4.3 1.9-1.9 3.2-4.7 3.2-7.9 0-2.5-0.9-5.3-3.6-7.6 -3.2-2.8-8.1-4.2-16.3-6.6l-8.5-2.6c-5.3-1.7-13-4.5-18.1-10.2 -6.4-7-7.2-15.9-7.2-22.3 0-15.5 6-24.9 11.5-30.4 6.4-6.4 17-11.9 32.3-11.9 12.5 0 27 4 38.9 10.2l-13 25.5c-9.8-7.7-17.2-8.5-21.5-8.5 -3.2 0-7.6 0.8-10.8 3.8 -1.9 1.9-3.2 4-3.2 6.8 0 2.3 0.4 4 1.7 5.7 0.9 1.1 3.2 3.4 11 5.7l10 3c7.9 2.5 16.3 5.3 22.9 12.5 6.4 6.8 8.1 13.8 8.1 22.5 0 11.5-2.8 22.7-11.9 31.8 -10.8 10.8-23.8 12.9-37.2 12.9 -7.9 0-15.5-0.8-24.8-4.2 -2.1-0.8-10-3.8-19.1-10L375.8 165.2z' }),
            h("path", { class: 'path', d: 'M533.7 104.8V203H501v-98.3h-26.6V77H561v27.8H533.7z' }),
            h("path", { class: 'path', d: 'M661.8 104.8h-38.9v21h36.9v27.8h-36.9v21.7h38.9V203h-71.6V77h71.6V104.8z' }),
            h("path", { class: 'path', d: 'M695.5 203V77h32.7l60.3 77.1V77h32.7v126h-32.7l-60.3-77.1V203H695.5z' }),
            h("path", { class: 'path', d: 'M942.1 199.6c-13 4.7-20.2 6.2-28.3 6.2 -21.9 0-38.4-8.7-48.8-18.9 -12.3-12.3-19.1-29.5-19.1-45.9 0-18 7.7-35 19.1-46.5 11.2-11.3 28-19.7 47.6-19.7 6 0 15.9 0.9 29.5 6.4v39.1c-10.6-13-23.1-13.8-28.5-13.8 -9.4 0-16.6 2.8-22.7 8.3 -7.7 7.2-11 17-11 25.9 0 8.7 3.6 18.3 10.2 24.6 5.5 5.1 14.2 8.7 23.4 8.7 4.9 0 17-0.6 28.5-13.2L942.1 199.6 942.1 199.6z' }),
            h("path", { class: 'path', d: 'M1009.5 77v126h-32.7V77H1009.5z' }),
            h("path", { class: 'path', d: 'M1080.5 77v98.3h39.3V203h-72V77H1080.5z' }),
            h("path", { class: 'path', d: 'M184.2 0h-88c-52.8 0-96 43.2-96 96v88c0 52.8 43.2 96 96 96h88c52.8 0 96-43.2 96-96V96C280.2 43.2 237 0 184.2 0zM196.2 179.2c0 12.5-18.3 22.8-30.8 22.8H115c-12.6 0-30.8-10.2-30.8-22.8V178h112V179.2zM196.2 152H115c-12.5 0-30.8-10.3-30.8-22.8V128h81.2c12.5 0 30.8 10.3 30.8 22.8V152zM196.2 102h-112v-1.2C84.2 88.3 102.4 78 115 78h50.4c12.6 0 30.8 10.2 30.8 22.8V102z' })));
    }
    static get is() { return "sti-logo"; }
    static get style() { return "sti-logo {\n  display: block;\n  width: 100px;\n  height: 25px;\n}\n\nsti-logo .path {\n  fill: #16161d;\n}"; }
}

export { StiMain, StiLogo };
