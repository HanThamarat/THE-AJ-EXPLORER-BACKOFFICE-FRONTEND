import DefaultEmpty from "@/app/components/empty/default-emtpy";
import TableLoader from "@/app/components/loader/tableLoader";
import DataTable from "@/app/components/table/dataTable";
import { useAppDispatch } from "@/app/hook/appDispatch"
import { CurrencyConvert } from "@/app/hook/currencyConvertion";
import { getBookingOverview, kpiSelector } from "@/app/store/slice/kpiSlice";
import { overviewEntityType } from "@/app/types/kpi";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function BookingOverview() {

    const dispatch = useAppDispatch();
    const { bookOverview } = useSelector(kpiSelector);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [overviewData, setOverviewData] = useState<overviewEntityType[]>([]);
    const isFaching = useRef(false);

    useEffect(() => {
        const fecthData = async () => {
            if (isFaching.current) return;
            isFaching.current = true;
            await dispatch(getBookingOverview());
            isFaching.current = true;
        }

        fecthData();
    }, [dispatch]);

    useEffect(() => {

        if (bookOverview !== null) {
            const filterdata: overviewEntityType[] = bookOverview.map((Item, key) => ({
                index: key + 1,
                amount: CurrencyConvert.currencyConvertToThai(Item.amount as number),
                packageName: Item.packageName,
                booker: Item.booker,
                bookingId: Item.bookingId,
                paymentStatus: Item.paymentStatus,
                peopleQty: Item.peopleQty,
                bookingStatus: Item.bookingStatus
            }));

            setOverviewData(filterdata);
            setIsLoading(false);
        }

    }, [bookOverview]);

    const columns: ColumnDef<overviewEntityType>[] = [
            {
                accessorKey: "index",
                header: "#"
            },
            {
                accessorKey: "bookingId",
                header: "Booking ID"
            },
            {
                accessorKey: "packageName",
                header: "Package name"
            },
            {
                accessorKey: "packageName",
                header: "Package name"
            },
            {
                accessorKey: "bookingStatus",
                header: "Booking Status",
                cell: ({ row }) => (
                    <div>
                        {
                            row.original.bookingStatus === 'confirmed' &&
                            <div className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#ECFDF3] rounded-full">
                                <div className="w-[8px] h-[8px] rounded-full bg-[#12B76A]"></div>
                                <span className="text-[#027A48]">Confirmed</span>
                            </div>
                        }
                        {
                            row.original.bookingStatus === 'panding' &&
                            <div className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#FFA500]/5 rounded-full">
                                <div className="w-[8px] h-[8px] rounded-full bg-[#FFA500]"></div>
                                <span className="text-[#FFA500]">Peding</span>
                            </div>
                        }
                        {
                            row.original.bookingStatus === 'failed' &&
                            <div className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#F44336]/5 rounded-full">
                                <div className="w-[8px] h-[8px] rounded-full bg-[#F44336]"></div>
                                <span className="text-[#F44336]">Canceled</span>
                            </div>
                        }
                    </div>
                )
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
                accessorKey: "amount",
                header: "Amount"
            },
            {
                accessorKey: "peopleQty",
                header: "Qty of People"
            },
        ]

    return(
        <>
         <div className="bg-white rounded-[20px] w-full mt-[25px]">
            <div className="p-[20px]">
                <span className="text-[16px] font-semibold">Overview</span>
            </div>
            {
                isLoading ?
                <div className="px-[20px] pb-[20px]">
                    <TableLoader />
                </div>
                :
                (
                    (overviewData?.length !== 0 ) ?
                    <div className="pb-[20px]">
                        <DataTable globalFilter={false} data={overviewData} columns={columns} />
                    </div>
                    :
                    <DefaultEmpty />
                )
            }
        </div>
        </>
    )
};