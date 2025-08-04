import { useEffect, useRef, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { addMinutes, isSameDay } from 'date-fns';

import InfoLottieIcon from '../../../assets/lottie/info.lottie';
import Button from '../../../common/Button';
import CommonDatePicker from '../../../common/CommonDatePicker';
import Loader from '../../../common/Loader';
import TextArea from '../../../common/TextArea';
import { classNames } from '../../../Helper/HelperFunction';
import { MaintenanceModeAlertModalInterface } from '../../../interface/MaintenanceMode';

const AlertModalIcon = () => {
  return (
    <div className='w-full h-full max-w-[80px] max-h-[80px] m-auto'>
      <DotLottieReact
        src={InfoLottieIcon}
        loop
        autoplay
        className='w-full h-full'
        width={'100%'}
        height={'100%'}
      />
    </div>
  );
};

function MaintenanceModeAlertModal(props: MaintenanceModeAlertModalInterface) {
  const {
    ModalInfo,
    showAlertModal,
    setShowAlertModal,
    AlertIcon,
    maintenanceModeReason,
    setMaintenanceModeReason,
    showError,
    handelActiveDeactivateMaintenanceModeButton,
    handelClickOnCancelButton,
    loading,
    showReasonField,
    scheduledMaintenanceStartEndDates,
    setScheduledMaintenanceStartEndDates,
    handelScheduleMaintenanceMode,
  } = props;

  const [showModalAnimation, setShowModalAnimation] = useState<boolean>(false);
  const [renderComponent, setRenderComponent] = useState<boolean>(false);

  const boxRef = useRef<HTMLDivElement>(null);

  const handelClickOnDate = (
    date: Date | null,
    module_name: 'started_at' | 'ended_at'
  ) => {
    if (!date) return;

    // Update state
    setScheduledMaintenanceStartEndDates((prevData) => ({
      ...prevData,
      [module_name]: date,
    }));
  };

  const getMinimumTime = (type: 'started_at' | 'ended_at') => {
    const now = new Date();
    const selected = scheduledMaintenanceStartEndDates[type]
      ? new Date(scheduledMaintenanceStartEndDates[type])
      : now;

    if (isSameDay(now, selected)) {
      return addMinutes(now, 30); // today: only allow 30min in future
    }

    return new Date(selected.setHours(0, 0, 0, 0)); // future: allow full-day times
  };

  const getMaximumTime = (type: 'started_at' | 'ended_at') => {
    const now = new Date();
    const selected = scheduledMaintenanceStartEndDates[type]
      ? new Date(scheduledMaintenanceStartEndDates[type])
      : now;

    return isSameDay(now, selected)
      ? new Date(now.setHours(23, 45, 0, 0)) // if today
      : new Date(selected.setHours(23, 45, 0, 0)); // any selected date
  };

  useEffect(() => {
    const handelClickOutSideTheBox = (event: MouseEvent) => {
      if (!ModalInfo?.protected) {
        if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
          setShowAlertModal(false);
        }
      }
    };
    document.addEventListener('mousedown', handelClickOutSideTheBox);
    return () => {
      document.removeEventListener('mousedown', handelClickOutSideTheBox);
    };
  }, [ModalInfo?.protected, setShowAlertModal]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (showAlertModal) {
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
  }, [showAlertModal]);

  if (renderComponent)
    return (
      <div
        role='dialog'
        aria-labelledby='alert-modal-title'
        aria-describedby='alert-modal-description'
        className={classNames(
          'w-screen h-screen absolute top-0 left-0 z-50 bg-black/[0.6] backdrop-blur-[1px] transition-all ease-in-out',

          {
            'opacity-0 pointer-events-none invisible': !showModalAnimation,
            'opacity-100 visible': showModalAnimation,
          }
        )}
      >
        <div
          className={classNames(
            'w-full h-full flex items-center justify-center p-4 transition-all ease-in-out',
            {
              'scale-70 pointer-events-none invisible opacity-0':
                !showModalAnimation,
              'scale-100 visible opacity-100': showModalAnimation,
            }
          )}
        >
          <div
            className='min-w-1/2 max-w-[500px] rounded-lg bg-white px-6 py-5'
            ref={boxRef}
            tabIndex={-1}
          >
            <div className='grid grid-cols-1 gap-8'>
              {/* It Is used To Show Case The Icon Related To The Action Modal */}
              <div className='w-full flex items-center justify-center'>
                {AlertIcon ? AlertIcon : <AlertModalIcon />}
              </div>
              <div className='w-full'>
                <h3 className='text-black text-xl font-semibold font-inter text-pretty text-center'>
                  {ModalInfo?.alertModalTitle}
                </h3>
              </div>
              <div className='w-full'>
                <p
                  className='text-black font-inter text-sm text-pretty'
                  dangerouslySetInnerHTML={{
                    __html: ModalInfo?.alertModelInfo,
                  }}
                ></p>
              </div>

              {ModalInfo?.status === 'scheduled' && (
                <div className='flex items-center justify-between gap-2'>
                  <CommonDatePicker
                    onChange={(date) => handelClickOnDate(date, 'started_at')}
                    selectedValue={
                      scheduledMaintenanceStartEndDates?.started_at
                    }
                    name='started_at'
                    labelFieldName='Starting Date And Time'
                    isRequiredField={true}
                    datePickerPosition={'right-start'}
                    showError={showError}
                    showTimeSelect
                    minimumDate={new Date()}
                    minTime={getMinimumTime('started_at')}
                    maxTime={getMaximumTime('started_at')}
                    errorMessage={
                      showError &&
                      !scheduledMaintenanceStartEndDates?.started_at
                        ? 'this field is required'
                        : ''
                    }
                  />
                  <CommonDatePicker
                    onChange={(date) => handelClickOnDate(date, 'ended_at')}
                    selectedValue={scheduledMaintenanceStartEndDates?.ended_at}
                    name='ended_at'
                    labelFieldName='Ending Date And Time'
                    isRequiredField={true}
                    datePickerPosition={'left-start'}
                    showError={showError}
                    showTimeSelect
                    minimumDate={new Date()}
                    minTime={getMinimumTime('ended_at')}
                    maxTime={getMaximumTime('ended_at')}
                    errorMessage={
                      showError && !scheduledMaintenanceStartEndDates?.ended_at
                        ? 'this field is required'
                        : ''
                    }
                  />
                </div>
              )}

              {showReasonField && (
                <div className='w-full'>
                  <TextArea
                    name='reason'
                    labelFieldName='Reason for Activation'
                    isRequiredField
                    rows={3}
                    value={maintenanceModeReason}
                    setValue={setMaintenanceModeReason}
                    showError={showError}
                    errorMessage={
                      showError && maintenanceModeReason.trim().length == 0
                        ? 'this is a required field'
                        : ''
                    }
                  />
                </div>
              )}

              <div className='w-full'>
                <div className='grid grid-cols-2 gap-5 items-center justify-center'>
                  <Button
                    type='button'
                    className='text-black text-base px-16 py-2 font-medium rounded-lg mx-auto border border-black/30 w-full'
                    onClick={handelClickOnCancelButton}
                  >
                    Cancel
                  </Button>
                  {ModalInfo?.status == 'scheduled' ? (
                    <Button
                      type='button'
                      className='text-base px-16 py-2 font-medium rounded-lg mx-auto text-white w-full bg-[var(--them-green-light-color)]'
                      onClick={handelScheduleMaintenanceMode}
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader loaderText='Scheduling...' />
                      ) : (
                        'Schedule'
                      )}
                    </Button>
                  ) : (
                    <Button
                      type='button'
                      className={classNames(
                        'text-base px-16 py-2 font-medium rounded-lg mx-auto text-white w-full',
                        {
                          'bg-[var(--them-green-light-color)]':
                            ModalInfo.status === 'inActive',
                          'bg-red-600': ModalInfo?.status == 'active',
                        }
                      )}
                      onClick={handelActiveDeactivateMaintenanceModeButton}
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader
                          loaderText={
                            ModalInfo?.status !== 'inActive'
                              ? 'Deactivating...'
                              : 'Activating...'
                          }
                        />
                      ) : ModalInfo?.status !== 'inActive' ? (
                        'Deactivate'
                      ) : (
                        'Activate'
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default MaintenanceModeAlertModal;
