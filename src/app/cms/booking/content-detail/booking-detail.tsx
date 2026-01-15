import TableLoader from "@/app/components/loader/tableLoader";
import { bookingDetailEntityType } from "@/app/types/booking";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { updateBookingStatus, updateBookingStatusProps } from "@/app/store/slice/bookingSlice";
import { useAppDispatch } from "@/app/hook/appDispatch";
import notify from "@/app/components/alert/toastify";

interface BookingDetailCanvasProps {
    bookingDetail: bookingDetailEntityType | null;
    onClose: (value: boolean) => void;
}

export default function BookingDetailCanvas({
    bookingDetail,
    onClose
}: BookingDetailCanvasProps) {

    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isOpenbookingSelector, setIsOpenbookingSelector] = useState<boolean>(true);
    const [bookingStatusSelected, setBookingStatusSelected] = useState<"confirmed" | "panding" | "failed">("panding");

    const bookingStatusList = [
        {
            key: "confirmed",
            value: "Confirmed"
        },
        {
            key: "panding",
            value: "Panding"
        },
        {
            key: "failed",
            value: "Cancel"
        },
    ];

    useEffect(() => {
        setIsLoading(true);

        if (bookingDetail) {
            setBookingStatusSelected(bookingDetail.bookingStatus as "confirmed" | "panding" | "failed");
            setIsLoading(false);
        }
    }, [bookingDetail]);
    
    const handlerClik = () => {
        onClose(false);
        setIsOpenbookingSelector(false);
    }

    const handleChangeBkkStatus = async (value: "confirmed" | "panding" | "failed") => {
        setBookingStatusSelected(value);
        setIsOpenbookingSelector(false);

        if (value === bookingStatusSelected) return;
            
        try {
            const dataFormat: updateBookingStatusProps = {
                bookingId: bookingDetail?.bookingId as string,
                bookingStatus: value
            }
    
            const res: any = await dispatch(updateBookingStatus(dataFormat));   

            if (res.payload.status) {
                notify({
                    type: "success",
                    label: "Updating booking status successfully."
                })
            } else {
                throw "Updating booking status failed, please try again later.";
            }
        } catch (error) {
            notify({
                type: "error",
                label: error as string
            })
        }
    }

    return(
        <div className="flex flex-col gap-[24px]">
            <div>
                <button 
                    className="py-[8px] rounded-[10px] px-[10px] flex items-center gap-[5px] duration-100 ease-in-out hover:bg-gray-200"
                    onClick={handlerClik}
                >
                    <IoIosArrowBack className="text-[24px]" />
                    <span>Back to Bookings</span>
                </button>
            </div>
            <div className="border border-gray-200 w-full rounded-[10px] p-[10px]">
                {
                    isLoading ?
                    <TableLoader />
                    :
                    <div className="flex flex-col gap-[15px]">
                        <div className="flex flex-col">
                            <span className="text-[16px] font-semibold">Booking Detail</span>
                            <span>Get detailed information about the Booking.</span>
                        </div>
                        <div className="grid grid-cols-2 2xl:grid-cols-4 gap-[15px] justify-between">
                            <div className="flex flex-col">
                                <span className="font-semibold">Booking No.</span>
                                <span>{bookingDetail?.bookingId}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold">Name of booking</span>
                                <span>{bookingDetail?.booker.firstName} {bookingDetail?.booker.lastName}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold">Payment Status</span>
                                <div>
                                    {
                                        bookingDetail?.paymentStatus === 'paid' &&
                                        <div className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#ECFDF3] rounded-full">
                                            <div className="w-[8px] h-[8px] rounded-full bg-[#12B76A]"></div>
                                            <span className="text-[#027A48]">Paid</span>
                                        </div>
                                    }
                                    {
                                        bookingDetail?.paymentStatus === 'panding' &&
                                        <div className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#FFA500]/5 rounded-full">
                                            <div className="w-[8px] h-[8px] rounded-full bg-[#FFA500]"></div>
                                            <span className="text-[#FFA500]">Peding</span>
                                        </div>
                                    }
                                    {
                                        bookingDetail?.paymentStatus === 'failed' &&
                                        <div className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#F44336]/5 rounded-full">
                                            <div className="w-[8px] h-[8px] rounded-full bg-[#F44336]"></div>
                                            <span className="text-[#F44336]">Failed</span>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold">Booking Status</span>
                                <div className="w-fit relative">
                                    {
                                        bookingStatusSelected === 'confirmed' &&
                                        <button onClick={() => setIsOpenbookingSelector(!isOpenbookingSelector)} className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#ECFDF3] rounded-full">
                                            <div className="w-[8px] h-[8px] rounded-full bg-[#12B76A]"></div>
                                            <span className="text-[#027A48]">Confirmed</span>
                                            <IoIosArrowDown className="text-[#12B76A]" />
                                        </button>
                                    }
                                    {
                                        bookingStatusSelected === 'panding' &&
                                        <button onClick={() => setIsOpenbookingSelector(!isOpenbookingSelector)} className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#FFA500]/5 rounded-full">
                                            <div className="w-[8px] h-[8px] rounded-full bg-[#FFA500]"></div>
                                            <span className="text-[#FFA500]">Peding</span>
                                            <IoIosArrowDown className="text-[#FFA500]" />
                                        </button>
                                    }
                                    {
                                        bookingStatusSelected === 'failed' &&
                                        <button onClick={() => setIsOpenbookingSelector(!isOpenbookingSelector)} className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#F44336]/5 rounded-full">
                                            <div className="w-[8px] h-[8px] rounded-full bg-[#F44336]"></div>
                                            <span className="text-[#F44336]">Canceled</span>
                                            <IoIosArrowDown className="text-[#F44336]" />
                                        </button>
                                    }
                                    <div 
                                        className={` ${ isOpenbookingSelector ? '' : 'hidden' } cursor-pointer p-[5px] flex flex-col gap-[5px] duration-100 ease-in-out mt-[5px] rounded-[10px] absolute w-full drop-shadow-2xl bg-white`}
                                    >
                                        {
                                            bookingStatusList.map((data, key) => (
                                                <button
                                                    key={key}
                                                    className={` ${ data.key === bookingStatusSelected ? 'bg-gray-100' : '' } w-full cursor-pointer py-[2px] hover:bg-gray-200 duration-100 ease-in-out rounded-[5px]`}
                                                    onClick={() => handleChangeBkkStatus(data.key as "confirmed" | "panding" | "failed")}
                                                >
                                                    {data.value}
                                                </button>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 justify-between gap-[15px]">
                            <div className="flex flex-col">
                                <span className="font-semibold">Phone number</span>
                                <span>{bookingDetail?.booker.phoneNumber}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold">Email</span>
                                <span>{bookingDetail?.booker.email}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold">Package name</span>
                                <span>{bookingDetail?.packageName}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold">Totol price</span>
                                <span>{bookingDetail?.amount} THB</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold">Pick up point</span>
                                <span>{bookingDetail?.pickUpLocation}</span>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}