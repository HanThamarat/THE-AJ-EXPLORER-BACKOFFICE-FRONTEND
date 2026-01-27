"use client"

import DefaultEmpty from "@/app/components/empty/default-emtpy";
import TableLoader from "@/app/components/loader/tableLoader";
import DataTable from "@/app/components/table/dataTable";
import { useAppDispatch } from "@/app/hook/appDispatch";
import { CurrencyConvert } from "@/app/hook/currencyConvertion";
import { cancelSelector, getAllCancel, getCancelDetail } from "@/app/store/slice/cancelSlice";
import { cancelDetailEntityType, cancelEntityType } from "@/app/types/cancel";
import { ColumnDef } from "@tanstack/react-table";
import { Drawer } from "antd";
import { useEffect, useRef, useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import CancelDetail from "./contents/detail";
import { IoIosArrowBack } from "react-icons/io";

export default function CancelPage() {

    const dispatch = useAppDispatch();
    const { cancels, cancelDetail } = useSelector(cancelSelector);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoadingCancelDetail, setIsLoadingCancelDetail] = useState<boolean>(true);
    const [dataTable, setDataTable] = useState<cancelEntityType[]>([]);
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [cancelData, setCancelData] = useState<cancelDetailEntityType | null>();
    const isFaching = useRef<boolean>(false);

    const hnadlerOpenDrawer = async (bookingId: string) => {
        setIsLoadingCancelDetail(true);
        setOpenDrawer(true);

        const response: any = await dispatch(getCancelDetail(bookingId));

        if (response.payload.status === true) {
            setIsLoadingCancelDetail(false);
        } else {
            setIsLoadingCancelDetail(false);
            setOpenDrawer(false);
        }
    }

    useEffect(() => {

        if (cancelDetail !== null) {
            setCancelData(cancelDetail);
        }

    }, [cancelDetail]);

    const columns: ColumnDef<cancelEntityType>[] = [
        {
            accessorKey: 'index',
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
            cell: ({ row }) => <div className="max-w-[120px] line-clamp-1 text-ellipsis">{row.original.packageName}</div>
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
            accessorKey: "cancelStatus",
            header: "Cancel ststus",
            cell: ({ row }) => (
                <div>
                    {
                        row.original.cancelStatus === 'confirmed' &&
                        <div className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#ECFDF3] rounded-full">
                            <div className="w-[8px] h-[8px] rounded-full bg-[#12B76A]"></div>
                            <span className="text-[#027A48]">Confirmed</span>
                        </div>
                    }
                    {
                        row.original.cancelStatus === 'panding' &&
                        <div className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#FFA500]/5 rounded-full">
                            <div className="w-[8px] h-[8px] rounded-full bg-[#FFA500]"></div>
                            <span className="text-[#FFA500]">Peding</span>
                        </div>
                    }
                    {
                        row.original.cancelStatus === 'failed' &&
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
            accessorKey: "refundPercentage",
            header: "Refund percent",
            cell: ({ row }) => <span>{row.original.refundPercentage}%</span>
        },
        {
            accessorKey: "refundAmount",
            header: "Refund percent",
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
        },
    ]; 

    useEffect(() => {
        const fecthData = async () => {
            if (isFaching.current) return;
            isFaching.current = true;
            await dispatch(getAllCancel());
            isFaching.current = false;
        }

        fecthData();
    }, [dispatch]);

    useEffect(() => {

        if (cancels !== null) {

            const fliterData: cancelEntityType[] = cancels.map((item, key) => ({
                index: key + 1,
                ...item
            }));

            setDataTable(fliterData);
            setIsLoading(false);
        }

    }, [cancels]);

    return(
        <>
            <div className="mt-[25px] bg-white rounded-[20px] w-full">
                <div className="p-[20px]">
                    <span className="text-[16px] font-semibold">All Cancel</span>
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
                        <span>Back to Cancel</span>
                    </button>
                </div>
                <CancelDetail
                    isLoading={isLoadingCancelDetail}
                    cancelDetail={cancelData}
                />
            </Drawer>
        </>
    );
}