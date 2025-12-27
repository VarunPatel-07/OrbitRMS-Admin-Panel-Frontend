import { BiDownload } from 'react-icons/bi';
import Skeleton from 'react-loading-skeleton';

import Button from '../../common/Button';
import { MonitoringSidebarInterface } from '../../interface/interface';
import RenderFilesItems from './RenderFilesItems';

function MonitoringSidebar({
  loading,
  availableLogFiles,
  setShowModal,
  handelClickOnDownload,
}: MonitoringSidebarInterface) {
  return (
    <div className='min-w-[350px] max-h-[calc(100vh-110px)] hide-scrollbar bg-white flex flex-col rounded-xl border border-gray-200 shadow-sm overflow-hidden'>
      <div className='p-5 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white'>
        <h2 className='text-lg font-semibold text-gray-900 mb-1.5 font-inter'>
          Log Files
        </h2>
        {loading ? (
          <Skeleton width={250} height={15} borderRadius={3} />
        ) : (
          <p className='text-xs text-gray-600 font-inter'>
            {availableLogFiles?.length}{' '}
            {availableLogFiles?.length === 1 ? 'file' : 'files'} available
          </p>
        )}
        <div className='w-full mt-4'>
          {loading ? (
            <Skeleton width='100%' height={40} borderRadius={6} />
          ) : (
            <Button
              type='button'
              className='bg-blue-700 text-sm font-normal w-full py-2.5 rounded-md'
              onClick={() => setShowModal(true)}
            >
              <span className='flex items-center justify-center gap-3'>
                <BiDownload size={18} />
                <span>Download Backup Files</span>
              </span>
            </Button>
          )}
        </div>
      </div>
      <div className='w-full'>
        <RenderFilesItems
          loading={loading}
          availableLogFiles={availableLogFiles}
          handelClickOnDownload={handelClickOnDownload}
        />
      </div>
    </div>
  );
}

export default MonitoringSidebar;
