import { Between, Is } from '../../../Constant/FilterOperator';
import { FilterFieldsTypeEnums } from '../../../enums/enums';
import { SearchBarFilterOptionsInterface } from '../../../interface/propsInterface';

export const MaintenanceModeQueryFilterArray: SearchBarFilterOptionsInterface[] =
  [
    {
      id: 'type',
      value: 'Type',
      label: (
        <div className='flex items-start'>
          <span className='icon-mail-05 text-gray-600 text-sm pe-2' />
          <span className='font-inter text-base text-black font-medium'>
            Type
          </span>
        </div>
      ),
      optionType: 'select',
      operator: [Is],
      options: [
        {
          label: 'manual',
          value: 'Manual',
          type: FilterFieldsTypeEnums[2],
        },
        {
          label: 'scheduled',
          value: 'Scheduled',
          type: FilterFieldsTypeEnums[2],
        },
      ],
    },
    {
      id: 'status',
      value: 'Status',
      label: (
        <div className='flex items-start'>
          <span className='icon-mail-05 text-gray-600 text-sm pe-2' />
          <span className='font-inter text-base text-black font-medium'>
            Status
          </span>
        </div>
      ),
      optionType: 'multi-select',
      operator: [Is],
      options: [
        {
          label: 'active',
          value: 'Active',
          type: FilterFieldsTypeEnums[2],
        },
        {
          label: 'scheduled',
          value: 'Scheduled',
          type: FilterFieldsTypeEnums[2],
        },
        {
          label: 'completed',
          value: 'Completed',
          type: FilterFieldsTypeEnums[2],
        },
        {
          label: 'cancelled',
          value: 'Cancelled',
          type: FilterFieldsTypeEnums[2],
        },
      ],
    },
    {
      id: 'starting_date',
      value: 'Starting Date',
      label: (
        <div className='flex items-start'>
          <span className='icon-mail-05 text-gray-600 text-sm pe-2' />
          <span className='font-inter text-base text-black font-medium'>
            Starting Date
          </span>
        </div>
      ),
      optionType: 'date',
      operator: [Is, Between],
      options: [],
    },
    {
      id: 'ending_date',
      value: 'Ending Date',
      label: (
        <div className='flex items-start'>
          <span className='icon-mail-05 text-gray-600 text-sm pe-2' />
          <span className='font-inter text-base text-black font-medium'>
            Ending Date
          </span>
        </div>
      ),
      optionType: 'date',
      operator: [Is, Between],
      options: [],
    },
  ];
