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
