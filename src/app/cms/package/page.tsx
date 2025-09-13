"use client"

import DefaultButton from "@/app/components/button/default-button";
import { FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function UserOverview() {

    const router = useRouter();

    return(
        <>
            <div className="w-full flex justify-end">
                <div>
                    <DefaultButton
                        label="Create New Package"
                        size="large"
                        icon={<FiPlus className="text-white text-[16px]" />} 
                        onClick={() => router.push('/cms/usermanagement/create')}
                    />
                </div>
            </div>
            <div className="mt-[25px] bg-white p-[20px] rounded-[20px] w-full">
                <div>
                    <span className="text-[16px] font-semibold">All Packages</span>
                </div>
            </div>
        </>
    );
};
