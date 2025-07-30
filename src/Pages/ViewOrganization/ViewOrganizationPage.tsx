import { useContext, useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import Breadcrumbs from '../../common/Breadcrumbs';
import {
  OrganizationInfoInitialData,
  ViewOrganizationHeaderButtons,
} from '../../Constant/OrganizationManagerConstant';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../Context/Notification/NotificationContextApi';
import { multipleFetchApi } from '../../Helper/api/multipleAPI';
import { classNames } from '../../Helper/HelperFunction';
import ProtectedRoute from '../../Helper/ProtectedRoute';
import { useDebounce } from '../../Hooks/useDebounce';
import {
  OrganizationSettingsInterface,
  ViewOrganizationHeaderButtonsInterface,
} from '../../interface/OrganizationManager';
import { endpointObject } from '../../interface/propsInterface';
import OrganizationSidebar from './OrganizationsHelper/OrganizationSidebar';
import OrganizationDetails from './ViewOrganizationPages/OrganizationDetails';
import OrganizationEmployees from './ViewOrganizationPages/OrganizationEmployees';
import OrgEmployeeProfile from './ViewOrganizationPages/OrgEmployeeProfile/OrgEmployeeProfile';

function ViewOrganizationPage() {
  const { id: organization_id } = useParams();
  const navigate = useNavigate();

  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const navigation = useLocation();

  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [data, setData] = useState<OrganizationSettingsInterface>(
    OrganizationInfoInitialData
  );

  const BreadcrumbsObjects = (OrgName: string) => [
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
      label: 'employee-profile',
      link: `/orbitrms/organizations/${organization_id}`,
    },
  ];

  const OrganizationHeaderButtonArray = useMemo(() => {
    let buttonArray: ViewOrganizationHeaderButtonsInterface[] = [];
    if (organization_id?.trim() !== '' && organization_id) {
      buttonArray = ViewOrganizationHeaderButtons(organization_id);
    }

    return buttonArray;
  }, [ViewOrganizationHeaderButtons]);

  const fetchOrganizationWithDebounce = useDebounce(async (id: string) => {
    const endPointArr: endpointObject[] = [
      {
        endPoint: `organization-manager/client-organization/details?id=${id}`,
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
  }, 100);

  useEffect(() => {
    if (organization_id?.trim() == '') {
      const data = {
        message: 'Organization Id Not Found',
        success: false,
      };
      handelNotification(data, 'top-right');
      navigate('/orbitrms/organization-manager');
    } else {
      fetchOrganizationWithDebounce(organization_id);
    }
  }, []);

  const basePath = `/orbitrms/organizations/${organization_id}/`;
  const wildcardPath = navigation.pathname.replace(basePath, '');

  return (
    <div className='w-full h-full'>
      <div className='w-full h-full flex items-stretch justify-start'>
        <div className='w-[30%] max-w-[350px] bg-white border-r border-r-black/20 overflow-auto h-[calc(100vh-57px)] hide-scrollbar'>
          <OrganizationSidebar loading={isFetching} data={data} />
        </div>
        <div className='w-[70%] flex-grow overflow-hidden'>
          <div className='w-full h-full relative'>
            <Breadcrumbs
              BreadcrumbsNavigationFlow={BreadcrumbsObjects(
                data?.general_info?.organization_name
              )}
            />
            {wildcardPath !== 'employee-profile' && (
              <div className='w-full absolute top-[37px]'>
                <div className='w-full bg-white px-3 py-2.5 border-b border-black/20'>
                  <div className='flex items-stretch justify-between gap-4'>
                    <div className='flex items-center justify-start flex-grow gap-4'>
                      {isFetching ? (
                        <>
                          {Array?.from({ length: 3 }).map((_, index) => (
                            <Skeleton
                              height={35}
                              width={140}
                              borderRadius={6}
                              key={index}
                            />
                          ))}
                        </>
                      ) : (
                        <>
                          {OrganizationHeaderButtonArray?.map((item, index) => (
                            <Link
                              to={item?.link}
                              key={index}
                              className={classNames(`${item?.classNames}`, {
                                'bg-[#EEF4FF] border border-[#C7D7FE] !text-[#3538CD]':
                                  navigation.pathname?.startsWith(item?.link),
                              })}
                            >
                              {item?.title}
                            </Link>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className='pt-12 h-full'>
              <Routes>
                {['/', '/organization-details'].map((eachPath, index) => (
                  <Route
                    path={eachPath}
                    key={index}
                    element={
                      <ProtectedRoute
                        element={
                          <OrganizationDetails
                            data={data}
                            loading={isFetching}
                          />
                        }
                      />
                    }
                  />
                ))}
                <Route
                  path={'/employees'}
                  element={
                    <ProtectedRoute element={<OrganizationEmployees />} />
                  }
                />

                <Route
                  path={'/employee-profile'}
                  element={<ProtectedRoute element={<OrgEmployeeProfile OrgData={data} />} />}
                />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewOrganizationPage;
