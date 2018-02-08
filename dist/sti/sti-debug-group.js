/*! Built with http://stenciljs.com */
const { h, Context } = window.sti;

import { autobind, StiInjectorInstance } from './chunk1.js';

class StiDebugGroup {
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
    static get style() { return "sti-debug-group .header {\n  font-weight: 400;\n  font-size: 12px;\n  margin: 0;\n  padding: 4px;\n  background: #f4f4f4;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.25);\n  border-top: 1px solid rgba(0, 0, 0, 0.25);\n}\n\nsti-debug-group .content {\n  margin: 4px;\n}\n\n.dark debug-group .header {\n  color: #989898;\n  background: #2a2a2a;\n  border-bottom: 1px solid #5c5c5c;\n  border-top: 1px solid #3d3d3d;\n}"; }
}

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
class StiPropertyView {
    constructor() {
        this.item = null;
        this.isExpanded = false;
        this.expandedValue = null;
    }
    itemChangeHandler() {
        this.isExpanded = false;
        this.expandedValue = null;
    }
    itemsChangeHandler(newItem) {
        this.isExpanded = newItem.isExpanded;
        this.expandedValue = newItem.expandedValue;
    }
    arrowClickHandler() {
        StiInjectorInstance.toggleDebugValueExpansion({
            isExpanded: this.isExpanded,
            expandedValue: this.expandedValue
        }, this.item, this.itemsChangeHandler);
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
    renderChildList(isExpanded, items) {
        if (!isExpanded || !items) {
            return null;
        }
        const itemsArr = Object.keys(items)
            .map((itemKey) => {
            return items[itemKey];
        });
        return (h("ul", { class: 'properties' }, itemsArr.length === 0 ?
            (h("div", { class: 'no-properties' }, "Object has no properties.")) :
            itemsArr.map(this.renderChild)));
    }
    render() {
        return [
            (h("span", { class: 'property-line' },
                h("span", { style: {
                        opacity: this.item.canExpand ? '1' : '0'
                    }, class: 'arrow', onClick: this.arrowClickHandler }, this.renderArrow(this.isExpanded)),
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
            this.renderChildList(this.isExpanded, this.expandedValue)
        ];
    }
    static get is() { return "sti-property-view"; }
    static get properties() { return { "expandedValue": { "state": true }, "isExpanded": { "state": true }, "item": { "type": "Any", "attr": "item", "watchCallbacks": ["itemChangeHandler"] } }; }
    static get style() { return "sti-property-view {\n  margin-top: 2px;\n  display: block;\n}\n\nsti-property-view .arrow {\n  font-size: 10px;\n  color: dimgray;\n  cursor: default;\n}\n\nsti-property-view .arrow .right {\n  margin-right: 1px;\n}\n\nsti-property-view .property-line {\n  white-space: nowrap;\n}\n\nsti-property-view .property-name {\n  font-size: 12px;\n  color: purple;\n  font-family: monospace;\n  margin-left: 1px;\n}\n\nsti-property-view .value-container {\n  position: relative;\n}\n\nsti-property-view .property-editor {\n  font-family: monospace;\n  font-size: 12px;\n  margin: 0;\n  height: 12px;\n  outline: none;\n  border: 1px solid darkgray;\n  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);\n  position: absolute;\n  top: 4px;\n  left: 2px;\n  padding: 0 0 0 2px;\n}\n\nsti-property-view .property-value,\nsti-property-view .token-colon {\n  font-size: 12px;\n  color: dimgray;\n  font-family: monospace;\n}\n\nsti-property-view .property-value.null, sti-property-view .property-value.undefined {\n  color: dimgray;\n}\n\nsti-property-view .property-value.boolean {\n  color: deeppink;\n}\n\nsti-property-view .property-value.string {\n  color: red;\n  white-space: nowrap;\n}\n\nsti-property-view .property-value.number {\n  color: blue;\n}\n\nsti-property-view .property-value.array {\n  color: black;\n}\n\nsti-property-view .property-value.object, sti-property-view .property-value.node {\n  color: black;\n}\n\nsti-property-view .property-value.node {\n  color: #cbcbcb;\n}\n\nsti-property-view ul.properties {\n  margin-left: 16px;\n}\n\nsti-property-view .no-properties {\n  margin-top: 4px;\n  font-size: 10px;\n}\n\n.dark property-view .property-name {\n  color: #34c7bb;\n}\n\n.dark property-view .property-value.string {\n  color: #cbcbcb;\n}\n\n.dark property-view .property-value.number {\n  color: #59a6ca;\n}\n\n.dark property-view .property-value.array {\n  color: #cbcbcb;\n}\n\n.dark property-view .property-value.object {\n  color: #cbcbcb;\n}\n\n.dark property-view .no-properties {\n  color: #989898;\n}"; }
}
__decorate([
    autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StiPropertyView.prototype, "itemsChangeHandler", null);
__decorate([
    autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StiPropertyView.prototype, "arrowClickHandler", null);

export { StiDebugGroup, StiPropertyView };
