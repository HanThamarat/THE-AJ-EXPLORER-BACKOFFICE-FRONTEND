import Image from "next/image";
import Mockup from "@/app/assets/images/svg/mockup_1.svg";

export default function CreateUser() {
    return(
        <>
            <div className="mt-[20px]">
                <span className="text-[18px] font-medium">Create New Package</span>
                <span className="block text-gray-600">Please enter form below for create your package.</span>
            </div>
            <div className="w-full p-[20px] bg-white mt-[10px] rounded-[20px] flex justify-between gap-[10px]">
                <div className="w-full">

                </div>
                <div className="w-[40%]">
                    <div className="justify-center flex w-full">
                        <Image src={Mockup} alt="" />
                    </div>
                    <div className="justify-center flex w-full">
                        <span className="text-center w-full">Create your package new to better your business </span>
                    </div>
                </div>
            </div>
        </>
    );
};
