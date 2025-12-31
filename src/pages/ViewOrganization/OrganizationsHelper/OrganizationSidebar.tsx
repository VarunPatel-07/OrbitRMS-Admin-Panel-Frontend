import { useContext, useState } from 'react';
import { RiVerifiedBadgeFill } from 'react-icons/ri';
import Skeleton from 'react-loading-skeleton';

import Button from '../../../components/common/Button';
import EmployeeProfilePicture from '../../../components/EmployeeProfilePicture';
import ResetPasswordLinkModal from '../../../components/modal/ResetPasswordLinkModal';
import { publicEmailProviders } from '../../../constant/PublicEmailArray';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../../context/notification/NotificationContextApi';
import { useDebounce } from '../../../hooks/useDebounce';
import { ViewOrgSidebarPropsInterface } from '../../../interface/OrganizationManager';
import { endpointObject } from '../../../interface/propsInterface';
import { multiplePostApi } from '../../../utils/api/multipleAPI';
import { classNames, formateDate } from '../../../utils/helper/HelperFunction';

function OrganizationSidebar(props: ViewOrgSidebarPropsInterface) {
  const { loading, data, handelClickOnOrgPowerOff } = props;

  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'Email' | 'Onboarding'>('Email');

  const reSendEmailVerificationLinkWithDebounce = useDebounce(
    async (mail: string, callBack: (success: boolean) => void) => {
      const endPointArr: endpointObject[] = [
        {
          endPoint: `organization-manager/reset/resend-email-verification?id=${data?.id}`,
          protected: true,
          data: { email: mail },
        },
      ];
      const response = await multiplePostApi(endPointArr);
      const res = response[0];

      callBack(res?.success);
      handelNotification(res, 'top-right');
    }
  );
  const reSendOnboardingInstructionLink = useDebounce(
    async (mail: string, callBack: (success: boolean) => void) => {
      const endPointArr: endpointObject[] = [
        {
          endPoint: `organization-manager/reset/resend-onboarding-instruction?id=${data?.id}`,
          protected: true,
          data: { email: mail },
        },
      ];
      const response = await multiplePostApi(endPointArr);
      const res = response[0];

      callBack(res?.success);
      handelNotification(res, 'top-right');
    }
  );

  const handelSubmit = (mail: string, callBack: (success: boolean) => void) => {
    if (modalType == 'Email') {
      reSendEmailVerificationLinkWithDebounce(mail, callBack);
    } else {
      reSendOnboardingInstructionLink(mail, callBack);
    }
  };

  const hostBlacklistMails = publicEmailProviders?.map((item) => item?.mail);

  return (
    <>
      <div className='w-full h-full pt-10'>
        <div className='w-full h-full flex flex-col items-center justify-between'>
          <div className='w-full h-full flex flex-col justify-between'>
            <div className='flex flex-col items-center justify-start gap-5 px-2 w-full pb-5'>
              <EmployeeProfilePicture
                width={160}
                height={160}
                profilePicture={
                  data?.general_info?.organization_profile_picture
                }
                isLoading={loading}
              />

              <div className='flex flex-col items-center justify-start gap-2 w-full'>
                {loading ? (
                  <Skeleton height={20} width={200} />
                ) : (
                  <p className='text-lg text-black font-inter font-medium max-w-[90%] text-ellipsis overflow-hidden text-center m-auto'>
                    {data?.general_info?.organization_name}
                  </p>
                )}

                {loading ? (
                  <Skeleton height={26} width={110} borderRadius={8} />
                ) : (
                  <p className='text-xs text-black bg-slate-50 py-1 px-3 border border-black/15 font-inter font-medium w-fit rounded-lg max-w-[90%] text-ellipsis overflow-hidden text-center m-auto mt-1'>
                    {data?.address?.country}
                  </p>
                )}
              </div>

              {loading ? (
                <Skeleton height={42} width={220} borderRadius={8} />
              ) : (
                <div className='w-full flex items-center justify-center max-w-[220px]'>
                  <Button
                    type='button'
                    className={classNames(
                      'font-inter font-medium text-sm px-5 py-2 rounded-lg capitalize text-ellipsis overflow-hidden text-center w-full',
                      {
                        'bg-green-100 border border-green-500 text-green-700':
                          !data?.status,
                        'bg-rose-100 border border-rose-500 text-rose-700':
                          data?.status,
                      }
                    )}
                    onClick={() => handelClickOnOrgPowerOff(data)}
                  >
                    {data?.status
                      ? 'Disable Organization'
                      : 'Enable Organization'}
                  </Button>
                </div>
              )}
            </div>
            <div className='w-full  border-t border-t-black/20'>
              <div className='w-full px-5 py-4 flex flex-col items-center justify-center gap-6'>
                {data?.general_info?.email_verified ? (
                  <span className='w-full bg-green-100 border border-green-400 text-nowrap text-green-700 px-5 py-3 text-base flex rounded-lg'>
                    <span className='flex items-center justify-start gap-4 w-full'>
                      <RiVerifiedBadgeFill className='text-xl' />
                      <span className='font-semibold'>
                        Email Verification Completed
                      </span>
                    </span>
                  </span>
                ) : (
                  <Button
                    type='button'
                    className='w-full bg-orange-100 border border-orange-400 text-nowrap text-orange-700 px-5 py-3 text-base'
                    onClick={() => {
                      setShowResetModal(!showResetModal);
                      setModalType('Email');
                    }}
                  >
                    <span className='flex items-center justify-start gap-4'>
                      <RiVerifiedBadgeFill className='text-xl' />
                      <span className='font-semibold'>
                        Email Verification Required
                      </span>
                    </span>
                  </Button>
                )}
                {data?.organization_created ? (
                  <span className='w-full bg-green-100 border border-green-400 text-nowrap text-green-700 px-5 py-3 text-base flex rounded-lg'>
                    <span className='flex items-center justify-center gap-4 w-full'>
                      <RiVerifiedBadgeFill className='text-xl' />
                      <span className='font-semibold'>
                        Onboarding Completed
                      </span>
                    </span>
                  </span>
                ) : (
                  <Button
                    type='button'
                    className='w-full bg-orange-100 border border-orange-400 text-nowrap text-orange-700 px-5 py-3 text-base'
                    onClick={() => {
                      setShowResetModal(!showResetModal);
                      setModalType('Onboarding');
                    }}
                  >
                    <span className='flex items-center justify-start gap-4'>
                      <RiVerifiedBadgeFill className='text-xl' />
                      <span className='font-semibold'>
                        Onboarding Is Pending
                      </span>
                    </span>
                  </Button>
                )}
              </div>
            </div>
            <div className='w-full flex flex-col items-start justify-start pb-5'>
              <div className='px-4 py-5 border-t border-t-black/20 w-full'>
                <div className='flex items-center justify-between gap-4'>
                  <p className='text-black/80 text-sm font-medium font-inter min-w-fit'>
                    Primary Email:
                  </p>
                  {loading ? (
                    <Skeleton height={22} width={150} borderRadius={8} />
                  ) : (
                    <a
                      href={`mailto:${data?.general_info?.primary_email}`}
                      className='font-inter text-black font-medium transition-all text-base hover:underline hover:text-blue-600 text-nowrap text-ellipsis overflow-hidden'
                    >
                      {data?.general_info?.primary_email || '-'}
                    </a>
                  )}
                </div>
              </div>
              <div className='px-4 py-5 border-t border-t-black/20 w-full'>
                <div className='flex items-center justify-between'>
                  <p className='text-black/80 text-sm font-medium font-inter'>
                    Primary Number:
                  </p>
                  {loading ? (
                    <Skeleton height={30} width={75} borderRadius={8} />
                  ) : (
                    <>
                      <a
                        href={`tel:${data?.general_info?.country_info?.country_number_code}-${data?.general_info?.primary_number}`}
                        className='font-inter text-black font-medium transition-all text-base hover:underline hover:text-blue-600 text-nowrap text-ellipsis overflow-hidden'
                      >
                        {data?.general_info?.country_info?.country_number_code}{' '}
                        {'  - '} {'  '}
                        {data?.general_info?.primary_number || '-'}
                      </a>
                    </>
                  )}
                </div>
              </div>
              <div className='px-4 py-5 border-t border-t-black/20 w-full'>
                <div className='flex items-center justify-between'>
                  <p className='text-black/80 text-sm font-medium font-inter'>
                    Created On:
                  </p>
                  {loading ? (
                    <Skeleton height={22} width={150} borderRadius={8} />
                  ) : (
                    <span className='w-fit font-inter text-base capitalize font-medium text-black/85'>
                      {formateDate(data?.created_at, 'DD-MMM-Y', false)}
                    </span>
                  )}
                </div>
              </div>
              <div className='px-4 py-5 border-t border-t-black/20 border-b border-b-black/20 w-full'>
                <div className='flex items-center justify-between'>
                  <p className='text-black/80 text-sm font-medium font-inter'>
                    Email Domain:
                  </p>
                  {loading ? (
                    <Skeleton height={22} width={150} borderRadius={8} />
                  ) : (
                    <span className='w-fit font-inter text-base font-medium text-black/85'>
                      {data?.organization_settings?.email_domain_slug}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ResetPasswordLinkModal
        isOpen={showResetModal}
        setIsOpen={setShowResetModal}
        personalEmail=''
        companyEmail={data?.general_info?.primary_email}
        handelSubmit={handelSubmit}
        modelTitle={
          modalType == 'Email'
            ? 'Resend Email Verification Link'
            : 'Resend Onboarding Instruction Link'
        }
        hostBlacklistMails={hostBlacklistMails}
        showCustomInput={modalType == 'Onboarding' ? false : true}
      />
    </>
  );
}

export default OrganizationSidebar;
