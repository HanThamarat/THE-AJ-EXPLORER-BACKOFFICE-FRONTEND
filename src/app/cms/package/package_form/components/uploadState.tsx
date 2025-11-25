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
        const newThumbnailArr: PackageImageDTO[] = fileResponse.map(file => ({
            id: file.id,
            fileName: file.file.name,
            base64: file.preview,
            mainFile: true
        }));

        setImageArr(prev => {
            // remove old thumbnail(s)
            const filteredPrev = prev.filter(prevItem => !prevItem.mainFile);

            return [...filteredPrev, ...newThumbnailArr];
        });
    }

    const handlerUploadImage = (fileResponse: FilePreview[]) => {
        const newImageArr: PackageImageDTO[] = fileResponse.map(file => ({
            id: file.id,
            fileName: file.file.name,
            base64: file.preview,
            mainFile: false
        }));

        setImageArr(prev => {
            const keepOnlyThumbnails = prev.filter(item => item.mainFile === true);
            return [...keepOnlyThumbnails, ...newImageArr];
        });
    }

    return(
        <div className="w-full flex flex-col gap-[24px]">
            <CvUploadComponent 
                label="Upload thumbnail image"
                aollowFileTypes={["image/png", "image/jpeg"]}
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
                    aollowFileTypes={["image/png", "image/jpeg"]}
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