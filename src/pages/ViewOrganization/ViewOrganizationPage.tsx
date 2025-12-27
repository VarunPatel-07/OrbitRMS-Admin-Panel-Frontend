import { useContext, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { GoArrowLeft } from 'react-icons/go';
import Skeleton from 'react-loading-skeleton';
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import Breadcrumbs from '../../components/common/Breadcrumbs';
import NotFound from '../../components/common/NotFound';
import OrgAlertModal from '../../components/modal/OrgAlertModal';
import {
  OrganizationInfoInitialData,
  OrganizationManagerAlertModalInitialObj,
  ViewOrganizationHeaderButtons,
} from '../../constant/OrganizationManagerConstant';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../context/notification/NotificationContextApi';
import { useDebounce } from '../../hooks/useDebounce';
import {
  NotFoundPagesOptionsButtonArray,
  OrganizationManagerAlertModalInfoType,
} from '../../interface/CommonComponentProps';
import {
  OrganizationSettingsInterface,
  ViewOrganizationHeaderButtonsInterface,
} from '../../interface/OrganizationManager';
import { endpointObject } from '../../interface/propsInterface';
import { multipleFetchApi, multiplePutApi } from '../../utils/api/multipleAPI';
import HelmetSeo from '../../utils/helper/HelmetSeo';
import { classNames } from '../../utils/helper/HelperFunction';
import ProtectedRoute from '../../utils/helper/ProtectedRoute';
import { OrganizationAlertModalHelperFunction } from '../OrganizationManager/OrganizationAlertModalHelper';
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
  const [data, setData] = useState<OrganizationSettingsInterface | null>(
    OrganizationInfoInitialData
  );
  const [organizationStatusLoader, setOrganizationStatusLoader] =
    useState<boolean>(false);
  const [alertModalInfo, setAlertModalInfo] =
    useState<OrganizationManagerAlertModalInfoType>(
      OrganizationManagerAlertModalInitialObj
    );
  const [deactivateOrganizationModal, setDeactivateOrganizationModal] =
    useState<boolean>(false);

  const handelClickOnOrgPowerOff = (data: OrganizationSettingsInterface) => {
    setDeactivateOrganizationModal(!deactivateOrganizationModal);
    const obj = OrganizationAlertModalHelperFunction(data?.status, data?.id);

    setAlertModalInfo(obj);
  };

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
      setData(null);
      handelNotification(res, 'top-right');
    }
    setIsFetching(false);
  }, 100);

  const handelOrgStatusWithDebounce = useDebounce(async (id: string) => {
    const endPointArr: endpointObject[] = [
      {
        endPoint: `organization-manager/organization-setting/status?id=${id}`,
        protected: true,
      },
    ];
    const response = await multiplePutApi(endPointArr);
    const res = response[0];

    if (res?.success) {
      setIsFetching(true);
      setAlertModalInfo(OrganizationManagerAlertModalInitialObj);
      setDeactivateOrganizationModal(false);
      fetchOrganizationWithDebounce(id);
    }
    setOrganizationStatusLoader(false);
  }, 100);

  const handelClickOnOrganizationStatusToggled = (id: string) => {
    setOrganizationStatusLoader(true);
    handelOrgStatusWithDebounce(id);
  };

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

  const optionsButtonArray: NotFoundPagesOptionsButtonArray[] = [
    {
      label: 'back To Organization Listing',
      type: 'link',
      className:
        'text-black flex items-center justify-center gap-2 capitalize px-4 py-2 border border-black/30 rounded-lg hover:text-white hover:bg-black transition-all w-fit',
      link: `/orbitrms/organization-manager`,
      icon: <GoArrowLeft className='text-xl' />,
    },
  ];
  const PageNotFoundOptionsButton: NotFoundPagesOptionsButtonArray[] = [
    {
      label: 'back To Home Page',
      type: 'link',
      className:
        'text-black flex items-center justify-center gap-2 capitalize px-4 py-2 border border-black/30 rounded-lg hover:text-white hover:bg-black transition-all w-fit',
      link: `/orbitrms/dashboard`,
      icon: <GoArrowLeft className='text-xl' />,
    },
  ];

  if (data)
    return (
      <>
        <HelmetSeo
          Title={`${data?.general_info?.organization_name || ''} Organization Info | OrbitRMS Admin Panel`}
          Content='Log in to OrbitRMS and start managing everything in one place with ease and efficiency!'
        />
        <div className='w-full h-full'>
          <div className='w-full h-full flex items-stretch justify-start'>
            <div className='w-[30%] max-w-[350px] bg-white border-r border-r-black/20 overflow-auto h-[calc(100vh-57px)] hide-scrollbar'>
              <OrganizationSidebar
                loading={isFetching}
                data={data}
                handelClickOnOrgPowerOff={handelClickOnOrgPowerOff}
              />
            </div>
            <div className='w-[70%] flex-grow overflow-hidden'>
              <div className='w-full h-full relative'>
                {wildcardPath !== 'employee-profile' && (
                  <Breadcrumbs
                    BreadcrumbsNavigationFlow={BreadcrumbsObjects(
                      data?.general_info?.organization_name
                    )}
                  />
                )}

                {wildcardPath !== 'employee-profile' && (
                  <div className='w-full absolute top-[37px] z-10'>
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
                              {OrganizationHeaderButtonArray?.map(
                                (item, index) => (
                                  <Link
                                    to={item?.link}
                                    key={index}
                                    className={classNames(
                                      `${item?.classNames}`,
                                      {
                                        'bg-[#EEF4FF] border border-[#C7D7FE] !text-[#3538CD]':
                                          navigation.pathname?.startsWith(
                                            item?.link
                                          ),
                                      }
                                    )}
                                  >
                                    {item?.title}
                                  </Link>
                                )
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className='h-full'>
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
                      element={
                        <ProtectedRoute
                          element={<OrgEmployeeProfile OrgData={data} />}
                        />
                      }
                    />
                    <Route
                      path={'*'}
                      element={
                        <NotFound
                          title='Page Not Found'
                          message=''
                          optionsButton={PageNotFoundOptionsButton}
                        />
                      }
                    />
                  </Routes>
                </div>
              </div>
            </div>
          </div>
        </div>
        {createPortal(
          <OrgAlertModal
            ModalInfo={alertModalInfo}
            showAlertModal={deactivateOrganizationModal}
            setShowAlertModal={setDeactivateOrganizationModal}
            loading={organizationStatusLoader}
            setLoading={setOrganizationStatusLoader}
            handelOnClickButton={handelClickOnOrganizationStatusToggled}
          />,
          document.body
        )}
      </>
    );
  else {
    return (
      <NotFound
        title='Organization Not Found'
        message='We could not find any organization associated with the ID you provided. This might be due to an incorrect or outdated ID. Please double-check the ID and try again. If the issue persists, contact the system administrator or support team for assistance.'
        optionsButton={optionsButtonArray}
      />
    );
  }
}

export default ViewOrganizationPage;
