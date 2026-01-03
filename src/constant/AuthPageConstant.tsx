import { HiOutlineArrowRight } from 'react-icons/hi';

import { SignInPageFormDataInterface } from '../interface/AuthPageInterface';

export const AuthFormDataInitialState: SignInPageFormDataInterface = {
  email: '',
  password: '',
};

export const alertModalSuccessButtonArray = (link?: string) => [
  {
    buttonTitle: 'Go to Verification Page',
    showButton: true,
    classNames:
      'text-black text-base w-fit px-16 py-2 font-medium rounded-lg mx-auto',
    icon: <HiOutlineArrowRight className='text-lg' />,
    link: link,
    childClassName: 'flex-row-reverse',
  },
];

export const initialAlertModalPropsInfo = {
  success: false,
  protected: true,
  alertModalTitle: 'string',
  alertModelInfo: 'string',
  optionsButtonArray: alertModalSuccessButtonArray(),
};
