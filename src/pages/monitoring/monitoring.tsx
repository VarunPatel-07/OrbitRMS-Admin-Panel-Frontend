import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FaTerminal } from 'react-icons/fa';
import { FiRefreshCw } from 'react-icons/fi';
import InfiniteScroll from 'react-infinite-scroll-component';
import Skeleton from 'react-loading-skeleton';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Button from '../../components/common/Button';
import SearchDrop from '../../components/common/SearchDrop';
import { ENV_CONFIG } from '../../config/EnvConfig';
import { initialMetadata } from '../../constant/Constant';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../context/notification/NotificationContextApi';
import { useDebounce } from '../../hooks/useDebounce';
import { RuntimeLogsFilesInterface } from '../../interface/interface';
import {
  endpointObject,
  MetaDataInterface,
} from '../../interface/propsInterface';
import { multipleFetchApi } from '../../utils/api/multipleAPI';
import { getDataFromSecureCookie } from '../../utils/helper/HelperFunction';
import DownloadBackupFiles from './DownloadBackupFiles';
import MonitoringSidebar from './MonitoringSidebar';

const BACKEND_API_BASEURL = ENV_CONFIG.VITE_BACKEND_API_BASEURL;

function Monitoring() {
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const autoRefreshIntervalRef = useRef<number | null>(null);

  const [filteredLogs, setFilteredLogs] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [metaData, setMetaData] = useState<MetaDataInterface>(initialMetadata);
  const [availableLogFiles, setAvailableLogFiles] = useState<
    RuntimeLogsFilesInterface[]
  >([]);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<'failures' | 'runtime'>(
    'runtime'
  );
  const [loadingLogs, setLoadingLogs] = useState<boolean>(true);
  const fetchLogsFileWithDebounce = useDebounce(async () => {
    const endPointArr: endpointObject[] = [
      {
        endPoint: `monitoring/logs/history/files`,
        protected: true,
      },
    ];
    const response = await multipleFetchApi(endPointArr);
    const res = response[0];

    if (res?.success) {
      setAvailableLogFiles(res?.data);
    } else {
      setAvailableLogFiles([]);
      handelNotification(res, 'top-right');
    }
    setLoading(false);
  });
  const fetchLogsWithDebounce = useDebounce(
    async (_page: number, type: 'failures' | 'runtime') => {
      const endPointArr: endpointObject[] = [
        {
          endPoint: `monitoring/logs/${type || 'runtime'}?page=${_page || 1}&limit=100`,
          protected: true,
        },
      ];
      const response = await multipleFetchApi(endPointArr);
      const res = response[0];

      if (res?.success) {
        if (_page === 1) {
          setFilteredLogs(res.data);
        } else {
          setFilteredLogs((pervData) => [...pervData, ...res.data]);
        }

        setMetaData(res?.metadata);
      } else {
        setFilteredLogs([]);
        handelNotification(res, 'top-right');
      }
      setLoadingLogs(false);
    },
    100
  );

  const initializeAutoRefresh = () => {
    if (autoRefreshIntervalRef.current) {
      clearInterval(autoRefreshIntervalRef?.current);
    }

    autoRefreshIntervalRef.current = window.setInterval(() => {
      if (autoRefresh) {
        if (page < metaData.total_pages) {
          fetchLogsWithDebounce(1, selectedValue);
        }
      }
    }, 300_000);
  };

  const hasMore = useMemo(() => {
    if (!metaData) return true;

    return page < metaData.total_pages;
  }, [page, metaData]);

  const handelClickOnDownload = async (
    file_name: string,
    file_path: string
  ) => {
    const endpoint = `${BACKEND_API_BASEURL}/monitoring/logs/download-file/${file_path}`;

    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getDataFromSecureCookie('adminAuthenticationToken')}`,
      },
    });

    if (!res.ok) {
      throw new Error('Download failed');
    }

    const blob = await res.blob();
    const urlObject = URL.createObjectURL(blob);

    const anchorTag = document.createElement('a');

    anchorTag.href = urlObject;
    anchorTag.download = file_name;
    document.body.appendChild(anchorTag);
    anchorTag.click();
    anchorTag.remove();

    URL.revokeObjectURL(urlObject);
  };

  const fetchMoreData = () => {
    setPage((prevPage) => {
      const nextPage = prevPage + 1;

      fetchLogsWithDebounce(nextPage, selectedValue);

      return nextPage;
    });
  };

  const handelRefreshNowBtn = () => {
    fetchLogsWithDebounce(1, selectedValue);
    setPage(1);
    initializeAutoRefresh();
  };

  const handelOnSelect = (data: string | object) => {
    if (typeof data === 'string') {
      if (['runtime', 'failures'].includes(data?.toLocaleLowerCase())) {
        setLoadingLogs(true);
        navigate(`?type=${data?.toLocaleLowerCase()}`);
        setSelectedValue(data?.toLocaleLowerCase() as 'runtime' | 'failures');
        fetchLogsWithDebounce(
          1,
          data?.toLocaleLowerCase() as 'runtime' | 'failures'
        );
      }
    }
  };

  useEffect(() => {
    const searchVal = searchParams?.get('type');

    if (searchVal && ['failures', 'runtime'].includes(searchVal)) {
      setSelectedValue(searchVal as 'runtime' | 'failures');
      fetchLogsWithDebounce(1, searchVal as 'runtime' | 'failures');
      fetchLogsFileWithDebounce();
    }
  }, []);

  useEffect(() => {
    if (autoRefresh) initializeAutoRefresh();
    else if (autoRefreshIntervalRef.current) {
      clearInterval(autoRefreshIntervalRef.current);
      autoRefreshIntervalRef.current = null;
    }

    return () => {
      if (autoRefreshIntervalRef.current)
        clearInterval(autoRefreshIntervalRef.current);
    };
  }, [autoRefresh]);

  return (
    <>
      <div className='flex-1 w-full h-full p-6 overflow-hidden'>
        <div className='w-full h-full flex items-stretch justify-start gap-5'>
          <MonitoringSidebar
            loading={loading}
            availableLogFiles={availableLogFiles}
            handelClickOnDownload={handelClickOnDownload}
            setShowModal={setShowModal}
          />
          <div
            className={`bg-white border border-gray-200 rounded-lg h-full flex flex-col overflow-hidden grow`}
          >
            <div
              className={`bg-white border-b border-gray-200 w-full px-7 py-3 flex items-center justify-between gap-2`}
            >
              <div className='flex items-center gap-2'>
                <FaTerminal size={16} className='text-black' />
                <span
                  className={`text-base font-semibold font-inter text-black`}
                >
                  Console Output
                </span>
              </div>
              <div className='flex items-center justify-end gap-5'>
                <div>
                  <SearchDrop
                    options={['Runtime', 'Failures']}
                    emptyDataMessage='No Options Found'
                    position='bottom'
                    searchKey=''
                    showSearchBar={false}
                    onSelectValBtn={handelOnSelect}
                    selectedValue={selectedValue}
                    className='min-w-[120px]'
                  />
                </div>
                <div className='flex items-center gap-2'>
                  <Button
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      autoRefresh
                        ? 'text-green-700 border-green-300 bg-green-50 hover:bg-green-100'
                        : 'text-gray-600 border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <span className='flex items-center gap-2'>
                      <FiRefreshCw
                        size={16}
                        className={autoRefresh ? 'animate-spin' : ''}
                      />
                      <span className='text-sm font-medium'>Auto-refresh</span>
                    </span>
                  </Button>
                </div>
                <div className='flex items-center gap-2'>
                  <Button
                    onClick={handelRefreshNowBtn}
                    className='px-3 py-2 rounded-lg border text-blue-700 border-blue-300 bg-blue-50 hover:bg-blue-100 transition-colors'
                  >
                    <span className='flex items-center gap-2'>
                      <FiRefreshCw size={16} />
                      <span className='text-sm font-medium'>Refresh Now</span>
                    </span>
                  </Button>
                </div>
              </div>
            </div>

            <div
              id='log-scroll-container'
              className='py-5 flex-1 overflow-y-auto h-full max-h-[calc(100vh-200px)] hide-scrollbar'
            >
              {loadingLogs ? (
                <div className='w-full h-full px-5'>
                  <Skeleton width='100%' height='100%' borderRadius={6} />
                </div>
              ) : (
                <>
                  {filteredLogs?.length !== 0 ? (
                    <InfiniteScroll
                      dataLength={filteredLogs?.length}
                      next={fetchMoreData}
                      hasMore={hasMore}
                      loader={<h4>Loading...</h4>}
                      endMessage={
                        <p className='py-5 text-black text-center'>
                          <b>Yay! You’ve seen all the logs.</b>
                        </p>
                      }
                      scrollableTarget='log-scroll-container'
                    >
                      <div className='flex flex-col h-full w-full'>
                        {filteredLogs.map((log, index) => (
                          <span
                            key={index}
                            className={`py-1 px-8 block w-full font-inter text-sm ${String(log).includes('INFO') ? 'text-black' : 'text-rose-600 font-medium'}`}
                          >
                            {log}
                          </span>
                        ))}
                      </div>
                    </InfiniteScroll>
                  ) : (
                    <div className='flex flex-col items-center justify-center h-full text-center px-8'>
                      <div className='w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center mb-5'>
                        <FaTerminal size={32} className='text-gray-600' />
                      </div>
                      <h3 className='text-lg font-semibold text-gray-900 mb-2 font-inter'>
                        No Console Output
                      </h3>
                      <p className='text-sm text-gray-500 max-w-sm font-inter leading-relaxed'>
                        Console logs will appear here once your application
                        starts generating output.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <DownloadBackupFiles showModal={showModal} setShowModal={setShowModal} />
    </>
  );
}

export default Monitoring;
