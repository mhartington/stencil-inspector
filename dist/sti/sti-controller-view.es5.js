/*! Built with http://stenciljs.com */
sti.loadBundle('sti-controller-view', ['exports'], function (exports) {
    var h = window.sti.h;
    var Context = window.sti.Context;
    var StiControllerView = /** @class */ (function () {
        function StiControllerView() {
            this.controller = null;
        }
        StiControllerView.prototype.renderChild = function (child) {
            return (h("li", null, h("sti-property-view", { item: child })));
        };
        StiControllerView.prototype.render = function () {
            if (this.controller === null) {
                return null;
            }
            return [
                (h("div", { class: 'category' }, h("h4", { class: 'category-name' }, "Bindables"), h("ul", { class: 'properties' }, this.controller.bindables(this.renderChild)))),
                (h("div", { class: 'category' }, h("h4", { class: 'category-name' }, "Properties"), h("ul", { class: 'properties' }, this.controller.properties(this.renderChild))))
            ];
        };
        Object.defineProperty(StiControllerView, "is", {
            get: function () { return "sti-controller-view"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StiControllerView, "properties", {
            get: function () { return { "controller": { "type": "Any", "attr": "controller" } }; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StiControllerView, "style", {
            get: function () { return "controller-view .category-name {\n  font-size: 10px;\n  margin-bottom: 2px;\n  margin-top: 2px;\n}"; },
            enumerable: true,
            configurable: true
        });
        return StiControllerView;
    }());
    exports.StiControllerView = StiControllerView;
    Object.defineProperty(exports, '__esModule', { value: true });
});
