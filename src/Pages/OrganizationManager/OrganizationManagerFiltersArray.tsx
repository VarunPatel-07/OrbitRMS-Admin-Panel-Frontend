import { CountryDataForSearch } from '../../Constant/CountryData';
import {
  Contains,
  EndsWith,
  Equals,
  Is,
  StartsWith,
} from '../../Constant/FilterOperator';
import { FilterFieldsTypeEnums } from '../../enums/enums';
import { SearchBarFilterOptionsInterface } from '../../interface/propsInterface';

export const OrganizationManagerFiltersArray: SearchBarFilterOptionsInterface[] =
  [
    {
      id: 'organization_name',
      value: 'Organization Name',
      label: (
        <div className='flex items-start'>
          <span className='icon-mail-05 text-gray-600 text-sm pe-2' />
          <span className='font-inter text-base text-black font-medium'>
            Organization Name
          </span>
        </div>
      ),
      optionType: 'text',
      operator: [Equals, Contains, StartsWith, EndsWith],
      options: [], // No options for text filters
    },
    {
      id: 'primary_email',
      value: 'Primary Email',
      label: (
        <div className='flex items-start'>
          <span className='icon-mail-05 text-gray-600 text-sm pe-2' />
          <span className='font-inter text-base text-black font-medium'>
            Primary Email
          </span>
        </div>
      ),
      optionType: 'text',
      operator: [Equals, Contains, StartsWith, EndsWith],
      options: [], // No options for text filters
    },
    {
      id: 'primary_number',
      value: 'Primary Number',
      label: (
        <div className='flex items-start'>
          <span className='icon-mail-05 text-gray-600 text-sm pe-2' />
          <span className='font-inter text-base text-black font-medium'>
            Primary Number
          </span>
        </div>
      ),
      optionType: 'text',
      operator: [Equals, Contains, StartsWith, EndsWith],
      options: [], // No options for text filters
    },
    {
      id: 'meta_verified',
      value: 'Meta',
      label: (
        <div className='flex items-start'>
          <span className='icon-user text-gray-600 text-lg pe-2' />
          <span className='font-inter text-base text-black font-medium'>
            Meta
          </span>
        </div>
      ),
      optionType: 'select',
      operator: [Is],
      options: [
        {
          label: 'verified',
          value: 'Verified',
          type: FilterFieldsTypeEnums[2],
        },
        {
          label: 'not_verified',
          value: 'Not Verified',
          type: FilterFieldsTypeEnums[2],
        },
      ], // No options for text filters
    },
    {
      id: 'email_verified',
      value: 'Email',
      label: (
        <div className='flex items-start'>
          <span className='icon-user text-gray-600 text-lg pe-2' />
          <span className='font-inter text-base text-black font-medium'>
            Email
          </span>
        </div>
      ),
      optionType: 'select',
      operator: [Is],
      options: [
        {
          label: 'verified',
          value: 'Verified',
          type: FilterFieldsTypeEnums[2],
        },
        {
          label: 'not_verified',
          value: 'Not Verified',
          type: FilterFieldsTypeEnums[2],
        },
      ], // No options for text filters
    },
    {
      id: 'country',
      value: 'Country',
      label: (
        <div className='flex items-start'>
          <span className='icon-user text-gray-600 text-lg pe-2' />
          <span className='font-inter text-base text-black font-medium'>
            Country
          </span>
        </div>
      ),
      optionType: 'multi-select',
      operator: [Is],
      options: CountryDataForSearch, // No options for text filters
    },
  ];
