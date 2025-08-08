import { useContext, useEffect, useRef, useState } from 'react';
import { FaScrewdriverWrench } from 'react-icons/fa6';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import { Editor } from '@tiptap/react';

import Breadcrumbs from '../../../common/Breadcrumbs';
import Button from '../../../common/Button';
import {
  initialMaintenanceModeModalPropsInfo,
  MaintenanceModeBreadCrumbObject,
  MaintenanceModeFormData,
} from '../../../Constant/MaintenanceModeConstant';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../../Context/Notification/NotificationContextApi';
import {
  multipleFetchApi,
  multiplePutApi,
} from '../../../Helper/api/multipleAPI';
import {
  formateDate,
  isRichTextEditorIsEmpty,
  stripHtml,
} from '../../../Helper/HelperFunction';
import { useDebounce } from '../../../Hooks/useDebounce';
import {
  MaintenanceModeFormDataInterface,
  MaintenanceModeModalInfo,
  scheduledMaintenanceStartEndDatesInterface,
} from '../../../interface/MaintenanceMode';
import { endpointObject } from '../../../interface/propsInterface';
import MaintenanceModeAlertModal from '../MaintenanceModeHelper/MaintenanceModeAlertModal';
import MaintenanceModeDescription from '../MaintenanceModeHelper/MaintenanceModeDescription';
import {
  ActivatingMaintenanceModeObject,
  SchedulingMaintenanceModeObject,
} from '../MaintenanceModeHelper/MaintenanceModeHelper';

function MaintenanceMode() {
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;
  const editorRef = useRef<Editor | null>(null);
  const useEffectRef = useRef(false);

  const [dummyData, setDummyData] = useState<MaintenanceModeFormDataInterface>(
    MaintenanceModeFormData
  );
  const [formData, setFormData] = useState<MaintenanceModeFormDataInterface>(
    MaintenanceModeFormData
  );

  const [showError, setShowError] = useState<boolean>(false);
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFetchMaintenanceInfo, setIsFetchMaintenanceInfo] =
    useState<boolean>(true);
  const [alertModalPropsInfo, setAlertModalPropsInfo] =
    useState<MaintenanceModeModalInfo>(initialMaintenanceModeModalPropsInfo);
  const [maintenanceModeReason, setMaintenanceModeReason] =
    useState<string>('');

  const [emptyReasonError, setEmptyReasonError] = useState<boolean>(false);
  const [isEditingMessage, setIsEditingMessage] = useState<boolean>(false);

  const [
    scheduledMaintenanceStartEndDates,
    setScheduledMaintenanceStartEndDates,
  ] = useState<scheduledMaintenanceStartEndDatesInterface>({
    started_at: null,
    ended_at: null,
  });

  const onEditorReady = (editor: Editor) => {
    editorRef.current = editor;
  };

  const FetchMaintenanceModeInfoWithDebounce = useDebounce(async () => {
    const endPointArr: endpointObject[] = [
      {
        endPoint: 'maintenance-mode/fetch',
        protected: true,
      },
    ];
    const response = await multipleFetchApi(endPointArr);
    const res = response[0];
    if (res?.success) {
      setFormData(res?.data);
      setDummyData(res?.data);
    } else {
      handelNotification(res, 'top-right');
    }

    setIsFetchMaintenanceInfo(false);
  }, 100);

  const activateMaintenanceModeWithDebounce = useDebounce(
    async (type: 'activate' | 'deactivate') => {
      const data = {
        message: formData?.message,
        reason: maintenanceModeReason,
      };
      const endPointArr: endpointObject[] = [
        {
          endPoint: `maintenance-mode/manual/toggle?type=${type}`,
          protected: true,
          data: data,
        },
      ];
      const response = await multiplePutApi(endPointArr);
      const res = response[0];
      handelNotification(res, 'top-right');
      if (res?.success) {
        editorRef.current?.commands.clearContent();
        setShowAlertModal(false);
        setShowError(false);
        setAlertModalPropsInfo(initialMaintenanceModeModalPropsInfo);
        setIsFetchMaintenanceInfo(true);
        setMaintenanceModeReason('');
        FetchMaintenanceModeInfoWithDebounce();
      }

      setLoading(false);
    },
    100
  );

  const handelClickOnCancelButton = () => {
    setShowAlertModal(false);
    setAlertModalPropsInfo(initialMaintenanceModeModalPropsInfo);
    setScheduledMaintenanceStartEndDates({ started_at: null, ended_at: null });
    setMaintenanceModeReason('');
  };

  const ScheduleMaintenanceModeWithDebounce = useDebounce(
    async (type: 'scheduled' | 'cancelling') => {
      const data = {
        message: formData?.message,
        reason: maintenanceModeReason,
        ...scheduledMaintenanceStartEndDates,
      };

      console.log(type);
      const endPointArr: endpointObject[] = [
        {
          endPoint:
            type === 'cancelling'
              ? `maintenance-mode/schedule/cancellation?id=${formData?.scheduler_info?.id}`
              : `maintenance-mode/schedule/setup`,
          protected: true,
          data:
            type === 'cancelling' ? { reason: maintenanceModeReason } : data,
        },
      ];
      const response = await multiplePutApi(endPointArr);
      const res = response[0];
      handelNotification(res, 'top-right');
      if (res?.success) {
        editorRef.current?.commands.clearContent();
        setShowAlertModal(false);
        setShowError(false);
        setEmptyReasonError(false);
        setAlertModalPropsInfo(initialMaintenanceModeModalPropsInfo);
        setIsFetchMaintenanceInfo(true);
        setMaintenanceModeReason('');
        setScheduledMaintenanceStartEndDates({
          ended_at: null,
          started_at: null,
        });
        FetchMaintenanceModeInfoWithDebounce();
      }

      setLoading(false);
    },
    100
  );

  const saveMessageWithDebounce = useDebounce(async (id: string) => {
    const endPointArr: endpointObject[] = [
      {
        endPoint: `maintenance-mode/edit/save-message?id=${id}`,
        protected: true,
        data: { message: formData.message },
      },
    ];

    const response = await multiplePutApi(endPointArr);
    const res = response[0];

    if (res?.success) {
      setFormData((pervData) => ({ ...pervData, message: res?.data?.message }));
      setDummyData((pervData) => ({
        ...pervData,
        message: res?.data?.message,
      }));
    } else {
      handelNotification(res, 'top-right');
    }
    setIsEditingMessage(false);
  }, 100);
  const handelClickOnSaveChange = () => {
    setIsEditingMessage(true);
    saveMessageWithDebounce(formData.id);
  };

  const handelScheduleMaintenanceMode = (type: 'scheduled' | 'cancelling') => {
    if (type == 'scheduled') {
      if (
        maintenanceModeReason?.trim()?.length === 0 ||
        !scheduledMaintenanceStartEndDates?.started_at ||
        !scheduledMaintenanceStartEndDates?.ended_at
      ) {
        setEmptyReasonError(true);
      } else {
        setLoading(true);
        ScheduleMaintenanceModeWithDebounce(type);
      }
    } else {
      if (maintenanceModeReason?.trim()?.length === 0) {
        setEmptyReasonError(true);
      } else {
        setLoading(true);
        ScheduleMaintenanceModeWithDebounce(type);
      }
    }
  };

  const handelActiveDeactivateMaintenanceModeButton = () => {
    if (formData?.status == 'active') {
      setLoading(true);
      activateMaintenanceModeWithDebounce('deactivate');
    } else {
      if (maintenanceModeReason?.trim()?.length == 0) {
        setEmptyReasonError(true);
      } else {
        setEmptyReasonError(false);
        setLoading(true);
        activateMaintenanceModeWithDebounce('activate');
      }
    }
  };

  const handelClickOnActivateMaintenanceMode = () => {
    if (
      isRichTextEditorIsEmpty(formData?.message) &&
      formData?.status !== 'active'
    )
      setShowError(true);
    else {
      setShowAlertModal(true);
      setAlertModalPropsInfo(ActivatingMaintenanceModeObject(formData?.status));
    }
  };

  const handelClickOnScheduleMaintenanceButton = () => {
    if (
      isRichTextEditorIsEmpty(formData?.message) &&
      formData?.status !== 'active'
    ) {
      setShowError(true);
    } else {
      setShowAlertModal(true);
      setAlertModalPropsInfo(SchedulingMaintenanceModeObject('scheduled'));
    }
  };

  const handelClickOnCancelScheduleMaintenanceButton = () => {
    if (formData?.status === 'scheduled') {
      setShowAlertModal(true);
      setAlertModalPropsInfo(SchedulingMaintenanceModeObject('cancelling'));
    }
  };
  useEffect(() => {
    if (useEffectRef.current) return;
    useEffectRef.current = true;
    FetchMaintenanceModeInfoWithDebounce();
  }, []);

  return (
    <SkeletonTheme baseColor='#dcdce3' highlightColor='#ebebeb'>
      <div className='w-full h-full relative'>
        <Breadcrumbs
          BreadcrumbsNavigationFlow={MaintenanceModeBreadCrumbObject}
        />
        <div className='w-full h-full pt-9'>
          <div className='w-full h-full p-4 2xl:p-5'>
            <div className='w-full h-full bg-white rounded-lg relative border border-black/20 overflow-hidden'>
              <div className='absolute top-0 left-0 p-4 w-full bg-white border-b border-b-black/30 z-30'>
                <div className='w-full flex items-center justify-between'>
                  {isFetchMaintenanceInfo ? (
                    <Skeleton
                      width={70}
                      height={34}
                      className='inline-block'
                      borderRadius={6}
                    />
                  ) : (
                    <>
                      <span className='font-inter inline-block text-green-700 bg-green-100 border border-green-700 rounded-md px-3 py-1.5 text-sm capitalize'>
                        {formData?.status}
                      </span>
                    </>
                  )}
                  <div className='flex items-center justify-center gap-3'>
                    <FaScrewdriverWrench className='text-black text-lg' />
                    <h2 className='font-inter text-2xl text-black font-semibold'>
                      Maintenance Mode
                    </h2>
                  </div>
                  {isFetchMaintenanceInfo ? (
                    <Skeleton
                      width={70}
                      height={34}
                      className='inline-block'
                      borderRadius={6}
                    />
                  ) : (
                    <Link
                      to='/orbitrms/maintenance-mode/history'
                      type='button'
                      className='font-inter text-sm text-blue-600 font-bold bg-blue-100 border border-blue-600 capitalize rounded-md px-3 py-1.5'
                    >
                      History
                    </Link>
                  )}
                </div>
              </div>
              <div className='py-[100px] px-4 overflow-auto max-h-[calc(100vh-135px)] hide-scrollbar'>
                {isFetchMaintenanceInfo || isEditingMessage ? (
                  <Skeleton
                    width={'100%'}
                    height={355}
                    className='inline-block mt-5'
                    borderRadius={8}
                  />
                ) : (
                  <MaintenanceModeDescription
                    description={formData?.message}
                    onEditorReady={onEditorReady}
                    setDescription={setFormData}
                    showError={showError}
                  />
                )}
              </div>
              <div className='w-full absolute bottom-0 left-0 border-t bg-white border-t-black/30 p-3'>
                <div className='w-full flex items-center justify-between gap-4'>
                  <div className='flex-grow'>
                    {formData?.status === 'scheduled' ? (
                      <p className='text-black/70 italic text-sm font-inter font-medium'>
                        {formData?.scheduler_info?.started_by} has scheduled
                        maintenance from
                        <strong className='text-black px-1'>
                          {formateDate(
                            formData?.scheduler_info?.started_at,
                            'DD/MM/YYYY'
                          )}
                        </strong>
                        to
                        <strong className='text-black pl-1'>
                          {formateDate(
                            formData?.scheduler_info?.ended_at,
                            'DD/MM/YYYY'
                          )}
                        </strong>
                        .
                      </p>
                    ) : (
                      <p className='text-black/70 italic text-sm font-inter font-medium'>
                        Last update on
                        <strong className='text-black px-1'>
                          {formateDate(formData?.updated_at, 'DD/MM/YYYY')}
                        </strong>
                        by {formData?.updated_by}.
                      </p>
                    )}
                  </div>
                  <div className='w-fit flex items-center justify-end gap-4'>
                    {isFetchMaintenanceInfo ? (
                      <div className='flex items-center justify-end gap-5 w-full'>
                        <Skeleton
                          width={210}
                          height={40}
                          className='inline-block'
                          borderRadius={8}
                        />
                        <Skeleton
                          width={210}
                          height={40}
                          className='inline-block'
                          borderRadius={8}
                        />
                      </div>
                    ) : (
                      <>
                        {formData?.status == 'active' ? (
                          <div className='flex items-center justify-end gap-5 w-full'>
                            {stripHtml(formData?.message) !==
                              stripHtml(dummyData?.message) && (
                              <Button
                                type='button'
                                className='bg-transparent border border-black/40 text-black px-4 py-2'
                                onClick={() => {
                                  setFormData(dummyData);
                                }}
                              >
                                Reset Message
                              </Button>
                            )}

                            <Button
                              type='button'
                              className='text-white bg-[var(--them-green-light-color)] px-4 py-2'
                              onClick={handelClickOnSaveChange}
                              disabled={
                                formData?.message?.trim() ===
                                dummyData?.message?.trim()
                              }
                            >
                              Save Change
                            </Button>
                            <Button
                              type='button'
                              className='text-white bg-red-600 px-4 py-2'
                              onClick={handelClickOnActivateMaintenanceMode}
                            >
                              Deactivate Maintenance Mode
                            </Button>
                          </div>
                        ) : null}
                        {formData?.status == 'inActive' ? (
                          <div className='flex items-center justify-end gap-5 w-full'>
                            <Button
                              type='button'
                              className='bg-blue-100 text-blue-700 border border-blue-600 px-4 py-2'
                              onClick={handelClickOnScheduleMaintenanceButton}
                            >
                              Schedule Maintenance
                            </Button>
                            <Button
                              type='button'
                              className='text-white bg-[var(--them-green-light-color)] px-4 py-2'
                              onClick={handelClickOnActivateMaintenanceMode}
                            >
                              Activate Maintenance Mode
                            </Button>
                          </div>
                        ) : null}
                        {formData?.status == 'scheduled' ? (
                          <div className='flex items-center justify-end gap-5 w-full'>
                            <Button
                              type='button'
                              className='bg-gray-100 text-gray-700 border border-gray-700 px-4 py-2'
                              onClick={
                                handelClickOnCancelScheduleMaintenanceButton
                              }
                            >
                              Cancel Scheduler
                            </Button>
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showAlertModal && (
        <MaintenanceModeAlertModal
          ModalInfo={alertModalPropsInfo}
          showAlertModal={showAlertModal}
          setShowAlertModal={setShowAlertModal}
          maintenanceModeReason={maintenanceModeReason}
          setMaintenanceModeReason={setMaintenanceModeReason}
          showError={emptyReasonError}
          handelActiveDeactivateMaintenanceModeButton={
            handelActiveDeactivateMaintenanceModeButton
          }
          handelClickOnCancelButton={handelClickOnCancelButton}
          loading={loading}
          showReasonField={formData?.status === 'inActive'}
          scheduledMaintenanceStartEndDates={scheduledMaintenanceStartEndDates}
          setScheduledMaintenanceStartEndDates={
            setScheduledMaintenanceStartEndDates
          }
          handelScheduleMaintenanceMode={handelScheduleMaintenanceMode}
        />
      )}
    </SkeletonTheme>
  );
}

export default MaintenanceMode;
