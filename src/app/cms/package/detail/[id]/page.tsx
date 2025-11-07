"use client"

import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react";
import { getPackagebyId } from "@/app/store/slice/packageManagement";
import { useSelector } from "react-redux";
import { packageSelector } from "@/app/store/slice/packageManagement";
import { useAppDispatch } from "@/app/hook/appDispatch";
import TextLoander from "@/app/components/loader/text-loader";
import { FiEdit } from "react-icons/fi";
import { useRouter } from "next/navigation";
import ImageDisplayComponent from "./components/image";
import ImageLoader from "@/app/components/loader/image-loader";
import { convert } from "html-to-text";
import TableLoader from "@/app/components/loader/tableLoader";
import PackageOptionDetailComponent from "./components/packageOption";

export default function PackageDetail() {

    const param = useParams();
    const packageId = param.id;
    const dispacth = useAppDispatch();
    const isFaching = useRef(false);
    const { packageByid } = useSelector(packageSelector);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        setIsLoading(true);
        const fecthData = async () => {
            if (isFaching.current) return;
            isFaching.current = true;
            await dispacth(getPackagebyId(Number(packageId)));
            isFaching.current = false;
        }

        fecthData();
        
        packageByid !== null && setIsLoading(false);        
    }, [dispacth, packageByid]);

    return(
        <>
            <div className="bg-white rounded-[20px] p-[20px]">
                <div className="flex items-center justify-between">
                    {
                        packageByid !== null && !isLoading ?
                        <span className="text-[18px] font-semibold">{packageByid.packageName}</span>
                        :
                        <TextLoander label="fwgeesgegsegsgsgege" />
                    }
                    <button  onClick={() => router.push(`/cms/package/package_form?packageId=${packageId}`)} >
                        <FiEdit className="text-[18px] font-semibold text-gray-500" />
                    </button>
                </div>
                <div className="w-full mt-[24px]">
                    {
                        packageByid !== null && !isLoading ?
                        <ImageDisplayComponent images={packageByid.packageImage} />
                        :
                        <ImageLoader />
                    }
                </div>
                <div className="w-full mt-[24px] flex gap-[30px] justify-between">
                    <div className="w-full">
                        {
                            packageByid !== null && !isLoading ?
                            <div className="text-gray-600 text-[14px]">
                                {convert(packageByid.description, {
                                    wordwrap: 130
                                })}
                            </div>
                            :
                            <TableLoader />
                        }
                    </div>
                    <div className="w-[30%]">
                        {
                            packageByid !== null && !isLoading ?
                            <PackageOptionDetailComponent packageOptions={packageByid.packageOption} />
                            :
                            <TableLoader />
                        }
                    </div>
                </div>
            </div> 
        </>
    )
}