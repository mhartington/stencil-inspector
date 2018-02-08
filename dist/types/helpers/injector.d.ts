declare var StiInjectorInstance: any;
declare global  {
    interface Window {
        stiDebugger: any;
    }
}
export interface ComponentDebugEntry {
    name: string;
    canExpand: boolean;
    isExpanded: boolean;
    type: string;
    value: string;
    expandedValue: ComponentDebugInfo;
    debugId: number;
}
export interface ComponentDebugInfo {
    [field: string]: ComponentDebugEntry;
}
export interface DebugInfoStatus {
    success: boolean;
    error: {
        category: string;
        message: string;
    };
}
export interface DebugInfo {
    info: DebugInfoStatus;
    cmp?: ComponentDebugInfo;
    props?: ComponentDebugInfo;
}
export default StiInjectorInstance;
