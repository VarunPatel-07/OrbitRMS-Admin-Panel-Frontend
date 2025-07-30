import { OrganizationManagerAlertModalInfoType } from '../../interface/CommonComponentProps';

const AlertModalDeactivationInfo = `Disabling this organization will immediately revoke its access to the OrbitRMS platform. 
All users will be logged out, and active workflows may be interrupted. 
Use this action carefully—it should only be done when necessary. 
You can re-enable access later from the admin panel.`;

const AlertModalActivationInfo = `Re-enabling this organization will restore its access to the OrbitRMS platform. 
Users will be able to log in again, and workflows will resume. 
Ensure that all compliance checks are completed before reactivating access.`;

export const OrganizationAlertModalHelperFunction = (
  status: boolean,
  orgId: string
) => {
  const AlertModalObject: OrganizationManagerAlertModalInfoType = {
    id: orgId,
    success: status,
    protected: false,
    alertModalTitle: status
      ? 'Are You Sure You Want to Disable This Organization?'
      : 'Are You Sure You Want to Activate This Organization?',
    alertModelInfo: status
      ? AlertModalDeactivationInfo
      : AlertModalActivationInfo,
  };

  return AlertModalObject;
};
