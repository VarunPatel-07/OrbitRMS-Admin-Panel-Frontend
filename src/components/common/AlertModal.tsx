import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import { AlertModalProps } from '../../interface/CommonComponentProps';
import { AlertModalDefaultIcon } from '../../utils/helper/Helper';
import { classNames } from '../../utils/helper/HelperFunction';

function AlertModal(props: AlertModalProps) {
  const { ModalInfo, showAlertModal, setShowAlertModal, AlertIcon } = props;

  const [showModalAnimation, setShowModalAnimation] = useState<boolean>(false);
  const [renderComponent, setRenderComponent] = useState<boolean>(false);

  const boxRef = useRef<HTMLDivElement>(null);

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
            className='min-w-1/2 max-w-[500px] rounded-lg bg-white px-8 py-10'
            ref={boxRef}
            tabIndex={-1}
          >
            <div className='grid grid-cols-1 gap-8'>
              {/* It Is used To Show Case The Icon Related To The Action Modal */}
              <div className='w-full flex items-center justify-center'>
                {AlertIcon
                  ? AlertIcon
                  : AlertModalDefaultIcon(ModalInfo?.success)}
              </div>
              <div className='w-full'>
                <h3 className='text-black text-2xl font-semibold font-inter text-pretty text-center'>
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
              <div className='w-full'>
                <div className='grid grid-cols-1 gap-5 items-center justify-center'>
                  {ModalInfo?.optionsButtonArray?.map((item, index) => {
                    const isButton = !item?.link;
                    const commonContent = (
                      <span
                        className={clsx(
                          'flex items-center justify-center gap-2',
                          item?.childClassName
                        )}
                      >
                        {item?.icon}
                        <span>{item?.buttonTitle || 'Default Title'}</span>
                      </span>
                    );

                    return isButton ? (
                      <button
                        type='button'
                        className={item?.classNames || 'default-class'}
                        onClick={item?.onclickFunction}
                        key={index}
                      >
                        {commonContent}
                      </button>
                    ) : (
                      <Link
                        to={item?.link || '#'}
                        className={item?.classNames || 'default-class'}
                        key={index}
                        target='_blank'
                      >
                        {commonContent}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default AlertModal;
