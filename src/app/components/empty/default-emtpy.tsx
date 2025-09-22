import emptyImg from "@/app/assets/images/svg/empty_state.svg";
import Image from "next/image";

export default function DefaultEmpty() {
    return(
        <div className="w-full grid grid-cols-1 justify-center items-center py-[40px]">
            <div className="flex justify-center">
                <Image src={emptyImg} alt="" />
            </div>
            <div className="flex justify-center">
                <span className="font-semibold text-[16px]">No data Found</span>
            </div>
            <div className="flex justify-center">
                <span className="text-gray-800">No data are currently available.</span>
            </div>
        </div>
    );
};