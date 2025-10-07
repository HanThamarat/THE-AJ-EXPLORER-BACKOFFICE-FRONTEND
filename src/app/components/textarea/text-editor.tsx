import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface TextEditorProps {
    label?: string;
    onChange?: (e?: string) => void;
    value?: string;
}

export default function TextEditor({
    onChange,
    value,
    label
}: TextEditorProps) {

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'], // <-- add image tool here
      ['clean'],
    ],
  };

  return (
    <div className="w-full">
        {label && <span className="font-medium text-[12px]">{label}</span>}
        <ReactQuill 
            theme="snow" 
            value={value || ''}
            onChange={onChange} 
            modules={modules}
        />
    </div>
  );
}
