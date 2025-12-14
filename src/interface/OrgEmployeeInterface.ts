export interface personal_info {
  first_name: string;
  middle_name: string;
  last_name: string;
  full_name: string;
  profile_picture: string;
  gender: string;
  date_of_birth: string;
  blood_group: string;
  about: string;
  user_id: string;
}

export interface reporting_manager {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  full_name: string;
  gender: string;
  profile_picture: string;
  profile_picture_bg: string;
}

export interface employee_info {
  status: string;
  organization_name: string;
  department: string;
  designation: string;
  reporting_manager: reporting_manager;
  employee_role: {
    id: string;
    role_name: string;
  };
  employee_email: string;
  employee_code: string;
  employee_type: string;
  joining_date: string;
}

export interface personal_contact_info {
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

export interface family_info {
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

export interface AddressInterface {
  address: string;
  country: string;
  city: string;
  state: string;
  zip_code: string;
  country_code: string;
}

export interface UserProfileInformationInterface {
  account_status: boolean;
  personal_info: personal_info;
  employee_info: employee_info;
  personal_contact_info: personal_contact_info;
  family_info: family_info;
  current_address: AddressInterface;
  same_as_current_address: boolean;
  permanent_address: AddressInterface;
  social_link: Array<{
    icon: string;
    link: string;
    name: string;
    target_blank: boolean;
    id: string;
    user_id: string;
  }>;
}
