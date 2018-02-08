/*! Built with http://stenciljs.com */
sti.loadBundle('sti-comp', ['exports'], function (exports) {
    var h = window.sti.h;
    var Context = window.sti.Context;
    var StiComp = /** @class */ (function () {
        function StiComp() {
            this.prop = 'unset';
        }
        StiComp.prototype.componentWillLoad = function () {
            chrome.devtools.panels.elements.createSidebarPane('Stencil', function (sidebar) { return sidebar.setPage('index.html'); });
        };
        StiComp.prototype.render = function () {
            return (h("div", null, "Component ", this.prop));
        };
        Object.defineProperty(StiComp, "is", {
            get: function () { return "sti-comp"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StiComp, "encapsulation", {
            get: function () { return "shadow"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StiComp, "properties", {
            get: function () { return { "prop": { "type": String, "attr": "prop" } }; },
            enumerable: true,
            configurable: true
        });
        return StiComp;
    }());
    exports.StiComp = StiComp;
    Object.defineProperty(exports, '__esModule', { value: true });
});
