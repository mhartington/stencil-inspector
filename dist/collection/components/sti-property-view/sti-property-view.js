var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import autobind from '../../decorators/autobind';
import StiInjectorInstance from '../../helpers/injector';
export class StiPropertyView {
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
    static get style() { return "/**style-placeholder:sti-property-view:**/"; }
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
//# sourceMappingURL=sti-property-view.js.map