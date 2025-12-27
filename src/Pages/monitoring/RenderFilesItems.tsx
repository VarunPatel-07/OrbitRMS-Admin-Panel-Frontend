import { BiArchive, BiDownload } from 'react-icons/bi';
import { FiFileText } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';

import Button from '../../components/common/Button';
import {
  RenderFilesItemsInterface,
  RuntimeLogsFilesInterface,
} from '../../interface/interface';
import { bytesToSize, formateDate } from '../../utils/helper/HelperFunction';

function RenderSkeletonButton({ index }: { index: number }) {
  return (
    <div
      key={index}
      className='p-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 group'
    >
      <div className='flex items-start justify-between gap-3'>
        <div className='flex items-start gap-3 flex-1 min-w-0'>
          <div className='block'>
            <Skeleton width={34} height={34} borderRadius={8} />
          </div>
          <div className='flex-1 min-w-0 pt-0.5'>
            <div className='font-mono text-sm truncate text-gray-900 font-medium mb-1.5'>
              <Skeleton width={180} height={15} borderRadius={3} />
            </div>
            <div className='text-xs flex items-center gap-2 text-gray-500'>
              <span className='font-medium'>
                <Skeleton width={60} height={15} borderRadius={3} />
              </span>
              <span className='text-gray-300'>
                <Skeleton width={60} height={15} borderRadius={3} />
              </span>
            </div>
          </div>
        </div>
        <div className='block'>
          <Skeleton width={34} height={34} borderRadius={8} />
        </div>
      </div>
    </div>
  );
}

function RenderFilesItems({
  loading,
  availableLogFiles,
  handelClickOnDownload,
}: RenderFilesItemsInterface) {
  return (
    <div className='flex-1 overflow-y-auto hide-scrollbar'>
      {loading ? (
        <>
          {Array?.from({ length: 10 })?.map((_, index) => (
            <RenderSkeletonButton index={index} key={index} />
          ))}
        </>
      ) : (
        <>
          {availableLogFiles?.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-full text-center'>
              <div className='w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center mb-5'>
                <FiFileText size={32} className='text-gray-600' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2 font-inter'>
                No Logs Available
              </h3>
              <p className='text-sm text-gray-500 max-w-sm font-inter leading-relaxed'>
                Logs will appear here once your application starts generating
                server output logs.
              </p>
            </div>
          ) : (
            <>
              {availableLogFiles?.map(
                (file: RuntimeLogsFilesInterface, index: number) => {
                  const isGZFile = file?.file_name?.endsWith('.gz');

                  return (
                    <div
                      key={index}
                      className='p-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 group'
                    >
                      <div className='flex items-start justify-between gap-3'>
                        <div className='flex items-start gap-3 flex-1 min-w-0'>
                          <div
                            className={`mt-0.5 shrink-0 p-2 rounded-lg ${
                              isGZFile ? 'bg-amber-50' : 'bg-blue-50'
                            }`}
                          >
                            {isGZFile ? (
                              <BiArchive size={18} className='text-amber-600' />
                            ) : (
                              <FiFileText size={18} className='text-blue-600' />
                            )}
                          </div>
                          <div className='flex-1 min-w-0 pt-0.5'>
                            <div className='font-mono text-sm truncate text-gray-900 font-medium mb-1.5'>
                              {file.file_name}
                            </div>
                            <div className='text-xs flex items-center gap-2 text-gray-500'>
                              <span className='font-medium'>
                                {bytesToSize(file.size)}
                              </span>
                              <span className='text-gray-300'>•</span>
                              <span>
                                {formateDate(
                                  file.creation_time,
                                  'DD-MMM-YY',
                                  false
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          className='p-2.5 rounded-lg text-blue-600 hover:text-blue-700 transition-all duration-200 bg-blue-50 hover:bg-blue-100 group-hover:shadow-sm'
                          type='button'
                          onClick={() =>
                            handelClickOnDownload(
                              file?.file_name,
                              file?.file_path
                            )
                          }
                        >
                          <BiDownload size={18} />
                        </Button>
                      </div>
                    </div>
                  );
                }
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default RenderFilesItems;
