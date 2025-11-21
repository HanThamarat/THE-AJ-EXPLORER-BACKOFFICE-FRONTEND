"use client"

import { useEffect, useRef, useState } from "react";
import { getAllBooking } from "@/app/store/slice/bookingSlice";
import { bookingSelector } from "@/app/store/slice/bookingSlice";
import { useAppDispatch } from "@/app/hook/appDispatch";
import { useSelector } from "react-redux";
import TableLoader from "@/app/components/loader/tableLoader";
import DataTable from "@/app/components/table/dataTable";
import DefaultEmpty from "@/app/components/empty/default-emtpy";
import { bookingEntity } from "@/app/types/booking";
import { ColumnDef } from "@tanstack/react-table";
import dateFormat from "dateformat";

export default function BookingPage() {

    const dispatch = useAppDispatch();
    const { bookings } = useSelector(bookingSelector);
    const [ bookingTableData, setBookingTableData ] = useState<bookingEntity[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const isFaching = useRef(false);

    useEffect(() => {
        const fecthBooking = async () => {
            if (isFaching.current) return;
            isFaching.current = true;
            await dispatch(getAllBooking());
            isFaching.current = false;
        }

        fecthBooking();

        if (bookings?.length !== 0 && bookings !== null) {
            const bookingFormatter: bookingEntity[] = bookings.map((data, key) => ({
                index: key + 1,
                id: data.id,
                name: data.name,
                packageName: data.packageName,
                trip_at: data.trip_at,
                paymentRef: data.paymentRef,
                paymentStatus: data.paymentStatus,
                bookingStatus: data.bookingStatus,
                bookingId: data.bookingId,
                created_at: data.created_at,
                updated_at: data.updated_at
            }));

            setBookingTableData(bookingFormatter);
        }

        bookings !== null && setIsLoading(false);
    }, [dispatch, bookings]);


    const columns: ColumnDef<bookingEntity>[] = [
        {
            accessorKey: 'index',
            header: "#"
        },
        {
            accessorKey: 'bookingId',
            header: "Booking No."
        },
        {
            accessorKey: 'name',
            header: "Name"
        },
        {
            accessorKey: 'packageName',
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
            accessorKey: "trip_at",
            header: "Trip date",
            cell: ({ row }) => (
                <p>{dateFormat(row.original.trip_at, "mediumDate")}</p>
            )
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <div className="flex gap-[10px] items-center">

                </div>
            )
        }
    ]

    return(
        <>
            <div className="mt-[25px] bg-white rounded-[20px] w-full">
                <div className="p-[20px]">
                    <span className="text-[16px] font-semibold">All Booking</span>
                </div>
                {
                    isLoading ?
                    <div className="px-[20px] pb-[20px]">
                        <TableLoader />
                    </div>
                    :
                    (
                    bookingTableData.length !== 0 ?
                        <div className="pb-[20px]">
                            <DataTable data={bookingTableData} columns={columns} globalFilter={false} />
                        </div>
                        :
                        <DefaultEmpty />
                    )
                }
            </div>
        </>
    );
}