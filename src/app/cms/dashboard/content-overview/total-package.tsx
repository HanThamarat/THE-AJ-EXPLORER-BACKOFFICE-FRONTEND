import { useAppDispatch } from "@/app/hook/appDispatch";
import { getCurrentTotalPackage, kpiSelector } from "@/app/store/slice/kpiSlice";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineTicket } from "react-icons/hi2";

export default function TotalPackage() {

    const dispatch = useAppDispatch();
    const { totalPackage } = useSelector(kpiSelector);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const isFaching = useRef<boolean>(false);

     useEffect(() => {
    
        const fecthPackageTotal = async () => {
            if (isFaching.current) return;
            isFaching.current = true;
            await dispatch(getCurrentTotalPackage());
            isFaching.current = false;
        }

        totalPackage === null ? fecthPackageTotal() : setIsLoading(false);
    }, [totalPackage, dispatch]);

    return(
        <div className="w-full bg-white flex justify-between items-center p-[10px] rounded-[20px]">
            <div>
                <span className="text-gray-400 text-[14px]">Total Pacakge</span>
                {
                    isLoading ?
                    <div className='animate-pulse bg-gray-200 rounded-[5px]'><span className='invisible'>Administrator</span></div>
                    :
                    <span className="block font-medium text-[14px]">{totalPackage?.qty}</span>
                }
            </div>
            <div className="rounded-[10px] p-[10px] bg-primary">
                <HiOutlineTicket className="text-white text-[24px]" />
            </div>
        </div>
    )
}