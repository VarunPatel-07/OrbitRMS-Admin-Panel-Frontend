import React, { SetStateAction } from 'react';
import { Editor } from '@tiptap/react';

export interface ButtonProps {
  type?: 'button' | 'submit';
  children: React.ReactElement | string;
  className: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface InputProps {
  name: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'url' | 'checkbox';
  value?: string;
  setValue?: (value: string) => void;
  placeHolder?: string;
  className?: string;
  placeholderColor?: string;
  viewPasswordBtn?: boolean;
  showError?: boolean;
  errorMessage?: string;
  labelFieldName?: string;
  isRequiredField?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export interface LoginFormInterface {
  email: string;
  password: string;
}

export interface ModalInfoType {
  success: boolean;
  protected: boolean;
  alertModalTitle: string;
  alertModelInfo: string;
  optionsButtonArray?: OrganizationModalInfoType[];
  icon?: React.ReactElement | null;
}

export interface OrganizationManagerAlertModalInfoType {
  success: boolean;
  protected: boolean;
  alertModalTitle: string;
  alertModelInfo: string;
  id: string;
}

export interface OrganizationModalInfoType {
  buttonTitle: string;
  showButton: boolean;
  link?: string;
  classNames: string;
  childClassName: string;
  icon?: React.ReactElement | null;
  onclickFunction?: () => void;
}

export interface AlertModalProps {
  ModalInfo: ModalInfoType;
  showAlertModal: boolean;
  setShowAlertModal: React.Dispatch<SetStateAction<boolean>>;
  AlertIcon?: React.ReactElement;
}

export interface OrgManagerAlertModalProps {
  ModalInfo: OrganizationManagerAlertModalInfoType;
  showAlertModal: boolean;
  setShowAlertModal: React.Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  handelOnClickButton: (id: string) => void;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
}

export interface NotFoundPagesOptionsButtonArray {
  label: string;
  className: string;
  type: 'link' | 'button';
  link?: string;
  onClick?: () => void;
  icon?: React.ReactElement;
}

export interface NotFoundPageComponentPropsInterface {
  message: string;
  title: string;
  optionsButton: NotFoundPagesOptionsButtonArray[];
}

export interface RichTextEditorInterface {
  name: string;
  className?: string;
  cols?: number;
  rows?: number;
  value?: string;
  setValue?: React.Dispatch<SetStateAction<string>>;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  labelFieldName?: string;
  isRequiredField?: boolean;
  showError?: boolean;
  errorMessage?: string;

  handelOnUpdateFunction: (data: string) => void;
  onEditorReady?: (editor: Editor) => void;
  feedContent: string;
}

export interface TextAreaProps {
  name: string;
  className?: string;
  cols?: number;
  rows?: number;
  value?: string;
  setValue?: React.Dispatch<SetStateAction<string>>;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  labelFieldName?: string;
  isRequiredField?: boolean;
  showError?: boolean;
  errorMessage?: string;
  disabled?: boolean;
}

export interface commonDatePickerProps {
  selectedValue: Date | null;
  onChange: (date: Date | null) => void;
  labelFieldName?: string;
  isRequiredField?: boolean;
  name: string;
  className?: string;
  datePickerPosition?:
    | 'bottom'
    | 'bottom-end'
    | 'bottom-start'
    | 'left'
    | 'left-end'
    | 'left-start'
    | 'right'
    | 'right-end'
    | 'right-start'
    | 'top'
    | 'top-end'
    | 'top-start';
  showError?: boolean;
  errorMessage?: string;
  year?: number;
  disabled?: boolean;
  showTimeSelect?: boolean;
  minimumDate?: Date | undefined;
  maxTime?: Date | undefined;
  minTime?: Date | undefined;
}
