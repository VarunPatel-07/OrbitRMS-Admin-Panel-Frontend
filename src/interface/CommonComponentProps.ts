import { SetStateAction } from 'react';

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
  optionsButtonArray: Array<{
    buttonTitle: string;
    showButton: boolean;
    link?: string;
    classNames: string;
    childClassName: string;
    icon?: React.ReactElement | null;
    onclickFunction?: () => void;
  }>;
}

export interface AlertModalProps {
  ModalInfo: ModalInfoType;
  showAlertModal: boolean;
  setShowAlertModal: React.Dispatch<SetStateAction<boolean>>;
}
