import React, { SetStateAction } from 'react';
import { Editor } from '@tiptap/react';

export interface MaintenanceModeDescriptionInterface {
  description: string;
  showError: boolean;
  onEditorReady: (editor: Editor) => void;
  setDescription: React.Dispatch<
    SetStateAction<MaintenanceModeFormDataInterface>
  >;
}

export interface MaintenanceModeAlertModalInterface {
  ModalInfo: MaintenanceModeModalInfo;
  showAlertModal: boolean;
  setShowAlertModal: React.Dispatch<SetStateAction<boolean>>;
  AlertIcon?: React.ReactElement;
  setMaintenanceModeReason: React.Dispatch<SetStateAction<string>>;
  maintenanceModeReason: string;
  showError: boolean;
  handelActiveDeactivateMaintenanceModeButton: () => void;
  handelClickOnCancelButton: () => void;
  loading: boolean;
  showReasonField: boolean;
  handelScheduleMaintenanceMode: () => void;
  scheduledMaintenanceStartEndDates: scheduledMaintenanceStartEndDatesInterface;
  setScheduledMaintenanceStartEndDates: React.Dispatch<
    SetStateAction<scheduledMaintenanceStartEndDatesInterface>
  >;
}

export interface MaintenanceModeFormDataInterface {
  id: string;
  status: 'active' | 'inActive' | 'scheduled';
  message: string;
  updated_at: string;
  updated_by: string;
}

export interface MaintenanceModeModalInfo {
  status: 'active' | 'inActive' | 'scheduled';
  protected: boolean;
  alertModalTitle: string;
  alertModelInfo: string;

  icon?: React.ReactElement | null;
}

export interface scheduledMaintenanceStartEndDatesInterface {
  started_at: Date | null;
  ended_at: Date | null;
}

export interface MaintenanceModeHistoryInterface {
  id: string;
  maintenance_mode_id: string;
  started_at: string;
  ended_at: string;
  started_by: string;
  ended_by: string;
  message: string;
  reason: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  type: 'manual' | 'scheduled';
  cancellation_reason: string;
}

export interface MaintenanceModeHistoryDetailsInterface {
  showMaintenanceModeHistoryDetails: boolean;
  setShowMaintenanceModeHistoryDetails: React.Dispatch<SetStateAction<boolean>>;
  data: MaintenanceModeHistoryInterface;
}

export interface EditScheduledMaintenanceModeInterface {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<SetStateAction<boolean>>;
  data: MaintenanceModeHistoryInterface;
  setData: React.Dispatch<
    SetStateAction<MaintenanceModeHistoryInterface | null>
  >;

  setMaintenanceModeReason: React.Dispatch<SetStateAction<string>>;
  maintenanceModeReason: string;
  showError: boolean;
  handelSubmitButton: (
    id: string,
    _data: MaintenanceModeHistoryInterface,
    type: 'cancellation' | 'editing'
  ) => void;
  loading: boolean;
}
