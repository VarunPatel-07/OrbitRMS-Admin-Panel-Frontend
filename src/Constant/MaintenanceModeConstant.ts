import { BreadcrumbsProps } from '../interface/interface';
import {
  MaintenanceModeFormDataInterface,
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
};

export const initialMaintenanceModeModalPropsInfo: MaintenanceModeModalInfo = {
  status: 'inActive',
  protected: true,
  alertModalTitle: 'string',
  alertModelInfo: 'string',
};
