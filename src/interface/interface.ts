import React, { SetStateAction } from 'react';
import { Area } from 'react-easy-crop';
import { Editor } from '@tiptap/react';

import { AddEditPostFormdataInterface } from './Dashboard';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface EmployeeProfilePictureInterface {
  width: number;
  height: number;
  profilePicture?: string;
  isLoading?: boolean;
}

export interface SelectedFileArrayObjInterface {
  id: string;
  file: File;
  croppedImagePreview: string;
  originalFile: File;
  croppedArea: Area;
  rotation: number;
}
export interface BreadcrumbsProps {
  label: string;
  name: string;
  link: string;
  target?: string;
  customIcon?: React.ReactNode;
}

export interface Column {
  key: string;
  childKey?: string;
  title: string | React.ReactElement;
  isSortable: boolean;
  isSticky: boolean;
  canToggleVisibility: boolean;
  align?: 'left' | 'center' | 'right';
  filterable?: boolean;
  renderContent: (data: any, childKeyData?: any) => React.ReactElement;
  // onSortColumn: () => void;
}

export interface InfoFieldProps {
  label: string;
  value: string | number | null | undefined;
  renderDate?: boolean;
  default_dateformat?: string;
  isLink?: boolean;
  renderTime?: boolean;
}
type InterFaceModuleLabelType =
  | 'employee_general_info'
  | 'personal_information'
  | 'employee_information'
  | 'personal_contact_information'
  | 'family_info'
  | 'address'
  | 'social_link'
  | 'organization_general_info'
  | 'organization_address'
  | 'organization_contact_info'
  | 'organization_about_info'
  | 'organization_organization_settings';
export interface InterFaceModuleData {
  label: InterFaceModuleLabelType;
  title: string;
  module: React.ReactElement;
  id: number;
}

export interface InterFaceModuleData {
  label: InterFaceModuleLabelType;
  title: string;
  module: React.ReactElement;
  id: number;
}

export interface ResetPasswordLinkModalInterface {
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  handelSubmit: (mail: string, callBack: (success: boolean) => void) => void;
  companyEmail: string;
  personalEmail: string;
  modelTitle?: string;
  waringTitle?: string;
  warningMessage?: string;
  hostBlacklistMails?: string[];
  showCustomInput?: boolean;
}

export interface CloudinaryUploadResult {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  original_filename: string;
}

export interface SelectedFileForCrop {
  id: string;
  file: File;
  previewUrl: string;
  croppedImagePreview: string;
  originalFile: File;
  croppedArea: Area;
  rotation: number;
}

export interface AddEditPostModalInterface {
  showAddEditPostModal: boolean;

  handelOnSubmit: () => void;
  onEditorReady?: (editor: Editor) => void;
  formData: AddEditPostFormdataInterface;
  setFormData: React.Dispatch<SetStateAction<AddEditPostFormdataInterface>>;
  loading: boolean;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
  handelCancelButton: () => void;
}

export interface RuntimeLogsFilesInterface {
  creation_time: string;
  file_name: string;
  file_path: string;
  size: number;
}

export interface MonitoringSidebarInterface {
  loading: boolean;
  availableLogFiles: RuntimeLogsFilesInterface[];
  setShowModal: React.Dispatch<SetStateAction<boolean>>;
  handelClickOnDownload: (
    file_name: string,
    file_path: string,
    bulkDownload?: boolean
  ) => void;
}

export interface DownloadBackupFilesInterface {
  showModal: boolean;
  setShowModal: React.Dispatch<SetStateAction<boolean>>;
}
export interface RenderFilesItemsInterface {
  loading: boolean;
  availableLogFiles: RuntimeLogsFilesInterface[];
  handelClickOnDownload: (
    file_name: string,
    file_path: string,
    bulkDownload?: boolean
  ) => void;
}
