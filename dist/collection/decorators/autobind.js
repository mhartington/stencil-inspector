// tslint:disable:no-invalid-this
export default function (target, propertyKey, descriptor) {
    let actualFn = descriptor.value;
    if (typeof actualFn !== 'function') {
        throw new Error(`Cannot autobind: ${typeof actualFn}`);
    }
    return {
        configurable: true,
        get() {
            if (this === target.prototype || this.hasOwnProperty(propertyKey) || typeof actualFn !== 'function') {
                return actualFn;
            }
            const bindedFn = actualFn.bind(this);
            Object.defineProperty(this, propertyKey, {
                configurable: true,
                get() {
                    return bindedFn;
                },
                set(value) {
                    actualFn = value;
                    // tslint:disable-next-line:no-dynamic-delete
                    delete this[propertyKey];
                }
            });
            return bindedFn;
        },
        set(value) {
            actualFn = value;
        }
    };
}
//# sourceMappingURL=autobind.js.map