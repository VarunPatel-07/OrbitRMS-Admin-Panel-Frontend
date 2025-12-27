/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { MutableRefObject, SetStateAction } from 'react';
import axios, { AxiosError } from 'axios';
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';
import validator from 'validator';

const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;
const current_environment = import.meta.env.VITE_ENVIRONMENT;

export const classNames = (
  defaultClass: string,
  conditionBasedClass: { [keys: string]: boolean }
) => {
  return `${defaultClass} ${Object.keys(conditionBasedClass)
    .filter((key) => conditionBasedClass[key])
    .join(' ')}`;
};

export const isValidEmail = (
  email: string,
  host_blacklist: string[] = []
): boolean => {
  const isValid = validator.isEmail(email, { host_blacklist: host_blacklist });

  return isValid;
};

export const ErrorHandler = (error: Error | AxiosError) => {
  if (axios.isAxiosError(error)) {
    const errorData = {
      success: error?.response?.data?.detail?.success ?? false,
      message: error?.response?.data?.detail?.message ?? 'something went wrong',
      data: null,
    };

    return errorData;
  } else {
    const errorData = {
      success: false,
      message: 'An unknown error occurred',
      data: null,
    };

    return errorData;
  }
};

//  * To Store The Data In The LocalStorage And This Function Have A Default Argument That If The Environment Is Production Then All The Data Will Be Stored In Encrypted Formate.

export const storeDataInLocalStorage = (
  _data: any,
  key: string,
  encrypted: boolean = current_environment == 'PRODUCTION' ? true : false
) => {
  if (!key) {
    console.error('the key is required to store the data');

    return;
  }
  let dataToStore: string;

  if (encrypted) {
    _data = typeof _data == 'object' ? JSON.stringify(_data) : _data;
    dataToStore = CryptoJS.AES.encrypt(_data, encryptionKey).toString();
  } else {
    dataToStore = JSON.stringify(_data);
  }
  localStorage.setItem(key, dataToStore);
};

export const storeDataInSecureCookie = (
  _data: any,
  key: string,
  encrypted: boolean = current_environment == 'PRODUCTION' ? true : false
) => {
  if (!key) {
    console.error('the key is required to store the data');

    return;
  }
  let dataToStore: string;

  if (encrypted) {
    _data = typeof _data == 'object' ? JSON.stringify(_data) : _data;
    dataToStore = CryptoJS.AES.encrypt(_data, encryptionKey).toString();
  } else {
    dataToStore = JSON.stringify(_data);
  }
  Cookies.set(key, dataToStore, {
    secure: true,
    sameSite: 'strict',
    expires: 7,
  });
};

export const getDataFromSecureCookie = (
  key: string,
  encrypted: boolean = current_environment == 'PRODUCTION' ? true : false
): any | null => {
  try {
    const cookieStorageData = Cookies.get(key);

    if (!cookieStorageData) return null;

    if (encrypted) {
      if (!encryptionKey)
        throw new Error('Encryption key is required for decryption');
      const decryptedData = CryptoJS.AES.decrypt(
        cookieStorageData,
        encryptionKey
      ).toString(CryptoJS.enc.Utf8);

      if (key != 'adminAuthenticationToken') {
        return JSON.parse(decryptedData);
      } else {
        return decryptedData;
      }
    }

    return JSON.parse(cookieStorageData);
  } catch (error) {
    console.error(`Error reading from localStorage (key: ${key}):`, error);

    return null;
  }
};

//  * To Handel The Error From The One Place.

export const getDataFromLocalStorage = (
  key: string,
  encrypted: boolean = current_environment == 'PRODUCTION' ? true : false
): any | null => {
  try {
    const localStorageData = localStorage.getItem(key);

    if (!localStorageData) return null;

    if (encrypted) {
      if (!encryptionKey)
        throw new Error('Encryption key is required for decryption');
      const decryptedData = CryptoJS.AES.decrypt(
        localStorageData,
        encryptionKey
      ).toString(CryptoJS.enc.Utf8);

      if (key != 'adminAuthenticationToken') {
        return JSON.parse(decryptedData);
      } else {
        return decryptedData;
      }
    }

    return JSON.parse(localStorageData);
  } catch (error) {
    console.error(`Error reading from localStorage (key: ${key}):`, error);

    return null;
  }
};
export const removeDataFromLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};
// * to clear local storage all the value form it
export const clearLocalSessionStorage = () => {
  localStorage.clear();
  sessionStorage.clear();
};

export const clearCookieStorage = () => {
  const allCookie = Cookies.get();

  Object.keys(allCookie).forEach((cookie) => {
    Cookies.remove(cookie);
  });
};

export const storeDataInSessionStorage = (
  _data: any,
  key: string,
  encrypted: boolean = current_environment == 'PRODUCTION' ? true : false
) => {
  if (!key) {
    console.error('the key is required to store the data');

    return;
  }
  let dataToStore: string;

  if (encrypted) {
    _data = typeof _data == 'object' ? JSON.stringify(_data) : _data;
    dataToStore = CryptoJS.AES.encrypt(_data, encryptionKey).toString();
  } else {
    dataToStore = JSON.stringify(_data);
  }
  sessionStorage.setItem(key, dataToStore);
};

export const getDataFromTheSessionStorage = (
  key: string,
  encrypted: boolean = current_environment == 'PRODUCTION' ? true : false
) => {
  const sessionStorageData = sessionStorage.getItem(key);

  if (!sessionStorageData) return null;
  if (encrypted) {
    if (!encryptionKey)
      throw new Error('Encryption key is required for decryption');
    const decryptedData = CryptoJS.AES.decrypt(
      sessionStorageData,
      encryptionKey
    ).toString(CryptoJS.enc.Utf8);

    if (key != 'adminAuthenticationToken') {
      return JSON.parse(decryptedData);
    } else {
      return decryptedData;
    }
  }

  return JSON.parse(sessionStorageData);
};

export const MaxLimitCountDownTimeFormatter = (ms: number): string => {
  if (!ms || isNaN(ms)) return '00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');

  return `${minutes}:${seconds}`;
};

export const formateDate = (
  UTCString: string,
  default_dateformat: string,
  showTime: boolean = true
): string => {
  const date = new Date(UTCString?.endsWith('Z') ? UTCString : UTCString + 'Z');
  const year = date.getFullYear();
  const twoDigitYear = year % 100;
  const month = date.getMonth(); // 0-based
  const day = date.getDate();

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const replacements: Record<string, string> = {
    YYYY: `${year}`,
    MMM: monthNames[month],
    YY: twoDigitYear <= 9 ? `0${twoDigitYear}` : `${twoDigitYear}`,
    MM: month + 1 <= 9 ? `0${month + 1}` : `${month + 1}`,
    Y: `${year}`,
    DD: day <= 9 ? `0${day}` : `${day}`,
    D: `${day}`,
    M: `${month + 1}`,
  };

  // Replace tokens in order from longest to shortest to avoid partial replacements
  const tokenOrder = ['YYYY', 'MMM', 'YY', 'MM', 'Y', 'DD', 'D', 'M'];

  let formattedDate = default_dateformat;

  for (const token of tokenOrder) {
    // Replace exact tokens only (use \b boundaries or match whole token)
    const regex = new RegExp(`\\b${token}\\b`, 'g');

    formattedDate = formattedDate.replace(regex, replacements[token]);
  }

  if (showTime) {
    const creationTime = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    formattedDate += `, ${creationTime.toUpperCase()}`;
  }

  return formattedDate;
};

export const convertToTitleCase = (field_name: string) => {
  return field_name
    ?.split('_')
    .map(
      (word) =>
        word?.charAt(0)?.toUpperCase() + word?.slice(1)?.toLocaleLowerCase()
    )
    .join(' ');
};

export const handleCountDownFunction = (
  utcString: string,
  intervalRef: MutableRefObject<ReturnType<typeof setInterval> | null>,
  setCountDown: React.Dispatch<SetStateAction<number>>,
  LOCAL_DATA_STRING: string
) => {
  // Clear existing interval if any
  if (intervalRef?.current) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }

  // Start new countdown interval
  intervalRef.current = setInterval(() => {
    const expiryDate = new Date(utcString);
    const currentDate = new Date();
    const difference = expiryDate.getTime() - currentDate.getTime();

    if (difference <= 0) {
      setCountDown(0);
      removeDataFromLocalStorage(LOCAL_DATA_STRING);
      clearInterval(intervalRef.current!);
      intervalRef.current = null;
    } else {
      setCountDown(difference);
    }
  }, 1000);
};

export const NormalizeStringifiedArray = (value: string) => {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed; // return the parsed array
    }

    return null;
  } catch {
    return null;
  }
};

export const isRichTextEditorIsEmpty = (htmlString: string) => {
  const text = htmlString
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, '')
    .replace(/"/g, '')
    .trim();

  return text === '';
};

export const differenceBetweenDates = (next_date: string) => {
  const current_date = new Date();
  const nextDate = getUTCDateFormIsoString(next_date);

  return Math.abs(current_date.getTime() - nextDate.getTime()) / (1000 * 60);
};

export const isValidDateString = (dateString: string) => {
  const date = new Date(dateString);

  return !isNaN(date.getTime());
};

export const getUTCDateFormIsoString = (dateString: string): Date => {
  return new Date(dateString?.endsWith('Z') ? dateString : dateString + 'Z');
};

export const compareTwoNestedObject = (objOne: any, objTwo: any): boolean => {
  if (objOne === objTwo) return true;

  if (
    typeof objOne !== 'object' ||
    typeof objTwo !== 'object' ||
    objOne == null ||
    objTwo == null
  )
    return false;

  const objOneKeys = Object.keys(objOne);
  const objTwoKeys = Object.keys(objTwo);

  if (objOneKeys.length !== objTwoKeys.length) return false;

  for (const key of objOneKeys) {
    if (!objTwoKeys.includes(key)) return false;
    const valOne = objOne[key];
    const valTwo = objTwo[key];

    const areObjects =
      typeof valOne === 'object' &&
      valOne !== null &&
      typeof valTwo === 'object' &&
      valTwo !== null;

    if (areObjects) {
      if (!compareTwoNestedObject(valOne, valTwo)) return false;
    } else {
      if (valOne !== valTwo) return false;
    }
  }

  return true;
};

export const stripHtml = (html: string = '') =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const getRadianAngle = (rotation: number) => {
  return (rotation * Math.PI) / 180;
};

export const createImageUtilFunction = (url: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();

    img.src = url;
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
  });
};

export const getBoundingBox = (
  _width: number,
  _height: number,
  radian: number
) => {
  return {
    width:
      Math.abs(_width * Math.cos(radian)) +
      Math.abs(_height * Math.sin(radian)),
    height:
      Math.abs(_width * Math.sin(radian)) +
      Math.abs(_height * Math.cos(radian)),
  };
};

export const dataUrlToFileConvertor = (dataUrl: string, filename: string) => {
  const arr = dataUrl.split(',');
  const match = arr[0].match(/:(.*?);/);
  const mime = match ? match[1] : 'application/octet-stream';

  const correctedFilename =
    filename.endsWith('.png') && mime !== 'image/png'
      ? filename.replace('.png', '.jpeg')
      : filename;

  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], correctedFilename, { type: mime });
};

export const generateTimeBasedGreeting = (): string => {
  const date = new Date();
  const time = date?.getHours();

  if (time >= 5 && time < 12) return 'Good Morning';
  if (time >= 12 && time < 16) return 'Good Afternoon';
  if (time >= 16 && time < 20) return 'Good Evening';

  return 'Good Night';
};

export const bytesToSize = (bytes: number, decimal: number = 2): string => {
  if (bytes === 0) return `0 Bytes`;

  const k = 1024;
  const decimalVal = decimal < 0 ? 0 : decimal;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(decimalVal)) + ' ' + sizes[i]
  );
};
