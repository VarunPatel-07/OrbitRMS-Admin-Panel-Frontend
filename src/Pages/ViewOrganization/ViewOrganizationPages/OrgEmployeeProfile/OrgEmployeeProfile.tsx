import { useContext, useEffect, useState } from 'react';
import { GoArrowLeft } from 'react-icons/go';
import { useParams, useSearchParams } from 'react-router-dom';

import Breadcrumbs from '../../../../components/common/Breadcrumbs';
import NotFound from '../../../../components/common/NotFound';
import EmployeeProfileSkeletonLoader from '../../../../components/loader/EmployeeProfileSkeletonLoader';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../../../context/notification/NotificationContextApi';
import { useDebounce } from '../../../../hooks/useDebounce';
import { NotFoundPagesOptionsButtonArray } from '../../../../interface/CommonComponentProps';
import { InterFaceModuleData } from '../../../../interface/interface';
import {
  OrganizationEmployeeProfileInterface,
  OrganizationSettingsInterface,
} from '../../../../interface/OrganizationManager';
import { UserProfileInformationInterface } from '../../../../interface/OrgEmployeeInterface';
import { endpointObject } from '../../../../interface/propsInterface';
import { multipleFetchApi } from '../../../../utils/api/multipleAPI';
import { EmployeeInfoInitialState } from './EmployeeInfoInitialState';
import {
  EmployeeGeneralInfo,
  EmployeeInformation,
  FamilyInfo,
  PersonalContactInformation,
  PersonalInformation,
  RenderAddressComponent,
} from './OrgEmployeeProfileHelper';

function OrgEmployeeProfile(props: OrganizationEmployeeProfileInterface) {
  const { OrgData } = props;

  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const { id: organization_id } = useParams();

  const [queryParameter] = useSearchParams();

  const [data, setData] = useState<UserProfileInformationInterface>(
    EmployeeInfoInitialState
  );
  const [isFetching, setIsFetching] = useState<boolean>(true);

  const HandelFetchingEmployeeInfoWithDebounce = useDebounce(
    async (employee_id: string, organization_id: string) => {
      const endPointArr: endpointObject[] = [
        {
          endPoint: `organization/employees/employee-detail?employee_id=${employee_id}&organization_id=${organization_id}`,
          protected: true,
        },
      ];

      const response = await multipleFetchApi(endPointArr);
      const res = response[0];

      if (res?.success) {
        setData(res?.data);
      } else {
        handelNotification(res, 'top-right');
      }

      setIsFetching(false);
    },
    100
  );

  useEffect(() => {
    const employee_id = queryParameter.get('employee-id');

    if (!employee_id && organization_id) {
      const data = {
        message: 'invalid Ids',
        success: false,
      };

      handelNotification(data, 'top-right');
    } else {
      HandelFetchingEmployeeInfoWithDebounce(employee_id, organization_id);
    }
  }, []);
  const UserInformationDataModules = (
    _data: UserProfileInformationInterface,
    _OrgData: OrganizationSettingsInterface
  ): InterFaceModuleData[] => [
    {
      id: 1,
      label: 'employee_general_info',
      module: EmployeeGeneralInfo(_data),
      title: 'Personal Info',
    },
    {
      id: 2,
      label: 'personal_information',
      module: PersonalInformation(_data, _OrgData),
      title: 'Personal Info',
    },
    {
      id: 3,
      label: 'employee_information',
      module: EmployeeInformation(_data, _OrgData),
      title: 'Employee Info',
    },
    {
      id: 4,
      label: 'personal_contact_information',
      module: PersonalContactInformation(_data.personal_contact_info),
      title: 'Personal Contact Information',
    },
    {
      id: 5,
      label: 'family_info',
      module: FamilyInfo(_data.family_info, _OrgData),
      title: 'Family information',
    },
    {
      id: 6,
      label: 'address',
      module: RenderAddressComponent(_data),
      title: 'Address',
    },
  ];

  const BreadcrumbsObjects = (OrgName: string) => {
    const breadcrumbs = [
      {
        name: 'Home',
        label: 'home',
        link: `/orbitrms/dashboard`,
      },
      {
        name: 'Organization Manager',
        label: 'organization_manager',
        link: `/orbitrms/organization-manager`,
      },
      {
        name: OrgName,
        label: 'organization-details',
        link: `/orbitrms/organizations/${organization_id}/organization-details`,
      },
    ];

    if (data?.personal_info?.user_id) {
      breadcrumbs.push({
        name: data.personal_info.full_name,
        label: 'employee-profile',
        link: `/orbitrms/organizations/${organization_id}/employee-profile?employee-id=${data.personal_info.user_id}`,
      });
    }

    return breadcrumbs;
  };

  const optionsButtonArray: NotFoundPagesOptionsButtonArray[] = [
    {
      label: 'back To Employee Listing',
      type: 'link',
      className:
        'text-black flex items-center justify-center gap-2 capitalize px-4 py-2 border border-black/30 rounded-lg hover:text-white hover:bg-black transition-all w-fit',
      link: `/orbitrms/organizations/${organization_id}/employees`,
      icon: <GoArrowLeft className='text-xl' />,
    },
  ];

  return (
    <>
      <Breadcrumbs
        BreadcrumbsNavigationFlow={BreadcrumbsObjects(
          OrgData?.general_info?.organization_name
        )}
      />
      <div className='w-full h-full max-h-[calc(100vh-60px)] overflow-auto px-4 hide-scrollbar pt-14'>
        <div className='w-full h-full flex flex-col gap-6'>
          {isFetching ? (
            <EmployeeProfileSkeletonLoader />
          ) : (
            <>
              {data ? (
                <>
                  {UserInformationDataModules(data, OrgData)?.map((section) => (
                    <div className='w-full' key={section?.id}>
                      {section?.module}
                    </div>
                  ))}
                </>
              ) : (
                <NotFound
                  title='Employee Not Found'
                  message='We could not find any employee associated with the ID you provided. This might be due to an incorrect or outdated ID. Please double-check the ID and try again. If the issue persists, contact the system administrator or HR department for assistance.'
                  optionsButton={optionsButtonArray}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default OrgEmployeeProfile;
