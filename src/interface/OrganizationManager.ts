export interface CountryInfo {
  country_code: string;
  country_flag: string;
  country_name: string;
  country_number_code: string;
}
export interface OrganizationAddress {
  country: string;
  country_code: string;
}

export interface OrganizationDetails {
  id: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  organization_created: boolean;
  primary_email: string;
  primary_number: string;
  organization_name: string;
  email_domain_slug: string;
  is_meta_verified: boolean;
  email_verified: boolean;
  employee_code_prefix: string;
  intern_code_prefix: string;
  country_info: CountryInfo;
  organization_address: OrganizationAddress;
  organization_image: string;
  portal_slug: string;
}

export interface ViewOrgSidebarPropsInterface {
  loading: boolean;
  data: OrganizationSettingsInterface;
  handelClickOnOrgPowerOff: (data: OrganizationSettingsInterface) => void;
}

export interface OrganizationSettingsInterface {
  id: string;
  status: boolean;
  updated_at: string;
  created_at: string;
  organization_created: boolean;
  general_info: GeneralInfo;
  address: OrgAddress;
  contact_info: OrganizationContactInfo[];
  organization_settings: OrganizationSettings;
  about_info: OrganizationAboutInfo;
}
interface GeneralInfo {
  country_info: {
    country_code: string;
    country_flag: string;
    country_name: string;
    country_number_code: string;
  };

  email_verified: boolean;
  id: string;
  is_meta_verified: boolean;
  meta_key: string;
  meta_value: string;
  organization_id: string;
  organization_name: string;
  organization_profile_picture: string;
  portal_slug: string;
  portal_url: string;
  primary_email: string;
  primary_number: string;
  terms_accepted: true;
  website_url: string;
}
interface OrgAddress {
  address: string;
  city: string;
  country: string;
  country_code: string;
  id: string;
  organization_id: string;
  state: string;
  zip_code: string;
}

interface OrganizationContactInfo {
  company_email: string;
  country_info: string;
  id: string;
  organization_id: string;
  phone_number: string;
}

interface OrganizationSettings {
  default_dateformat: string;
  default_timezone: string;
  email_domain_slug: string;
  employee_code_prefix: string;
  id: string;
  intern_code_prefix: string;
  organization_id: string;
}

interface OrganizationAboutInfo {
  about: string;
  established_science: string;
  id: string;
  organization_id: string;
  registration_number: string;
}

export interface ViewOrganizationHeaderButtonsInterface {
  link: string;
  classNames: string;
  label: string;
  title: string;
}

export interface OrganizationDetailsPropsInterface {
  data: OrganizationSettingsInterface;
  loading: boolean;
}

export interface EmployeePersonalInfo {
  user_id: string;
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  full_name: string;
  profile_picture: string;
  profile_picture_bg: string;
  gender: string;
  date_of_birth: string;
  blood_group: string;
  about: string;
}

export interface ReportingManager {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  full_name: string;
  profile_picture: string;
  profile_picture_bg: string;
  gender: string;

  employee_code: string;
}

export interface EmployeeRole {
  id: string;
  role_name: string;
  description: string;
  status: boolean;
  created_at: string;
  updated_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  source_type: string;
  config_module_id: string;
}

export interface EmployeeEmployeeInfo {
  id: string;
  user_id: string;
  status: string;
  organization_id: string;
  organization_name: string;
  department: string;
  designation: string;
  reporting_to_id: string;
  reporting_manager: ReportingManager;
  employee_role: EmployeeRole;
  employee_email: string;
  employee_code: string;
  employee_type: string;
  joining_date: string;
  account_status: boolean;
}

export interface EmployeeFieldInterface {
  personal_info: EmployeePersonalInfo;
  employee_info: EmployeeEmployeeInfo;

  account_status: boolean;
  organization_id: string;
}

export interface EmployeePersonalContactInterface {
  personal_email: string;
  mobile_number: string;
  country_info: string;
  emergency_contacts: Array<{
    emergency_contact_name: string;
    emergency_contact_number: string;
    emergency_contact_country_info: string;
    contact_id: string;
    id: string;
  }>;
}

export interface EmployeeFamilyInfoInterface {
  father_name: string;
  mother_name: string;
  marital_status: string;
  children: Array<{
    child_date_of_birth: string;
    child_name: string;
    family_info_id: string;
    id: string;
  }>;
}

export type EmployeeStatusInterface =
  | 'Intern'
  | 'Trainee'
  | 'Probation'
  | 'Confirmed';

export interface OrganizationEmployeeProfileInterface {
  OrgData: OrganizationSettingsInterface;
}

export interface AddressModuleInterface {
  address: string;
  country: string;
  city: string;
  state: string;
  zip_code: string;
  country_code: string;
}

export interface OrganizationEmployeeAddressInterface {
  current_address: {
    address: string;
    country: string;
    city: string;
    state: string;
    zip_code: string;
    country_code: string;
  };
  same_as_current_address: boolean;
  permanent_address: {
    address: string;
    country: string;
    city: string;
    state: string;
    zip_code: string;
    country_code: string;
  };
}
