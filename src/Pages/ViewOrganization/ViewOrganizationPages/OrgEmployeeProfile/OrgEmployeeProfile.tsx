import { useContext, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import EmployeeProfileSkeletonLoader from '../../../../Components/Loader/EmployeeProfileSkeletonLoader';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../../../Context/Notification/NotificationContextApi';
import { multipleFetchApi } from '../../../../Helper/api/multipleAPI';
import { useDebounce } from '../../../../Hooks/useDebounce';
import { InterFaceModuleData } from '../../../../interface/interface';
import { OrganizationEmployeeProfileInterface } from '../../../../interface/OrganizationManager';
import { UserProfileInformationInterface } from '../../../../interface/OrgEmployeeInterface';
import { endpointObject } from '../../../../interface/propsInterface';
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
  const UserInformationDataModules: InterFaceModuleData[] = [
    {
      id: 1,
      label: 'employee_general_info',
      module: EmployeeGeneralInfo(data),
      title: 'Personal Info',
    },
    {
      id: 2,
      label: 'personal_information',
      module: PersonalInformation(data, OrgData),
      title: 'Personal Info',
    },
    {
      id: 3,
      label: 'employee_information',
      module: EmployeeInformation(data, OrgData),
      title: 'Employee Info',
    },
    {
      id: 4,
      label: 'personal_contact_information',
      module: PersonalContactInformation(data.personal_contact_info),
      title: 'Personal Contact Information',
    },
    {
      id: 5,
      label: 'family_info',
      module: FamilyInfo(data.family_info, OrgData),
      title: 'Family information',
    },
    {
      id: 6,
      label: 'address',
      module: RenderAddressComponent(data),
      title: 'Address',
    },
  ];
  return (
    <div className='w-full h-full max-h-[calc(100vh-120px)] overflow-auto px-4 hide-scrollbar pt-3'>
      <div className='w-full flex flex-col gap-6'>
        {isFetching ? (
          <EmployeeProfileSkeletonLoader />
        ) : (
          <>
            {UserInformationDataModules?.map((section) => (
              <div className='w-full' key={section?.id}>
                {section?.module}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default OrgEmployeeProfile;
