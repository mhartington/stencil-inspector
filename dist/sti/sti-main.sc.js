/*! Built with http://stenciljs.com */
const { h, Context } = window.sti;

import { StiInjectorInstance } from './chunk1.js';

class StiMain {
    constructor() {
        this.isDarkTheme = false;
        this.elementInfoChangeHandler = this.elementInfoChangeHandler.bind(this);
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
                h("span", { class: 'logo-badge' }, "INSPECTOR"))),
            (h("main", null,
                h("sti-debug-group", { heading: 'Component Info', items: this.debugInfo.cmp, info: this.debugInfo.info })))
        ];
    }
    static get is() { return "sti-main"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return { "debugInfo": { "state": true }, "isDarkTheme": { "state": true } }; }
    static get style() { return "[data-sti-main-host]   .app-header[data-sti-main] {\n  background: #f4f4f4;\n  padding: 5px 0 0;\n  text-align: center;\n}\n\n[data-sti-main-host]   .logo-badge[data-sti-main] {\n  position: relative;\n  top: -7px;\n  font-weight: 100;\n  font-size: 16px;\n  color: #bb79a8;\n}\n\n[data-sti-main-host]   .not-found[data-sti-main] {\n  font-style: italic;\n  font-size: 10px;\n}\n\n[data-sti-main-host]   .custom-attribute[data-sti-main] {\n  margin-bottom: 4px;\n}\n\n[data-sti-main-host]   .custom-attribute[data-sti-main]   .attribute-name[data-sti-main] {\n  color: saddlebrown;\n}\n\n[data-sti-main-host]   .custom-attribute[data-sti-main]   .block-token[data-sti-main] {\n  color: gray;\n}\n\n[data-sti-main-host]   .custom-attribute[data-sti-main]   .attribute-name[data-sti-main], [data-sti-main-host]   .custom-attribute[data-sti-main]   .block-token[data-sti-main] {\n  font-size: 12px;\n  display: inline;\n  font-family: monospace;\n}\n\n.dark[data-sti-main]   .app-header[data-sti-main] {\n  background: #2a2a2a;\n}\n\n.dark[data-sti-main]   .not-found[data-sti-main] {\n  color: #989898;\n}\n\n.dark[data-sti-main]   .custom-attribute[data-sti-main]   .attribute-name[data-sti-main] {\n  color: #ef9565;\n}"; }
}

export { StiMain };
