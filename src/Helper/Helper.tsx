import { BsCheckCircle } from 'react-icons/bs';
import { MdOutlineDoNotDisturbOn } from 'react-icons/md';

import { OrganizationEmployeeStatusArray } from '../Constant/Constant';
import { InfoFieldProps } from '../interface/interface';
import { EmployeeStatusInterface } from '../interface/OrganizationManager';
import { classNames, formateDate } from './HelperFunction';

const AccountStatusColor: Record<string, string> = {
  Intern: 'bg-yellow-500',
  Trainee: 'bg-fuchsia-600',
  Probation: ' bg-indigo-600',
  Confirmed: 'bg-green-500',
};

const MaintenanceStatusColor: Record<string, string> = {
  scheduled: 'bg-yellow-50 text-yellow-700 border-yellow-700',
  active: 'bg-green-50 text-green-600 border-green-700',
  completed: 'bg-indigo-50 text-indigo-700 border-indigo-700',
  cancelled: 'bg-red-50 text-red-700 border-red-700',
};

const MaintenanceStatusColorBadge: Record<string, string> = {
  scheduled: 'bg-yellow-500',
  active: 'bg-green-700',
  completed: 'bg-indigo-700',
  cancelled: 'bg-red-700',
};

export const InfoField = ({
  label,
  value,
  renderDate = false,
  default_dateformat,
  isLink = false,
  renderTime = false,
}: InfoFieldProps) => (
  <div className='w-full'>
    {label?.trim() !== '' && (
      <span className='text-sm lg:text-base font-inter font-medium text-black pb-1 inline-block'>
        {label}
      </span>
    )}

    {isLink && typeof value == 'string' && (
      <a
        href={value}
        target='_blank'
        className='text-xs lg:text-sm text-blue-600 font-medium font-inter w-full text-ellipsis overflow-hidden text-nowrap inline-block'
      >
        {value || '-'}
      </a>
    )}

    {!isLink && (
      <>
        {renderDate && default_dateformat ? (
          <p className='text-xs lg:text-sm text-black/65 font-inter font-medium w-full text-ellipsis overflow-hidden text-nowrap'>
            {value
              ? formateDate(value as string, default_dateformat, renderTime)
              : '-'}
          </p>
        ) : (
          <p className='text-xs lg:text-sm text-black/65 font-medium font-inter w-full text-ellipsis overflow-hidden text-nowrap'>
            {value || '-'}
          </p>
        )}
      </>
    )}
  </div>
);

export const BeautifulAccountStatusRenderer = (
  status: EmployeeStatusInterface
): React.ReactNode => {
  if (OrganizationEmployeeStatusArray.includes(status)) {
    return (
      <span className='border border-black/15 rounded-lg px-2.5 py-1 flex items-center justify-between gap-2 w-fit'>
        <span
          className={`w-2 h-2 inline-block rounded-full ${AccountStatusColor[status]}`}
        ></span>
        <span className='text-sm text-black/60 font-inter font-medium'>
          {status}
        </span>
      </span>
    );
  } else {
    return (
      <span className='text-sm text-black/60 font-inter font-medium'>-</span>
    );
  }
};

export const AlertModalDefaultIcon = (success: boolean) => {
  return (
    <div className='w-[110px] h-[110px] relative'>
      <span
        className={classNames(
          'rounded-full flex items-center justify-center aspect-square w-[90px] h-[90px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1]',
          {
            'border-2 border-red-700/[0.1]': !success,
            'border-2 border-green-700/[0.1]': success,
          }
        )}
      ></span>
      <span
        className={classNames(
          'rounded-full flex items-center justify-center aspect-square w-[75px] h-[75px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2]',
          {
            'border-2 border-red-700/[0.25]': !success,
            'border-2 border-green-700/[0.25]': success,
          }
        )}
      ></span>
      <span
        className={classNames(
          'rounded-full flex items-center justify-center aspect-square w-[60px] h-[60px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[3]',
          {
            'border-2 border-red-700/[0.35]': !success,
            'border-2 border-green-700/[0.35]': success,
          }
        )}
      ></span>
      <span
        className={classNames(
          'rounded-full flex items-center justify-center aspect-square w-[45px] h-[45px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[4]',
          {
            'border-2 border-red-700/[0.6]': !success,
            'border-2 border-green-700/[0.6]': success,
          }
        )}
      ></span>
      {success ? (
        <BsCheckCircle className='text-green-700 w-7 h-7 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[5]' />
      ) : (
        <MdOutlineDoNotDisturbOn className='text-red-700 w-7 h-7 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[5]' />
      )}
    </div>
  );
};

export const RenderBeautifulMaintenanceStatus = (
  status: 'scheduled' | 'active' | 'completed' | 'cancelled'
) => {
  return (
    <span
      className={`border border-black/15 rounded-lg px-2.5 py-1 flex items-center justify-between gap-2 w-fit ${MaintenanceStatusColor[status]}`}
    >
      <span
        className={`w-2 h-2 inline-block rounded-full ${MaintenanceStatusColorBadge[status]}`}
      ></span>
      <span className='text-sm capitalize font-inter font-semibold'>
        {status}
      </span>
    </span>
  );
};
