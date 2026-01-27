"use client"

import DefaultEmpty from "@/app/components/empty/default-emtpy";
import TableLoader from "@/app/components/loader/tableLoader";
import DataTable from "@/app/components/table/dataTable";
import { CurrencyConvert } from "@/app/hook/currencyConvertion";
import { getAllRefund, getRefundDetail, refundSelector } from "@/app/store/slice/refundSlice";
import { useAppDispatch } from "@/app/store/store";
import { refundDetailType, refundEntityType } from "@/app/types/refund";
import { ColumnDef } from "@tanstack/react-table";
import { Drawer } from "antd";
import { useEffect, useRef, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoEyeOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import RefundDetail from "./contents/detail";

export default function RefundPage() {

    const dispatch = useAppDispatch();
    const { refunds, refundDetail } = useSelector(refundSelector);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [dataTable, setDataTable] = useState<refundEntityType[]>([]);
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [isLoadingRefundDetail, setIsLoadingRefundDetail] = useState<boolean>(true);
    const [refundData, setRefundData] = useState<refundDetailType | null>();
    const isFaching = useRef<boolean>(false);

    const hnadlerOpenDrawer = async (bookingId: string) => {
        setIsLoadingRefundDetail(true);
        setOpenDrawer(true);

        const response: any = await dispatch(getRefundDetail(bookingId));

         if (response.payload.status === true) {
            setIsLoadingRefundDetail(false);
        } else {
            setIsLoadingRefundDetail(false);
            setOpenDrawer(false);
        }
    };

    useEffect(() => {

        if (refundDetail !== null) {
            setRefundData(refundDetail);
        }

    }, [refundDetail])

    const columns: ColumnDef<refundEntityType>[] = [
        {
            accessorKey: "index",
            header: "#"
        },
        {
            accessorKey: "bookingId",
            header: "Booking ID"
        },
        {
            accessorKey: "bookerName",
            header: "Booker name"
        },
        {
            accessorKey: "packageName",
            header: "Package name",
            cell: ({ row }) => <div className="max-w-[120px] line-clamp-1 text-ellipsis">{ row.original.packageName }</div>
        },
        {
            accessorKey: "paymentStatus",
            header: "Payment Status",
            cell: ({ row }) => (
                <div>
                    {
                        row.original.paymentStatus === 'paid' &&
                        <div className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#ECFDF3] rounded-full">
                            <div className="w-[8px] h-[8px] rounded-full bg-[#12B76A]"></div>
                            <span className="text-[#027A48]">Paid</span>
                        </div>
                    }
                    {
                        row.original.paymentStatus === 'panding' &&
                        <div className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#FFA500]/5 rounded-full">
                            <div className="w-[8px] h-[8px] rounded-full bg-[#FFA500]"></div>
                            <span className="text-[#FFA500]">Peding</span>
                        </div>
                    }
                    {
                        row.original.paymentStatus === 'failed' &&
                        <div className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#F44336]/5 rounded-full">
                            <div className="w-[8px] h-[8px] rounded-full bg-[#F44336]"></div>
                            <span className="text-[#F44336]">Failed</span>
                        </div>
                    }
                </div>
            )
        },
        {
            accessorKey: "refundStatus",
            header: "Refund status",
            cell: ({ row }) => (
                <div>
                    {
                        row.original.refundStatus === 'refunded' &&
                        <div className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#ECFDF3] rounded-full">
                            <div className="w-[8px] h-[8px] rounded-full bg-[#12B76A]"></div>
                            <span className="text-[#027A48]">Refunded</span>
                        </div>
                    }
                    {
                        row.original.refundStatus === 'panding' &&
                        <div className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#FFA500]/5 rounded-full">
                            <div className="w-[8px] h-[8px] rounded-full bg-[#FFA500]"></div>
                            <span className="text-[#FFA500]">Peding</span>
                        </div>
                    }
                    {
                        row.original.refundStatus === 'failed' &&
                        <div className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#F44336]/5 rounded-full">
                            <div className="w-[8px] h-[8px] rounded-full bg-[#F44336]"></div>
                            <span className="text-[#F44336]">Canceled</span>
                        </div>
                    }
                </div>
            )
        },
        {
            accessorKey: "amount",
            header: "Paid amount",
            cell: ({ row }) => <span>{CurrencyConvert.currencyConvertToThai(row.original.amount)} THB</span>
        },
        {
            accessorKey: "refundPercentahe",
            header: "Refund percent",
            cell: ({ row }) => <span>{row.original.refundPercentahe}%</span>
        },
        {
            accessorKey: "refundAmount",
            header: "Refund amount",
            cell: ({ row }) => <span>{CurrencyConvert.currencyConvertToThai(row.original.refundAmount)} THB</span>
        },
        {
            accessorKey: "action",
            header: "",
            cell: ({ row }) => <div className="flex items-center gap-[10px]">
                <button onClick={() => hnadlerOpenDrawer(row.original.bookingId as string)}>
                    <IoEyeOutline className="text-[24px]" />
                </button>
            </div>
        }
    ]

    useEffect(() => {
        const fecthData = async () => {
            if (isFaching.current) return;
            isFaching.current = true;
            await dispatch(getAllRefund());
            isFaching.current = false;
        }

        fecthData();
    }, [dispatch]);

    useEffect(() => {

        if (refunds !== null) {

            const filterData: refundEntityType[] = refunds.map((item, key) => ({
                index: key + 1,
                ...item
            }));

            setDataTable(filterData);
            setIsLoading(false);
        }

    }, [refunds]);

    return(
        <>
        <div className="mt-[25px] bg-white rounded-[20px] w-full">
            <div className="p-[20px]">
                <span className="text-[16px] font-semibold">All Refund</span>
            </div>
            {
                isLoading ?
                <div className="px-[20px] pb-[20px]">
                    <TableLoader />
                </div>
                :
                (
                dataTable.length !== 0 ?
                    <div className="pb-[20px]">
                        <DataTable data={dataTable} columns={columns} globalFilter={true} />
                    </div>
                    :
                    <DefaultEmpty />
                )
            }
        </div>

        <Drawer
            closable={false}
            onClose={() => setOpenDrawer(false)}
            open={openDrawer}
            className=" rounded-l-[20px]"
            width={750}
        >   
            <div>
                <button 
                    className="py-[8px] rounded-[10px] px-[10px] flex items-center gap-[5px] duration-100 ease-in-out hover:bg-gray-200"
                    onClick={() => setOpenDrawer(false)}
                >
                    <IoIosArrowBack className="text-[24px]" />
                    <span>Back to Refund</span>
                </button>
            </div>
            <RefundDetail
                isLoading={isLoadingRefundDetail}
                refundData={refundData}
            />
        </Drawer>
        </>
    );
};