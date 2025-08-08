import { useEffect, useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';

import {
  InfoField,
  RenderBeautifulMaintenanceStatus,
} from '../../../Helper/Helper';
import { classNames } from '../../../Helper/HelperFunction';
import { MaintenanceModeHistoryDetailsInterface } from '../../../interface/MaintenanceMode';

function MaintenanceModeHistoryDetails(
  props: MaintenanceModeHistoryDetailsInterface
) {
  const {
    showMaintenanceModeHistoryDetails,
    setShowMaintenanceModeHistoryDetails,
    data,
  } = props;

  const [showModalAnimation, setShowModalAnimation] = useState<boolean>(false);
  const [renderComponent, setRenderComponent] = useState<boolean>(false);

  const modalBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handelClickOutSideTheBox = (event: MouseEvent) => {
      if (
        modalBoxRef.current &&
        !modalBoxRef.current.contains(event.target as Node)
      ) {
        setShowMaintenanceModeHistoryDetails(false);
      }
    };
    document.addEventListener('mousedown', handelClickOutSideTheBox);
    return () => {
      document.removeEventListener('mousedown', handelClickOutSideTheBox);
    };
  }, [setShowMaintenanceModeHistoryDetails]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (showMaintenanceModeHistoryDetails) {
      setRenderComponent(true); // Mount modal

      // Trigger show animation slightly later
      timeout = setTimeout(() => {
        setShowModalAnimation(true);
      }, 100); // Small delay for transition to kick in
    } else {
      setShowModalAnimation(false); // Start hide animation

      // After animation duration, unmount the modal
      timeout = setTimeout(() => {
        setRenderComponent(false);
      }, 500); // Match with your CSS `duration-300`
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [showMaintenanceModeHistoryDetails]);
  if (renderComponent) {
    return (
      <div
        className={classNames(
          'bg-black/30 backdrop-blur-[1px] fixed top-0 left-0 h-full w-full z-50 overflow-hidden transition-all duration-300',
          {
            'opacity-0 pointer-events-none invisible': !showModalAnimation,
            'opacity-100 visible': showModalAnimation,
          }
        )}
      >
        <div
          className={classNames(
            'w-full bg-white max-w-[500px] h-full ml-auto transition-all duration-300',
            {
              'translate-x-full': !showModalAnimation,
              'translate-x-0': showModalAnimation,
            }
          )}
          ref={modalBoxRef}
        >
          <div className='w-full flex items-center justify-between border-b border-b-black/20 p-5'>
            <p className='font-inter text-lg text-black font-medium'>
              Maintenance Log History
            </p>
            <button
              className='h-10 w-10 flex items-center justify-center rounded-lg bg-black'
              onClick={() => setShowMaintenanceModeHistoryDetails(false)}
            >
              <IoClose className='text-2xl text-white' />
            </button>
          </div>
          <div className='w-full py-6 px-5 h-[calc(100%-100px)] overflow-auto text-base'>
            <div className='w-full grid grid-cols-1 gap-6'>
              <div className='w-full'>
                <div className='w-full grid grid-cols-2 gap-2'>
                  <div className='w-full'>
                    <div className='flex flex-col items-start justify-start'>
                      <span className='text-sm lg:text-base font-inter font-medium text-black pb-1 inline-block'>
                        Type
                      </span>
                      <p className='text-base lg:text-base font-inter text-black pb-1 inline-block capitalize font-bold'>
                        {data?.type}
                      </p>
                    </div>
                  </div>
                  <div className='w-full'>
                    <div className='flex flex-col items-start justify-start'>
                      <span className='text-sm lg:text-base font-inter font-medium text-black pb-1 inline-block'>
                        Status
                      </span>
                      <p className='text-sm lg:text-base font-inter font-medium text-black/65 pb-1 inline-block capitalize'>
                        {RenderBeautifulMaintenanceStatus(data?.status)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='w-full'>
                <div className='w-full grid grid-cols-2 gap-2'>
                  <div className='w-full'>
                    <InfoField label='Started By' value={data?.started_by} />
                  </div>
                  <div className='w-full'>
                    <InfoField label='Ended By' value={data?.ended_by} />
                  </div>
                </div>
              </div>
              <div className='w-full'>
                <div className='w-full grid grid-cols-2 gap-2'>
                  <div className='w-full'>
                    <InfoField
                      label='Started At'
                      value={data?.started_at}
                      renderDate
                      default_dateformat='DD/MM/YYYY'
                      renderTime
                    />
                  </div>
                  <div className='w-full'>
                    <InfoField
                      label='Ended At'
                      value={data?.ended_at}
                      renderDate
                      default_dateformat='DD/MM/YYYY'
                      renderTime
                    />
                  </div>
                </div>
              </div>
              <div className='w-full'>
                <div className='flex flex-col items-start justify-start'>
                  <span className='text-sm lg:text-base font-inter font-medium text-black pb-1 inline-block'>
                    Reason
                  </span>
                  <p className='text-sm lg:text-base font-inter font-medium text-black/65 inline-block capitalize w-full'>
                    {data?.reason}
                  </p>
                </div>
              </div>
              <div className='w-full'>
                <div className='flex flex-col items-start justify-start'>
                  <span className='text-sm lg:text-base font-inter font-medium text-black pb-1 inline-block'>
                    Cancellation Reason
                  </span>
                  <p className='text-sm lg:text-base font-inter font-medium text-black/65 inline-block capitalize w-full'>
                    {data?.cancellation_reason || '-'}
                  </p>
                </div>
              </div>
              <div className='w-full'>
                <div className='flex flex-col items-start justify-start'>
                  <span className='text-sm lg:text-base font-inter font-medium text-black pb-2 inline-block'>
                    Message
                  </span>
                  <div
                    className='text-sm lg:text-base font-inter font-medium text-black inline-block capitalize w-full p-3 border border-black/20 rounded-md'
                    dangerouslySetInnerHTML={{ __html: data?.message }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MaintenanceModeHistoryDetails;
