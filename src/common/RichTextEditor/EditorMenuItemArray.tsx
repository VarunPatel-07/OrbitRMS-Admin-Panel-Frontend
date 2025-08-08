import { AiFillHighlight } from 'react-icons/ai';
import { FaBold, FaItalic, FaStrikethrough } from 'react-icons/fa';
import {
  MdFormatAlignCenter,
  MdFormatAlignJustify,
  MdFormatAlignLeft,
  MdFormatAlignRight,
} from 'react-icons/md';
import {
  PiTextHFiveBold,
  PiTextHFourBold,
  PiTextHOneBold,
  PiTextHSixBold,
  PiTextHThreeBold,
  PiTextHTwoBold,
} from 'react-icons/pi';
import { Editor } from '@tiptap/react';

import { RichTextEditorMenuProps } from '../../interface/CommonComponentProps';

export const EditorMenuDefaultMenuItem = (
  editor: Editor
): RichTextEditorMenuProps[] => [
  {
    icon: <FaBold className='text-lg' />,
    onClick: () => editor.chain().focus().toggleBold().run(),
    isActive: editor.isActive('bold'),
  },
  {
    icon: <FaItalic className='text-lg' />,
    onClick: () => editor.chain().focus().toggleItalic().run(),
    isActive: editor.isActive('italic'),
  },
  {
    icon: <FaStrikethrough className='text-lg' />,
    onClick: () => editor.chain().focus().toggleStrike().run(),
    isActive: editor.isActive('strike'),
  },
  {
    icon: <AiFillHighlight className='text-lg' />,
    onClick: () => editor.chain().focus().toggleHighlight().run(),
    isActive: editor.isActive('highlight'),
  },
  {
    icon: <MdFormatAlignLeft className='text-lg' />,
    onClick: () => editor.chain().focus().setTextAlign('left').run(),
    isActive: editor.isActive({ textAlign: 'left' }),
  },
  {
    icon: <MdFormatAlignCenter className='text-lg' />,
    onClick: () => editor.chain().focus().setTextAlign('center').run(),
    isActive: editor.isActive({ textAlign: 'center' }),
  },
  {
    icon: <MdFormatAlignRight className='text-lg' />,
    onClick: () => editor.chain().focus().setTextAlign('right').run(),
    isActive: editor.isActive({ textAlign: 'right' }),
  },
  {
    icon: <MdFormatAlignJustify className='text-lg' />,
    onClick: () => editor.chain().focus().setTextAlign('justify').run(),
    isActive: editor.isActive({ textAlign: 'justify' }),
  },
];

export const EditorMenuDefaultHeadingItemArray = (
  editor: Editor
): RichTextEditorMenuProps[] => [
  {
    icon: <PiTextHOneBold className='text-xl' />,
    onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: editor.isActive('heading', { level: 1 }) ?? false,
  },
  {
    icon: <PiTextHTwoBold className='text-xl' />,
    onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: editor.isActive('heading', { level: 2 }) ?? false,
  },
  {
    icon: <PiTextHThreeBold className='text-xl' />,
    onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: editor.isActive('heading', { level: 3 }) ?? false,
  },
  {
    icon: <PiTextHFourBold className='text-xl' />,
    onClick: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
    isActive: editor.isActive('heading', { level: 4 }) ?? false,
  },
  {
    icon: <PiTextHFiveBold className='text-xl' />,
    onClick: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
    isActive: editor.isActive('heading', { level: 5 }) ?? false,
  },
  {
    icon: <PiTextHSixBold className='text-xl' />,
    onClick: () => editor.chain().focus().toggleHeading({ level: 6 }).run(),
    isActive: editor.isActive('heading', { level: 6 }) ?? false,
  },
];

function createFontOption(
  editor: Editor,
  name: string,
  fontFamily: string
): RichTextEditorMenuProps {
  const isActive = editor.isActive('textStyle', { fontFamily });
  return {
    name,
    onClick: !isActive
      ? () => editor.chain().focus().setFontFamily(fontFamily).run()
      : () => editor.chain().focus().unsetFontFamily().run(),
    isActive,
  };
}

export const EditorMenuDefaultFontFamilyArray = (
  editor: Editor
): RichTextEditorMenuProps[] => [
  createFontOption(editor, 'Inter', 'Inter'),
  createFontOption(editor, 'Comic Sans', '"Comic Sans MS", "Comic Sans"'),
  createFontOption(editor, 'Serif', 'serif'),
  createFontOption(editor, 'Monospace', 'monospace'),
  createFontOption(editor, 'Cursive', 'cursive'),
  createFontOption(editor, 'Exo 2', '"Exo 2"'),
];
