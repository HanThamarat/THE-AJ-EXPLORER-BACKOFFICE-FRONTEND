import { packageAttractionEntity } from "@/app/types/package";
import { SlLocationPin } from "react-icons/sl";
import dayjs from "dayjs";
import { useState } from "react";

interface TimelineComponentProps {
    packageAttractions: packageAttractionEntity[] | null
}

export default function TimelineComponent({
    packageAttractions
}: TimelineComponentProps) {

    const [showmore, setShowmore] = useState<boolean>(false);

    return(
        <>
            <span className="text-[18px] font-semibold text-gray-800">Itinerary information</span>
            <div className={`grid grid-cols-1 gap-[10px] mt-[20px] ${ showmore ? '' : 'max-h-[330px] overflow-y-hidden' } `}>
                {
                    packageAttractions !== null && packageAttractions.map((data, key) => (
                        <div key={key} className="flex items-start gap-[10px]">
                            <div className="grid grid-cols-1 gap-[5px]">
                                <SlLocationPin className="text-[24px] text-gray-500" />
                                <div className="flex justify-center">
                                    <div className="h-[50px] w-0 border rounded-full border-gray-500"></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-[10px]">
                                <span className="font-medium">Stop at: {data.attractionName}</span>
                                <span className="text-gray-600"> {dayjs(data.attractionTime).format('h A')}</span>
                            </div>
                        </div>
                    ))
                }
            </div>
            <button className="underline text-blue-700 cursor-pointer" onClick={() => setShowmore(!showmore)}>Show more</button>
        </>
    );
};