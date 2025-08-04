// updated icon

import { MaintenanceModeModalInfo } from '../../../interface/MaintenanceMode';

const DeactivateAlertModalDescription =
  'You are about to deactivate Maintenance Mode. Once disabled, all users will regain access to the platform. Ensure all maintenance tasks are complete before proceeding.';

const ActivateAlertModalDescription =
  'You are about to activate Maintenance Mode immediately. Once enabled, all non-admin users will be redirected to the maintenance page. This is typically used during critical updates, system checks, or administrative work.';

const ActivateAlertModalTitle = 'Activate Maintenance Mode Now?';

const DeactivateAlertModalTitle = 'Deactivate Maintenance Mode Now?';

const ScheduleActivateAlertModalTitle = 'Schedule Maintenance Mode Activation?';

const ScheduleActivateAlertModalDescription =
  'You are about to schedule Maintenance Mode to activate at a specified date and time. Once enabled, all non-admin users will be redirected to the maintenance page. This is useful for planned updates, system checks, or administrative tasks during off-peak hours.';

export const ActivatingMaintenanceModeObject = (
  status: 'active' | 'inActive' | 'scheduled'
): MaintenanceModeModalInfo => {
  return {
    status: status,
    protected: true,
    alertModalTitle:
      status == 'active' ? DeactivateAlertModalTitle : ActivateAlertModalTitle,
    alertModelInfo:
      status == 'active'
        ? DeactivateAlertModalDescription
        : ActivateAlertModalDescription,
  };
};

export const SchedulingMaintenanceModeObject = (
  status: 'active' | 'inActive' | 'scheduled'
): MaintenanceModeModalInfo => {
  return {
    status: status,
    protected: true,
    alertModalTitle: ScheduleActivateAlertModalTitle,
    alertModelInfo: ScheduleActivateAlertModalDescription,
  };
};
