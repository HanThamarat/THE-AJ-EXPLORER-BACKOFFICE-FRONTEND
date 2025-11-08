import CvUploadComponent, { FilePreview } from "@/app/components/CvUpload/Cvupload";
import { useEffect, useState } from "react";
import { PackageImageDTO } from "@/app/types/package";

interface FileUploadStatePropsType {
    value?: PackageImageDTO[]
    onChange?: (value: PackageImageDTO[]) => void;
}

export default function FileUploadState({
    value = [],
    onChange
}: FileUploadStatePropsType) {

    const [imagesArr, setImageArr] = useState<PackageImageDTO[]>(value);

    

    useEffect(() => {
        onChange?.(imagesArr);
    }, [imagesArr]);

    const handlerUploadthumbnail = (fileResponse: FilePreview[]) => {
        let newThumnail: PackageImageDTO[] = [];
        const fillterData: FilePreview[] = fileResponse.filter(item => item.id !== item.id);
        console.log(fillterData);
        for (const file of fileResponse) {
            newThumnail.push({
                id: file.id,
                fileName: file.file.name,
                base64: file.preview,
                mainFile: true
            });
        }
        setImageArr((prev) => {
            const filteredPrev = prev.filter(
                prevItem => !newThumnail.some(newItem => newItem.id === prevItem.id)
            );
            return [...filteredPrev, ...newThumnail];
        });
    }

    const handlerUploadImage = (fileResponse: FilePreview[]) => {
        let newImageArr: PackageImageDTO[] = [];
        for (const file of fileResponse) {
            newImageArr.push({
                id: file.id,
                fileName: file.file.name,
                base64: file.preview,
                mainFile: false
            });
        }

        setImageArr((prev) => {
            const filteredPrev = prev.filter(
                prevItem => !newImageArr.some(newItem => newItem.id === prevItem.id)
            );

            return [...filteredPrev, ...newImageArr];
        });
    }

    return(
        <div className="w-full flex flex-col gap-[24px]">
            <CvUploadComponent 
                label="Upload thumbnail image"
                qty={1}
                value={
                    imagesArr.filter(img => img.mainFile === true).map((imgs) => ({
                        id: imgs.id,
                        preview: imgs.base64,
                        file: {} as File,    
                    }))
                }
                onChange={handlerUploadthumbnail}
            />
            <div>
                 <CvUploadComponent 
                label="Upload images"
                qty={20}
                value={
                    imagesArr.filter(img => img.mainFile === false).map((imgs) => ({
                        id: imgs.id,
                        preview: imgs.base64,
                        file: {} as File,    
                    }))
                }
                onChange={handlerUploadImage}
            />
            </div>
        
        </div>
    );
}