import { OrganizationManagerAlertModalInfoType } from '../../../interface/CommonComponentProps';

const AlertModalEmployeeDeactivationInfo = `Disabling this employee will immediately revoke their access to the OrbitRMS platform. 
They will be logged out of all sessions, and their involvement in ongoing workflows will be paused. 
Use this action cautiously and only when required. You can re-enable the employee later if needed.`;

const AlertModalEmployeeActivationInfo = `Re-enabling this employee will restore their access to the OrbitRMS platform. 
They will be able to log in again and resume any assigned workflows. 
Ensure that the employee is authorized to resume their responsibilities before proceeding.`;

export const OrganizationEmployeeAlertModalHelper = (
  status: boolean,
  userId: string
) => {
  const AlertModalObject: OrganizationManagerAlertModalInfoType = {
    id: userId,
    success: status,
    protected: false,
    alertModalTitle: status
      ? 'Are You Sure You Want to Disable This Employee?'
      : 'Are You Sure You Want to Activate This Employee?',
    alertModelInfo: status
      ? AlertModalEmployeeDeactivationInfo
      : AlertModalEmployeeActivationInfo,
  };

  return AlertModalObject;
};
