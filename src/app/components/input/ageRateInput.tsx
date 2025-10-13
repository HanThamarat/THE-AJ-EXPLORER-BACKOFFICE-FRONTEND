import React, { useEffect } from "react";
import { RxDoubleArrowRight } from "react-icons/rx";
import { useState } from "react";

interface AgeRateInputProps {
    value:      AgeRateEntiry;
    onChage:   (e: AgeRateEntiry) => void;
}

export interface AgeRateEntiry {
    from?: string;
    to?: string;
}

export default function AgeRateInput({
    value = { from: "", to: "" },
    onChage
}: AgeRateInputProps) {
    
    const [ageRate, setAgeRate] = useState<AgeRateEntiry>(value);

    useEffect(() => {
        onChage?.(ageRate);
    }, [ageRate]);

    return(
        <div className="w-full grid grid-cols-1 gap-[2px]">
            <span>Age Rate *</span>
            <div className="overflow-hidden items-center gap-[10px] hover:border-primary hover:outline-2 hover:outline-[#EAF4FF] focus-within:border-primary focus-within:outline-2 focus-within:outline-[#EAF4FF] duration-100 ease-in-out h-[40px] w-full border px-[5px] border-[#d7dade] flex justify-between rounded-[6px]">
                <input 
                    type="number" 
                    placeholder="From"
                    className="w-full outline-0"
                    value={value.from}
                    onChange={(e) => setAgeRate({...ageRate, from: e.target.value })}
                />
                <RxDoubleArrowRight className="text-[40px] text-primary" />
                <input 
                    type="number" 
                    placeholder="To"
                    className="w-full outline-0"
                    value={value.to}
                    onChange={(e) => setAgeRate({...ageRate, to: e.target.value })}
                />
            </div>
        </div>
    );
};