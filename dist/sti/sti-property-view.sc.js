/*! Built with http://stenciljs.com */
const { h, Context } = window.sti;

import { StiInjectorInstance } from './chunk1.js';

class StiPropertyView {
    constructor() {
        this.item = null;
    }
    arrowClickHandler() {
        StiInjectorInstance.toggleDebugValueExpansion(this.item);
    }
    renderArrow(isExpanded) {
        if (isExpanded) {
            return (h("span", { class: 'down' }, "\u25BC"));
        }
        return (h("span", { class: 'right' }, "\u25B6"));
    }
    renderChild(child) {
        return (h("li", null,
            h("sti-property-view", { item: child })));
    }
    renderChildList(canExpand, items) {
        if (!canExpand) {
            return null;
        }
        const itemsArr = Object.keys(items)
            .map((itemKey) => {
            return items[itemKey];
        });
        return (h("ul", { class: 'properties' }, itemsArr.map(this.renderChild)));
    }
    render() {
        return [
            (h("span", { class: 'property-line' },
                h("span", { style: {
                        opacity: this.item.canExpand ? '1' : '0'
                    }, class: 'arrow', onClick: this.arrowClickHandler }, this.renderArrow(this.item.isExpanded)),
                h("span", { class: 'property-name' }, this.item.name),
                h("span", { class: 'token-colon' }, ":"),
                "\u00A0",
                h("span", { class: 'value-container' },
                    this.item.type === 'string' ?
                        (h("span", { class: 'property-value string' }, "\u00A0\"")) :
                        null,
                    h("span", { class: `property-value ${this.item.type}` }, this.item.value.toString()),
                    this.item.type === 'string' ?
                        (h("span", { class: 'property-value string' }, "\"")) :
                        null))),
            this.renderChildList(this.item.canExpand, this.item.expandedValue)
        ];
    }
    static get is() { return "sti-property-view"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return { "item": { "type": "Any", "attr": "item" } }; }
    static get style() { return "[data-sti-property-view-host] {\n  margin-top: 2px;\n  display: block;\n}\n\n[data-sti-property-view-host]   .arrow[data-sti-property-view] {\n  font-size: 10px;\n  color: dimgray;\n  cursor: default;\n}\n\n[data-sti-property-view-host]   .arrow[data-sti-property-view]   .right[data-sti-property-view] {\n  margin-right: 1px;\n}\n\n[data-sti-property-view-host]   .property-line[data-sti-property-view] {\n  white-space: nowrap;\n}\n\n[data-sti-property-view-host]   .property-name[data-sti-property-view] {\n  font-size: 12px;\n  color: purple;\n  font-family: monospace;\n  margin-left: 1px;\n}\n\n[data-sti-property-view-host]   .value-container[data-sti-property-view] {\n  position: relative;\n}\n\n[data-sti-property-view-host]   .property-editor[data-sti-property-view] {\n  font-family: monospace;\n  font-size: 12px;\n  margin: 0;\n  height: 12px;\n  outline: none;\n  border: 1px solid darkgray;\n  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);\n  position: absolute;\n  top: 4px;\n  left: 2px;\n  padding: 0 0 0 2px;\n}\n\n[data-sti-property-view-host]   .property-value[data-sti-property-view], [data-sti-property-view-host]   .token-colon[data-sti-property-view] {\n  font-size: 12px;\n  color: dimgray;\n  font-family: monospace;\n}\n\n[data-sti-property-view-host]   .property-value.null[data-sti-property-view], [data-sti-property-view-host]   .property-value.undefined[data-sti-property-view] {\n  color: dimgray;\n}\n\n[data-sti-property-view-host]   .property-value.boolean[data-sti-property-view] {\n  color: deeppink;\n}\n\n[data-sti-property-view-host]   .property-value.string[data-sti-property-view] {\n  color: red;\n  white-space: nowrap;\n}\n\n[data-sti-property-view-host]   .property-value.number[data-sti-property-view] {\n  color: blue;\n}\n\n[data-sti-property-view-host]   .property-value.array[data-sti-property-view] {\n  color: black;\n}\n\n[data-sti-property-view-host]   .property-value.object[data-sti-property-view], [data-sti-property-view-host]   .property-value.node[data-sti-property-view] {\n  color: black;\n}\n\n[data-sti-property-view-host]   .property-value.node[data-sti-property-view] {\n  color: #cbcbcb;\n}\n\n[data-sti-property-view-host]   ul.properties[data-sti-property-view] {\n  margin-left: 16px;\n}\n\n[data-sti-property-view-host]   .no-properties[data-sti-property-view] {\n  margin-top: 4px;\n  font-size: 10px;\n}\n\n.dark[data-sti-property-view]   property-view[data-sti-property-view]   .property-name[data-sti-property-view] {\n  color: #34c7bb;\n}\n\n.dark[data-sti-property-view]   property-view[data-sti-property-view]   .property-value.string[data-sti-property-view] {\n  color: #cbcbcb;\n}\n\n.dark[data-sti-property-view]   property-view[data-sti-property-view]   .property-value.number[data-sti-property-view] {\n  color: #59a6ca;\n}\n\n.dark[data-sti-property-view]   property-view[data-sti-property-view]   .property-value.array[data-sti-property-view] {\n  color: #cbcbcb;\n}\n\n.dark[data-sti-property-view]   property-view[data-sti-property-view]   .property-value.object[data-sti-property-view] {\n  color: #cbcbcb;\n}\n\n.dark[data-sti-property-view]   property-view[data-sti-property-view]   .no-properties[data-sti-property-view] {\n  color: #989898;\n}"; }
}

export { StiPropertyView };
