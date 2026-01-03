import React, { useEffect, useRef, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { FeedPostDataPropsInterface } from '../interface/Dashboard';
import { classNames, formateDate } from '../utils/helper/HelperFunction';
import Button from './common/Button';
import EmployeeProfilePicture from './EmployeeProfilePicture';

interface propsInterface {
  data: FeedPostDataPropsInterface;

  editPostHandler: (feedData: FeedPostDataPropsInterface) => void;
  handelClickOnDeleteButton: (id: string) => void;
}

function FeedPostCard(props: propsInterface) {
  const { data, editPostHandler, handelClickOnDeleteButton } = props;
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const postWrapperDivRef = useRef<HTMLDivElement>(null);

  const [showMenu, setShowMenu] = useState(false);

  const postActionButtonsRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => setShowMenu((prev) => !prev);

  const handleContextMenu: React.MouseEventHandler<HTMLImageElement> = (e) => {
    e.preventDefault(); // Disable right-click
  };

  const handleDragStart: React.DragEventHandler<HTMLImageElement> = (e) => {
    e.preventDefault(); // Disable dragging
  };

  const handelClickOnEditPost = (feedData: FeedPostDataPropsInterface) => {
    editPostHandler(feedData);
    setShowMenu(false);
  };

  const renderPostEditButton = () => {
    return (
      <li className='px-3 w-full py-2 text-black text-nowrap border-b border-b-black/15 hover:bg-gray-50'>
        <Button
          type='button'
          className=''
          onClick={() => handelClickOnEditPost(data)}
        >
          Edit Post
        </Button>
      </li>
    );
  };

  const renderPostDeleteButton = () => {
    return (
      <li className='px-3 w-full py-2 text-black text-nowrap hover:bg-gray-50'>
        <Button
          type='button'
          className=''
          onClick={() => handelClickOnDeleteButton(data?.id)}
        >
          Delete Post
        </Button>
      </li>
    );
  };

  useEffect(() => {
    const handelClickOutSideTheBox = (event: MouseEvent) => {
      if (
        postWrapperDivRef.current &&
        !postWrapperDivRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handelClickOutSideTheBox);

    return () => {
      document.addEventListener('mouseup', handelClickOutSideTheBox);
    };
  }, [setShowMenu]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        postActionButtonsRef.current &&
        !postActionButtonsRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      className='w-full border border-black/10 border-b-0 rounded-lg'
      ref={postWrapperDivRef}
    >
      <div className='w-full flex items-center justify-between px-3.5 py-2 bg-[var(--main-white-color)] border-b border-b-black/10 rounded-t-lg'>
        <div className='flex items-center justify-start gap-3'>
          <EmployeeProfilePicture
            profilePicture={data?.publisher?.profile_picture}
            height={35}
            width={35}
          />
          <div className='flex flex-col items-start justify-start gap-0.5'>
            <p className='text-black flex items-center justify-start text-sm font-semibold gap-1'>
              <span>You</span>
            </p>

            <p className='text-black/70 text-xs'>
              {formateDate(data?.created_at, 'DD-MMM-Y', false)}
            </p>
          </div>
        </div>

        <div className='relative' ref={postActionButtonsRef}>
          <button onClick={toggleMenu} className='text-black'>
            <BsThreeDotsVertical />
          </button>

          {showMenu && (
            <ul
              className={classNames(
                'flex flex-col items-start justify-start bg-white shadow-xl absolute top-full z-10 rounded overflow-hidden right-0 transition-all border border-black/15',
                { 'opacity-0': !showMenu, 'opacity-100': showMenu }
              )}
            >
              {renderPostEditButton()}
              {renderPostDeleteButton()}
            </ul>
          )}
        </div>
      </div>
      <div className='w-full h-fit'>
        {JSON.parse(data?.images)?.length > 0 && (
          <div className='p-3.5 relative'>
            <Swiper
              modules={[Navigation]}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onBeforeInit={(swiper) => {
                if (
                  swiper.params.navigation &&
                  typeof swiper.params.navigation !== 'boolean'
                ) {
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                }
              }}
              spaceBetween={0}
              slidesPerView={1}
              allowTouchMove={false}
              className='w-full h-full overflow-hidden rounded-lg relative'
            >
              {JSON.parse(data?.images)?.length > 1 && (
                <>
                  <button
                    className='w-10 h-10 flex items-center justify-center border border-black/20 rounded-full bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed absolute top-1/2 -translate-x-1/2 left-7 z-10'
                    ref={prevRef}
                  >
                    <RiArrowLeftSLine className='text-slate-900 text-3xl' />
                  </button>

                  <button
                    className='w-10 h-10 flex items-center justify-center border border-black/20 rounded-full bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed absolute top-1/2 -translate-x-1/2 -right-2 z-10'
                    ref={nextRef}
                  >
                    <RiArrowRightSLine className='text-slate-900 text-3xl' />
                  </button>
                </>
              )}

              {JSON.parse(data?.images)?.map((image: string, index: number) => {
                return (
                  <SwiperSlide key={index}>
                    <div className='w-full h-full min-h-[360px] max-h-[360px] aspect-video'>
                      <picture>
                        <source src={image} />
                        <img
                          src={image}
                          alt='Post Slider Image'
                          width={'100%'}
                          height={'100%'}
                          className='object-cover w-full h-full aspect-video'
                          loading='lazy'
                          onContextMenu={handleContextMenu}
                          onDragStart={handleDragStart}
                          draggable={false}
                        />
                      </picture>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        )}
        <div
          className={classNames('px-3.5 pt-4 pb-5 text-black', {
            'pt-3.5': JSON.parse(data?.images)?.length == 0,
          })}
        >
          <div dangerouslySetInnerHTML={{ __html: data?.description }}></div>
        </div>
      </div>

      <div
        className={classNames(
          'w-full h-fit flex items-center justify-between border-b border-b-black/10 rounded-b-lg',
          {
            'bg-[var(--main-white-color)] px-3.5 py-2':
              !data?.isLikeDisabled || !data?.isCommentDisabled,
          }
        )}
      ></div>
    </div>
  );
}

export default FeedPostCard;
