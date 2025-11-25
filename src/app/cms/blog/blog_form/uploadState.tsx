import CvUploadComponent, { FilePreview } from "@/app/components/CvUpload/Cvupload";
import { useEffect, useState } from "react";
import { ImageDTOSchemaType } from "@/app/types/image";

interface FileUploadStateBlogPropsType {
    value?: ImageDTOSchemaType[]
    onChange?: (value: ImageDTOSchemaType[]) => void;
}

export default function FileUploadStateBlog({
    value = [],
    onChange
}: FileUploadStateBlogPropsType) {

    const [imagesArr, setImageArr] = useState<ImageDTOSchemaType[]>(value);

    useEffect(() => {
        onChange?.(imagesArr);
    }, [imagesArr]);

    const handlerUploadImage = (fileResponse: FilePreview[]) => {
        const newThumbnailArr: ImageDTOSchemaType[] = fileResponse.map(file => ({
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

    return(
        <>
         <CvUploadComponent 
                label="Thumbnail (PNG, JPG) *"
                qty={1}
                aollowFileTypes={['image/png', 'image/jpeg']}
                value={
                    imagesArr.map((imgs) => ({
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