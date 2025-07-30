import React, { RefObject, SetStateAction } from 'react';

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
  loading?: boolean;
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

export interface ModuleValueInterface {
  label: string;
  value: string;
  type: string;
}

export interface FilterObjectInterface {
  id: string;
  moduleValue: ModuleValueInterface[];
  optionType?: 'text' | 'select' | 'multi-select' | 'date';
}
export interface FiltersOptionsDropdownInterface {
  showCurrentOptionDropdown: boolean;
  filterColumnsArray: SearchBarFilterOptionsInterface[];
  currentFilterId: string;
  filterObject: FilterObjectInterface[];
  setShowCurrentOperatorDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCurrentOptionDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  updateFilterObject: (
    newItem: ModuleValueInterface,
    id: string,
    callback?: (updatedArray: FilterObjectInterface[]) => void
  ) => void;
  setFilterObject: React.Dispatch<
    React.SetStateAction<FilterObjectInterface[]>
  >;
  updateFinalFilterQuery: (newData: FilterObjectInterface[]) => void;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  showFilterDropDownMenu: boolean;
  searchInputValue: string;
  enterClickHandler: () => void;
}

export interface countryObject {
  country_flag: string;
  country_name: string;
  country_code: string;
  country_number_code: string;
}

export interface DropDownProps {
  dropDownSelectedValue?: string | number;
  setDropDownSelectedValue?: React.Dispatch<SetStateAction<string | number>>;
  dropdownMenuArray: Array<string | number | countryObject>;
  styleDropdownButton?: string;
  children?: React.ReactNode;
  dropdownPosition?: 'top' | 'bottom'; // New prop for dropdown position
  maxHeight: number;
  minWidth?: number;
  disabled?: boolean;
}

export interface FiltersOperatorDropdownInterface {
  showCurrentOperatorDropdown: boolean;
  filterColumnsArray: SearchBarFilterOptionsInterface[];
  currentFilterId: string;
  updateFilterObject: (
    newItem: ModuleValueInterface,
    id: string,
    callback?: (updatedArray: FilterObjectInterface[]) => void
  ) => void;
  setShowCurrentOperatorDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCurrentOptionDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  handelInputFieldFocus: () => void;
  showFilterDropDownMenu: boolean;
}

export interface handleMultiInputChangeInterface {
  filterObject: FilterObjectInterface[];
  selectedFilterObject: FilterObjectInterface[];
  inputFieldRef: RefObject<HTMLInputElement>;
  inputValue: string;
  setInputValue: React.Dispatch<SetStateAction<string>>;
  setShowFilterDropDownMenu: React.Dispatch<SetStateAction<boolean>>;
  optionType: 'text' | 'select' | 'multi-select' | 'date' | undefined;
  searchInputValue: string;
  setSearchInputValue: React.Dispatch<SetStateAction<string>>;
}

export interface FilterInputMainFilterDropdownInterface {
  showFilterDropDownMenu: boolean;
  currentFilterId: string;
  filterColumnsArray: SearchBarFilterOptionsInterface[];
  selectedFilterObject: FilterObjectInterface[];
  setShowFilterDropDownMenu: React.Dispatch<SetStateAction<boolean>>;
  setCurrentFilterId: React.Dispatch<SetStateAction<string>>;
  setFilterObject: React.Dispatch<SetStateAction<FilterObjectInterface[]>>;
  setShowCurrentOperatorDropdown: React.Dispatch<SetStateAction<boolean>>;
}

export interface MetaDataInterface {
  total_data: number;
  total_pages: number;
  current_page: number;
  record_per_page: number;
}
