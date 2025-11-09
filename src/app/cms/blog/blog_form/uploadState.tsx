import CvUploadComponent, { FilePreview } from "@/app/components/CvUpload/Cvupload";
import { useEffect, useState } from "react";
import { PackageImageDTO } from "@/app/types/package";

interface FileUploadStateBlogPropsType {
    value?: PackageImageDTO[]
    onChange?: (value: PackageImageDTO[]) => void;
}

export default function FileUploadStateBlog({
    value = [],
    onChange
}: FileUploadStateBlogPropsType) {

    const [imagesArr, setImageArr] = useState<PackageImageDTO[]>(value);

    useEffect(() => {
        onChange?.(imagesArr);
    }, [imagesArr]);

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
        <>
         <CvUploadComponent 
                label="Thumbnail (PNG, JPG) *"
                qty={1}
                value={
                    imagesArr.filter(img => img.mainFile === false).map((imgs) => ({
                        id: imgs.id,
                        preview: imgs.base64,
                        file: {} as File,    
                    }))
                }
                onChange={handlerUploadImage}
            />
        </>
    );
}