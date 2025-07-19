/* eslint-disable @typescript-eslint/no-explicit-any */
import { SetStateAction } from 'react';
import axios from 'axios';

import { LoginFormInterface } from '../../interface/CommonComponentProps';
import { ErrorHandler, storeDataInSessionStorage } from '../HelperFunction';

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
      storeDataInSessionStorage(
        response?.data?.data?.authenticationToken,
        'authenticationToken'
      );
    }

    return response?.data;
  } catch (error: any) {
    return ErrorHandler(error);
  }
};
