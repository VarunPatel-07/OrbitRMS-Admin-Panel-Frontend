import { ReactElement } from 'react';
import { LuBuilding2 } from 'react-icons/lu';
import { MdSpaceDashboard } from 'react-icons/md';

export interface SidebarMenuItemInterface {
  id: number;
  name: string;
  label: string;
  icon: ReactElement;
  link: string;
  protected: boolean;
  showToolTip: boolean;
  ToolTipValue: string;
}

export const SidebarMenuItems = (
  organization: string
): SidebarMenuItemInterface[] => [
  {
    id: 1,
    name: 'Dashboard',
    icon: <MdSpaceDashboard className='w-6 h-6' />,
    label: 'data-tooltip-dashboard',
    link: `/${organization}/dashboard`,
    protected: true,
    showToolTip: true,
    ToolTipValue: 'Dashboard',
  },
  {
    id: 2,
    name: 'Organization Manager',
    icon: <LuBuilding2 className='w-6 h-6' />,
    label: 'data-tooltip-organization-manager',
    link: `/${organization}/organization-manager`,
    protected: true,
    showToolTip: true,
    ToolTipValue: 'Organization Manager',
  },
];
