/* eslint-disable @typescript-eslint/no-explicit-any */
export interface endpointObject {
  endPoint: string;
  protected: boolean;
  data?: object;
  header?: object;
}
export interface URLObject {
  url: string;
  Method: 'GET' | 'POST';
  data?: object;
  header?: object;
}
export interface ApiReturnInterface {
  message: string;
  success: boolean;
  data?: any;
  metadata?: any;
  current_session_id?: string;
}

export interface TableInfoHeaderInterfaceButtonArrayObject {
  buttonTitle: string;
  classNames: string;
  icon?: React.ReactElement | null;
  onclickFunction?: () => void;
}
export interface TableInfoHeaderInterface {
  moduleName: string;
  badgeValue: string;
  buttonsArray?: Array<TableInfoHeaderInterfaceButtonArrayObject>;
  renderDateSelector?: boolean;
  year?: number;
  handelYearButton?: (type: 'increment' | 'decrement') => void;
}
export interface Column {
  key: string;
  childKey?: string;
  title: string | React.ReactElement;
  isSortable: boolean;
  isSticky: boolean;
  canToggleVisibility: boolean;
  align?: 'left' | 'center' | 'right';
  filterable?: boolean;
  renderContent: (data: any, childKeyData?: any) => React.ReactElement;
  // onSortColumn: () => void;
}
export interface operatorObject {
  label: string;
  value: string;
  type: string;
}
export interface SearchBarFilterOptionsInterface {
  id: string;
  value: string;
  label: React.ReactElement;
  operator?: Array<operatorObject>;
  options?: Array<operatorObject>;
  optionType: 'text' | 'select' | 'multi-select' | 'date';
}

export interface UrlEncodedFilterQueryInterface {
  field_name: string;
  operator: string;
  value: string;
}
