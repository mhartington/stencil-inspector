export class StiComp {
    constructor() {
        this.prop = 'unset';
    }
    componentWillLoad() {
        chrome.devtools.panels.elements.createSidebarPane('Stencil', (sidebar) => sidebar.setPage('index.html'));
    }
    render() {
        return (h("div", null,
            "Component ",
            this.prop));
    }
    static get is() { return "sti-comp"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return { "prop": { "type": String, "attr": "prop" } }; }
}
//# sourceMappingURL=sti-comp.js.map