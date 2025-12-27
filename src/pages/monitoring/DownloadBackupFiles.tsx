import { useContext, useEffect, useRef, useState } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { RiCloseFill } from 'react-icons/ri';

import Button from '../../components/common/Button';
import { ENV_CONFIG } from '../../config/EnvConfig';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../context/notification/NotificationContextApi';
import { useDebounce } from '../../hooks/useDebounce';
import {
  DownloadBackupFilesInterface,
  RuntimeLogsFilesInterface,
} from '../../interface/interface';
import { endpointObject } from '../../interface/propsInterface';
import { multipleFetchApi } from '../../utils/api/multipleAPI';
import {
  classNames,
  getDataFromSecureCookie,
} from '../../utils/helper/HelperFunction';
import RenderFilesItems from './RenderFilesItems';

const BACKEND_API_BASEURL = ENV_CONFIG.VITE_BACKEND_API_BASEURL;

function DownloadBackupFiles({
  showModal,
  setShowModal,
}: DownloadBackupFilesInterface) {
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const modalBoxRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(showModal);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [availableLogFiles, setAvailableLogFiles] = useState<
    RuntimeLogsFilesInterface[]
  >([]);

  const fetchLogsWithDebounce = useDebounce(async () => {
    const endPointArr: endpointObject[] = [
      {
        endPoint: `monitoring/logs/archive/files`,
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
  }, 100);
  const handelClickOnDownload = async (
    file_name: string,
    file_path: string,
    bulkDownload: boolean = false
  ) => {
    const endpoint = bulkDownload
      ? `${BACKEND_API_BASEURL}/monitoring/logs/archive/files/download-all`
      : `${BACKEND_API_BASEURL}/monitoring/logs/download-file/${file_path}`;

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

  useEffect(() => {
    if (showModal) {
      fetchLogsWithDebounce();
    }
  }, [showModal]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalBoxRef.current &&
        !modalBoxRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowModal, showModal]);

  useEffect(() => {
    if (showModal) {
      setIsMounted(true);
      setTimeout(() => {
        setIsVisible(true);
      }, 10);
    } else {
      setIsVisible(false);
      setTimeout(() => {
        setIsMounted(false);
      }, 300);
    }
  }, [showModal]);

  if (!isMounted) return null;

  if (showModal)
    return (
      <div
        className={classNames(
          'w-full h-screen bg-black/30 fixed z-50 top-0 left-0 overflow-hidden transition-all duration-100',
          {
            'opacity-0 invisible': !isVisible,
            'opacity-100 visible': isVisible,
          }
        )}
      >
        <div className='w-full h-full p-4 flex items-center justify-center overflow-hidden'>
          <div
            className={classNames(
              'bg-white w-full h-fit max-w-[600px] rounded-lg transition-all overflow-hidden',
              {
                'opacity-0 scale-50': !isVisible,
                'opacity-100 scale-100': isVisible,
              }
            )}
            ref={modalBoxRef}
          >
            <div className='w-full overflow-hidden'>
              <div className='flex items-center justify-between p-5 border-b border-gray-200'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  Download Backup Files
                </h3>
                <Button
                  type='button'
                  onClick={() => setShowModal(false)}
                  className='p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700'
                >
                  <RiCloseFill size={20} />
                </Button>
              </div>
              <div className='w-full p-2.5'>
                <div className='p-4 bg-amber-50 rounded-lg border border-amber-200'>
                  <div className='flex items-start gap-3'>
                    <FiAlertTriangle
                      size={20}
                      className='text-amber-600 shrink-0 mt-0.5'
                    />
                    <div>
                      <p className='text-sm font-semibold text-amber-900 mb-1'>
                        Important Notice
                      </p>
                      <p className='text-sm text-amber-800'>
                        All backup files are automatically deleted after 30
                        days. Please download any files you need to retain for
                        longer periods.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='w-full max-h-[400px] overflow-auto hide-scrollbar py-3'>
                <RenderFilesItems
                  loading={loading}
                  availableLogFiles={availableLogFiles}
                  handelClickOnDownload={handelClickOnDownload}
                />
              </div>
              <div className='p-5 border-t border-gray-200 flex items-center justify-between bg-gray-50'>
                <Button
                  type='button'
                  className='text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium'
                  onClick={() => handelClickOnDownload('', '', true)}
                >
                  Download All
                </Button>
                <button
                  onClick={() => setShowModal(false)}
                  className='px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700'
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default DownloadBackupFiles;
