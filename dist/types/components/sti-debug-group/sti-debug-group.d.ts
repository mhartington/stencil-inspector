import { ComponentDebugInfo, DebugInfoStatus } from '../../helpers/injector';
export declare class StiDebugGroup {
    heading: string;
    category: string;
    items: ComponentDebugInfo;
    info: DebugInfoStatus;
    private renderError(message?);
    private renderChild(child);
    private renderChildList(items);
    protected render(): JSX.Element;
}
