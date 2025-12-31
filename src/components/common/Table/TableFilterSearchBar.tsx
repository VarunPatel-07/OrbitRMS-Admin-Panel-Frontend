import clsx from 'clsx';

import {
  FilterObjectInterface,
  SearchBarFilterOptionsInterface,
  UrlEncodedFilterQueryInterface,
} from '../../../interface/propsInterface';
import Button from '../Button';
import FilterInput from './FilterInput/FilterInput';

interface TableFilterSearchBarInterface {
  filterColumnsArray: SearchBarFilterOptionsInterface[];
  handelApplyFilterFunc: (filterArray: FilterObjectInterface[]) => void;
  urlDecodedFilterQuery?: UrlEncodedFilterQueryInterface[];
  classNames?: string;
}

export default function TableFilterSearchBar(
  props: TableFilterSearchBarInterface
) {
  const {
    filterColumnsArray,
    handelApplyFilterFunc,
    urlDecodedFilterQuery,
    classNames,
  } = props;

  return (
    <div
      className={clsx(
        'p-2 bg-gray-200 w-full border border-black/5 border-t-0 border-b-0',
        classNames
      )}
    >
      <div className='flex items-start justify-between gap-2'>
        <div className='flex-grow max-w-[calc(100%-85px)] hide-scrollbar'>
          <FilterInput
            filterColumnsArray={filterColumnsArray}
            handelApplyFilterFunc={handelApplyFilterFunc}
            urlDecodedFilterQuery={urlDecodedFilterQuery}
          />
        </div>
        <div className='min-w-[82px]'>
          <Button
            type='button'
            className='font-inter font-semibold bg-[#EEF4FF] border border-[#C7D7FE] text-[#3538CD] text-base h-full px-5 py-2 rounded-lg capitalize'
            disabled
          >
            filter
          </Button>
        </div>
      </div>
    </div>
  );
}
