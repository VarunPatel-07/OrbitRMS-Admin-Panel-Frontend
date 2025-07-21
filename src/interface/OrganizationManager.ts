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
}
