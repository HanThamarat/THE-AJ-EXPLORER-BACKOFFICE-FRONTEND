import { packageOptionEntity } from "@/app/types/package";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { FiPlus } from "react-icons/fi";
import { RiSubtractFill } from "react-icons/ri";

interface PackageOptionDetailComponentProps {
    packageOptions: packageOptionEntity[] | null
}

export default function PackageOptionDetailComponent ({
    packageOptions
}: PackageOptionDetailComponentProps) {

    const [activePkgOption, setActivePkgOption] = useState<number>(0);
    const days = Array.from({ length: 7 }, (_, i) => dayjs().add(i, "day"));
    const [selectedDate, setSelectedDate] = useState(days[0].format("YYYY-MM-DD"));
    const [adultQty, setadultQty] = useState<number>(0);
    const [childQty, setChildQty] = useState<number>(0);
    const [groupQty, setgroupQty] = useState<number>(0);
    const [amoutPrice, setAmoutPrice] = useState<number>(0);

    useEffect(() => {
        if (adultQty > 0 || childQty > 0) {
            setgroupQty(0);
            setAmoutPrice(0);

            if (packageOptions !== null) {
                const amoutAdult = (Number(packageOptions[activePkgOption].adultPrice) * adultQty);
                const amoutchild = (Number(packageOptions[activePkgOption].childPrice) * childQty);
                const amoutPrice = (amoutAdult + amoutchild);

                setAmoutPrice(amoutPrice);
            }
        }

        if (groupQty > 0) {
            setChildQty(0);
            setadultQty(0);
            setAmoutPrice(0);

            if (packageOptions !== null) {
                setAmoutPrice(Number(packageOptions[activePkgOption].groupPrice));
            }
        }
        
    }, [adultQty, childQty, groupQty]);

    return(
        <>
        <div>
            <span className="text-[18px] font-semibold">Ticket and price</span>
        </div>
        <div className="w-full flex overflow-x-scroll gap-[10px] no-scrollbar mt-[10px]">
            {
                packageOptions?.length !== 1 && (
                    packageOptions?.map((data, key) => (
                        <div key={key} onClick={() => setActivePkgOption(key)} className={`${activePkgOption === key ? 'border-[#613DC1] bg-[#613DC1]/5' : 'border-gray-200 bg-transparent' } min-w-[180px] p-[10px] rounded-[5px] border cursor-pointer`}>
                            <span className={`${ activePkgOption === key ? 'text-[#613DC1]' : 'text-gray-700' } font-semibold text-[14px]`}>{data.name}</span>
                        </div>
                    ))
                )
            }
        </div>
        <div className="mt-[24px]">
            <span className="text-[18px] font-semibold">Search ticket availability by date</span>
        </div>
        <div className="w-full flex overflow-x-scroll gap-[10px] no-scrollbar mt-[24px]">
            {days.map((date) => {
                const isSelected = selectedDate === date.format("YYYY-MM-DD");
                return (
                    <button
                        key={date.format("DD-MM-YYYY")}
                        onClick={() => setSelectedDate(date.format("YYYY-MM-DD"))}
                        className={`min-w-[80px] flex flex-col items-center justify-center rounded-[5px] border p-3 flex-shrink-0 transition-all ${
                        isSelected
                            ? "border-purple-500 bg-purple-50 text-purple-600 font-semibold"
                            : "border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                    >
                        <span className="text-sm">{date.format("ddd")}</span>
                        <span
                        className={`text-xl font-bold ${
                            isSelected ? "text-purple-700" : "text-black"
                        }`}
                        >
                        {date.format("D")}
                        </span>
                        <span className="text-sm">{date.format("MMM")}</span>
                    </button>
                );
            })}
        </div>
        <div className="mt-[24px] border border-[#613DC1] rounded-[10px] p-[10px] gird grid-cols-1 gap-[20px]">
            <div>
                <span className="text-[18px] font-semibold">How many tickets</span>
            </div>
            {
                packageOptions !== null &&
                (packageOptions[activePkgOption].adultFromAge !== "" && packageOptions[activePkgOption].adultToAge !== "") ?
                <div>
                    <div className="flex justify-between items-center mt-[24px]">
                        <div>
                            <span className="text-[14px]">Adult (age {packageOptions[activePkgOption].adultFromAge} - {packageOptions[activePkgOption].adultToAge})</span>
                            <span className="text-gray-500 block">THB {packageOptions[activePkgOption].adultPrice}</span>
                        </div>
                        <div className="flex gap-[10px] justify-between items-center">
                            <button onClick={() => {
                                adultQty > 0 && setadultQty(adultQty-1);
                            }} className="cursor-pointer border flex justify-center items-center border-gray-300 rounded-[5px] h-[35px] w-[35px]">
                                <RiSubtractFill className="text-[24px] text-[#613DC1]" />
                            </button>
                            <div className="cursor-pointer border flex justify-center items-center border-gray-300 rounded-[5px] h-[35px] w-[35px]">
                                {adultQty}
                            </div>
                            <button onClick={() => {
                            setadultQty(adultQty+1);
                            }} className="cursor-pointer border flex justify-center items-center border-gray-300 rounded-[5px] h-[35px] w-[35px]">
                                <FiPlus className="text-[24px] text-[#613DC1]" />
                            </button>
                        </div>
                    </div>       
                    <div className="flex justify-between items-center mt-[10px]">
                        <div>
                            <span className="text-[14px]">Child (age {packageOptions[activePkgOption].childFromAge} - {packageOptions[activePkgOption].childToAge})</span>
                            <span className="text-gray-500 block">THB {packageOptions[activePkgOption].childPrice}</span>
                        </div>
                        <div className="flex gap-[10px] justify-between items-center">
                            <button onClick={() => {
                                childQty > 0 && setChildQty(childQty - 1);
                            }} className="cursor-pointer border flex justify-center items-center border-gray-300 rounded-[5px] h-[35px] w-[35px]">
                                <RiSubtractFill className="text-[24px] text-[#613DC1]" />
                            </button>
                            <div className="cursor-pointer border flex justify-center items-center border-gray-300 rounded-[5px] h-[35px] w-[35px]">
                                {childQty}
                            </div>
                            <button onClick={() => {
                                setChildQty(childQty + 1);
                            }} className="cursor-pointer border flex justify-center items-center border-gray-300 rounded-[5px] h-[35px] w-[35px]">
                                <FiPlus className="text-[24px] text-[#613DC1]" />
                            </button>
                        </div>
                    </div>       
                </div>
                :
                packageOptions !== null &&
                <div>
                     <div className="flex justify-between items-center mt-[24px]">
                        <div className="w-full">
                            <span className="text-[14px]">Group ({packageOptions[activePkgOption].groupFromAge} - {packageOptions[activePkgOption].groupToAge} people)</span>
                            <span className="text-gray-500 block">THB {packageOptions[activePkgOption].groupPrice}</span>
                        </div>
                        <div className="flex gap-[10px] justify-between items-center">
                            <button onClick={() => {
                                groupQty > 0 && setgroupQty(groupQty - 1);
                            }} className="cursor-pointer border flex justify-center items-center border-gray-300 rounded-[5px] h-[35px] w-[35px]">
                                <RiSubtractFill className="text-[24px] text-[#613DC1]" />
                            </button>
                            <div className="cursor-pointer border flex justify-center items-center border-gray-300 rounded-[5px] h-[35px] w-[35px]">
                                {groupQty}
                            </div>
                            <button onClick={() => {
                                groupQty < Number(packageOptions[activePkgOption].groupToAge) && setgroupQty(groupQty + 1);
                            }} className="cursor-pointer border flex justify-center items-center border-gray-300 rounded-[5px] h-[35px] w-[35px]">
                                <FiPlus className="text-[24px] text-[#613DC1]" />
                            </button>
                        </div>
                    </div>       
                </div>
            }
            <div className="mt-[24px]">
                <span className="text-[16px]">Total </span>
                <span className="text-[18px] font-medium">THB {amoutPrice}</span>
            </div>
        </div>
        </>
    );
};