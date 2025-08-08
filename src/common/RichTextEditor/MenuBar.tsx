import { useEffect, useRef, useState } from 'react';
import { BiFontFamily } from 'react-icons/bi';
import { Editor } from '@tiptap/react';
import tippy from 'tippy.js';

import './editor.css';

import { FaLink } from 'react-icons/fa';
import { FaLinkSlash } from 'react-icons/fa6';
import { RiFontSizeAi } from 'react-icons/ri';
import { Instance } from 'tippy.js';

import { classNames } from '../../Helper/HelperFunction';
import { RichTextEditorMenuProps } from '../../interface/CommonComponentProps';
import {
  EditorMenuDefaultFontFamilyArray,
  EditorMenuDefaultHeadingItemArray,
  EditorMenuDefaultMenuItem,
} from './EditorMenuItemArray';

function MenuBar({ editor }: { editor: Editor | null }) {
  const linkButtonRef = useRef<HTMLButtonElement>(null);
  const tippyInstance = useRef<Instance | null>(null);

  const FontFamilyDropDownRef = useRef<HTMLDivElement>(null);
  const FontTextDropDownArray = useRef<HTMLDivElement>(null);

  // State Definition For The FontFamily Drop Down
  const [showFontFamilyDropDown, setShowFontFamilyDropDown] =
    useState<boolean>(false);
  const [showFontTextDropDown, setShowFontTextDropDown] =
    useState<boolean>(false);

  useEffect(() => {
    const handelClickOutSideTheBox = (event: MouseEvent) => {
      if (
        FontFamilyDropDownRef.current &&
        !FontFamilyDropDownRef.current.contains(event.target as Node)
      ) {
        setShowFontFamilyDropDown(false);
      }
    };
    document.addEventListener('mousedown', handelClickOutSideTheBox);
    return () => {
      document.removeEventListener('mousedown', handelClickOutSideTheBox);
    };
  }, []);

  useEffect(() => {
    const handelClickOutSideTheBox = (event: MouseEvent) => {
      if (
        FontTextDropDownArray.current &&
        !FontTextDropDownArray.current.contains(event.target as Node)
      ) {
        setShowFontTextDropDown(false);
      }
    };
    document.addEventListener('mousedown', handelClickOutSideTheBox);
    return () => {
      document.removeEventListener('mousedown', handelClickOutSideTheBox);
    };
  }, []);
  if (!editor) return null;

  const handelSetLinkFunction = () => {
    if (!linkButtonRef.current) return;
    if (tippyInstance.current) {
      tippyInstance.current.destroy();
    }
    const previewUrl = editor?.getAttributes('link').href;
    let url = previewUrl || '';

    const popoverWrapper = document.createElement('div');
    popoverWrapper.className =
      'p-2 flex flex-col gap-2 shadow-xl min-w-[200px]';

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = url;
    inputField.placeholder = 'Enter URL...';
    inputField.autofocus = true;
    inputField.className =
      'border border-black/45 bg-transparent rounded w-full text-black py-1 px-2 outline-0 resize-none focus:right-0 focus:outline-none focus:outline-2 focus:outline-[rgba(215,139,159,0.2)] focus:border-[var(--them-pink-color)] text-sm';

    const buttonWarper = document.createElement('div');
    buttonWarper.className =
      'w-full grid grid-cols-2 gap-3 border-t border-t-black/20 pt-2 items-center justify-center';

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.className =
      'bg-[var(--them-green-color)] rounded text-white font-inter px-2 py-1 text-sm';

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.className =
      'bg-white border border-black/20 rounded text-black font-inter px-2 py-1 text-sm';

    buttonWarper.appendChild(submitButton);
    buttonWarper.appendChild(removeButton);

    popoverWrapper.appendChild(inputField);

    popoverWrapper.appendChild(buttonWarper);

    tippyInstance.current = tippy(linkButtonRef.current, {
      content: popoverWrapper,
      trigger: 'manual',
      interactive: true,
      placement: 'bottom',
      theme: 'light',
      arrow: false,
      onShow() {
        inputField.focus();
      },
    });

    // Show the popover
    tippyInstance.current.show();

    // Handle apply action
    const handleApply = () => {
      url = inputField.value.trim();

      if (url === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
      } else {
        try {
          editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: url })
            .run();
        } catch (e) {
          console.error(e);
        }
      }
      tippyInstance.current?.hide();
    };

    // Handle remove action
    const handleRemove = () => {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      tippyInstance.current?.hide();
    };

    // Handle key events
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleApply();
      } else if (e.key === 'Escape') {
        tippyInstance.current?.hide();
      }
    };

    inputField.addEventListener('keydown', handleKeyDown);
    submitButton.addEventListener('click', handleApply);
    removeButton.addEventListener('click', handleRemove);

    // Cleanup event listeners when popover is hidden
    const cleanUp = () => {
      inputField.removeEventListener('keydown', handleKeyDown);
      submitButton.removeEventListener('click', handleApply);
      removeButton.removeEventListener('click', handleRemove);
    };

    tippyInstance.current.setProps({
      onHidden() {
        cleanUp();
        tippyInstance.current?.destroy();
        tippyInstance.current = null;
      },
    });
  };

  const MenuItems = EditorMenuDefaultMenuItem(editor);
  const HeadingItemArray = EditorMenuDefaultHeadingItemArray(editor);
  const FontFamilyArray = EditorMenuDefaultFontFamilyArray(editor);

  const RenderMenuItemButton = (
    index: number,
    item: RichTextEditorMenuProps,
    className?: string
  ) => {
    return (
      <button
        key={index}
        onClick={item.onClick}
        className={classNames(
          `p-2 border border-black/20 rounded-md transition-all ${className}`,
          {
            'bg-black text-white': item?.isActive,
            'hover:bg-black/10 text-black': !item?.isActive,
          }
        )}
      >
        {item.icon ? item?.icon : item?.name}
      </button>
    );
  };

  const fontSizesArray = Array.from({ length: 100 }, (_, i) => `${1 + i}px`);

  return (
    <div className='control-group'>
      <div className='button-group flex flex-wrap items-center justify-start gap-2 border-b border-b-black/20 p-2 rounded-t-lg'>
        {[...MenuItems, ...HeadingItemArray].map((item, index) =>
          RenderMenuItemButton(index, item)
        )}

        <div className='relative'>
          <button
            onClick={() => {
              setShowFontTextDropDown(!showFontTextDropDown);
            }}
            className={classNames(
              'p-2 border border-black/20 rounded-md transition-all',
              {
                'bg-black text-white': editor.isActive('link'),
                'hover:bg-black/10 text-black': !editor.isActive('link'),
              }
            )}
          >
            <RiFontSizeAi className='text-xl font-bold' />
          </button>
          <div
            ref={FontTextDropDownArray}
            className={classNames(
              'min-h-[200px] max-h-[250px] overflow-auto hide-scrollbar absolute top-full right-0 mt-2 mr-2 bg-white border border-black/30 rounded-lg shadow-xl z-30 origin-top p-1',
              {
                'opacity-0 scale-y-0 invisible': !showFontTextDropDown,
                'opacity-100 scale-100 visible': showFontTextDropDown,
              }
            )}
          >
            <div className='flex flex-col items-center justify-start gap-2'>
              {fontSizesArray?.map((size, index) => {
                const isActive = editor.isActive('textStyle', {
                  fontSize: size,
                });
                return (
                  <button
                    key={index}
                    onClick={
                      isActive
                        ? () => editor.chain().focus().unsetFontSize().run()
                        : () => editor.chain().focus().setFontSize(size).run()
                    }
                    className={classNames(
                      `p-2 text-sm rounded-md transition-all`,
                      {
                        'bg-black text-white': isActive,
                        'hover:bg-black/10 text-black': !isActive,
                      }
                    )}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        {/* <button
          onClick={() => editor.chain().focus().setFontSize('32px').run()}
          className={
            editor.isActive('textStyle', { fontSize: '32px' })
              ? 'is-active'
              : 'text-black'
          }
          data-test-id='32px'
        >
          Font size 32px
        </button> */}
        <div className='flex flex-wrap items-center justify-end gap-2 lg:ml-auto'>
          <button
            ref={linkButtonRef}
            onClick={handelSetLinkFunction}
            className={classNames(
              'p-2 border border-black/20 rounded-md transition-all',
              {
                'bg-black text-white': editor.isActive('link'),
                'hover:bg-black/10 text-black': !editor.isActive('link'),
              }
            )}
          >
            <FaLink className='text-lg' />
          </button>
          <button
            onClick={() => editor.chain().focus().unsetLink().run()}
            className={classNames(
              'p-2 border border-black/20 rounded-md transition-all text-black',
              {
                'hover:bg-black/10 text-black': false,
              }
            )}
          >
            <FaLinkSlash className='text-lg' />
          </button>
          <div className='relative'>
            <button
              onClick={() => {
                setShowFontFamilyDropDown(!showFontFamilyDropDown);
              }}
              className={classNames(
                'p-2 border border-black/20 rounded-md transition-all',
                {
                  'bg-black text-white': editor.isActive('link'),
                  'hover:bg-black/10 text-black': !editor.isActive('link'),
                }
              )}
            >
              <BiFontFamily className='text-xl font-bold' />
            </button>
            <div
              ref={FontFamilyDropDownRef}
              className={classNames(
                'min-w-[150px] min-h-[200px] max-h-[250px] overflow-auto hide-scrollbar absolute top-full right-0 mt-2 mr-2 bg-white border border-black/30 rounded-lg shadow-xl z-30 origin-top p-2',
                {
                  'opacity-0 scale-y-0 invisible': !showFontFamilyDropDown,
                  'opacity-100 scale-100 visible': showFontFamilyDropDown,
                }
              )}
            >
              <div className='flex flex-col items-center justify-start gap-2'>
                {FontFamilyArray.map((item, index) =>
                  RenderMenuItemButton(index, item, 'w-full py-1.5')
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuBar;
