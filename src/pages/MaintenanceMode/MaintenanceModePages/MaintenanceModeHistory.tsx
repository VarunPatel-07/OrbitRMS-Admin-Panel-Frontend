import { useContext, useEffect, useRef, useState } from 'react';
import { IoEye } from 'react-icons/io5';
import { MdModeEdit } from 'react-icons/md';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { differenceInMinutes } from 'date-fns';

import Breadcrumbs from '../../../components/common/Breadcrumbs';
import Table from '../../../components/common/Table/Table';
import TableFilterSearchBar from '../../../components/common/Table/TableFilterSearchBar';
import TableInfoHeader from '../../../components/common/Table/TableInfoHeader';
import TableNoDataFound from '../../../components/common/Table/TableNoDataFound';
import TablePagination from '../../../components/common/Table/TablePagination';
import TableSkeletonLoader from '../../../components/loader/Table/TableSkeletonLoader';
import { dropdownMenuArray, initialMetadata } from '../../../constant/Constant';
import { MaintenanceModeHistoryBreadCrumbObject } from '../../../constant/MaintenanceModeConstant';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../../context/notification/NotificationContextApi';
import { FilterFieldsTypeEnums } from '../../../enums/enums';
import { useDebounce } from '../../../hooks/useDebounce';
import { Column } from '../../../interface/interface';
import { MaintenanceModeHistoryInterface } from '../../../interface/MaintenanceMode';
import {
  endpointObject,
  FilterObjectInterface,
  MetaDataInterface,
  UrlEncodedFilterQueryInterface,
} from '../../../interface/propsInterface';
import {
  multipleFetchApi,
  multiplePutApi,
} from '../../../utils/api/multipleAPI';
import { RenderBeautifulMaintenanceStatus } from '../../../utils/helper/Helper';
import {
  formateDate,
  getUTCDateFormIsoString,
} from '../../../utils/helper/HelperFunction';
import EditScheduledMaintenanceMode from '../MaintenanceModeHelper/EditScheduledMaintenanceMode';
import MaintenanceModeHistoryDetails from '../MaintenanceModeHelper/MaintenanceModeHistoryDetails';
import { MaintenanceModeQueryFilterArray } from '../MaintenanceModeHelper/MaintenanceModeQueryFilterArray';

function MaintenanceModeHistory() {
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const navigate = useNavigate();

  const useEffectRef = useRef(false);
  const [queryParameter] = useSearchParams();

  const [isInitialFetching, setIsInitialFetching] = useState<boolean>(true);
  const [isFetchingData, setIsFetchingData] = useState<boolean>(true);
  const [data, setData] = useState<MaintenanceModeHistoryInterface[]>([]);
  const [maintenanceLogDetails, setMaintenanceLogDetails] =
    useState<MaintenanceModeHistoryInterface | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [urlDecodedFilterQuery, setUrlDecodedFilterQuery] = useState<
    UrlEncodedFilterQueryInterface[]
  >([]);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editData, setEditData] =
    useState<MaintenanceModeHistoryInterface | null>(null);
  const [showError, setShowError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [maintenanceModeReason, setMaintenanceModeReason] =
    useState<string>('');
  const [recordsPerPage, setRecordsPerPage] = useState<number>(10);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [metaData, setMetaData] = useState<MetaDataInterface>(initialMetadata);

  const fetchMaintenanceModeHistoryWithDebounce = useDebounce(
    async (queryString: string, page: number = 1, limit: number = 10) => {
      const endPointArr: endpointObject[] = [
        {
          endPoint: queryString
            ? `maintenance-mode/history/fetch?page=${page}&limit=${limit}&${queryString}`
            : `maintenance-mode/history/fetch?page=${page}&limit=${limit}`,
          protected: true,
        },
      ];

      const response = await multipleFetchApi(endPointArr);
      const res = response[0];

      if (res?.success) {
        setData(res?.data);
        setMetaData(res?.metadata);
      } else {
        handelNotification(res, 'top-right');
      }

      setIsFetchingData(false);
      setIsInitialFetching(false);
    },
    100
  );

  const columns: Array<Column> = [
    {
      key: 'type',
      title: 'Type',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: string) => (
        <div className='w-fit'>
          <p className='w-full text-ellipsis overflow-hidden line-clamp-4 font-inter text-base text-black capitalize font-semibold'>
            {data}
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: 'scheduled' | 'active' | 'completed') =>
        RenderBeautifulMaintenanceStatus(data),
    },
    {
      key: 'reason',
      title: 'Reason',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: string) => (
        <div className='w-fit min-w-[250px]'>
          <p className='w-full text-ellipsis overflow-hidden line-clamp-4 font-inter text-base text-black'>
            {data ? data : '-'}
          </p>
        </div>
      ),
    },
    {
      key: 'cancellation_reason',
      title: 'Cancellation Reason',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: string) => (
        <div className='w-fit min-w-[250px]'>
          <p className='w-full text-ellipsis overflow-hidden line-clamp-4 font-inter text-base text-black'>
            {data ? data : '-'}
          </p>
        </div>
      ),
    },
    {
      key: 'message',
      title: 'Message',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: string) => {
        const sanitizedData = data
          .replace(/style="[^"]*"/g, '') // remove inline styles
          .replace(/<h1>/g, '<div>')
          .replace(/<\/h1>/g, '</div>');

        return (
          <div className='line-clamp-4 overflow-hidden min-w-[250px] text-ellipsis'>
            <div
              className='prose prose-sm font-inter text-black !text-base'
              dangerouslySetInnerHTML={{ __html: sanitizedData }}
            />
          </div>
        );
      },
    },

    {
      key: 'started_at',
      title: 'Start Time',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,

      renderContent: (data: string) => (
        <div className='w-fit min-w-[200px]'>
          <p className='w-full text-ellipsis overflow-hidden line-clamp-4 font-inter text-base text-black'>
            {data ? formateDate(data, 'DD/MM/YYYY') : '-'}
          </p>
        </div>
      ),
    },
    {
      key: 'started_by',
      title: 'Started By',
      isSortable: false,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: string) => (
        <div className='w-fit'>
          <p className='w-full text-ellipsis overflow-hidden line-clamp-4 font-inter text-base text-black'>
            {data ? data : '-'}
          </p>
        </div>
      ),
    },
    {
      key: 'ended_at',
      title: 'End Time',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: string) => (
        <div className='w-fit min-w-[200px]'>
          <p className='w-full text-ellipsis overflow-hidden line-clamp-4 font-inter text-base text-black'>
            {data ? formateDate(data, 'DD/MM/YYYY') : '-'}
          </p>
        </div>
      ),
    },
    {
      key: 'ended_by',
      title: 'Ended By',
      isSortable: false,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: string) => (
        <div className='w-fit'>
          <p className='w-full text-ellipsis overflow-hidden line-clamp-4 font-inter text-base text-black'>
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
        <div className='w-fit min-w-[200px]'>
          <p className='w-full text-ellipsis overflow-hidden line-clamp-4 font-inter text-base text-black'>
            {data ? formateDate(data, 'DD/MM/YYYY', true) : '-'}
          </p>
        </div>
      ),
    },
    {
      key: 'updated_at',
      title: 'Updated On',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,

      renderContent: (data: string) => (
        <div className='w-fit min-w-[200px]'>
          <p className='w-full text-ellipsis overflow-hidden line-clamp-4 font-inter text-base text-black'>
            {data ? formateDate(data, 'DD/MM/YYYY', true) : '-'}
          </p>
        </div>
      ),
    },
    {
      key: 'action',
      title: 'Action',
      isSortable: false,
      isSticky: true,
      canToggleVisibility: true,
      renderContent: (data: MaintenanceModeHistoryInterface) => {
        const now = new Date();

        const endDateDifference =
          differenceInMinutes(getUTCDateFormIsoString(data?.ended_at), now) <=
          60;
        const startDateDifference =
          differenceInMinutes(getUTCDateFormIsoString(data?.started_at), now) <=
          60;

        const disableEditButton =
          data?.status !== 'scheduled' ||
          startDateDifference ||
          endDateDifference;

        return (
          <div className='w-full h-full flex items-center justify-start gap-2'>
            <button
              className='text-black/80 p-1.5 disabled:opacity-50 disabled:cursor-not-allowed'
              data-tooltip-id='maintenance-mode-edit-button'
              data-tooltip-content='Edit'
              disabled={disableEditButton}
              onClick={() => {
                setShowEditModal(true);
                setEditData(data);
                setMaintenanceModeReason(data?.reason);
              }}
            >
              <MdModeEdit className='text-2xl' />
            </button>
            <button
              className='text-black/80 p-1.5 disabled:opacity-50 disabled:cursor-not-allowed'
              data-tooltip-id='maintenance-mode-view-details-button'
              data-tooltip-content='View History'
              onClick={() => {
                setShowDetailsModal(true);
                setMaintenanceLogDetails(data);
              }}
            >
              <IoEye className='text-2xl' />
            </button>
            {!disableEditButton && (
              <Tooltip
                id='maintenance-mode-edit-button'
                opacity={'100'}
                className='z-[15] bg-white'
                place='left'
              />
            )}

            <Tooltip
              id='maintenance-mode-view-details-button'
              opacity={'100'}
              className='z-[15] bg-white'
              place='left'
            />
          </div>
        );
      },
    },
  ];

  const handelEditMaintenanceModeWithDebounce = useDebounce(
    async (
      id: string,
      data: MaintenanceModeHistoryInterface,
      type: 'cancellation' | 'editing'
    ) => {
      const endPointArr: endpointObject[] = [
        {
          endPoint:
            type == 'cancellation'
              ? `maintenance-mode/schedule/cancellation?id=${id}`
              : `maintenance-mode/schedule/edit?id=${id}`,
          protected: true,
          data: { ...data, reason: maintenanceModeReason },
        },
      ];

      const response = await multiplePutApi(endPointArr);
      const res = response[0];

      if (res?.success) {
        setEditData(null);
        setShowEditModal(false);
        setShowError(false);
        setIsFetchingData(true);
        const filterQuery = queryParameter.get('filter');
        let queryString = '';

        if (filterQuery) {
          const decodeQuery = decodeURIComponent(filterQuery);
          const parsedFilter = JSON.parse(decodeQuery);

          setUrlDecodedFilterQuery(parsedFilter);
          queryString = `filter=${encodeURIComponent(JSON.stringify(parsedFilter))}`;
        }
        fetchMaintenanceModeHistoryWithDebounce(queryString);
      }
      handelNotification(res, 'top-right');
      setLoading(false);
    },
    100
  );

  const handelClickOnSubmitButton = (
    id: string,
    _data: MaintenanceModeHistoryInterface,
    type: 'cancellation' | 'editing'
  ) => {
    if (
      type == 'editing' &&
      (maintenanceModeReason?.trim().length === 0 ||
        editData?.started_at == null ||
        editData?.ended_at == null)
    ) {
      setShowError(true);
    } else if (
      type == 'cancellation' &&
      maintenanceModeReason?.trim().length === 0
    ) {
      setShowError(true);
    } else {
      setShowError(false);
      setLoading(true);
      handelEditMaintenanceModeWithDebounce(id, _data, type);
    }
  };

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
    await fetchMaintenanceModeHistoryWithDebounce(queryString);

    // Then navigate after the state updates are complete
    setTimeout(() => {
      navigate(`/orbitrms/maintenance-mode/history?${queryString}`);
    }, 0);
  };

  const handelClickOnRecordPerPage = (value: string | number) => {
    setRecordsPerPage(Number(value));
    const filterQuery = queryParameter.get('filter');
    let queryString = '';

    if (filterQuery) {
      const decodeQuery = decodeURIComponent(filterQuery);
      const parsedFilter = JSON.parse(decodeQuery);

      queryString = `filter=${encodeURIComponent(JSON.stringify(parsedFilter))}`;
    }
    setIsFetchingData(true);
    fetchMaintenanceModeHistoryWithDebounce(queryString, 1, value);
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
    fetchMaintenanceModeHistoryWithDebounce(queryString, value, recordsPerPage);
  };

  useEffect(() => {
    if (useEffectRef?.current) return;
    useEffectRef.current = true;
    const filterQuery = queryParameter.get('filter');
    let queryString = '';

    if (filterQuery) {
      const decodeQuery = decodeURIComponent(filterQuery);
      const parsedFilter = JSON.parse(decodeQuery);

      setUrlDecodedFilterQuery(parsedFilter);
      queryString = `filter=${encodeURIComponent(JSON.stringify(parsedFilter))}`;
    }
    fetchMaintenanceModeHistoryWithDebounce(queryString);
  }, []);

  return (
    <>
      <div className='w-full h-full relative'>
        <Breadcrumbs
          BreadcrumbsNavigationFlow={MaintenanceModeHistoryBreadCrumbObject}
        />
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
                  moduleName='Maintenance Log History'
                  badgeValue={
                    data?.length > 0
                      ? `${(selectedPage - 1) * Number(recordsPerPage) + 1} - ${data?.length * selectedPage} of  ${metaData?.total_data}  Log History`
                      : `0 Log History
`
                  }
                  buttonsArray={[]}
                  loading={isFetchingData}
                />
                <TableFilterSearchBar
                  filterColumnsArray={MaintenanceModeQueryFilterArray}
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
                        notFoundTitle={'Maintenance History Empty'}
                        notFoundMessage={
                          'No maintenance mode activity has been logged yet.'
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

      {showDetailsModal && maintenanceLogDetails && (
        <MaintenanceModeHistoryDetails
          setShowMaintenanceModeHistoryDetails={setShowDetailsModal}
          showMaintenanceModeHistoryDetails={showDetailsModal}
          data={maintenanceLogDetails}
        />
      )}
      {showEditModal && editData && (
        <EditScheduledMaintenanceMode
          data={editData}
          setShowEditModal={setShowEditModal}
          showEditModal={showEditModal}
          setData={setEditData}
          showError={showError}
          maintenanceModeReason={maintenanceModeReason}
          setMaintenanceModeReason={setMaintenanceModeReason}
          handelSubmitButton={handelClickOnSubmitButton}
          loading={loading}
        />
      )}
    </>
  );
}

export default MaintenanceModeHistory;
