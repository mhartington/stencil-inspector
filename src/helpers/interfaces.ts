declare global {
  interface Window {
    stiScout: any;
  }

  var createStiScout: any;
}

export interface StiEntry {
  name: string;
  canExpand: boolean;
  isExpanded: boolean;
  type: string;
  value: string;
  expandedValue: StiGroup;
  cachingIndex: number;
}

export interface StiGroup {
  [field: string]: StiEntry;
}

export interface StiStatus {
  success: boolean;
  message: string;
}

export interface StiMap {
  info: StiStatus;
  props?: StiGroup;
  states?: StiGroup;
  methods?: StiGroup;
  elements?: StiGroup;
  instance?: StiGroup;
  cmp?: StiGroup;
}
