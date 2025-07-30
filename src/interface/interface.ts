/* eslint-disable @typescript-eslint/no-explicit-any */
export interface EmployeeProfilePictureInterface {
  width: number;
  height: number;
  profilePicture?: string;
  isLoading?: boolean;
}

export interface BreadcrumbsProps {
  label: string;
  name: string;
  link: string;
  target?: string;
  customIcon?: React.ReactNode;
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

export interface InfoFieldProps {
  label: string;
  value: string | number | null | undefined;
  renderDate?: boolean;
  default_dateformat?: string;
  isLink?: boolean;
}
type InterFaceModuleLabelType =
  | 'employee_general_info'
  | 'personal_information'
  | 'employee_information'
  | 'personal_contact_information'
  | 'family_info'
  | 'address'
  | 'social_link'
  | 'organization_general_info'
  | 'organization_address'
  | 'organization_contact_info'
  | 'organization_about_info'
  | 'organization_organization_settings';
export interface InterFaceModuleData {
  label: InterFaceModuleLabelType;
  title: string;
  module: React.ReactElement;
  id: number;
}

export interface InterFaceModuleData {
  label: InterFaceModuleLabelType;
  title: string;
  module: React.ReactElement;
  id: number;
}
