import { promotionLinkTableType, PromotionTablePropsType } from "@/app/types/promotion"
import { Drawer } from "antd";
import { useState } from "react"
import { IoEyeOutline } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import dateFormat from "dateformat";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/app/components/table/dataTable";
import DefaultEmpty from "@/app/components/empty/default-emtpy";
import DelPromotionModal from "./promotionDelete";
import { FiEdit } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface PromotiomDetailProps {
    promoData: PromotionTablePropsType;
}

export default function PromotiomDetail({
    promoData
}: PromotiomDetailProps) {

    const [open, setOpen] = useState<boolean>(false);
    const [promotionLink, setPromotionLink] = useState<promotionLinkTableType[]>([]);
    const router = useRouter();

    const handlerOpen = async () => {
        setOpen(true);
        if (promoData.packagePromoLink.length !== 0) {
            const dataformat: promotionLinkTableType[] = promoData.packagePromoLink ? promoData.packagePromoLink.map((data, index) => ({
                index: index + 1,
                packageLink: data.packageLink,
                percentage: data.percentage
            })) : [];
            setPromotionLink(dataformat);
        } 
    };

    const columns: ColumnDef<promotionLinkTableType>[] = [
        {
            accessorKey: "index",
            header: "#"
        },
        {
            accessorKey: "packageLink",
            header: "Package"
        },
        {
            accessorKey: "percentage",
            header: "Promotion Percentage"
        }
    ];

    return(
        <>
        <button onClick={handlerOpen} >
            <IoEyeOutline className="text-[20px] font-bold text-[#535862]" />
        </button>
        <Drawer
            size="large"
            open={open}
            closable={false}
            className="rounded-l-[20px]"
        >
            <div className="flex justify-between items-center w-full">
                <button type="button" onClick={() => setOpen(false)} className="flex gap-[5px] items-center px-[10px] py-[10px] rounded-[10px] bg-[#F5F5F5]">
                    <IoIosArrowBack className="text-[24px] text-[#414651]" />
                    <span className="text-[#414651]">Back to promotion & coupon</span>
                </button>
                <div className="flex gap-[10px] items-center">
                    <button onClick={() => router.push(`/cms/package/package-promotion/form/${promoData.type}?promo_id=${promoData.id}`)} >
                        <FiEdit className="text-[18px] font-semibold text-gray-500" />
                    </button>
                    <DelPromotionModal promoId={promoData.id} />
                </div>
            </div>
            <div className="w-full border border-gray-300 rounded-[20px] p-[20px] mt-[24px]">
                <span className="text-[18px] text-[#414651] font-semibold">Promotion Detail</span>
                <span className="block">Get detailed information about the Promotion.</span>
                <div className="mt-[24px] grid grid-cols-2 gap-[24px]">
                    <div>
                        <span className="text-[14px] font-semibold">Promotion name</span>
                        <span className="block">{promoData.promoName}</span>
                    </div>
                    <div>
                        <span className="text-[14px] font-semibold">Type</span>
                        <span className="block">{promoData.type}</span>
                    </div>
                    <div>
                        <span className="text-[14px] font-semibold">Start Date</span>
                        <span className="block">{dateFormat(promoData.startDate, "mediumDate")}</span>
                    </div>
                    <div>
                        <span className="text-[14px] font-semibold">End Date</span>
                        <span className="block">{dateFormat(promoData.endDate, "mediumDate")}</span>
                    </div>
                    <div>
                        <span className="text-[14px] font-semibold">Status</span>
                        {
                            promoData.status === true ?
                            <div className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#ECFDF3] rounded-full">
                                <div className="w-[8px] h-[8px] rounded-full bg-[#12B76A]"></div>
                                <span className="text-[#027A48]">Active</span>
                            </div>
                            :
                            <div className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#F2F4F7] rounded-full">
                                <div className="w-[8px] h-[8px] rounded-full bg-[#667085]"></div>
                                <span className="text-[#344054]">Inactive</span>
                            </div>
                        }
                    </div>
                </div>
                <div className="mt-[24px]">
                    <span>Description</span>
                    <div className="w-full border border-gray-200 rounded-[8px] p-[5px]">
                        {promoData.description ?? ""}
                    </div>
                </div>
                <div className="mt-[24px] w-full border border-gray-200 rounded-[8px]">
                    <div className="p-[15px]">
                        <span className="text-[18px] font-semibold">Promotion Link</span>
                    </div>
                    {
                        (promoData?.packagePromoLink?.length !== 0 ) ?
                        <div className="pb-[20px]">
                            <DataTable globalFilter={false} data={promotionLink} columns={columns} />
                        </div>
                        :
                        <DefaultEmpty />
                    }
                </div>
            </div>
        </Drawer>
        </>
    )
}