import { useEffect, useRef, useState } from "react";
import { BsLuggage } from "react-icons/bs";
import { useAppDispatch } from "@/app/hook/appDispatch";
import { useSelector } from "react-redux";
import { getCurrentTotalBooking, kpiSelector } from "@/app/store/slice/kpiSlice";

export default function TotalBooking() {

    const dispatch = useAppDispatch();
    const { totalBooking } = useSelector(kpiSelector);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const isFaching = useRef<boolean>(false);

    useEffect(() => {

        const fecthBookingTotal = async () => {
            if (isFaching.current) return;
            isFaching.current = true;
            await dispatch(getCurrentTotalBooking());
            isFaching.current = false;
        }

        totalBooking === null ? fecthBookingTotal() : setIsLoading(false);
    }, [totalBooking, dispatch]);

    return(
        <div className="w-full bg-white flex justify-between items-center p-[10px] rounded-[20px]">
            <div>
                <span className="text-gray-400 text-[14px]">Total Booking</span>
                {
                    isLoading ?
                    <div className='animate-pulse bg-gray-200 rounded-[5px]'><span className='invisible'>Administrator</span></div>
                    :
                    <span className="block font-medium text-[14px]">{totalBooking?.qty}</span>
                }
            </div>
            <div className="rounded-[10px] p-[10px] bg-primary">
                <BsLuggage className="text-white text-[24px]" />
            </div>
        </div>
    )
}