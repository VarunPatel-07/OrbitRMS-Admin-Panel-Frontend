import React, { useContext, useEffect, useRef, useState } from 'react';
import { FaStarOfLife } from 'react-icons/fa6';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import OrbitLogo from '../../assets/Images/orbitrms-final-logo-transperent.webp';
import AuthLotiAnimation from '../../assets/lottie/AuthPageLoginAnimation.lottie';
import Button from '../../common/Button';
import Loader from '../../common/Loader';
import { MINIMUM_RESEND_OTP_INTERVAL } from '../../Constant/Constant';
import { ERROR_MESSAGES } from '../../Constant/ErrorMessages';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../Context/Notification/NotificationContextApi';
import { multiplePostApi } from '../../Helper/api/multipleAPI';
import {
  getDataFromLocalStorage,
  handleCountDownFunction,
  MaxLimitCountDownTimeFormatter,
  removeDataFromLocalStorage,
  storeDataInLocalStorage,
  storeDataInSecureCookie,
} from '../../Helper/HelperFunction';
import { useDebounce } from '../../Hooks/useDebounce';
import { endpointObject } from '../../interface/propsInterface';

function VerifyEmailAddress() {
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const OTPInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const useEffectRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const [otpCode, setOtpCode] = useState<string[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [countDown, setCountDown] = useState<number>(0);
  const [expiryTimeUTCString, setExpiryTimeUTCString] = useState<string>('');
  const [resendOtpLoader, setResendOtpLoader] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (value.length > 1 || (value && !/^\d?$/.test(value))) return;

    const OtpCodeArray = [...otpCode];
    OtpCodeArray[index] = value;

    setOtpCode(OtpCodeArray);

    if (value && index < OTPInputRefs.current.length - 1) {
      if (OTPInputRefs.current) OTPInputRefs.current[index + 1]?.focus();
    }
  };

  const handelKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const isBackspace = e.key?.toLowerCase() == 'backspace';

    const currentValue = (e.target as HTMLInputElement).value;
    if (isBackspace && !currentValue && index > 0) {
      if (OTPInputRefs.current) OTPInputRefs.current[index - 1]?.focus();
    }
  };

  const handelVerifyOtpWithDebounce = useDebounce(async () => {
    const id = searchParams.get('id');
    const signature = searchParams.get('signature');
    const endPointArr: endpointObject[] = [
      {
        endPoint: `auth/otp/verify-otp?id=${id}&signature=${signature}`,
        protected: false,
        data: {
          otp: otpCode?.join(''),
        },
      },
    ];

    const response = await multiplePostApi(endPointArr);
    const res = response[0];
    if (!res?.success) {
      handelNotification(res, 'top-right');
    } else {
      storeDataInSecureCookie(
        res?.data?.authenticationToken,
        'adminAuthenticationToken'
      );
      setOtpCode([]);
      handelNotification(res, 'top-right');
      navigate('/orbitrms/dashboard');
    }
    setLoading(false);
  }, 100);

  const handelSubmitButton = () => {
    if (otpCode.length === 6) {
      setLoading(true);
      handelVerifyOtpWithDebounce();
    }
  };

  const handelResendMailWithDebounce = useDebounce(async () => {
    const id = searchParams.get('id');
    const signature = searchParams.get('signature');
    const endPointArr: endpointObject[] = [
      {
        endPoint: `auth/otp/re-send-otp?id=${id}&signature=${signature}`,
        protected: false,
      },
    ];

    const response = await multiplePostApi(endPointArr);
    const res = response[0];
    if (res?.success) {
      storeDataInLocalStorage(
        res?.data?.resend_available_at,
        MINIMUM_RESEND_OTP_INTERVAL
      );
      setExpiryTimeUTCString(res?.data?.resend_available_at);
      removeDataFromLocalStorage(MINIMUM_RESEND_OTP_INTERVAL);
    } else {
      handelNotification(res, 'top-right');
      storeDataInLocalStorage(
        res?.data?.resend_available_at,
        MINIMUM_RESEND_OTP_INTERVAL
      );
      setExpiryTimeUTCString(res?.data?.resend_available_at);
    }
    setResendOtpLoader(false);
  }, 100);

  const handelResendMail = () => {
    if (Number.isFinite(countDown) && countDown <= 0) {
      setResendOtpLoader(true);
      handelResendMailWithDebounce();
    }
  };

  useEffect(() => {
    OTPInputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    const localData = getDataFromLocalStorage(MINIMUM_RESEND_OTP_INTERVAL);

    const resendAvailableAt = searchParams.get('resend-available-at');
    if (resendAvailableAt) {
      if (!localData) {
        storeDataInLocalStorage(resendAvailableAt, MINIMUM_RESEND_OTP_INTERVAL);
        setExpiryTimeUTCString(resendAvailableAt);
        const id = searchParams.get('id');
        const signature = searchParams.get('signature');
        setTimeout(() => {
          navigate(`/auth/verify-email?id=${id}&signature=${signature}`);
        }, 0);
      }
    }

    const data = localData || expiryTimeUTCString || resendAvailableAt;

    if (data) {
      handleCountDownFunction(
        data,
        intervalRef,
        setCountDown,
        MINIMUM_RESEND_OTP_INTERVAL
      );
    }
  }, [expiryTimeUTCString, searchParams]);

  useEffect(() => {
    if (useEffectRef.current) return;
    useEffectRef.current = true;

    const id = searchParams.get('id');
    const signature = searchParams.get('signature');

    if (!id && !signature) {
      const data = {
        message:
          ERROR_MESSAGES.VERIFY_EMAIL_ACCESS_DENIED_FOR_INSUFFICIENT_DATA,
        success: false,
      };
      handelNotification(data, 'top-right');
      navigate('/auth/sign-in');
    }
  }, []);

  return (
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
                <div className='w-full flex flex-col items-center justify-center gap-3'>
                  <h1 className='text-black font-inter font-bold text-3xl'>
                    Verify Your{' '}
                    <span className='text-[var(--them-orange-color)]'>
                      Access Code
                    </span>
                  </h1>
                  <p className='text-black text-base font-medium w-[80%] text-center'>
                    Enter the 6-digit code sent to your email.
                  </p>
                  <p className='text-black/80 text-sm w-[80%] text-center'>
                    This step ensures your access to the OrbitRMS Command Panel
                    remains secure and exclusive.
                  </p>
                </div>
                <div className='flex flex-col items-center justify-center gap-5 w-full'>
                  {OTPInputRefs.current && (
                    <div className='flex items-stretch justify-between gap-4 w-full'>
                      {Array.from({ length: 6 })?.map((_, index) => (
                        <div
                          key={index}
                          className='w-16 h-20 border border-black/65 rounded-lg relative focus-within:border-[var(--them-pink-color)] focus-within:outline focus-within:outline-4 focus-within:outline-[rgba(215,139,159,0.2)] overflow-hidden'
                        >
                          <input
                            className='w-full h-full bg-transparent overflow-hidden text-base focus:outline-none focus:ring-0  py-2.5 font-inter resize-none disabled:bg-[#7fab98]/15 text-black text-center'
                            value={otpCode[index] || ''}
                            maxLength={1}
                            ref={(el) => {
                              if (el) OTPInputRefs.current[index] = el;
                            }}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handelKeyDown(e, index)}
                            onFocus={() => setFocusedIndex(index)}
                            onBlur={() => setFocusedIndex(0)}
                          />
                          {focusedIndex !== index && !otpCode[index] && (
                            <div className='w-full h-full absolute top-0 left-0 z-20 bg-gray-100'>
                              <div className='w-full h-full flex items-center justify-center'>
                                <FaStarOfLife className='text-black/50 text-sm' />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className='w-full'>
                  <Button
                    type='button'
                    className='bg-[var(--them-green-color)] w-full py-2.5'
                    onClick={handelSubmitButton}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader loaderText='Verifying...' />
                    ) : (
                      <>Verify Otp</>
                    )}
                  </Button>
                </div>
                <div className='w-full'>
                  <Button
                    type='button'
                    className='bg-transparent border border-black/50 text-black w-full text-base group py-2.5'
                    onClick={handelResendMail}
                    disabled={
                      (Number.isFinite(countDown) && countDown > 0) ||
                      resendOtpLoader
                    }
                  >
                    {resendOtpLoader ? (
                      <Loader loaderText='resending....' />
                    ) : (
                      <span className='flex flex-col gap-1'>
                        {Number.isFinite(countDown) && countDown > 0 ? (
                          <span className='text-sm'>
                            You can request a new code in
                            <span className='font-medium'>
                              ({MaxLimitCountDownTimeFormatter(countDown)})
                            </span>
                          </span>
                        ) : (
                          <span className='text-black/80 group-hover:text-black transition-all'>
                            Didn’t receive the code?{' '}
                            <span className='group-hover:text-blue-600 underline'>
                              Resend
                            </span>
                          </span>
                        )}
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailAddress;
