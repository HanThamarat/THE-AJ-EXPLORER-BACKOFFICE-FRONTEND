import { packageImageSave } from "@/app/types/package";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { Modal, Image as AntdImage } from "antd";

interface ImageDisplayComponentProps {
    images: packageImageSave[]
}

export default function ImageDisplayComponent({
    images
}: ImageDisplayComponentProps) {

    const [mainImage, setMainImage] = useState<packageImageSave[]>([]);
    const [childsImage, setChildsImage] = useState<packageImageSave[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpenModal, setIsOpenModal] = useState(false);

    useEffect(() => {
        const filterMainImage: packageImageSave[] = images.filter(image => image.mainFile === true);
        const filterChildsImage: packageImageSave[] = images.filter(image => image.mainFile === false);

        setMainImage(filterMainImage);
        setChildsImage(filterChildsImage);
        setChildsImage(prev => [...prev, ...filterChildsImage]);
        setIsLoading(false);
    }, [images]);

    return (
        <>
        <Modal
            title="Show all images"
            open={isOpenModal}
            footer={false}
            onCancel={() => setIsOpenModal(false)}
            width={1000}
        >
        <div className="w-full grid-cols-4 grid gap-[10px]">
            {
                (!isLoading) && (
                    images.map((data, key) => (
                    <div key={key} className="w-full h-full overflow-hidden rounded-[10px] relative cursor-pointer" onClick={() => setIsOpenModal(true)}>
                        <AntdImage
                            src={data.file_base64 as string}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </div>
                    ))
                )
            }
        </div>   
        </Modal>
        <div className="w-full grid grid-cols-2 gap-[10px] items-center justify-between">
            <div className="w-full h-full overflow-hidden rounded-[10px] cursor-pointer" onClick={() => setIsOpenModal(true)}>
                {
                    !isLoading && <Image src={mainImage[0].file_base64 as string} alt="" width={0} height={0} className="w-full h-full object-cover" />
                }
            </div>
            <div className="w-full grid grid-cols-2 gap-[10px] items-center justify-between">
                {
                   (!isLoading) && (
                        childsImage.slice(0, 4).map((data, key) => (
                        <div key={key} className="w-full h-full overflow-hidden rounded-[10px] relative cursor-pointer" onClick={() => setIsOpenModal(true)}>
                            {key !== 3 ? (
                                <Image
                                    src={data.file_base64 as string}
                                    alt=""
                                    width={0}
                                    height={0}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="relative w-full h-full group">
                                    <Image
                                    src={data.file_base64 as string}
                                    alt="Photo"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-800/60 to-transparent opacity-70 group-hover:opacity-60 transition-opacity" />
                                        <div className="absolute inset-0 flex items-center justify-center text-white text-[16px] font-medium">
                                        <ImageIcon className="w-6 h-6 mb-1 mr-2" />
                                        <span>Show all photo</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        ))
                   )
                }
            </div>
        </div>
        </>
    );
}