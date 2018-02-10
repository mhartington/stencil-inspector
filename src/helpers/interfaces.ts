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
  expandedValue: StiGroupInterface;
  cachingIndex: number;
}

export interface StiGroupInterface {
  [field: string]: StiEntry;
}

export interface StiStatus {
  success: boolean;
  message: string;
}

export interface StiMap {
  info: StiStatus;
  details?: StiGroupInterface;
  props?: StiGroupInterface;
  states?: StiGroupInterface;
  methods?: StiGroupInterface;
  elements?: StiGroupInterface;
  instance?: StiGroupInterface;
  cmp?: StiGroupInterface;
}
