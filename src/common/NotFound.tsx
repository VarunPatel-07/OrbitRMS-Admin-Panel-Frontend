import { Link } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import NotFoundAnimation from '../assets/lottie/NotFoundAnimation.lottie';
import { NotFoundPageComponentPropsInterface } from '../interface/CommonComponentProps';
import Button from './Button';

function NotFound(props: NotFoundPageComponentPropsInterface) {
  const { message, title, optionsButton } = props;
  return (
    <div className='w-full h-full pb-4'>
      <div className='w-full h-full bg-white rounded-lg'>
        <div className='flex flex-col items-center justify-center w-full h-full'>
          <div className='flex items-center justify-center w-full'>
            <div className='w-[300px] h-[300px] max-w-[300px] max-h-[300px]'>
              <DotLottieReact
                src={NotFoundAnimation}
                loop
                autoplay
                className='w-full h-full'
                width={'100%'}
                height={'100%'}
              />
            </div>
          </div>
          <div className='flex flex-col items-center justify-center max-w-[70%] gap-3 -mt-[60px]'>
            <h2 className='font-inter text-black text-2xl font-semibold'>
              {title}
            </h2>
            <p className='font-inter text-black/60 text-base text-pretty text-center'>
              {message}
            </p>
            <div className='w-full mt-3 m-auto flex flex-col items-center justify-center gap-2.5'>
              {optionsButton?.map((options) => {
                if (options?.type === 'button' && options?.onClick)
                  return (
                    <Button type='button' className={options?.className}>
                      {options?.label}
                    </Button>
                  );
                if (options?.type === 'link' && options?.link)
                  return (
                    <Link to={options?.link} className={options?.className}>
                      <span className='inline-block'>{options?.icon}</span>{' '}
                      <span className='inline-block'>{options?.label}</span>
                    </Link>
                  );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
