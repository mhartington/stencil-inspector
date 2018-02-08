export class StiControllerView {
    constructor() {
        this.controller = null;
    }
    renderChild(child) {
        return (h("li", null,
            h("sti-property-view", { item: child })));
    }
    render() {
        if (this.controller === null) {
            return null;
        }
        return [
            (h("div", { class: 'category' },
                h("h4", { class: 'category-name' }, "Bindables"),
                h("ul", { class: 'properties' }, this.controller.bindables(this.renderChild)))),
            (h("div", { class: 'category' },
                h("h4", { class: 'category-name' }, "Properties"),
                h("ul", { class: 'properties' }, this.controller.properties(this.renderChild))))
        ];
    }
    static get is() { return "sti-controller-view"; }
    static get properties() { return { "controller": { "type": "Any", "attr": "controller" } }; }
    static get style() { return "/**style-placeholder:sti-controller-view:**/"; }
}
//# sourceMappingURL=sti-controller-view.js.map