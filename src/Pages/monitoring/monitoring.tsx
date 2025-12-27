import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FaTerminal } from 'react-icons/fa';
import { FiRefreshCw } from 'react-icons/fi';
import InfiniteScroll from 'react-infinite-scroll-component';

import Button from '../../common/Button';
import { initialMetadata } from '../../Constant/Constant';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../Context/Notification/NotificationContextApi';
import { multipleFetchApi } from '../../Helper/api/multipleAPI';
import { getDataFromSecureCookie } from '../../Helper/HelperFunction';
import { useDebounce } from '../../Hooks/useDebounce';
import { RuntimeLogsFilesInterface } from '../../interface/interface';
import {
  endpointObject,
  MetaDataInterface,
} from '../../interface/propsInterface';
import DownloadBackupFiles from './DownloadBackupFiles';
import MonitoringSidebar from './MonitoringSidebar';

function Monitoring() {
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

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

  const fetchLogsWithDebounce = useDebounce(async (_page?: number) => {
    const endPointArr: endpointObject[] = [
      {
        endPoint: `monitoring/logs/runtime?page=${_page || 1}&limit=100`,
        protected: true,
      },
      {
        endPoint: `monitoring/logs/history/files`,
        protected: true,
      },
    ];
    const response = await multipleFetchApi(endPointArr);
    const res = response[0];
    const logFiles = response[1];

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

    if (logFiles?.success) {
      setAvailableLogFiles(logFiles?.data);
    } else {
      setAvailableLogFiles([]);
      handelNotification(res, 'top-right');
    }
    setLoading(false);
  }, 100);

  const initializeAutoRefresh = () => {
    if (autoRefreshIntervalRef.current) {
      clearInterval(autoRefreshIntervalRef?.current);
    }

    autoRefreshIntervalRef.current = window.setInterval(() => {
      if (autoRefresh) {
        if (page < metaData.total_pages) {
          fetchLogsWithDebounce(1);
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
    const Backend_Base_data = import.meta.env.VITE_BACKEND_API_BASEURL;

    const endpoint = `${Backend_Base_data}/monitoring/logs/download-file/${file_path}`;

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

      fetchLogsWithDebounce(nextPage);

      return nextPage;
    });
  };

  const handelRefreshNowBtn = () => {
    fetchLogsWithDebounce(1);
    setPage(1);
    initializeAutoRefresh();
  };

  useEffect(() => {
    fetchLogsWithDebounce();
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
              className='py-5 flex-1 overflow-y-auto h-full max-h-[calc(100vh-180px)] hide-scrollbar'
            >
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
                    Console logs will appear here once your application starts
                    generating output.
                  </p>
                </div>
              )}
              {/* <div className='pt-10' ref={bottomObserverRef}></div> */}
            </div>
          </div>
        </div>
      </div>
      <DownloadBackupFiles showModal={showModal} setShowModal={setShowModal} />
    </>
  );
}

export default Monitoring;
