"use client"

import DefaultButton from "@/app/components/button/default-button";
import { FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function BlogPage() {

    const router = useRouter();

    return(
        <>
            <div className="w-full flex justify-end">
                <div>
                    <DefaultButton
                        label="Create New Blog"
                        size="large"
                        icon={<FiPlus className="text-white text-[16px]" />} 
                        onClick={() => router.push('/cms/blog/form')}
                    />
                </div>
            </div>
            <div className="mt-[25px] bg-white rounded-[20px] w-full">
                <div className="p-[20px]">
                    <span className="text-[16px] font-semibold">All Blogs</span>
                </div>
            </div>
        </>
    );
};