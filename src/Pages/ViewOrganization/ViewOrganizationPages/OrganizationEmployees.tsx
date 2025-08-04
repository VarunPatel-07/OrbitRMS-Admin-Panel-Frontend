import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaPowerOff } from 'react-icons/fa';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { IoCloseCircleOutline, IoEye } from 'react-icons/io5';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

import Table from '../../../common/Table/Table';
import TableFilterSearchBar from '../../../common/Table/TableFilterSearchBar';
import TableNoDataFound from '../../../common/Table/TableNoDataFound';
import TablePagination from '../../../common/Table/TablePagination';
import EmployeeProfilePicture from '../../../Components/EmployeeProfilePicture';
import TableSkeletonLoader from '../../../Components/Loader/Table/TableSkeletonLoader';
import OrgAlertModal from '../../../Components/Modal/OrgAlertModal';
import { dropdownMenuArray, initialMetadata } from '../../../Constant/Constant';
import { OrganizationManagerAlertModalInitialObj } from '../../../Constant/OrganizationManagerConstant';
import { FilterFieldsTypeEnums } from '../../../enums/enums';
// import {
//   NotificationContext,
//   NotificationContextApiProps,
// } from '../../../Context/Notification/NotificationContextApi';
import {
  multipleFetchApi,
  multiplePutApi,
} from '../../../Helper/api/multipleAPI';
import { BeautifulAccountStatusRenderer } from '../../../Helper/Helper';
import { classNames } from '../../../Helper/HelperFunction';
import { useDebounce } from '../../../Hooks/useDebounce';
import { OrganizationManagerAlertModalInfoType } from '../../../interface/CommonComponentProps';
import { Column } from '../../../interface/interface';
import {
  EmployeeEmployeeInfo,
  EmployeeFieldInterface,
  EmployeePersonalInfo,
  EmployeeStatusInterface,
} from '../../../interface/OrganizationManager';
import {
  endpointObject,
  FilterObjectInterface,
  MetaDataInterface,
  UrlEncodedFilterQueryInterface,
} from '../../../interface/propsInterface';
import { OrganizationEmployeeAlertModalHelper } from '../OrganizationsHelper/OrganizationEmployeeAlertModalHelper';
import { EmployeeListingFiltersArray } from './EmployeeListingFiltersArray';

function OrganizationEmployees() {
  const { id: organization_id } = useParams();

  const [queryParameter] = useSearchParams();

  const navigate = useNavigate();

  //   const { handelNotification } = useContext(
  //     NotificationContext
  //   ) as NotificationContextApiProps;

  const useEffectRef = useRef(false);

  const [urlDecodedFilterQuery, setUrlDecodedFilterQuery] = useState<
    UrlEncodedFilterQueryInterface[]
  >([]);
  const [isInitialFetching, setIsInitialFetching] = useState<boolean>(true);
  const [isFetchingData, setIsFetchingData] = useState<boolean>(false);
  const [data, setData] = useState<EmployeeFieldInterface[]>([]);
  const [metaData, setMetaData] = useState<MetaDataInterface>(initialMetadata);
  const [recordsPerPage, setRecordsPerPage] = useState<string | number>(10);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [employeeStatusLoader, setEmployeeStatusLoader] =
    useState<boolean>(false);
  const [deactivateOrganizationModal, setDeactivateOrganizationModal] =
    useState<boolean>(false);
  const [alertModalInfo, setAlertModalInfo] =
    useState<OrganizationManagerAlertModalInfoType>(
      OrganizationManagerAlertModalInitialObj
    );

  const handelClickOnOrgPowerOff = (data: EmployeeFieldInterface) => {
    setDeactivateOrganizationModal(!deactivateOrganizationModal);
    const obj = OrganizationEmployeeAlertModalHelper(
      data?.account_status,
      data?.personal_info?.user_id
    );
    setAlertModalInfo(obj);
  };

  //
  // ? This Are The Column Which Is Used To render The Data Dynamically From The Backend
  //
  const columns: Array<Column> = [
    {
      key: 'personal_info',
      childKey: 'employee_info',
      title: 'Employee Name',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (
        data: EmployeePersonalInfo,
        childKeyData: EmployeeEmployeeInfo
      ) => (
        <div className='w-fit'>
          <div className='flex items-center justify-start gap-2.5'>
            <EmployeeProfilePicture
              width={50}
              height={50}
              profilePicture={data?.profile_picture}
            />
            <div className='flex items-start flex-col justify-start gap-0.5'>
              <span className='flex items-center justify-start gap-1'>
                <span className='font-inter text-sm font-medium text-nowrap text-black'>
                  {data?.full_name ||
                    data?.first_name +
                      ' ' +
                      data?.middle_name +
                      ' ' +
                      data?.last_name}
                </span>
                <span className='font-inter text-sm font-medium text-nowrap text-black'>
                  ({childKeyData?.employee_code})
                </span>
              </span>
              <span className='font-inter text-xs font-normal text-nowrap text-black/65'>
                {childKeyData?.designation}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'employee_info',
      title: 'Status',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: EmployeeEmployeeInfo) => (
        <div className='w-fit'>
          <span className='font-inter text-sm font-medium text-nowrap text-black'>
            {BeautifulAccountStatusRenderer(
              data?.status as EmployeeStatusInterface
            )}
          </span>
        </div>
      ),
    },
    {
      key: 'account_status',
      title: 'Account Status',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: boolean) => (
        <div className='w-fit'>
          {data ? (
            <span className='flex items-center justify-start gap-1.5'>
              <FaRegCircleCheck className='text-green-600 w-5 h-5' />
              <span className='font-inter font-medium text-sm'>Active</span>
            </span>
          ) : (
            <span className='flex items-center justify-start gap-1.5'>
              <IoCloseCircleOutline className='text-red-600 w-5 h-5' />
              <span className='font-inter font-medium text-sm'>InActive</span>
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'employee_info',
      title: 'Department',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: EmployeeEmployeeInfo) => (
        <div className='w-fit'>
          <span className='font-inter text-sm font-medium text-nowrap text-black'>
            {data?.department}
          </span>
        </div>
      ),
    },
    {
      key: 'employee_info',
      title: 'Employee Type',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: EmployeeEmployeeInfo) => (
        <div className='w-fit'>
          <span className='font-inter text-sm font-medium text-nowrap text-black'>
            {data?.employee_type}
          </span>
        </div>
      ),
    },
    {
      key: 'employee_info',
      title: 'Employee Role',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: EmployeeEmployeeInfo) => (
        <div className='w-fit'>
          <span className='font-inter text-sm font-medium text-nowrap px-4 py-1.5 border bg-[#EEF4FF] border-[#C7D7FE] text-[#3538CD] rounded-full'>
            {data?.employee_role?.role_name}
          </span>
        </div>
      ),
    },
    {
      key: 'employee_info',
      title: 'Reporting To',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: EmployeeEmployeeInfo) => (
        <div className='w-fit'>
          <div className='flex items-center justify-start gap-2.5'>
            <EmployeeProfilePicture
              width={35}
              height={35}
              profilePicture={data?.reporting_manager?.profile_picture}
            />
            <div className='w-fit'>
              <div className='flex items-center justify-start gap-1 text-black hover:text-[#3538CD]'>
                <span className='font-inter text-sm font-medium text-nowrap'>
                  {data?.reporting_manager?.full_name ||
                    data?.reporting_manager?.first_name +
                      ' ' +
                      data?.reporting_manager?.middle_name +
                      ' ' +
                      data?.reporting_manager?.last_name}
                </span>
                <span className='font-inter text-sm font-medium text-nowrap'>
                  ({data?.reporting_manager?.employee_code})
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'action',
      title: 'Action',
      isSortable: false,
      isSticky: true,
      canToggleVisibility: true,
      renderContent: (data: EmployeeFieldInterface) => {
        return (
          <div className='w-full h-full flex items-center justify-start gap-2'>
            <button
              className={classNames(
                'text-black/80 p-1.5 disabled:opacity-50 disabled:cursor-not-allowed',
                {
                  'text-green-700': !data?.account_status,
                  'text-rose-600': data?.account_status,
                }
              )}
              data-tooltip-id='organization_power_off_button'
              data-tooltip-content={
                data?.account_status
                  ? 'Deactivate Organization'
                  : 'Activate Organization'
              }
              onClick={() => handelClickOnOrgPowerOff(data)}
            >
              <FaPowerOff className='text-xl' />
            </button>
            <button
              className='text-black/80 p-1.5 disabled:opacity-50 disabled:cursor-not-allowed'
              data-tooltip-id='project_status_view_profile_button'
              data-tooltip-content='View Profile'
              onClick={() => {
                navigate(
                  `/orbitrms/organizations/${organization_id}/employee-profile?employee-id=${data?.personal_info?.user_id}`
                );
              }}
            >
              <IoEye className='text-[22px]' />
            </button>
            <Tooltip
              id='project_status_edit_button'
              opacity={'100'}
              className='z-[15] bg-white'
              place='left'
            />

            <Tooltip
              id='project_status_view_profile_button'
              opacity={'100'}
              className='z-[15] bg-white'
              place='left'
            />
          </div>
        );
      },
    },
  ];

  const fetchOrganizationEmployeeWithDebounce = useDebounce(
    async (
      id: string,
      queryString: string,
      page: number = 1,
      limit: number = 10
    ) => {
      const endPointArr: endpointObject[] = [
        {
          endPoint:
            queryString == undefined || queryString?.trim() == ''
              ? `organization/employees/fetch-all?id=${id}&page=${page}&limit=${limit}`
              : `organization/employees/fetch-all?id=${id}&page=${page}&limit=${limit}&${queryString}`,
          protected: true,
        },
      ];

      const response = await multipleFetchApi(endPointArr);
      const res = response[0];
      if (res?.success) {
        setData(res?.data);
        setMetaData(res?.metadata);
        setSelectedPage(res?.metadata?.current_page);
        setRecordsPerPage(res?.metadata?.record_per_page);
      }
      setIsInitialFetching(false);
      setIsFetchingData(false);
    },
    100
  );

  const handelApplyFilterEmployeeListing = async (
    filterArray: FilterObjectInterface[]
  ) => {
    setIsFetchingData(true);
    let queryString = '';
    if (filterArray?.length > 0) {
      const queryFilterArray = filterArray?.map((queryObj) => {
        const obj: UrlEncodedFilterQueryInterface = {
          field_name: '',
          operator: '',
          value: '',
        };
        queryObj?.moduleValue?.forEach((moduleValue) => {
          if (moduleValue?.type === FilterFieldsTypeEnums[0]) {
            obj.field_name = moduleValue?.label;
          }
          if (moduleValue?.type === FilterFieldsTypeEnums[1]) {
            obj.operator = moduleValue?.label;
          }
          if (moduleValue?.type === FilterFieldsTypeEnums[2]) {
            if (queryObj?.optionType == 'multi-select') {
              const MultiSelectArr: string[] = [];
              queryObj?.moduleValue
                ?.filter((tem) => tem.type === FilterFieldsTypeEnums[2])
                ?.map((data) => MultiSelectArr.push(data?.value));

              obj.value = JSON.stringify(MultiSelectArr);
            } else {
              obj.value = moduleValue?.value;
            }
          }
        });

        return obj;
      });

      queryString = `filter=${encodeURIComponent(JSON.stringify(queryFilterArray))}`;
    }

    // First update the state and fetch data
    await fetchOrganizationEmployeeWithDebounce(organization_id, queryString);

    // Then navigate after the state updates are complete
    setTimeout(() => {
      navigate(
        `/orbitrms/organizations/fb2c027f-f8fa-4dfa-8632-41b50bd10dd5/employees?${queryString}`
      );
    }, 0);
  };

  const handelClickOnRecordPerPage = (value: string | number) => {
    setRecordsPerPage(value);
    const filterQuery = queryParameter.get('filter');
    let queryString = '';
    if (filterQuery) {
      const decodeQuery = decodeURIComponent(filterQuery);
      const parsedFilter = JSON.parse(decodeQuery);
      queryString = `filter=${encodeURIComponent(JSON.stringify(parsedFilter))}`;
    }
    setIsFetchingData(true);
    fetchOrganizationEmployeeWithDebounce(
      organization_id,
      queryString,
      1,
      value
    );
  };

  const handelClickOnPaginationButtons = (value: number) => {
    setSelectedPage(value);

    const filterQuery = queryParameter.get('filter');
    let queryString = '';
    if (filterQuery) {
      const decodeQuery = decodeURIComponent(filterQuery);
      const parsedFilter = JSON.parse(decodeQuery);
      queryString = `filter=${encodeURIComponent(JSON.stringify(parsedFilter))}`;
    }
    setIsFetchingData(true);
    fetchOrganizationEmployeeWithDebounce(
      organization_id,
      queryString,
      value,
      recordsPerPage
    );
  };

  const handelClickOnDisableEmployeeWithDebounce = useDebounce(
    async (
      queryString: string,
      employee_id: string,
      organization_id: string
    ) => {
      const endPointArr: endpointObject[] = [
        {
          endPoint: `organization/employees/disable-employee?employee_id=${employee_id}&organization_id=${organization_id}`,
          protected: true,
        },
      ];
      const response = await multiplePutApi(endPointArr);
      const res = response[0];
      if (!res.success) {
        setIsFetchingData(true);
        setAlertModalInfo(OrganizationManagerAlertModalInitialObj);
        setDeactivateOrganizationModal(false);
        fetchOrganizationEmployeeWithDebounce(organization_id, queryString);
      }
      setEmployeeStatusLoader(false);
    },
    100
  );
  const handelClickOnDisableEmployee = (id: string) => {
    const filterQuery = queryParameter.get('filter');
    let queryString = '';
    if (filterQuery) {
      const decodeQuery = decodeURIComponent(filterQuery);
      const parsedFilter = JSON.parse(decodeQuery);
      queryString = `filter=${encodeURIComponent(JSON.stringify(parsedFilter))}`;
    }
    setEmployeeStatusLoader(true);
    if (organization_id) {
      handelClickOnDisableEmployeeWithDebounce(
        queryString,
        id,
        organization_id
      );
      return;
    }
  };

  useEffect(() => {
    if (useEffectRef.current) return;
    useEffectRef.current = true;
    setIsInitialFetching(true);

    const filterQuery = queryParameter.get('filter');
    let queryString = '';

    if (filterQuery) {
      const decodeQuery = decodeURIComponent(filterQuery);
      const parsedFilter = JSON.parse(decodeQuery);

      setUrlDecodedFilterQuery(parsedFilter);
      queryString = `filter=${encodeURIComponent(JSON.stringify(parsedFilter))}`;
    }

    fetchOrganizationEmployeeWithDebounce(organization_id, queryString);
  }, [fetchOrganizationEmployeeWithDebounce, queryParameter]);

  return (
    <>
      <div className='w-full h-full px-4 2xl:px-5 pb-4 2xl:pb-5 pt-28'>
        {isInitialFetching ? (
          <div className='w-full h-full overflow-hidden'>
            <TableSkeletonLoader
              tableHeaderCount={5}
              tableValueCount={13}
              maxHeight='calc(-315px + 100vh)'
              showHeaderLoader={false}
            />
          </div>
        ) : (
          <>
            <TableFilterSearchBar
              filterColumnsArray={EmployeeListingFiltersArray}
              handelApplyFilterFunc={handelApplyFilterEmployeeListing}
              urlDecodedFilterQuery={urlDecodedFilterQuery}
              classNames='rounded-t-lg'
            />
            {isFetchingData ? (
              <TableSkeletonLoader
                tableHeaderCount={5}
                tableValueCount={13}
                maxHeight='calc(-315px + 100vh)'
                showFilterLoader={false}
                showHeaderLoader={false}
              />
            ) : (
              <>
                {data?.length > 0 ? (
                  <>
                    <Table
                      columns={columns}
                      data={data}
                      tableWrapperClass={
                        'overflow-auto max-h-[calc(100vh-305px)] h-full bg-white'
                      }
                      stickyHeaderClass='sticky top-0'
                    />
                    <TablePagination
                      paginationDropDownArray={dropdownMenuArray}
                      recordsPerPage={recordsPerPage}
                      handelClickOnDroDownVal={handelClickOnRecordPerPage}
                      clickOnPaginationVal={handelClickOnPaginationButtons}
                      selectedPage={selectedPage}
                      totalPage={metaData?.total_pages}
                    />
                  </>
                ) : (
                  <TableNoDataFound
                    tableWrapperClass={
                      'max-h-[calc(100%-50px)] h-full rounded-b-lg'
                    }
                    notFoundTitle={'No Employees Found'}
                    notFoundMessage={
                      'No matching employee found. Try refining your search or add a new employee.'
                    }
                    notFoundOptionsButtonsArray={[]}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>

      {createPortal(
        <OrgAlertModal
          ModalInfo={alertModalInfo}
          showAlertModal={deactivateOrganizationModal}
          setShowAlertModal={setDeactivateOrganizationModal}
          loading={employeeStatusLoader}
          setLoading={setEmployeeStatusLoader}
          handelOnClickButton={handelClickOnDisableEmployee}
        />,
        document.body
      )}
    </>
  );
}

export default OrganizationEmployees;
