/* eslint-disable @typescript-eslint/no-explicit-any */
import { SetStateAction } from 'react';
import axios from 'axios';

import { LoginFormInterface } from '../../interface/CommonComponentProps';
import {
  clearLocalSessionStorage,
  ErrorHandler,
  getDataFromSecureCookie,
} from '../HelperFunction';

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASEURL;

const defaultHeader = {
  'Content-Type': 'application/json',
};

export const signInApiFunction = async (
  endpoint: string,
  data: LoginFormInterface,
  request_type: 'POST',
  setLoader: React.Dispatch<SetStateAction<boolean>>
) => {
  try {
    const url = `${BASE_URL}/${endpoint}`;

    const payload = {
      email: data?.email,
      password: data?.password,
    };

    const config = {
      method: request_type,
      url,
      headers: defaultHeader,
      data: payload,
    };
    const response = await axios(config);
    const res = response?.data;

    if (res?.success) {
      setLoader(true);
    }

    return response?.data;
  } catch (error: any) {
    return ErrorHandler(error);
  }
};

export const verifyUserApiFunction = async () => {
  try {
    const _cookieToken = getDataFromSecureCookie('adminAuthenticationToken');

    if (!_cookieToken) {
      return { success: false, message: 'User not authenticated' };
    }

    const url = `${BASE_URL}/auth/verify-user`;
    const config = {
      method: 'GET',
      url,
      headers: {
        ...defaultHeader,
        Authorization: `Bearer ${_cookieToken}`,
      },
    };

    const response = await axios(config);
    const res = response?.data;

    if (!res?.success) {
      window.location.href = '/auth/sign-in';
      clearLocalSessionStorage();
    }

    return res;
  } catch (error: any) {
    return ErrorHandler(error);
  }
};
