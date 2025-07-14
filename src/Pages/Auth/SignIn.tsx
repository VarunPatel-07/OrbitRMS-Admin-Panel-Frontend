import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import OrbitLogo from '../../assets/Images/orbitrms-final-logo-transperent.webp';
import AuthLotiAnimation from '../../assets/lottie/AuthPageLoginAnimation.lottie';
import Input from '../../common/Input';

function SignIn() {
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
              className='max-w-[200px] h-fit max-h-[70px]'
              loading='lazy'
              alt='Orbit Dark Logo'
              width={200}
              height={70}
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
                  width={150}
                  height={40}
                />
              </div>
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
              <div className='w-full'>
                <Input name='email' labelFieldName='Email' isRequiredField />
              </div>
              <div className='w-full'>
                <Input name='email' labelFieldName='Password' isRequiredField />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
