import { BreadcrumbsProps } from '../interface/interface';
import {
  MaintenanceModeFormDataInterface,
  MaintenanceModeHistoryInterface,
  MaintenanceModeModalInfo,
} from '../interface/MaintenanceMode';

export const MaintenanceModeBreadCrumbObject: BreadcrumbsProps[] = [
  {
    name: 'dashboard',
    label: 'dashboard',
    link: `/orbitrms/dashboard`,
  },

  {
    name: 'Maintenance Mode',
    label: 'maintenance-mode',
    link: `/orbitrms/maintenance-mode`,
  },
];

export const MaintenanceModeHistoryBreadCrumbObject: BreadcrumbsProps[] = [
  {
    name: 'dashboard',
    label: 'dashboard',
    link: `/orbitrms/dashboard`,
  },
  {
    name: 'Maintenance Mode',
    label: 'maintenance-mode',
    link: `/orbitrms/maintenance-mode`,
  },
  {
    name: 'History',
    label: 'maintenance-mode-history',
    link: `/orbitrms/maintenance-mode/history`,
  },
];

export const MaintenanceModeFormData: MaintenanceModeFormDataInterface = {
  id: '',
  status: 'inActive',
  message: '',
  updated_at: '',
  updated_by: '',
  scheduler_info: {
    started_at: '',
    started_by: '',
    ended_at: '',
    ended_by: '',
    id: '',
  },
};

export const initialMaintenanceModeModalPropsInfo: MaintenanceModeModalInfo = {
  status: 'inActive',
  protected: true,
  alertModalTitle: 'string',
  alertModelInfo: 'string',
};

export const EditScheduledMaintenanceModeInitialData: MaintenanceModeHistoryInterface =
  {
    id: '',
    maintenance_mode_id: '',
    started_at: '',
    ended_at: '',
    started_by: '',
    ended_by: '',
    message: '',
    reason: '',
    status: 'active',
    type: 'manual',
    cancellation_reason: '',
    created_at: '',
    updated_at: '',
  };
