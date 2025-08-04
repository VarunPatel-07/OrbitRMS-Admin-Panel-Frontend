import { useEffect, useRef, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import InfoLottieIcon from '../../assets/lottie/info.lottie';
import Button from '../../common/Button';
import Loader from '../../common/Loader';
import { classNames } from '../../Helper/HelperFunction';
import { OrgManagerAlertModalProps } from '../../interface/CommonComponentProps';

function OrgAlertModal(props: OrgManagerAlertModalProps) {
  const {
    ModalInfo,
    showAlertModal,
    setShowAlertModal,
    handelOnClickButton,
    loading,
    setLoading,
  } = props;

  const [showModalAnimation, setShowModalAnimation] = useState<boolean>(false);
  const [renderComponent, setRenderComponent] = useState<boolean>(false);

  const boxRef = useRef<HTMLDivElement>(null);

  const handelCancelButton = () => {
    setShowAlertModal(false);
    setLoading(false);
  };

  useEffect(() => {
    const handelClickOutSideTheBox = (event: MouseEvent) => {
      if (!ModalInfo?.protected) {
        if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
          handelCancelButton();
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
            <div className='grid grid-cols-1 gap-6'>
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
                <h3 className='text-black text-2xl font-semibold font-inter text-pretty text-center'>
                  {ModalInfo?.alertModalTitle}
                </h3>
              </div>
              <div className='w-full'>
                <p
                  className='text-black font-inter text-[15px] text-pretty'
                  dangerouslySetInnerHTML={{
                    __html: ModalInfo?.alertModelInfo,
                  }}
                ></p>
              </div>
              <div className='w-full'>
                <div className='grid grid-cols-2 w-full gap-x-2'>
                  <button
                    className='text-[var(--them-green-color)] w-full py-2.5 rounded-lg font-inter border border-[var(--them-green-color)] text-base font-semibold hover:bg-gray-800/5 hover:text-black transition-all'
                    onClick={handelCancelButton}
                  >
                    Cancel
                  </button>
                  {/* bg-rose-600 hover:bg-rose-700/90 */}
                  <Button
                    type='button'
                    className={classNames(
                      'text-white  w-full py-2.5 rounded-lg font-inter text-base font-semibold transition-all',
                      {
                        'bg-rose-600 hover:bg-rose-700/90': ModalInfo?.success,
                        'bg-[var(--them-green-color)]': !ModalInfo?.success,
                      }
                    )}
                    disabled={loading}
                    onClick={() => handelOnClickButton(ModalInfo?.id)}
                  >
                    {loading ? (
                      <Loader
                        loaderText={
                          ModalInfo?.success ? 'Disabling...' : 'Enabling...'
                        }
                      />
                    ) : ModalInfo?.success ? (
                      <span>Disable</span>
                    ) : (
                      <span>Enable</span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default OrgAlertModal;
