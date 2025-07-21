/* eslint-disable @typescript-eslint/no-explicit-any */
export interface endpointObject {
  endPoint: string;
  protected: boolean;
  data?: object;
  header?: object;
}
export interface URLObject {
  url: string;
  Method: 'GET' | 'POST';
  data?: object;
  header?: object;
}
export interface ApiReturnInterface {
  message: string;
  success: boolean;
  data?: any;
  metadata?: any;
  current_session_id?: string;
}
