import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import OrbitLogo from '../../assets/Images/orbitrms-final-logo-transperent.webp';
import AuthLotiAnimation from '../../assets/lottie/AuthPageLoginAnimation.lottie';
import AlertModal from '../../common/AlertModal';
import Button from '../../common/Button';
import Input from '../../common/Input';
import Loader from '../../common/Loader';
import MainSuspenseLoader from '../../Components/Loader/MainSuspenseLoader';
import {
  alertModalSuccessButtonArray,
  AuthFormDataInitialState,
  initialAlertModalPropsInfo,
} from '../../Constant/AuthPageConstant';
import { MAX_SIGN_IN_ATTEMPT } from '../../Constant/Constant';
import { ERROR_MESSAGES } from '../../Constant/ErrorMessages';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../Context/Notification/NotificationContextApi';
import { signInApiFunction, verifyUserApiFunction } from '../../Helper/api/api';
import HelmetSeo from '../../Helper/HelmetSeo';
import {
  getDataFromLocalStorage,
  handleCountDownFunction,
  isValidEmail,
  MaxLimitCountDownTimeFormatter,
  storeDataInLocalStorage,
} from '../../Helper/HelperFunction';
import { useDebounce } from '../../Hooks/useDebounce';
import { SignInPageFormDataInterface } from '../../interface/AuthPageInterface';
import { ModalInfoType } from '../../interface/CommonComponentProps';

function SignIn() {
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const navigate = useNavigate();

  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const useEffectRef = useRef(false);

  const [formData, setFormData] = useState<SignInPageFormDataInterface>(
    AuthFormDataInitialState
  );
  const [showGlobalLoader, setShowGlobalLoader] = useState(true as boolean);
  const [showError, setShowError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [countDown, setCountDown] = useState<number>(0);
  const [expiryTimeUTCString, setExpiryTimeUTCString] = useState<string>('');
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [alertModalPropsInfo, setAlertModalPropsInfo] = useState<ModalInfoType>(
    initialAlertModalPropsInfo
  );

  const handelOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    setFormData((pervData) => ({ ...pervData, [name]: value }));
  };

  const handelSignInApiCallingWithDebounce = useDebounce(async () => {
    const res = await signInApiFunction(
      'auth/sign-in',
      formData,
      'POST',
      setLoading
    );

    if (res?.success) {
      setLoading(false);
      setShowAlertModal(true);
      const link = `/auth/verify-email?id=${res?.data?.id}&signature=${res?.data?.admin_signature}&resend-available-at=${encodeURIComponent(res?.data?.resend_available_at)}`;
      setAlertModalPropsInfo({
        success: true,
        alertModalTitle: 'A 6-Digit Code Has Been Sent',
        protected: true,
        alertModelInfo:
          'We’ve Sent You a 6-Digit Verification Code! Please Check Your Email and Enter the Code Here to Continue Logging In Safely.',
        optionsButtonArray: alertModalSuccessButtonArray(link),
      });
    } else {
      setLoading(false);
      handelNotification(res, 'top-right');
      if (res?.data?.expiry_time) {
        setExpiryTimeUTCString(res?.data?.expiry_time);
        storeDataInLocalStorage(res?.data?.expiry_time, MAX_SIGN_IN_ATTEMPT);
      }
    }
  }, 100);

  const isFormValid = useMemo(() => {
    return (
      formData.email.trim().length > 0 &&
      formData.password.length >= 6 &&
      isValidEmail(formData.email)
    );
  }, [formData]);

  const handelSubmitButton = () => {
    if (!isFormValid) {
      setShowError(true);
    } else {
      setLoading(true);
      handelSignInApiCallingWithDebounce();
    }
  };

  const verifyUsersLoggedIn = useDebounce(async () => {
    const response = await verifyUserApiFunction();

    if (response?.success) {
      setShowGlobalLoader(false);
      navigate('/orbitrms/dashboard');
    } else {
      setShowGlobalLoader(false);
      handelNotification(response, 'top-right');
    }
  }, 100);

  useEffect(() => {
    const localData = getDataFromLocalStorage(MAX_SIGN_IN_ATTEMPT);

    const data = localData || expiryTimeUTCString;

    if (data) {
      handleCountDownFunction(
        data,
        intervalRef,
        setCountDown,
        MAX_SIGN_IN_ATTEMPT
      );
    }
  }, [expiryTimeUTCString]);

  useEffect(() => {
    if (useEffectRef.current) return;
    useEffectRef.current = true;
    const _localToken = getDataFromLocalStorage('authenticationToken');
    if (_localToken) {
      verifyUsersLoggedIn();
    } else {
      setShowGlobalLoader(false);
    }
  }, [verifyUsersLoggedIn]);

  return (
    <>
      <HelmetSeo
        Title='Sign In | OrbitRMS Admin Panel'
        Content='Log in to OrbitRMS and start managing everything in one place with ease and efficiency!'
      />

      <MainSuspenseLoader loading={showGlobalLoader} />
      <div className='w-screen h-screen bg-white'>
        <div className='flex items-stretch justify-start w-full h-full'>
          <div className='w-0 lg:w-1/2 hidden lg:block bg-red-50 relative'>
            <div className='w-1/2 h-full m-auto'>
              <DotLottieReact
                src={AuthLotiAnimation}
                loop
                autoplay
                className='w-full h-full'
                width={'100%'}
                height={'100%'}
              />
            </div>
            <div className='absolute top-3.5 left-7'>
              <img
                src={OrbitLogo}
                className='max-w-[200px] h-fit max-h-[90px]'
                loading='lazy'
                alt='Orbit Dark Logo'
                width={200}
                height={90}
              />
            </div>
          </div>
          <div className='w-full lg:w-1/2'>
            <div className='flex items-center justify-center flex-col w-full h-full'>
              <div className='flex flex-col items-center justify-center gap-5 max-w-[500px]'>
                <div className='w-full block lg:hidden m-auto'>
                  <img
                    src={OrbitLogo}
                    className='max-w-[200px] h-fit max-h-[70px] m-auto'
                    loading='lazy'
                    alt='Orbit Dark Logo'
                    width={180}
                    height={50}
                  />
                </div>
                <div className='flex flex-col items-center justify-center gap-10 w-full'>
                  <div className='w-full flex flex-col items-center justify-center gap-2'>
                    <h1 className='text-black font-inter font-bold text-3xl'>
                      Welcome Back,{' '}
                      <span className='text-[var(--them-orange-color)]'>
                        Admin!
                      </span>
                    </h1>
                    <p className='text-black/80 text-base w-[80%] text-center'>
                      Take Control of the Orbit. Log in to Command{' '}
                      <span className='text-[var(--them-orange-color)] font-semibold'>
                        OrbitRMS.
                      </span>
                    </p>
                  </div>
                  <div className='flex flex-col items-center justify-center gap-5 w-full'>
                    <div className='w-full'>
                      <Input
                        name='email'
                        labelFieldName='Email'
                        isRequiredField
                        onChange={handelOnChange}
                        value={formData?.email}
                        type='text'
                        showError={showError}
                        errorMessage={
                          showError
                            ? formData?.email?.trim()?.length === 0
                              ? ERROR_MESSAGES.REQUIRED_EMAIL
                              : !isValidEmail(formData?.email)
                                ? ERROR_MESSAGES.INVALID_EMAIL
                                : ''
                            : ''
                        }
                      />
                    </div>
                    <div className='w-full'>
                      <Input
                        name='password'
                        type='password'
                        labelFieldName='Password'
                        isRequiredField
                        onChange={handelOnChange}
                        value={formData?.password}
                        viewPasswordBtn
                        showError={showError}
                        errorMessage={
                          showError
                            ? formData?.password?.trim()?.length === 0
                              ? ERROR_MESSAGES.REQUIRED_FIELD
                              : formData?.password?.trim().length < 6
                                ? ERROR_MESSAGES.PASSWORD_MIN_CHARACTERS
                                : ''
                            : ''
                        }
                      />
                    </div>
                  </div>
                  <div className='w-full'>
                    <Button
                      type='button'
                      className='bg-[var(--them-green-color)] w-full'
                      onClick={handelSubmitButton}
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader loaderText='Signing in...' />
                      ) : (
                        <>Sign in</>
                      )}
                    </Button>
                  </div>
                  {countDown ? (
                    <p className='text-red-600 flex items-center gap-1 justify-center text-sm mt-1'>
                      <span className='inline-block'>Try Again After:</span>
                      <span className='inline-block'>
                        {MaxLimitCountDownTimeFormatter(countDown)}
                      </span>
                    </p>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AlertModal
        ModalInfo={alertModalPropsInfo}
        showAlertModal={showAlertModal}
        setShowAlertModal={setShowAlertModal}
      />
    </>
  );
}

export default SignIn;
