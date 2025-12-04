/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { MdOutlineDashboard } from 'react-icons/md';
import { Editor } from '@tiptap/react';
import * as tus from 'tus-js-client';

import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../Context/Notification/NotificationContextApi';
import {
  multipleDeleteApi,
  multipleFetchApi,
  multiplePostApi,
} from '../../Helper/api/multipleAPI';
import { generateTimeBasedGreeting } from '../../Helper/HelperFunction';
import { getCroppedImageBlob } from '../../Helper/ImageCropper';
import { ImageDownscaler } from '../../Helper/ImageDownscaler';
import { useDebounce } from '../../Hooks/useDebounce';
import {
  AddEditPostFormdataInterface,
  cloudSignDataInterface,
  FeedPostDataPropsInterface,
} from '../../interface/Dashboard';
import { CloudinaryUploadResult } from '../../interface/interface';
import { endpointObject } from '../../interface/propsInterface';
import Feed from './Feed';

const AddEditPostModal = React.lazy(
  () => import('../../Components/Modal/AddEditPostModal')
);

const DeleteModal = React.lazy(
  () => import('../../Components/Modal/DeleteModal')
);

const initialData: AddEditPostFormdataInterface = {
  description: '',
  new_images: [],
  isCommentDisabled: false,
  isLikeDisabled: false,
  existing_images: [],
  likes: [],
};

function Dashboard() {
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const useEffectReference = useRef(false);

  const editorRef = useRef<Editor | null>(null);

  const [showAddEditPostModal, setShowAddEditPostModal] =
    useState<boolean>(false);

  const [feedPostData, setFeedPostData] = useState<
    FeedPostDataPropsInterface[]
  >([]);

  const [formData, setFormData] =
    useState<AddEditPostFormdataInterface>(initialData);
  const [formSubmitLoader, setFormSubmitLoader] = useState<boolean>(false);
  const [feedPostLoader, setFeedPostLoader] = useState<boolean>(true);
  const [editPostId, setEditPostId] = useState<string>('');
  const [type, setType] = useState<'add' | 'edit'>('add');
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deletePostId, setDeletePostId] = useState<string>('');

  const [uploadingPostFormData, setUploadingPostFormData] =
    useState<AddEditPostFormdataInterface>(initialData);
  const [stage, setStage] = useState<
    'parsing' | 'uploading' | 'processing' | 'done'
  >('parsing');
  const [progress, setProgress] = useState(0);
  //
  //
  // * The Api That Help To Delete a Specific Post
  //
  //
  //

  const deletePostWithDebounce = useDebounce(async () => {
    const endPointArr: endpointObject[] = [
      {
        endPoint: `organization-updates/delete-post?id=${deletePostId}`,
        protected: true,
      },
    ];
    const response = await multipleDeleteApi(endPointArr);
    const res = response[0];
    setIsDeleteLoading(false);

    if (res?.success) {
      setFeedPostLoader(true);
      setDeletePostId('');
      setShowDeleteModal(false);
      fetchTheFeedPostsWithDebounce();
    } else {
      handelNotification(res, 'top-right');
    }
  }, 100);

  const handelClickOnDeleteButton = (id: string) => {
    setDeletePostId(id);
    setShowDeleteModal(true);
  };

  //
  //
  // * The Api That Help To Fetch The Post Data
  //
  //
  //
  const fetchTheFeedPostsWithDebounce = useDebounce(async () => {
    const endPointArr: endpointObject[] = [
      {
        endPoint: `organization-updates/fetch-post?order=desc&field_name=created_at`,
        protected: true,
      },
    ];
    const response = await multipleFetchApi(endPointArr);
    const res = response[0];

    if (res?.success) {
      setFeedPostData(res?.data);
    } else {
      handelNotification(res, 'top-right');
    }
    setFeedPostLoader(false);
    setType('add');
    setEditPostId('');
  }, 100);

  //
  //
  //* The Api That Help To Fetch The Initial Data Like Data For The Holiday Card
  //
  //
  //

  //
  //
  //* The Api That Help To Post The Feed As Well As For The Editing
  //
  //
  //
  const CLOUDINARY_UPLOAD_URL = (cloudName: string) =>
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
  // -------------------------------
  // VIDEO UPLOAD FUNCTION (TUS)
  // -------------------------------
  const uploadVideoUsingTUS = (
    file: File,
    { cloud_name }: cloudSignDataInterface,
    onProgress: (bytesUploaded: number, bytesTotal: number) => void
  ) => {
    return new Promise((resolve, reject) => {
      const uploadData = new tus.Upload(file, {
        endpoint: CLOUDINARY_UPLOAD_URL(cloud_name),
        metadata: {
          filename: file.name,
          filetype: file.type,
        },
        uploadDataDuringCreation: true,
        chunkSize: 5 * 1024 * 1024,
        retryDelays: [0, 1000, 3000, 5000],
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
        onError: (error) => {
          console.error('Upload failed:', error);
          reject(error);
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          onProgress(bytesUploaded, bytesTotal);
        },
        onSuccess: () => {
          resolve(uploadData.url);
        },
      });
      uploadData.start();
    });
  };
  // -------------------------------
  // IMAGE UPLOAD FUNCTION
  // -------------------------------
  const uploadImageToCloudinary = (
    file: File,
    { cloud_name, api_key, signature, time_stamp }: cloudSignDataInterface,
    onProgress: (bytesUploaded: number, bytesTotal: number) => void
  ) => {
    const url = CLOUDINARY_UPLOAD_URL(cloud_name);
    const formData = new FormData();

    formData.append('file', file);
    formData.append('api_key', api_key);
    formData.append('timestamp', String(time_stamp));
    formData.append('signature', signature);
    formData.append('resource_type', 'auto');

    return new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(e.loaded, e.total);
        }
      };
      xhr.onerror = () => reject(new Error('Upload failed'));
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else reject(new Error(`Upload failed: ${xhr.status}`));
      };
      xhr.send(formData);
    });
  };

  const uploadImageVideoToCloud = async (
    data: AddEditPostFormdataInterface,
    cloudSignData: cloudSignDataInterface
  ) => {
    const { time_stamp, signature, api_key, cloud_name } = cloudSignData;

    const allFiles = [
      ...(data?.new_images || []).map((i) => i?.originalFile),
    ].filter(Boolean) as File[];

    const totalBytes = allFiles.reduce((acc, f) => acc + f.size, 0);
    let uploadedBytes = 0;
    const handleProgress = (bytesUploaded: number) => {
      const totalProgress =
        ((uploadedBytes + bytesUploaded) / totalBytes) * 100;

      setProgress(totalProgress * 100);
    };
    const uploadedMedia: any[] = [];
    for (const item of data?.new_images || []) {
      const file = item?.originalFile;
      if (!file) return;

      const isVideo = file.type.startsWith('video');

      if (isVideo) {
        setStage('uploading');

        const uploadedUrl = await uploadVideoUsingTUS(
          file,
          {
            cloud_name,
            api_key,
            signature,
            time_stamp,
          },
          handleProgress
        );
        uploadedBytes += file.size;

        uploadedMedia.push({ url: uploadedUrl, type: 'video' });
      } else {
        setStage('uploading');

        let processedFile: File;
        if (file.size > 10 * 1024 * 1024) {
          processedFile = await ImageDownscaler(file, 10);
        } else {
          processedFile = file;
        }

        const blob = await getCroppedImageBlob(
          processedFile,
          item.croppedArea,
          item?.rotation
        );

        processedFile = new File([blob], file.name, { type: file.type });

        const uploadedUrl = await uploadImageToCloudinary(
          processedFile,
          {
            cloud_name,
            api_key,
            signature,
            time_stamp,
          },
          handleProgress
        );
        uploadedBytes += processedFile.size;

        if (uploadedUrl) {
          uploadedMedia.push({
            url: uploadedUrl.secure_url,
            type: uploadedUrl.resource_type || 'image',
          });
        }
      }
      for (const img of data?.existing_images || []) {
        uploadedMedia.push({ url: img, type: 'image' });
      }
    }
    return uploadedMedia;
  };

  const handelUploadPostWithDebounce = useDebounce(
    async (
      data: AddEditPostFormdataInterface,
      uploadImages: [{ type: 'image' | 'video'; url: string }]
    ) => {
      const multipartFormData = new FormData();
      multipartFormData.append('description', data.description);
      uploadImages?.map((item) => {
        if (item?.type == 'image')
          multipartFormData.append('images', item?.url);
        if (item?.type == 'video')
          multipartFormData.append('videos', item?.url);
      });
      formData?.existing_images.map((item) => {
        multipartFormData.append('images', item);
      });

      multipartFormData.append(
        'isCommentDisabled',
        String(data.isCommentDisabled)
      );
      multipartFormData.append('isLikeDisabled', String(data.isLikeDisabled));
      const multipartHeader = {
        'Content-Type': 'multipart/form-data',
      };

      const endPointArr: endpointObject[] = [
        {
          endPoint:
            type == 'add'
              ? `organization-updates/add-edit?type=${type}`
              : `organization-updates/add-edit?type=${type}&id=${editPostId}`,
          protected: true,
          data: multipartFormData,
          header: multipartHeader,
        },
      ];

      const response = await multiplePostApi(endPointArr);
      const res = response[0];
      handelNotification(res, 'top-right');

      if (res?.success) {
        setShowAddEditPostModal(false);
        setFormData(initialData);
        editorRef.current?.commands.clearContent();
        setStage('done');
        setProgress(100);
        setTimeout(() => {
          setUploadingPostFormData(initialData);
        }, 500);
        setTimeout(() => {
          setFeedPostLoader(true);
          fetchTheFeedPostsWithDebounce();
        }, 800);
      }
    },
    100
  );

  const handelSubmitApiCallingWithDebounce = useDebounce(async () => {
    const endPointArr: endpointObject[] = [
      {
        endPoint: 'upload/cloud/signature',
        protected: true,
      },
    ];

    const response = await multiplePostApi(endPointArr);
    const res = response[0];
    if (res?.success) {
      setFormSubmitLoader(false);
      setShowAddEditPostModal(false);
      setStage('parsing');
      editorRef.current?.commands.clearContent();

      setUploadingPostFormData(formData);

      const responseData = await uploadImageVideoToCloud(formData, res.data);
      if (responseData) {
        setStage('processing');
        setProgress(100);
        handelUploadPostWithDebounce(formData, responseData);
      }
      setFormData(initialData);
    }
  }, 100);

  const editPostHandler = (feedData: FeedPostDataPropsInterface) => {
    setType('edit');
    setEditPostId(feedData?.id);
    setShowAddEditPostModal(true);
    setFormData({
      description: feedData?.description,
      existing_images: feedData?.images ? JSON.parse(feedData?.images) : [],
      isCommentDisabled: feedData?.isCommentDisabled,
      isLikeDisabled: feedData?.isLikeDisabled,
      new_images: [],
      likes: [],
    });
  };

  const handleEditorReady = (editor: Editor) => {
    editorRef.current = editor;
  };

  const handelCancelButton = () => {
    setShowAddEditPostModal(false);
    setFormData(initialData);
  };

  const handelDeleteItem = () => {
    setIsDeleteLoading(true);
    deletePostWithDebounce();
  };

  useEffect(() => {
    if (useEffectReference.current) return;
    useEffectReference.current = true;

    fetchTheFeedPostsWithDebounce();
  }, [fetchTheFeedPostsWithDebounce]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (
        uploadingPostFormData?.description !== '' ||
        uploadingPostFormData?.new_images?.length > 0 ||
        uploadingPostFormData?.existing_images?.length > 0
      ) {
        event.preventDefault();
        // Standard message ignored by most browsers, but required for the popup
        event.returnValue = '';
      }
    };

    if (
      uploadingPostFormData?.description !== '' ||
      uploadingPostFormData?.new_images?.length > 0 ||
      uploadingPostFormData?.existing_images?.length > 0
    ) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    } else {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [uploadingPostFormData]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <>
      <div className='w-full h-full bg-transparent overflow-hidden'>
        <div className='w-full h-full flex items-stretch justify-between overflow-hidden'>
          <div className='flex-grow w-1/2'>
            <div className='w-full  flex items-stretch justify-between px-3.5 py-3 border-b border-b-black/15 h-[60px] bg-white'>
              <p className='text-base text-wrap text-black font-inter font-semibold flex items-center justify-start gap-1'>
                <span>{generateTimeBasedGreeting()},</span>
                <span>Orbit Admin</span>
              </p>
              <button className='text-black text-base px-2 border border-black/15 rounded-md hover:bg-gray-100'>
                <MdOutlineDashboard className='text-2xl' />
              </button>
            </div>
          </div>
          <div className='w-1/2 max-w-[550px] bg-white min-w-[200px] h-full border-l border-l-black/15'>
            <Feed
              setShowAddEditPostModal={setShowAddEditPostModal}
              feedPostData={feedPostData}
              setFeedPostData={setFeedPostData}
              loading={feedPostLoader}
              editPostHandler={editPostHandler}
              handelClickOnDeleteButton={handelClickOnDeleteButton}
              progress={progress}
              stage={stage}
              uploadingPostFormData={uploadingPostFormData}
            />
          </div>
        </div>
      </div>
      <AddEditPostModal
        showAddEditPostModal={showAddEditPostModal}
        handelOnSubmit={handelSubmitApiCallingWithDebounce}
        onEditorReady={handleEditorReady}
        formData={formData}
        setFormData={setFormData}
        loading={formSubmitLoader}
        setLoading={setFormSubmitLoader}
        handelCancelButton={handelCancelButton}
      />
      <DeleteModal
        loading={isDeleteLoading}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        handelDelete={handelDeleteItem}
        name='Post'
      />
    </>
  );
}

export default Dashboard;
