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
export class StiMain {
    constructor() {
        this.isDarkTheme = false;
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
                h("sti-logo", null),
                h("span", { class: 'logo-badge' }, "INSPECTOR"))),
            (h("sti-debug-group", { heading: 'Component Info', category: 'cmp', items: this.debugInfo.cmp, info: this.debugInfo.info })),
            (h("sti-debug-group", { heading: 'Component Props', category: 'props', items: this.debugInfo.props, info: this.debugInfo.info }))
        ];
    }
    static get is() { return "sti-main"; }
    static get properties() { return { "debugInfo": { "state": true }, "isDarkTheme": { "state": true } }; }
    static get style() { return "/**style-placeholder:sti-main:**/"; }
}
__decorate([
    autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StiMain.prototype, "elementInfoChangeHandler", null);
//# sourceMappingURL=sti-main.js.map