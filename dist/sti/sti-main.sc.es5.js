/*! Built with http://stenciljs.com */
sti.loadBundle('sti-main', ['exports', './chunk1.js'], function (exports, __chunk1_js) {
    var h = window.sti.h;
    var Context = window.sti.Context;
    var StiMain = /** @class */ (function () {
        function StiMain() {
            this.isDarkTheme = false;
            this.elementInfoChangeHandler = this.elementInfoChangeHandler.bind(this);
            StiInjectorInstance.register(this.elementInfoChangeHandler);
        }
        StiMain.prototype.componentWillLoad = function () {
            this.isDarkTheme = chrome && chrome.devtools && chrome.devtools.panels && chrome.devtools.panels.themeName === 'dark';
        };
        StiMain.prototype.elementInfoChangeHandler = function (debugInfo) {
            this.debugInfo = debugInfo;
        };
        StiMain.prototype.hostData = function () {
            return {
                class: {
                    darkTheme: this.isDarkTheme
                }
            };
        };
        StiMain.prototype.render = function () {
            if (!this.debugInfo) {
                return null;
            }
            return [
                (h("h1", { class: 'app-header' }, h("span", { class: 'logo-badge' }, "INSPECTOR"))),
                (h("main", null, h("sti-debug-group", { heading: 'Component Info', items: this.debugInfo.cmp, info: this.debugInfo.info })))
            ];
        };
        Object.defineProperty(StiMain, "is", {
            get: function () { return "sti-main"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StiMain, "encapsulation", {
            get: function () { return "shadow"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StiMain, "properties", {
            get: function () { return { "debugInfo": { "state": true }, "isDarkTheme": { "state": true } }; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StiMain, "style", {
            get: function () { return "[data-sti-main-host]   .app-header[data-sti-main] {\n  background: #f4f4f4;\n  padding: 5px 0 0;\n  text-align: center;\n}\n\n[data-sti-main-host]   .logo-badge[data-sti-main] {\n  position: relative;\n  top: -7px;\n  font-weight: 100;\n  font-size: 16px;\n  color: #bb79a8;\n}\n\n[data-sti-main-host]   .not-found[data-sti-main] {\n  font-style: italic;\n  font-size: 10px;\n}\n\n[data-sti-main-host]   .custom-attribute[data-sti-main] {\n  margin-bottom: 4px;\n}\n\n[data-sti-main-host]   .custom-attribute[data-sti-main]   .attribute-name[data-sti-main] {\n  color: saddlebrown;\n}\n\n[data-sti-main-host]   .custom-attribute[data-sti-main]   .block-token[data-sti-main] {\n  color: gray;\n}\n\n[data-sti-main-host]   .custom-attribute[data-sti-main]   .attribute-name[data-sti-main], [data-sti-main-host]   .custom-attribute[data-sti-main]   .block-token[data-sti-main] {\n  font-size: 12px;\n  display: inline;\n  font-family: monospace;\n}\n\n.dark[data-sti-main]   .app-header[data-sti-main] {\n  background: #2a2a2a;\n}\n\n.dark[data-sti-main]   .not-found[data-sti-main] {\n  color: #989898;\n}\n\n.dark[data-sti-main]   .custom-attribute[data-sti-main]   .attribute-name[data-sti-main] {\n  color: #ef9565;\n}"; },
            enumerable: true,
            configurable: true
        });
        return StiMain;
    }());
    exports.StiMain = StiMain;
    Object.defineProperty(exports, '__esModule', { value: true });
});
