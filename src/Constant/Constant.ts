import { MetaDataInterface } from '../interface/propsInterface';

export const unauthorizedStatusCodes = [
  404,
  401, // Unauthorized (authentication required or token missing/invalid)
  403, // Forbidden (authenticated but not authorized for the resource)
  407, // Proxy Authentication Required (rare, but still access-related)
];
export const getEnterAnimationClass = {
  'top-right': 'animate-enter-top-right',
  'top-left': 'animate-enter-top-left',
  'bottom-right': 'animate-enter-bottom-right',
  'bottom-left': 'animate-enter-bottom-left',
  center: 'animate-enter-center',
};
export const getExitAnimationClass = {
  'top-right': 'animate-exit-top-right',
  'top-left': 'animate-exit-top-left',
  'bottom-right': 'animate-exit-bottom-right',
  'bottom-left': 'animate-exit-bottom-left',
  center: 'animate-exit-center',
};

export const PASSWORD_RESET_KEY = 'expiry_time';

export const MAX_SIGN_IN_ATTEMPT = 'sign_in_attempt';
export const MINIMUM_RESEND_OTP_INTERVAL = 'minimum_resend_otp_interval';

export const dropdownMenuArray = [10, 25, 50, 100];

export const initialMetadata: MetaDataInterface = {
  total_data: 0,
  total_pages: 1,
  current_page: 1,
  record_per_page: 10,
};

export const OrganizationEmployeeStatusArray = [
  'Intern',
  'Trainee',
  'Probation',
  'Confirmed',
];

export const AlignableForChildInfo = [
  'Married',
  'Divorced',
  'Widowed',
  'Prefer not to say',
];
