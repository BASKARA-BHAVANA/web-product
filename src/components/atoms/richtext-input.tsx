'use client';

import 'react-quill-new/dist/quill.snow.css';
import { useRef } from 'react';
import dynamic from 'next/dynamic';
import type ReactQuill from 'react-quill-new';
import { Label } from './label';

const QuillWrapper = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill-new');
    // eslint-disable-next-line react/display-name
    return ({ ...props }) => <RQ {...props} />;
  },
  {
    ssr: false,
  }
) as typeof ReactQuill;

type Props = {
  label?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
};

const RichTextInput = ({ label, error, value, onChange }: Props) => {
  const quillRef = useRef<ReactQuill | null>(null);

  const modules = {
    toolbar: {
      container: [
        [{ font: [] }],
        [{ size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ header: 1 }, { header: 2 }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
        ['link'],
        ['clean'],
      ],
    },
  };

  return (
    <div className="grid items-center gap-1.5">
      {label && <Label>{label}</Label>}
      <QuillWrapper
        ref={quillRef}
        value={value}
        onChange={onChange}
        modules={modules}
        theme="snow"
      />
      {error && <small className="text-destructive">{error}</small>}
    </div>
  );
};

export default RichTextInput;
