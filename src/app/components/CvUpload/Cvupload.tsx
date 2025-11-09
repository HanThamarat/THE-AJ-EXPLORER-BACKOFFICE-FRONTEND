import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import UploadIcon from "@/app/assets/images/svg/upload-cloud.svg";
import { FaRegTrashAlt } from "react-icons/fa";
import { BASE64_CONVERTION } from "@/app/hook/baseCovert";

export interface FilePreview {
  id: string;
  file: File;
  preview: string;
}

export interface CvUploadComponentPropsType {
    label?: string;
    qty?: number;
    value?: FilePreview[]
    onChange?: (value: FilePreview[]) => void;
    description?: string;
}

const CvUploadComponent = ({
    value = [],
    qty = 1,
    label,
    onChange,
    description
}: CvUploadComponentPropsType) => {
    const [files, setFiles] = useState<FilePreview[]>(value);
    const [isDragging, setIsDragging] = useState(false);
     const fileInputRef = useRef<HTMLInputElement>(null); 

    useEffect(() => { 
        onChange?.(files);
    }, [files]);

  const handleFiles = useCallback(async (filesAccepted: File) => {
        const base64 = await BASE64_CONVERTION.toBase64(filesAccepted);
        const newFiles: FilePreview = {
            id: crypto.randomUUID(),
            file: filesAccepted,
            preview: base64,
        };
        setFiles((prev) => [...prev, newFiles].slice(0, qty));
       
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    Array.from(e.dataTransfer.files).forEach(handleFiles);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(handleFiles);
    }
  };

  const handleDelete = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="w-full flex flex-col gap-[2px]">
        { label && <span className="font-medium text-[12px]">{label} ({files.length}/{qty})</span> }
        <div className="w-full">
            {/* Drop Area */}
            <div
                className={`border-2 border-dashed rounded-lg py-[50px] px-[24px] text-center cursor-pointer transition ${
                isDragging ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleInputChange}
                />

                <div className="flex flex-col items-center justify-center">
                    <div className="bg-gray-100 w-[40px] h-[40px] flex justify-center items-center rounded-full outline-gray-50 outline-[5px]">
                        <Image src={UploadIcon} width={24} alt="" />
                    </div>
                    <p className="mt-[24px]">
                        <span className="text-red-500 font-medium">Click or drag</span> a file to this area to upload
                    </p>
                    <p className="text-sm text-gray-500">
                        { description !== undefined ? description : "Upload file (40×40px)" }
                        
                    </p>
                </div>
            </div>

            {/* Preview List */}
            <div className="mt-4 space-y-2">
                {files.map((file) => (
                <div
                    key={file.id}
                    className="flex items-center justify-between p-2 border border-gray-300 rounded-lg"
                >
                    <div className="flex items-center space-x-3">
                    <img
                        src={file.preview}
                        alt={file.file.name}
                        className="w-10 h-10 rounded object-cover"
                    />
                    <span className="text-sm font-medium truncate max-w-[200px]">
                        {file.file.name}
                    </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => handleDelete(file.id)}
                    >
                        <FaRegTrashAlt className="text-[18px] font-semibold text-gray-500" />
                    </button>
                </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default CvUploadComponent;
