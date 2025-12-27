import { useEffect, useRef, useState } from 'react';
import { FaPowerOff } from 'react-icons/fa';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { IoCloseCircleOutline, IoEye } from 'react-icons/io5';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

import Breadcrumbs from '../../common/Breadcrumbs';
import Table from '../../common/Table/Table';
import TableFilterSearchBar from '../../common/Table/TableFilterSearchBar';
import TableInfoHeader from '../../common/Table/TableInfoHeader';
import TableNoDataFound from '../../common/Table/TableNoDataFound';
import TablePagination from '../../common/Table/TablePagination';
import EmployeeProfilePicture from '../../Components/EmployeeProfilePicture';
import TableSkeletonLoader from '../../Components/Loader/Table/TableSkeletonLoader';
import OrgAlertModal from '../../Components/Modal/OrgAlertModal';
import { dropdownMenuArray, initialMetadata } from '../../Constant/Constant';
import {
  OrganizationManagerAlertModalInitialObj,
  OrgManagerBreadcrumbsObjects,
} from '../../Constant/OrganizationManagerConstant';
import { FilterFieldsTypeEnums } from '../../enums/enums';
import { multipleFetchApi, multiplePutApi } from '../../Helper/api/multipleAPI';
import HelmetSeo from '../../Helper/HelmetSeo';
import { classNames, formateDate } from '../../Helper/HelperFunction';
import { useDebounce } from '../../Hooks/useDebounce';
import { OrganizationManagerAlertModalInfoType } from '../../interface/CommonComponentProps';
import { Column } from '../../interface/interface';
import {
  CountryInfo,
  OrganizationAddress,
  OrganizationDetails,
} from '../../interface/OrganizationManager';
import {
  endpointObject,
  FilterObjectInterface,
  MetaDataInterface,
  UrlEncodedFilterQueryInterface,
} from '../../interface/propsInterface';
import { OrganizationAlertModalHelperFunction } from './OrganizationAlertModalHelper';
import { OrganizationManagerFiltersArray } from './OrganizationManagerFiltersArray';

function OrganizationManager() {
  const useEffectRef = useRef(false);
  const navigate = useNavigate();

  const [queryParameter] = useSearchParams();

  const [data, setData] = useState<OrganizationDetails[]>([]);
  const [isInitialFetching, setIsInitialFetching] = useState<boolean>(true);
  const [isFetchingData, setIsFetchingData] = useState<boolean>(false);
  const [urlDecodedFilterQuery, setUrlDecodedFilterQuery] = useState<
    UrlEncodedFilterQueryInterface[]
  >([]);
  const [metaData, setMetaData] = useState<MetaDataInterface>(initialMetadata);
  const [recordsPerPage, setRecordsPerPage] = useState<string | number>(10);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [organizationStatusLoader, setOrganizationStatusLoader] =
    useState<boolean>(false);
  const [deactivateOrganizationModal, setDeactivateOrganizationModal] =
    useState<boolean>(false);
  const [alertModalInfo, setAlertModalInfo] =
    useState<OrganizationManagerAlertModalInfoType>(
      OrganizationManagerAlertModalInitialObj
    );

  const handelClickOnOrgPowerOff = (data: OrganizationDetails) => {
    setDeactivateOrganizationModal(!deactivateOrganizationModal);
    const obj = OrganizationAlertModalHelperFunction(data?.status, data?.id);

    setAlertModalInfo(obj);
  };

  const columns: Array<Column> = [
    {
      key: 'organization_name',
      title: 'Organization Name',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      childKey: 'organization_image',
      renderContent: (data: string, childData: string) => (
        <div className='w-fit min-w-[200px]'>
          <div className='w-fit flex items-center justify-start gap-2.5'>
            <EmployeeProfilePicture
              profilePicture={childData}
              height={40}
              width={40}
            />
            <p className='font-inter text-black font-semibold text-base'>
              {data || '-'}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
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
      key: 'primary_email',
      title: 'Primary Email',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: string) => (
        <div className='w-fit'>
          <a
            href={`mailto:${data}`}
            className='font-inter text-black font-medium transition-all text-base hover:underline hover:text-blue-600'
          >
            {data || '-'}
          </a>
        </div>
      ),
    },
    {
      key: 'primary_number',
      title: 'Primary Number',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      childKey: 'country_info',
      renderContent: (data: string, childData: CountryInfo) => (
        <div className='w-fit'>
          <a
            href={`tel:${childData?.country_number_code}-${data}`}
            className='font-inter text-black font-medium transition-all text-base hover:underline hover:text-blue-600'
          >
            {childData?.country_number_code} {'  - '} {'  '}
            {data || '-'}
          </a>
        </div>
      ),
    },
    {
      key: 'organization_address',
      title: 'Country',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,

      renderContent: (data: OrganizationAddress) => (
        <div className='w-fit'>
          <p className='font-inter text-black font-medium text-base'>
            {data?.country || '-'}
          </p>
        </div>
      ),
    },
    {
      key: 'email_domain_slug',
      title: 'Email Domain',
      isSortable: false,
      isSticky: false,
      canToggleVisibility: true,

      renderContent: (data: string) => (
        <div className='w-fit'>
          <p className='font-inter text-black font-medium text-base'>
            {data || '-'}
          </p>
        </div>
      ),
    },
    {
      key: 'is_meta_verified',
      title: 'Meta Verified',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,

      renderContent: (data: boolean) => (
        <div className='w-fit'>
          {data ? (
            <span className='text-green-700 bg-green-100 border border-green-500 rounded px-3 py-1 text-xs font-inter flex'>
              Verified
            </span>
          ) : (
            <span className='text-yellow-700 bg-yellow-100 border border-yellow-500 rounded px-3 py-1 text-xs font-inter flex'>
              Verification Required
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'email_verified',
      title: 'Email Verified',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,

      renderContent: (data: boolean) => (
        <div className='w-fit'>
          {data ? (
            <span className='text-green-700 bg-green-100 border border-green-500 rounded px-3 py-1 text-xs font-inter flex'>
              Verified
            </span>
          ) : (
            <span className='text-yellow-700 bg-yellow-100 border border-yellow-500 rounded px-3 py-1 text-xs font-inter flex'>
              Verification Required
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'employee_code_prefix',
      title: 'Employee Code',
      isSortable: false,
      isSticky: false,
      canToggleVisibility: true,

      renderContent: (data: string) => (
        <div className='w-fit'>
          <p className='font-inter text-black font-medium text-base text-black/85'>
            {data || '-'}
          </p>
        </div>
      ),
    },
    {
      key: 'intern_code_prefix',
      title: 'Intern Code',
      isSortable: false,
      isSticky: false,
      canToggleVisibility: true,

      renderContent: (data: string) => (
        <div className='w-fit'>
          <p className='font-inter text-black font-medium text-base text-black/85'>
            {data}
          </p>
        </div>
      ),
    },
    {
      key: 'created_at',
      title: 'Created On',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,

      renderContent: (data: string) => (
        <div className='w-fit'>
          <span className='w-full font-inter text-base capitalize font-medium inline-block text-black/85'>
            {formateDate(data, 'DD-MMM-Y', false)}
          </span>
        </div>
      ),
    },
    {
      key: 'action',
      title: 'Action',
      isSortable: false,
      isSticky: true,
      canToggleVisibility: true,
      renderContent: (data: OrganizationDetails) => {
        return (
          <div className='w-full h-full flex items-center justify-start gap-2'>
            <button
              className={classNames(
                'text-black/80 p-1.5 disabled:opacity-50 disabled:cursor-not-allowed',
                {
                  'text-green-700': !data?.status,
                  'text-rose-600': data?.status,
                }
              )}
              data-tooltip-id='organization_power_off_button'
              data-tooltip-content={
                data?.status
                  ? 'Deactivate Organization'
                  : 'Activate Organization'
              }
              onClick={() => handelClickOnOrgPowerOff(data)}
            >
              <FaPowerOff className='text-xl' />
            </button>
            <button
              className='text-black/80 p-1.5 disabled:opacity-50 disabled:cursor-not-allowed'
              data-tooltip-id='organization_view_organization_button'
              data-tooltip-content='View Organization'
              onClick={() => {
                navigate(
                  `/orbitrms/organizations/${data?.id}/organization-details`
                );
              }}
            >
              <IoEye className='text-2xl' />
            </button>
            <Tooltip
              id='organization_power_off_button'
              opacity={'100'}
              className='z-[15] bg-white'
              place='left'
            />

            <Tooltip
              id='organization_view_organization_button'
              opacity={'100'}
              className='z-[15] bg-white'
              place='left'
            />
          </div>
        );
      },
    },
  ];

  const fetchAllTheOrganizationWithDebounce = useDebounce(
    async (queryString: string, page: number = 1, limit: number = 10) => {
      const endPointArr: endpointObject[] = [
        {
          endPoint:
            queryString == undefined || queryString?.trim() == ''
              ? `organization-manager/fetch-organizations?page=${page}&limit=${limit}`
              : `organization-manager/fetch-organizations?page=${page}&limit=${limit}&${queryString}`,
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

  const handelApplyOrganizationListingFilter = async (
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
    await fetchAllTheOrganizationWithDebounce(queryString);

    // Then navigate after the state updates are complete
    setTimeout(() => {
      navigate(`/orbitrms/organization-manager?${queryString}`);
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
    fetchAllTheOrganizationWithDebounce(queryString, 1, value);
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
    fetchAllTheOrganizationWithDebounce(queryString, value, recordsPerPage);
  };

  const handelOrgStatusWithDebounce = useDebounce(
    async (queryString: string, id: string) => {
      const endPointArr: endpointObject[] = [
        {
          endPoint: `organization-manager/organization-setting/status?id=${id}`,
          protected: true,
        },
      ];
      const response = await multiplePutApi(endPointArr);
      const res = response[0];

      if (res?.success) {
        setIsFetchingData(true);
        setAlertModalInfo(OrganizationManagerAlertModalInitialObj);
        setDeactivateOrganizationModal(false);
        fetchAllTheOrganizationWithDebounce(
          queryString,
          selectedPage,
          recordsPerPage
        );
      }
      setOrganizationStatusLoader(false);
    },
    100
  );

  const handelClickOnOrganizationStatusToggled = (id: string) => {
    const filterQuery = queryParameter.get('filter');
    let queryString = '';

    if (filterQuery) {
      const decodeQuery = decodeURIComponent(filterQuery);
      const parsedFilter = JSON.parse(decodeQuery);

      queryString = `filter=${encodeURIComponent(JSON.stringify(parsedFilter))}`;
    }
    setOrganizationStatusLoader(true);
    handelOrgStatusWithDebounce(queryString, id);
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

    fetchAllTheOrganizationWithDebounce(queryString);
  }, [fetchAllTheOrganizationWithDebounce, queryParameter]);

  return (
    <>
      <HelmetSeo
        Title='Organization Manager | OrbitRMS Admin Panel'
        Content='Log in to OrbitRMS and start managing everything in one place with ease and efficiency!'
      />
      <div className='w-full h-full relative'>
        <Breadcrumbs BreadcrumbsNavigationFlow={OrgManagerBreadcrumbsObjects} />
        <div className='w-full h-full pt-9'>
          <div className='w-full h-full p-4 2xl:p-5'>
            {isInitialFetching ? (
              <div className='w-full h-full overflow-hidden'>
                <TableSkeletonLoader
                  tableHeaderCount={5}
                  tableValueCount={13}
                  maxHeight='calc(-350px + 100vh)'
                />
              </div>
            ) : (
              <>
                <TableInfoHeader
                  moduleName='Organizations'
                  badgeValue={
                    data?.length > 0
                      ? `${(selectedPage - 1) * Number(recordsPerPage) + 1} - ${data?.length * selectedPage} of  ${metaData?.total_data}  Organizations`
                      : `0 Organization`
                  }
                  buttonsArray={[]}
                  loading={isFetchingData}
                />
                <TableFilterSearchBar
                  filterColumnsArray={OrganizationManagerFiltersArray}
                  handelApplyFilterFunc={handelApplyOrganizationListingFilter}
                  urlDecodedFilterQuery={urlDecodedFilterQuery}
                />
                {isFetchingData ? (
                  <TableSkeletonLoader
                    tableHeaderCount={5}
                    tableValueCount={13}
                    maxHeight='calc(-350px + 100vh)'
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
                            'overflow-auto max-h-[calc(100vh-330px)] h-full bg-white'
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
                          'max-h-[calc(100%-150px)] rounded-b-lg'
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
        </div>
      </div>

      <OrgAlertModal
        ModalInfo={alertModalInfo}
        showAlertModal={deactivateOrganizationModal}
        setShowAlertModal={setDeactivateOrganizationModal}
        loading={organizationStatusLoader}
        setLoading={setOrganizationStatusLoader}
        handelOnClickButton={handelClickOnOrganizationStatusToggled}
      />
    </>
  );
}

export default OrganizationManager;
