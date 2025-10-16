"use client"

import DefaultButton from "@/app/components/button/default-button";
import TableLoader from "@/app/components/loader/tableLoader";
import DataTable from "@/app/components/table/dataTable";
import { FiPlus } from "react-icons/fi";
import { getAllPromotion } from "@/app/store/slice/promotionSlice";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/app/hook/appDispatch";
import { promotionSelector } from "@/app/store/slice/promotionSlice";
import { useEffect, useRef, useState } from "react";
import { PromotionLink, PromotionTablePropsType } from "@/app/types/promotion";
import { ColumnDef } from "@tanstack/react-table";
import DefaultEmpty from "@/app/components/empty/default-emtpy";
import dateFormat from "dateformat";
import { IoEyeOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import PromotiomDetail from "./components/promoDetail";

export default function PackagePromoPage() {

    const router = useRouter();
    const dispatch = useAppDispatch();
    const { promotions } = useSelector(promotionSelector);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const isFaching = useRef<boolean>(false);
    const [promoData, setPromoData] = useState<PromotionTablePropsType[]>([]);

    useEffect(() => {
        setIsLoading(true);
        const fecthPromoData = async () => {
            if (isFaching.current) return;
            isFaching.current = true;
            await dispatch(getAllPromotion());
            isFaching.current = false;
        }

        promotions === null ? fecthPromoData() : setIsLoading(false);

        if (promotions?.length !== 0 && promotions !== null) {
            const promotionFormatter: PromotionTablePropsType[] = promotions ? promotions?.map((data, index) => ({
                index: index + 1,
                id: data.id,
                promoName: data.promoName,
                packagePromoLink: data.packagePromoLink as PromotionLink[],
                description: data.description,
                couponCode: data.couponCode,
                startDate: data.startDate,
                endDate: data.endDate,
                type: data.type,
                status: Boolean(data.status),
                created_by: data.created_by,
                created_at: data.created_at,
                updated_by: data.updated_by,
                updated_at: data.updated_at
            })) : [];
            setPromoData(promotionFormatter);
        }
    }, [dispatch, promotions]); 

    const columns: ColumnDef<PromotionTablePropsType>[] = [
        {
            accessorKey: "index",
            header: "#"
        },
        {
            accessorKey: "promoName",
            header: "Group Name"
        },
        {
            accessorKey: "packagePromoLink",
            header: "Package Link",
            cell: ({ row }) => (
                <p>{row.original.packagePromoLink[0].packageLink}</p>
            )
        },
        {
            accessorKey: "type",
            header: "Type"
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <div>
                    {
                        row.original.status === true ?
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
            )
        },
        {
            accessorKey: "created_by",
            header: "Created By"
        },
        {
            accessorKey: "updated_at",
            header: "Last Updated",
            cell: ({ row }) => (
                <p>{dateFormat(row.original.updated_at, "mediumDate")}</p>
            )
        },
        {
            accessorKey: "updated_by",
            header: "Updated By"
        },
        {
            accessorKey: "actions",
            header: "",
            cell: ({ row }) => (
                <div className="flex gap-[10px] items-center">
                    <PromotiomDetail promoData={row.original} />
                </div>
            )
        }
    ]

    return(
        <>
            <div className="w-full flex justify-end">
                <div className="w-[45%] flex gap-[10px]">
                     <DefaultButton
                        label="Create New Coupon"
                        icon={<FiPlus className="text-white text-[16px]" />}
                        onClick={() => router.push("/cms/package/package-promotion/form/coupon")}
                    />
                    <DefaultButton
                        label="Create New Promotion"
                        icon={<FiPlus className="text-white text-[16px]" />}
                        onClick={() => router.push("/cms/package/package-promotion/form/promotion")}
                    />
                </div>
            </div>
            <div className="bg-white rounded-[20px] w-full mt-[25px]">
                <div className="p-[20px]">
                    <span className="text-[16px] font-semibold">All Promotin & Coupon</span>
                </div>
                {
                    isLoading ?
                    <div className="px-[20px] pb-[20px]">
                        <TableLoader />
                    </div>
                    :
                    (
                        (promoData?.length !== 0 ) ?
                        <div className="pb-[20px]">
                            <DataTable data={promoData} columns={columns} />
                        </div>
                        :
                        <DefaultEmpty />
                    )
                }
            </div>
        </>
    );
};