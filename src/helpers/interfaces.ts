import {
  ComponentInstance
} from '@stencil/core/dist/declarations';
import {
  HostElement
} from '@stencil/core/dist/declarations/component';

export interface StiScout {
  buildComponentsMembers: (receivedMembers: any[]) => any;
  buildComponentsDetails: () => any;
  buildProps: (currentCmpType: any, instance: ComponentInstance) => StiGroupData;
  createItem: (partialItem: Partial<StiItemData>, value: any) => StiItemData;
  buildGroupFromInstance: (label: string, currentCmpType: any, instance: ComponentInstance) => StiGroupData;
  convertObjectToGroup: (label: string, obj: {}) => StiGroupData;
  initializeMap: (selectedNode: HostElement) => StiMapData;
  getExpandedValue: (id: number) => StiItemData[];
}

export type CreateStiScout = () => void;

export interface StiStatusData {
  success: boolean;
  message: string;
}

export interface StiItemData {
  name: string;
  canExpand: boolean;
  type: string;
  value: string;
  expandedValue: StiGroupData;
  cachingIndex: number;
}

export interface StiGroupData {
  label: string;
  expanded: boolean;
  items: StiItemData[];
}

export interface StiMapData {
  info: StiStatusData;
  groups: StiGroupData[];
}

declare global {
  interface Window {
    stiScout: StiScout;
  }

  var createStiScout: CreateStiScout;
}
