import { useEffect, useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { addMinutes, isSameDay } from 'date-fns';

import InfoLottieIcon from '../../../assets/lottie/info.lottie';
import Button from '../../../common/Button';
import CommonDatePicker from '../../../common/CommonDatePicker';
import Loader from '../../../common/Loader';
import TextArea from '../../../common/TextArea';
import {
  classNames,
  differenceBetweenDates,
  getUTCDateFormIsoString,
} from '../../../Helper/HelperFunction';
import {
  EditScheduledMaintenanceModeInterface,
  MaintenanceModeHistoryInterface,
} from '../../../interface/MaintenanceMode';

function EditScheduledMaintenanceMode(
  props: EditScheduledMaintenanceModeInterface
) {
  const {
    setShowEditModal,
    showEditModal,
    data,
    setData,
    showError,
    maintenanceModeReason,
    loading,
    setMaintenanceModeReason,
    handelSubmitButton,
  } = props;

  const [showModalAnimation, setShowModalAnimation] = useState<boolean>(false);
  const [renderComponent, setRenderComponent] = useState<boolean>(false);
  const [cancelScheduler, setCancelScheduler] = useState(false);
  const [editData, setEditData] =
    useState<MaintenanceModeHistoryInterface | null>(null);

  const boxRef = useRef<HTMLDivElement>(null);

  const handelClickOnDate = (
    date: Date | null,
    module_name: 'started_at' | 'ended_at'
  ) => {
    if (!date) return;

    if (setEditData)
      setEditData((pervData) => {
        if (!pervData) return null;
        if (module_name === 'started_at') {
          const newEndDate = new Date(date);
          newEndDate.setHours(newEndDate.getHours() + 1);

          return {
            ...pervData,
            started_at: date?.toISOString(),
            ended_at: newEndDate?.toISOString(),
          };
        }

        return {
          ...pervData,
          [module_name]: new Date(date)?.toISOString(),
        };
      });
  };

  // const handelClickOnDate = (
  //   date: Date | null,
  //   module_name: 'started_at' | 'ended_at'
  // ) => {
  //   if (!date) return;

  //   setScheduledMaintenanceStartEndDates((prevData) => {
  //     if (module_name === 'started_at') {
  //       const newEndDate = new Date(date);
  //       newEndDate.setHours(newEndDate.getHours() + 1);

  //       return {
  //         ...prevData,
  //         started_at: date,
  //         ended_at: newEndDate,
  //       };
  //     }

  //     return {
  //       ...prevData,
  //       [module_name]: new Date(date),
  //     };
  //   });
  // };

  const getMinimumTime = (type: 'started_at' | 'ended_at') => {
    const now = getUTCDateFormIsoString(data[type]);
    const selected = editData ? new Date(editData[type]) : now;

    if (type === 'ended_at' && editData?.started_at) {
      const startedDate = getUTCDateFormIsoString(editData.started_at);

      if (isSameDay(startedDate, selected)) {
        return addMinutes(startedDate, -15); // allow ending time from started_at time
      }

      return new Date(selected.setHours(0, 0, 0, 0)); // future: allow full-day
    }

    if (isSameDay(now, selected)) {
      return addMinutes(now, -15); // today: restrict to current time - 15 mins
    }

    return new Date(selected.setHours(0, 0, 0, 0)); // future: full-day
  };

  const getMaximumTime = (type: 'started_at' | 'ended_at') => {
    const now = getUTCDateFormIsoString(data[type]);
    const selected = editData ? new Date(editData[type]) : now;

    return isSameDay(now, selected)
      ? new Date(now.setHours(23, 45, 0, 0)) // if today
      : new Date(selected.setHours(23, 45, 0, 0)); // any selected date
  };

  const EditDateComponent = () => {
    return (
      <>
        <div className='w-full'>
          <CommonDatePicker
            onChange={(date) => handelClickOnDate(date, 'started_at')}
            selectedValue={getUTCDateFormIsoString(
              editData?.started_at ? editData?.started_at : data?.started_at
            )}
            name='started_at'
            labelFieldName='Starting Date And Time'
            isRequiredField={true}
            datePickerPosition={'bottom'}
            showError={showError}
            showTimeSelect
            minimumDate={
              editData?.started_at
                ? getUTCDateFormIsoString(editData?.started_at)
                : new Date()
            }
            disabled={differenceBetweenDates(data?.started_at) <= 30}
            maxTime={getMinimumTime('started_at')}
            minTime={getMaximumTime('started_at')}
            errorMessage={
              showError && !data?.started_at ? 'this field is required' : ''
            }
          />
        </div>
        <div className='w-full'>
          <CommonDatePicker
            onChange={(date) => handelClickOnDate(date, 'ended_at')}
            selectedValue={getUTCDateFormIsoString(
              editData?.ended_at ? editData?.ended_at : data?.ended_at
            )}
            name='ended_at'
            labelFieldName='Ending Date And Time'
            isRequiredField={true}
            datePickerPosition={'bottom'}
            showError={showError}
            showTimeSelect
            minimumDate={
              editData?.ended_at
                ? getUTCDateFormIsoString(editData?.ended_at)
                : new Date()
            }
            minTime={getMinimumTime('ended_at')}
            maxTime={getMaximumTime('ended_at')}
            disabled={differenceBetweenDates(data?.ended_at) <= 30}
            errorMessage={
              showError && !data?.ended_at ? 'this field is required' : ''
            }
          />
        </div>
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

        <div className='grid grid-cols-2 gap-5 items-center justify-center'>
          <Button
            type='button'
            className='text-black text-nowrap text-base px-10 py-2 font-medium rounded-lg mx-auto border border-black/30 w-full'
            onClick={() => {
              setCancelScheduler(true);
              setMaintenanceModeReason('');
            }}
          >
            Cancel Scheduler
          </Button>
          <Button
            type='button'
            className='text-base px-10 py-2 font-medium rounded-lg mx-auto text-white w-full bg-[var(--them-green-light-color)]'
            onClick={() =>
              handelSubmitButton(data?.id, editData || data, 'editing')
            }
            disabled={
              loading ||
              (data?.started_at === editData?.started_at &&
                data?.ended_at === editData?.ended_at &&
                editData?.reason === maintenanceModeReason)
            }
          >
            {loading ? <Loader loaderText='Updating...' /> : 'Update'}
          </Button>
        </div>
      </>
    );
  };

  const CancelSchedularFunction = () => {
    return (
      <>
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
        <div className='w-full'>
          <h3 className='text-black text-xl font-semibold font-inter text-pretty text-center'>
            Cancel Maintenance Schedule?
          </h3>
        </div>
        <div className='w-full'>
          <p className='text-black font-inter text-sm text-pretty'>
            You're about to remove the scheduled maintenance window. This action
            cannot be undone and may affect planned operations. Are you sure you
            want to proceed?
          </p>
        </div>
        <div className='w-full'>
          <TextArea
            name='reason'
            labelFieldName='Reason for Cancellation'
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

        <div className='grid grid-cols-2 gap-5 items-center justify-center'>
          <Button
            type='button'
            className='text-black text-nowrap text-base px-10 py-2 font-medium rounded-lg mx-auto border border-black/30 w-full'
            onClick={() => setCancelScheduler(false)}
          >
            Cancel
          </Button>
          <Button
            type='button'
            className='text-base px-5 py-2 font-medium rounded-lg mx-auto text-white w-full bg-[var(--them-green-light-color)]'
            onClick={() =>
              handelSubmitButton(data?.id, editData || data, 'cancellation')
            }
            disabled={loading}
          >
            {loading ? <Loader loaderText='Canceling...' /> : 'Confirm Cancel'}
          </Button>
        </div>
      </>
    );
  };

  useEffect(() => {
    const handelClickOutSideTheBox = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setShowEditModal(false);
      }
    };
    document.addEventListener('mousedown', handelClickOutSideTheBox);
    return () => {
      document.removeEventListener('mousedown', handelClickOutSideTheBox);
    };
  }, [setShowEditModal]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (showEditModal) {
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
  }, [showEditModal]);

  useEffect(() => {
    if (data && !editData) setEditData(data);
  }, [data, editData]);

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
            className='min-w-1/2 max-w-[550px] rounded-lg bg-white px-6 py-5'
            ref={boxRef}
            tabIndex={-1}
          >
            <div className='grid grid-cols-1 gap-5'>
              <div className='flex items-center justify-between'>
                <h2 className='text-black font-inter text-lg font-semibold'>
                  {cancelScheduler ? 'Cancel' : 'Edit'} Scheduler
                </h2>
                <Button
                  type='button'
                  className='h-10 w-10 flex items-center justify-center rounded-lg bg-black'
                  onClick={() => {
                    setShowEditModal(false);
                    setEditData(null);
                    setCancelScheduler(false);
                    setData(null);
                  }}
                >
                  <IoClose className='text-2xl text-white' />
                </Button>
              </div>
              {}
              {!cancelScheduler
                ? EditDateComponent()
                : CancelSchedularFunction()}
            </div>
          </div>
        </div>
      </div>
    );
}

export default EditScheduledMaintenanceMode;
