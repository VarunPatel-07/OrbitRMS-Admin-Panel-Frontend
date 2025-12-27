import { OrganizationManagerAlertModalInfoType } from '../interface/CommonComponentProps';
import {
  OrganizationSettingsInterface,
  ViewOrganizationHeaderButtonsInterface,
} from '../interface/OrganizationManager';

export const OrgManagerBreadcrumbsObjects = [
  {
    name: 'dashboard',
    label: 'dashboard',
    link: `/orbitrms/dashboard`,
  },

  {
    name: 'Organization Manager',
    label: 'organization-manager',
    link: `/orbitrms/organization-manager`,
  },
];

export const OrganizationManagerAlertModalInitialObj: OrganizationManagerAlertModalInfoType =
  {
    success: false,
    protected: false,
    alertModalTitle: '',
    alertModelInfo: '',
    id: '',
  };

export const OrganizationInfoInitialData: OrganizationSettingsInterface = {
  id: '',
  status: false,
  updated_at: '',
  created_at: '',
  organization_created: false,
  general_info: {
    country_info: {
      country_code: '',
      country_flag: '',
      country_name: '',
      country_number_code: '',
    },
    email_verified: false,
    id: '',
    is_meta_verified: false,
    meta_key: '',
    meta_value: '',
    organization_id: '',
    organization_name: '',
    organization_profile_picture: '',
    portal_slug: '',
    portal_url: '',
    primary_email: '',
    primary_number: '',
    terms_accepted: true,
    website_url: '',
  },
  address: {
    address: '',
    city: '',
    country: '',
    country_code: '',
    id: '',
    organization_id: '',
    state: '',
    zip_code: '',
  },
  contact_info: [
    {
      company_email: '',
      country_info: '',
      id: '',
      organization_id: '',
      phone_number: '',
    },
  ],
  organization_settings: {
    default_dateformat: '',
    default_timezone: '',
    email_domain_slug: '',
    employee_code_prefix: '',
    id: '',
    intern_code_prefix: '',
    organization_id: '',
  },
  about_info: {
    about: '',
    established_science: '',
    id: '',
    organization_id: '',
    registration_number: '',
  },
};

export const ViewOrganizationHeaderButtons = (
  id: string
): ViewOrganizationHeaderButtonsInterface[] => [
  {
    link: `/orbitrms/organizations/${id}/organization-details`,
    classNames:
      'font-inter text-black font-medium capitalize text-sm px-3 py-1.5 border border-black/15 rounded-md h-full inline-block',
    label: 'organization_details',
    title: 'Organization Details',
  },
  {
    link: `/orbitrms/organizations/${id}/employees`,
    classNames:
      'font-inter text-black font-medium capitalize text-sm px-3 py-1.5 border border-black/15 rounded-md h-full inline-block',
    label: 'employees',
    title: 'Employees',
  },
];
