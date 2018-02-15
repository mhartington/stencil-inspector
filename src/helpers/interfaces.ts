export interface StiEnum {
 [index: number]: string;
}

export interface StiAppContext {
  [label: string]: any;
}

export interface StiCacheObject {
  cacheIndex: number;
  expandableValue: any;
}

export interface StiCacheMap {
  [label: string]: StiCacheObject;
}

export interface StiStatus {
  success: boolean;
  message: string;
}

export interface StiPropModel {
  name: string;
  isObserved: boolean;
  controller: string;
  isMutable: boolean;
  isContextProp: boolean;
  isConnectProp: boolean;
}

export interface StiProps {
  [label: string]: StiPropModel;
}

export interface StiMembers {
  props: StiProps;
  states: string[];
  methods: string[];
  elements: string[];
}

export interface StiListener {
  method: string;
  event: string;
  capture: number;
  passive: number;
  enabled: number;
  body?: any;
}

export interface StiListeners {
  [listener: string]: StiListener;
}

export interface StiDefinedComponent {
  tag: string;
  bundle: string;
  hasStyles: boolean;
  encapsulated: string;
  props: StiProps;
  states: string[];
  methods: string[];
  elements: string[];
  listeners: StiListeners;
}

export interface StiDefinedComponents {
  [tag: string]: StiDefinedComponent;
}

export interface StiItemData {
  name: string;
  canExpand: boolean;
  type: string;
  value: string;
  cacheIndex: number;
}

export interface StiCategoryData {
  label: string;
  expanded: boolean;
  items: StiItemData[];
}

export interface StiComponentCategories {
  props: StiCategoryData;
  states: StiCategoryData;
  methods: StiCategoryData;
  elements: StiCategoryData;
  listeners: StiCategoryData;
  instance: StiCategoryData;
}

export interface StiComponentData {
  label: string;
  status: StiStatus;
  categories: StiComponentCategories;
}

export interface StiNamespaceCategories {
  components: StiCategoryData;
  context: StiCategoryData;
}

export interface StiNamespaceData {
  label: string;
  status: StiStatus;
  categories: StiNamespaceCategories;
}

export type StiGroupData = StiComponentData | StiNamespaceData;

export interface StiExpandPayload {
  isExpanded: boolean;
  expandedValue: StiItemData[];
}
