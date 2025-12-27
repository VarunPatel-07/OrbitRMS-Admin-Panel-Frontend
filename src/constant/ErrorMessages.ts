export const ERROR_MESSAGES = {
  // Common validation messages
  REQUIRED_EMAIL: 'This is a required field.',
  INVALID_EMAIL: 'Enter a valid email.',
  REQUIRED_FIELD: 'This is a required field.',
  REQUIRED_FIELD_LOWERCASE: 'this field is required',
  REQUIRED_FIELD_LOWERCASE_ALT: 'this is a required field',
  REQUIRED_FIELD_CAPITALIZED: 'This Is An Required Field',
  REQUIRED_FIELD_WITH_PERIOD: 'This field is required.',

  // Password validation
  PASSWORD_MIN_CHARACTERS: 'Password must be at least 6 characters.',

  // Email validation
  VALID_EMAIL_ADDRESS: 'Please enter a valid email address.',
  VALID_EMAIL: 'Please enter a valid email.',
  PUBLIC_EMAIL_NOT_ALLOWED: 'public email ({company} - {mail}) Not Allowed',

  // Verification
  VERIFY_EMAIL_ACCESS_DENIED_FOR_INSUFFICIENT_DATA:
    'Access Denied: Invalid or incomplete verification link.',

  // File upload errors
  TOO_MANY_FILES_MAX_5_IMAGES: 'Too many files! Max 5 images allowed.',
  TOO_MANY_FILES_MAX_5_AT_TIME: 'Too many files! Max 5 at a time',
  FILE_TOO_LARGE_100MB: 'File too large! Keep it under 100MB',
  FILE_FORMAT_NOT_SUPPORTED:
    "Oops! That file format isn't supported. Try {formats}",
  MAX_LIMIT_IMAGES_LEFT: 'Max limit! {count} image{plural} left.',

  // General errors
  SOMETHING_WENT_WRONG: 'something went wrong',
  UNKNOWN_ERROR: 'An unknown error occurred',
  USER_NOT_AUTHENTICATED: 'User not authenticated',
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_IDS: 'invalid Ids',
  ORGANIZATION_ID_NOT_FOUND: 'Organization Id Not Found',
};
