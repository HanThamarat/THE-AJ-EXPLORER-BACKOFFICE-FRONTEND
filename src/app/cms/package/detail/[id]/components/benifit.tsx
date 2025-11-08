import { packageInclude, packageNotInclude } from "@/app/types/package";
import { FaRegCircleCheck } from "react-icons/fa6";
import { IoCloseCircleOutline } from "react-icons/io5";

interface BenefitComponentProps {
    benefit: packageInclude[] | null;
    not_benefit: packageNotInclude[] | null;
}

export default function BenefitComponent({
    benefit,
    not_benefit
}: BenefitComponentProps) {
    return(
        <>
            <div className="w-full grid gap-[20px] grid-cols-2">
                <div>
                    <span className="text-[18px] font-semibold">What's included</span>
                    <div className="mt-[10px] grid grid-cols-1 gap-[15px]">
                        {
                            benefit !== null && benefit.map((item, key) => (
                                <div className="flex items-center gap-[5px]" key={key}>
                                    <div className="w-[24px] h-[24px]">
                                         <FaRegCircleCheck className="text-[24px]" />
                                    </div>
                                    <span className="font-semibold overflow-ellipsis">{item.detail}</span>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div>
                    <span className="text-[18px] font-semibold">What's Not Included</span>
                    <div className="mt-[10px] grid grid-cols-1 gap-[15px]">
                        {
                            not_benefit !== null && not_benefit.map((item, key) => (
                                <div className="flex items-center gap-[5px]" key={key}>
                                    <div className="w-[24px] h-[24px]">
                                         <IoCloseCircleOutline className="text-[24px]" />
                                    </div>
                                    <span className="font-semibold overflow-ellipsis">{item.detail}</span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    );
};