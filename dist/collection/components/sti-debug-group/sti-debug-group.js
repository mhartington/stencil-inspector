export class StiDebugGroup {
    constructor() {
        this.heading = '';
        this.category = '';
        this.items = null;
        this.info = null;
    }
    renderError(message = '') {
        return (h("span", { class: 'not-found' }, message));
    }
    renderChild(child) {
        return (h("li", null,
            h("sti-property-view", { item: child })));
    }
    renderChildList(items) {
        const itemsArr = Object.keys(items)
            .map((itemKey) => {
            return items[itemKey];
        });
        return (h("ul", null, itemsArr.map(this.renderChild)));
    }
    render() {
        const { success, error } = this.info;
        return (h("section", null,
            h("h2", { class: 'header' }, this.heading),
            h("div", { class: 'content' }, success === false && (error.category === 'general' || error.category === this.category) ?
                this.renderError(error.message) :
                this.renderChildList(this.items))));
    }
    static get is() { return "sti-debug-group"; }
    static get properties() { return { "category": { "type": String, "attr": "category" }, "heading": { "type": String, "attr": "heading" }, "info": { "type": "Any", "attr": "info" }, "items": { "type": "Any", "attr": "items" } }; }
    static get style() { return "/**style-placeholder:sti-debug-group:**/"; }
}
//# sourceMappingURL=sti-debug-group.js.map