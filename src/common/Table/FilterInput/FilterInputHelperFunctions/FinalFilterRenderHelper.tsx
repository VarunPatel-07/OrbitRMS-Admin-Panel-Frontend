/* eslint-disable @typescript-eslint/no-explicit-any */
import { IoClose } from 'react-icons/io5';

import { FilterFieldsTypeEnums } from '../../../../enums/enums';
import {
  classNames,
  formateDate,
  isValidDateString,
} from '../../../../Helper/HelperFunction';
import { FilterObjectInterface } from '../../../../interface/propsInterface';

function FinalFilterRenderHelper({
  filterArray,
  background = 'bg-gray-100',
  handelClickOnDeleteBtn,
}: {
  filterArray: FilterObjectInterface[];
  background?: string;
  handelClickOnDeleteBtn?: (data: FilterObjectInterface) => void;
}) {
  return (
    <div className='w-fit py-1 pl-1 flex flex-nowrap gap-2 h-full'>
      {filterArray.map((arrayQuery, index) => (
        <div
          key={`${arrayQuery?.id}-${index}`}
          className={`${background} p-1 flex items-center justify-center rounded-md gap-2`}
        >
          <div className='flex items-center gap-1 h-full'>
            {arrayQuery?.moduleValue?.map((query, id) => {
              if (query.label === 'date' || isValidDateString(query?.label)) {
                let value: any = null;
                let isJson = false;

                try {
                  value = JSON.parse(query?.value);
                  isJson = typeof value === 'object' && value !== null;
                } catch {
                  isJson = false;
                }

                if (isJson) {
                  return (
                    <span
                      key={`query-${id}`}
                      className='flex items-center gap-1'
                    >
                      <span
                        className={classNames(
                          'bg-white border border-slate-300 rounded-md px-2 text-sm h-full flex items-center justify-center text-nowrap',
                          {
                            'font-medium text-black':
                              query?.type === FilterFieldsTypeEnums[0],
                            'text-black/80':
                              query?.type !== FilterFieldsTypeEnums[0],
                          }
                        )}
                      >
                        {formateDate(value.start_date, 'DD/MM/YYYY', false)}
                      </span>
                      <span
                        className={classNames(
                          'bg-white border border-slate-300 rounded-md px-2 text-sm h-full flex items-center justify-center text-nowrap',
                          {
                            'font-medium text-black':
                              query?.type === FilterFieldsTypeEnums[0],
                            'text-black/80':
                              query?.type !== FilterFieldsTypeEnums[0],
                          }
                        )}
                      >
                        To
                      </span>
                      <span
                        className={classNames(
                          'bg-white border border-slate-300 rounded-md px-2 text-sm h-full flex items-center justify-center text-nowrap',
                          {
                            'font-medium text-black':
                              query?.type === FilterFieldsTypeEnums[0],
                            'text-black/80':
                              query?.type !== FilterFieldsTypeEnums[0],
                          }
                        )}
                      >
                        {formateDate(value.end_date, 'DD/MM/YYYY', false)}
                      </span>
                    </span>
                  );
                } else {
                  return (
                    <span
                      key={`query-${id}`}
                      className={classNames(
                        'bg-white border border-slate-300 rounded-md px-2 text-sm h-full flex items-center justify-center text-nowrap',
                        {
                          'font-medium text-black':
                            query?.type === FilterFieldsTypeEnums[0],
                          'text-black/80':
                            query?.type !== FilterFieldsTypeEnums[0],
                        }
                      )}
                    >
                      {formateDate(query?.value, 'DD/MM/YYYY', false)}
                    </span>
                  );
                }
              } else {
                return (
                  <span
                    key={`query-${id}`}
                    className={classNames(
                      'bg-white border border-slate-300 rounded-md px-2 text-sm h-full flex items-center justify-center text-nowrap',
                      {
                        'font-medium text-black':
                          query?.type === FilterFieldsTypeEnums[0],
                        'text-black/80':
                          query?.type !== FilterFieldsTypeEnums[0],
                      }
                    )}
                  >
                    {query.value}
                  </span>
                );
              }
            })}
          </div>
          {handelClickOnDeleteBtn && (
            <button onClick={() => handelClickOnDeleteBtn(arrayQuery)}>
              <IoClose className='w-5 h-5 text-black' />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default FinalFilterRenderHelper;
