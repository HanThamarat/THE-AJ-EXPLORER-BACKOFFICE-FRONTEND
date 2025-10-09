
import { useEffect, useState, useRef } from "react";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/app/hook/appDispatch";
import { financialSelector } from "@/app/store/slice/financialSlice";
import { getCurrentBalance } from "@/app/store/slice/financialSlice";

export default function BalanceComponent() {

    const dispatch = useAppDispatch();
    const { balance } = useSelector(financialSelector);

    const isFachingBalance = useRef(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const fecthBalance = async () => {
            if (isFachingBalance.current) return;
            isFachingBalance.current = true;
            const response : any = await dispatch(getCurrentBalance());
            if (response.payload.status === true) {
                isFachingBalance.current = false;
            }
        }

        balance === null ? fecthBalance() : setIsLoading(false);
    }, [dispatch, balance]);
    return(
        <div className="w-full bg-white flex justify-between items-center p-[10px] rounded-[20px]">
            <div>
                <span className="text-gray-400 text-[14px]">Total Income</span>
                {
                    isLoading ?
                    <div className='animate-pulse bg-gray-200 rounded-[5px]'><span className='invisible'>Administrator</span></div>
                    :
                    <span className="block font-medium text-[14px]">{balance?.total}</span>
                }
            </div>
            <div className="rounded-[10px] p-[10px] bg-primary">
                <HiOutlineCurrencyDollar className="text-white text-[24px]" />
            </div>
        </div>
    );
};