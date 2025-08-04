import Skeleton from 'react-loading-skeleton';

import Button from '../../../common/Button';
import EmployeeProfilePicture from '../../../Components/EmployeeProfilePicture';
import { classNames, formateDate } from '../../../Helper/HelperFunction';
import { ViewOrgSidebarPropsInterface } from '../../../interface/OrganizationManager';

function OrganizationSidebar(props: ViewOrgSidebarPropsInterface) {
  const { loading, data, handelClickOnOrgPowerOff } = props;

  return (
    <div className='w-full h-full pt-10'>
      <div className='w-full h-full flex flex-col items-center justify-between'>
        <div className='w-full h-full flex flex-col justify-between'>
          <div className='flex flex-col items-center justify-start gap-5 px-2 w-full pb-5'>
            <EmployeeProfilePicture
              width={160}
              height={160}
              profilePicture={data?.general_info?.organization_profile_picture}
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
          <div className='w-full flex flex-col items-start justify-start'>
            <div className='px-4 py-5 border-t border-t-black/20 w-full'>
              <div className='flex items-center justify-between'>
                <p className='text-black/80 text-sm font-medium font-inter'>
                  Email Verified:
                </p>
                {loading ? (
                  <Skeleton height={30} width={75} borderRadius={8} />
                ) : (
                  <>
                    {data?.general_info.email_verified ? (
                      <span className='text-xs font-medium font-inter bg-green-100 text-green-700 border border-green-500 px-4 py-1.5 rounded-lg'>
                        Verified
                      </span>
                    ) : (
                      <span className='text-xs font-medium font-inter bg-red-100 text-red-700 border border-red-500 px-4 py-1.5 rounded-lg'>
                        Not Verified
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className='px-4 py-5 border-t border-t-black/20 w-full'>
              <div className='flex items-center justify-between'>
                <p className='text-black/80 text-sm font-medium font-inter'>
                  Meta Verified:
                </p>
                {loading ? (
                  <Skeleton height={30} width={75} borderRadius={8} />
                ) : (
                  <>
                    {data?.general_info.is_meta_verified ? (
                      <span className='text-xs font-medium font-inter bg-green-100 text-green-700 border border-green-500 px-4 py-1.5 rounded-lg'>
                        Verified
                      </span>
                    ) : (
                      <span className='text-xs font-medium font-inter bg-red-100 text-red-700 border border-red-500 px-4 py-1.5 rounded-lg'>
                        Not Verified
                      </span>
                    )}
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
            <div className='px-4 py-5 border-t border-t-black/20 w-full'>
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
  );
}

export default OrganizationSidebar;
