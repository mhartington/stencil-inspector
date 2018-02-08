import { ComponentDebugEntry } from '../../helpers/injector';
export declare class StiPropertyView {
    item: ComponentDebugEntry;
    private isExpanded;
    private expandedValue;
    protected itemChangeHandler(): void;
    private itemsChangeHandler(newItem);
    private arrowClickHandler();
    private renderArrow(isExpanded);
    private renderChild(child);
    private renderChildList(isExpanded, items);
    protected render(): JSX.Element[];
}
