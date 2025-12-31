import { LuUser } from 'react-icons/lu';
import { MdOutlineEmail } from 'react-icons/md';
import { Link } from 'react-router-dom';

import EmployeeProfilePicture from '../../../../components/EmployeeProfilePicture';
import { AlignableForChildInfo } from '../../../../constant/Constant';
import {
  AddressModuleInterface,
  EmployeeFamilyInfoInterface,
  EmployeePersonalContactInterface,
  EmployeeStatusInterface,
  OrganizationEmployeeAddressInterface,
  OrganizationSettingsInterface,
} from '../../../../interface/OrganizationManager';
import { UserProfileInformationInterface } from '../../../../interface/OrgEmployeeInterface';
import {
  BeautifulAccountStatusRenderer,
  InfoField,
} from '../../../../utils/helper/Helper';
import {
  classNames,
  formateDate,
} from '../../../../utils/helper/HelperFunction';

export const EmployeeProfileElemRenderer = (
  data: UserProfileInformationInterface
) => {
  return (
    <div className='bg-white rounded-xl border border-black/15 w-full p-5'>
      <div className='w-full flex items-start justify-start gap-5'>
        <div className='w-fit'>
          <EmployeeProfilePicture
            width={140}
            height={140}
            profilePicture={data.personal_info.profile_picture}
          />
        </div>
        <div className='flex flex-col items-start justify-start gap-3'>
          <p className='text-xl font-medium text-black'>
            {data.personal_info.full_name
              ? data.personal_info?.full_name
              : data.personal_info?.first_name +
                ' ' +
                data.personal_info?.middle_name +
                ' ' +
                data.personal_info?.last_name}
          </p>
          <p className='text-base text-black/60 font-inter font-medium text-ellipsis overflow-hidden text-center'>
            {data.employee_info.designation}
          </p>
          <p className='text-xs text-black bg-slate-50 py-1 px-3 border border-black/15 font-inter font-medium w-fit rounded-lg text-ellipsis overflow-hidden text-center'>
            {data?.employee_info?.department || '-'}
          </p>
        </div>
      </div>
    </div>
  );
};

export const EmployeeGeneralInfo = (data: UserProfileInformationInterface) => {
  return (
    <div className='bg-white rounded-xl border border-black/15'>
      <div className='w-full'>
        <div className='w-full grid grid-cols-3'>
          <div className='w-full border-r border-r-black/40'>
            <div className='w-full h-full flex flex-col items-start justify-end p-6'>
              <div className='w-full'>
                <div className='p-2 border border-black/25 rounded-md w-fit mb-3'>
                  <MdOutlineEmail className='text-black w-6 h-6' />
                </div>
                <span className='text-sm font-inter font-normal text-black/60 pb-0.5 inline-block'>
                  Email Address
                </span>
                <Link
                  to={`mailto:${data?.employee_info?.employee_email}`}
                  className='text-base text-black font-inter font-medium w-full text-ellipsis overflow-hidden hover:text-[#3538CD] block'
                >
                  {data?.employee_info?.employee_email || '-'}
                </Link>
              </div>
            </div>
          </div>
          <div className='w-full border-r border-r-black/40'>
            <div className='w-full h-full flex flex-col items-start justify-end p-6'>
              <div className='w-full'>
                <div className='p-2 border border-black/25 rounded-md w-fit mb-3'>
                  <LuUser className='text-black w-6 h-6' />
                </div>
                <span className='text-sm font-inter font-normal text-black/60 pb-0.5 inline-block'>
                  Employee Code
                </span>
                <p className='text-base text-black font-inter font-medium'>
                  {data?.employee_info?.employee_code || '-'}
                </p>
              </div>
            </div>
          </div>
          <div className='w-full'>
            <div className='w-full h-full flex flex-col items-start justify-end p-6'>
              <div className='w-full'>
                <div className='w-fit mb-3'>
                  <EmployeeProfilePicture
                    width={40}
                    height={40}
                    profilePicture={
                      data?.employee_info?.reporting_manager?.profile_picture
                    }
                  />
                </div>
                <span className='text-sm font-inter font-normal text-black/60 pb-0.5 inline-block'>
                  Reporting Manager
                </span>
                {data?.employee_info?.reporting_manager?.first_name ? (
                  <Link
                    to={`/orbitrms/organizations/${data?.personal_info}/employee-profile?employee-id=${data?.personal_info?.user_id}`}
                    className='text-base text-black font-inter font-medium block hover:text-[#3538CD]'
                    target='_blank'
                  >
                    {data?.employee_info?.reporting_manager?.full_name
                      ? data?.employee_info?.reporting_manager?.full_name
                      : data?.employee_info?.reporting_manager?.first_name +
                        ' ' +
                        data?.employee_info?.reporting_manager?.middle_name +
                        ' ' +
                        data?.employee_info?.reporting_manager?.last_name}
                  </Link>
                ) : (
                  <p className='text-base text-black font-inter font-medium'>
                    -
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export const PersonalInformation = (
  data: UserProfileInformationInterface,
  OrgData: OrganizationSettingsInterface
) => {
  return (
    <div className='bg-white rounded-xl border border-black/15'>
      <div className='flex items-start flex-col justify-start gap-1 px-6 py-4 border-b border-b-black/20'>
        <span className='font-inter text-lg text-black font-semibold capitalize'>
          Personal Information
        </span>
      </div>
      <div className='p-6 w-full'>
        <div className='grid grid-cols-1 gap-6'>
          <div className='w-full flex items-center justify-start gap-5 py-3'>
            <div className='w-fit'>
              <EmployeeProfilePicture
                width={120}
                height={120}
                profilePicture={data.personal_info.profile_picture}
              />
            </div>
            <div className='w-full'>
              <InfoField
                label='Full Name'
                value={
                  data.personal_info.full_name
                    ? data?.personal_info?.full_name
                    : data?.personal_info?.first_name +
                      ' ' +
                      data?.personal_info?.middle_name +
                      ' ' +
                      data?.personal_info?.last_name
                }
              />
            </div>
          </div>
          <div className='w-full'>
            <div className='w-full grid grid-cols-3 gap-5'>
              <div className='w-full'>
                <InfoField
                  label='First Name'
                  value={data.personal_info.first_name}
                />
              </div>
              <div className='w-full'>
                <InfoField
                  label='Middle Name'
                  value={data.personal_info.middle_name}
                />
              </div>
              <div className='w-full'>
                <InfoField
                  label='Last Name'
                  value={data.personal_info.last_name}
                />
              </div>
            </div>
          </div>
          <div className='w-full'>
            <div className='w-full grid grid-cols-3 gap-5'>
              <div className='w-full'>
                <InfoField label='Gender' value={data.personal_info.gender} />
              </div>
              <div className='w-full'>
                <InfoField
                  label='Date Of Birth'
                  value={data.personal_info.date_of_birth}
                  renderDate
                  default_dateformat={
                    OrgData?.organization_settings?.default_dateformat
                  }
                />
              </div>
              <div className='w-full'>
                <InfoField
                  label='Blood Group'
                  value={data.personal_info.blood_group}
                />
              </div>
            </div>
          </div>
          <div className='w-full'>
            <InfoField label='About Info' value={data.personal_info.about} />
          </div>
        </div>
      </div>
    </div>
  );
};
export const EmployeeInformation = (
  data: UserProfileInformationInterface,
  OrgData: OrganizationSettingsInterface
) => {
  return (
    <div className='w-full bg-white rounded-xl border border-black/15'>
      <div className='flex items-start flex-col justify-start gap-1 px-6 py-4 border-b border-b-black/20'>
        <span className='font-inter text-lg text-black font-semibold capitalize'>
          Employee Information
        </span>
      </div>
      <div className='p-6 w-full'>
        <div className='grid grid-cols-1 gap-6'>
          <div className='w-full'>
            <div className='w-full grid grid-cols-3 gap-5'>
              <div className='w-full'>
                <div className='w-full'>
                  <span className='text-base font-inter font-medium text-black pb-0.5 inline-block'>
                    Status
                  </span>

                  {BeautifulAccountStatusRenderer(
                    data.employee_info?.status as EmployeeStatusInterface
                  )}
                </div>
              </div>
              <div className='w-full'>
                <InfoField
                  label='Organization Name'
                  value={data.employee_info?.organization_name}
                />
              </div>
              <div className='w-full'>
                <InfoField
                  label='Department'
                  value={data.employee_info?.department}
                />
              </div>
            </div>
          </div>
          <div className='w-full'>
            <div className='w-full grid grid-cols-3 gap-5'>
              <div className='w-full'>
                <InfoField
                  label='Designation'
                  value={data.employee_info?.designation}
                />
              </div>

              <div className='w-full'>
                <InfoField
                  label='Employee Role'
                  value={data.employee_info?.employee_role?.role_name}
                />
              </div>
              <div className='w-full'>
                <InfoField
                  label='Employee Type'
                  value={data.employee_info?.employee_type}
                />
              </div>
              <div className='w-full'>
                <InfoField
                  label='Joining Date'
                  value={formateDate(
                    data.employee_info?.joining_date,
                    OrgData?.organization_settings?.default_dateformat,
                    false
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export const PersonalContactInformation = (
  data: EmployeePersonalContactInterface
) => {
  return (
    <div className='w-full bg-white rounded-xl border border-black/15'>
      <div className='flex items-start flex-col justify-start gap-1 px-6 py-4 border-b border-b-black/20'>
        <span className='font-inter text-lg text-black font-semibold capitalize'>
          Personal contact information
        </span>
      </div>
      <div className='p-6 w-full'>
        <div className='grid grid-cols-1 gap-6'>
          <div className='w-full'>
            <div className='w-full grid grid-cols-2 gap-5'>
              <div className='w-full'>
                <InfoField label='Personal Email' value={data.personal_email} />
              </div>
              <div className='w-full'>
                <InfoField label='Contact Number' value={data.mobile_number} />
              </div>
            </div>
          </div>
        </div>
        <div className='w-full'>
          <div className='flex w-full gap-2 items-center pb-2 pt-6'>
            <div className='grid grid-cols-2 w-full gap-5'>
              <p className='text-base font-inter font-medium text-black pb-1 inline-block'>
                Emergency Contact Name
              </p>
              <p className='text-base font-inter font-medium text-black pb-1 inline-block'>
                Emergency Contact Number
              </p>
            </div>
          </div>
          <div className='grid grid-cols-1 gap-6'>
            {data?.emergency_contacts?.map((eachContact, index) => (
              <div
                className='w-full flex items-stretch justify-start gap-5'
                key={index}
              >
                <div className='w-full grid grid-cols-2 gap-5'>
                  <div className='w-full'>
                    <InfoField
                      label=''
                      value={eachContact?.emergency_contact_name}
                    />
                  </div>
                  <div className='w-full'>
                    <InfoField
                      label=''
                      value={eachContact?.emergency_contact_number}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export const FamilyInfo = (
  data: EmployeeFamilyInfoInterface,
  OrgData: OrganizationSettingsInterface
) => {
  return (
    <div className='w-full bg-white rounded-xl border border-black/15'>
      <div className='flex items-start flex-col justify-start gap-1 px-6 py-4 border-b border-b-black/20'>
        <span className='font-inter text-lg text-black font-semibold capitalize'>
          Family information
        </span>
      </div>
      <div className='p-6 w-full'>
        <div className='grid grid-cols-1 gap-6'>
          <div className='w-full'>
            <div className='w-full grid grid-cols-2 gap-5'>
              <div className='w-full'>
                <InfoField label='Father Name' value={data.father_name} />
              </div>
              <div className='w-full'>
                <InfoField label='Mother Name' value={data.mother_name} />
              </div>
              <div className='w-full'>
                <InfoField label='Marital Status' value={data.marital_status} />
              </div>
            </div>
          </div>
        </div>
        {AlignableForChildInfo.includes(data?.marital_status) && (
          <div className='w-full'>
            <div className='flex w-full gap-2 items-center pb-2 pt-6'>
              <div className='grid grid-cols-2 w-full gap-2.5'>
                <p className='text-sm font-inter font-normal text-black/60 pb-0.5 inline-block'>
                  Children Name
                </p>
                <p className='text-sm font-inter font-normal text-black/60 pb-0.5 inline-block'>
                  Children Date Of Birth
                </p>
              </div>
            </div>
            <div className='grid grid-cols-1 gap-6'>
              {data?.children?.map((child, index) => (
                <div
                  className='w-full flex items-stretch justify-start gap-5'
                  key={index}
                >
                  <div className='w-full grid grid-cols-2 gap-5'>
                    <div className='w-full'>
                      <InfoField label='' value={child?.child_name} />
                    </div>
                    <div className='w-full'>
                      <InfoField
                        label=''
                        value={child?.child_date_of_birth}
                        renderDate
                        default_dateformat={
                          OrgData?.organization_settings?.default_dateformat
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export const RenderTheAddressFieldDynamically = (
  module: AddressModuleInterface
) => {
  return (
    <div className='w-full min-w-full grid grid-cols-1 gap-6'>
      <div className='w-full'>
        <InfoField label='Address' value={module?.address} />
      </div>

      <div className='grid grid-cols-2 gap-6'>
        <div className='w-full'>
          <InfoField label='Country' value={module?.country} />
        </div>
        <div className='w-full'>
          <InfoField label='State' value={module?.state} />
        </div>
        <div className='w-full'>
          <InfoField label='City' value={module?.city} />
        </div>
        <div className='w-full h-full'>
          <InfoField label='Zip Code' value={module?.zip_code} />
        </div>
      </div>
    </div>
  );
};

export const RenderAddressComponent = (
  data: OrganizationEmployeeAddressInterface
) => {
  return (
    <div className='w-full bg-white rounded-xl border border-black/15'>
      <div className='flex items-start flex-col justify-start gap-1 px-6 py-4 border-b border-b-black/20'>
        <span className='font-inter text-lg text-black font-semibold capitalize'>
          Current Information
        </span>
      </div>
      <div className='w-full'>
        <div className='p-6 w-full'>
          {RenderTheAddressFieldDynamically(data.current_address)}
        </div>
        <div className='py-3 w-full bg-gray-50 border-t border-t-black/10  rounded-b-xl'>
          <div
            className={classNames(
              'w-full flex items-center justify-start gap-1.5 px-6',
              {
                'border-b border-b-black/20 pb-3':
                  !data?.same_as_current_address,
              }
            )}
          >
            <p
              className={classNames('text-black capitalize font-inter w-fit', {
                'text-lg font-semibold': !data?.same_as_current_address,
                'text-sm': data?.same_as_current_address,
              })}
            >
              permanent address
            </p>
            {data?.same_as_current_address && (
              <>
                <p className='text-black capitalize font-inter text-sm'>-</p>
                <p className='text-indigo-600 capitalize font-inter text-sm'>
                  same as current address
                </p>
              </>
            )}
          </div>

          {!data?.same_as_current_address ? (
            <div className='pb-3 mt-6 transition-all px-6'>
              {RenderTheAddressFieldDynamically(data.permanent_address)}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
