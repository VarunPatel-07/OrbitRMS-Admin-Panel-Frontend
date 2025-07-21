import { useEffect, useRef, useState } from 'react';
import { IoEye } from 'react-icons/io5';
import { MdModeEdit } from 'react-icons/md';
import { Tooltip } from 'react-tooltip';

import Breadcrumbs from '../../common/Breadcrumbs';
import { FilterObjectInterface } from '../../common/Table/FilterInput';
import Table from '../../common/Table/Table';
import TableFilterSearchBar from '../../common/Table/TableFilterSearchBar';
import TableInfoHeader from '../../common/Table/TableInfoHeader';
import TableNoDataFound from '../../common/Table/TableNoDataFound';
import TableSkeletonLoader from '../../Components/Loader/Table/TableSkeletonLoader';
import { FilterFieldsTypeEnums } from '../../enums/enums';
import { multipleFetchApi } from '../../Helper/api/multipleAPI';
import { formateDate } from '../../Helper/HelperFunction';
import { useDebounce } from '../../Hooks/useDebounce';
import { Column } from '../../interface/interface';
import {
  CountryInfo,
  OrganizationAddress,
  OrganizationDetails,
} from '../../interface/OrganizationManager';
import {
  endpointObject,
  UrlEncodedFilterQueryInterface,
} from '../../interface/propsInterface';
import { OrganizationManagerFiltersArray } from './OrganizationManagerFiltersArray';

const BreadcrumbsObjects = [
  {
    name: 'dashboard',
    label: 'dashboard',
    link: `/orbitrms/dashboard`,
  },

  {
    name: 'Employee Listing',
    label: 'employee-listing',
    link: `/orbitrms/employee/employee-listing`,
  },
];

function OrganizationManager() {
  const useEffectRef = useRef(false);

  const [data, setData] = useState<OrganizationDetails[]>([]);
  const [isInitialFetching, setIsInitialFetching] = useState<boolean>(true);
  const [isFetchingData, setIsFetchingData] = useState<boolean>(false);

  const columns: Array<Column> = [
    {
      key: 'organization_name',
      title: 'Organization Name',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: string) => (
        <div className='w-fit'>
          <p className='font-inter text-black font-medium text-base'>{data}</p>
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
            {data}
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
            {data}
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
            {data?.country}
          </p>
        </div>
      ),
    },
    {
      key: 'email_domain_slug',
      title: 'Email Domain',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,

      renderContent: (data: string) => (
        <div className='w-fit'>
          <p className='font-inter text-black font-medium text-base'>{data}</p>
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
      isSortable: true,
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
      key: 'intern_code_prefix',
      title: 'Intern Code',
      isSortable: true,
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
      renderContent: () => {
        return (
          <div className='w-full h-full flex items-center justify-start gap-2'>
            <button
              className='text-black/80 p-1.5'
              data-tooltip-id='project_status_edit_button'
              data-tooltip-content='Edit'
              //   onClick={() => {
              //     navigate(
              //       `/${organization}/employee/edit/${data?.personal_info?.user_id}`
              //     );
              //   }}
            >
              <MdModeEdit className='text-[22px]' />
            </button>
            <button
              className='text-black/80 p-1.5 disabled:opacity-50 disabled:cursor-not-allowed'
              data-tooltip-id='project_status_view_profile_button'
              data-tooltip-content='View Profile'
              //   onClick={() => {
              //     navigate(
              //       `/${organization}/employee-profile/${data?.personal_info?.user_id}/employee-details`
              //     );
              //   }}
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

  const fetchAllTheOrganizationWithDebounce = useDebounce(async () => {
    const endPointArray: endpointObject[] = [
      { endPoint: 'organization-manager/fetch-organizations', protected: true },
    ];

    const response = await multipleFetchApi(endPointArray);
    const res = response[0];
    console.log(res);
    if (res?.success) {
      setData(res?.data);
    }
    setIsInitialFetching(false);
  }, 100);

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
            obj.value = moduleValue?.value;
          }
        });
        return obj;
      });

      queryString = `filter=${encodeURIComponent(JSON.stringify(queryFilterArray))}`;
    }

    // First update the state and fetch data
    await fetchAllTheOrganizationWithDebounce(queryString);

    // Then navigate after the state updates are complete
    // setTimeout(() => {
    //   navigate(`/${organization}/employee/employee-listing?${queryString}`);
    // }, 0);
  };

  useEffect(() => {
    if (useEffectRef.current) return;
    useEffectRef.current = true;
    setIsInitialFetching(true);

    fetchAllTheOrganizationWithDebounce();
  }, [fetchAllTheOrganizationWithDebounce]);
  return (
    <div className='w-full h-full relative'>
      <Breadcrumbs BreadcrumbsNavigationFlow={BreadcrumbsObjects} />
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
                badgeValue={'hello Admin'}
                buttonsArray={[]}
              />
              <TableFilterSearchBar
                filterColumnsArray={OrganizationManagerFiltersArray}
                handelApplyFilterFunc={handelApplyFilterEmployeeListing}
                urlDecodedFilterQuery={[]}
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
                      {/* <TablePagination
                        paginationDropDownArray={dropdownMenuArray}
                        recordsPerPage={recordsPerPage}
                        handelClickOnDroDownVal={handelClickOnRecordPerPage}
                        clickOnPaginationVal={handelClickOnPaginationButtons}
                        selectedPage={1}
                        totalPage={1}
                      /> */}
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
  );
}

export default OrganizationManager;
