import notify from "@/app/components/alert/toastify";
import TableLoader from "@/app/components/loader/tableLoader";
import { ConfirmModal } from "@/app/components/modal/default-modal";
import { useAppDispatch } from "@/app/hook/appDispatch";
import { CurrencyConvert } from "@/app/hook/currencyConvertion";
import { updateCancel, updateCancelProps } from "@/app/store/slice/cancelSlice";
import { cancelDetailEntityType } from "@/app/types/cancel";
import { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

interface CancelDetailProps {
    isLoading: boolean;
    cancelDetail?: cancelDetailEntityType | null;
}

export default function CancelDetail({
    isLoading,
    cancelDetail
}: CancelDetailProps) {

    if (isLoading === true || cancelDetail === null) {
        return(
            <div className="flex flex-col gap-[10px]">
                <TableLoader />
                <TableLoader />
            </div>
        );
    }

    const dispatch = useAppDispatch();
    const [cancelSelected, setcancelStatusSelected] = useState<"confirmed" | "panding" | "failed">("panding");
    const [isOpencancelSelector, setIsOpencancelSelector] = useState<boolean>(false);
    const [isOpenfirmModal, setIsOpenModal] = useState<boolean>(false);
    const [cancelDTO, setCancelDTO] = useState<updateCancelProps | null>();

    const handlerChangeCancelStatus = (value: "confirmed" | "panding" | "failed") => {
        setcancelStatusSelected(value);
        setIsOpencancelSelector(false);

        if (value === cancelSelected) return;

        const dataDTO: updateCancelProps = {
            bookingId: cancelDetail?.bookingId as string,
            cancelStatus: value
        };
        
        setCancelDTO(dataDTO);
        setIsOpenModal(true);
    };

    const handlerComfirmCancel = async () => {
        try {
            if (!cancelDTO) {
                setIsOpenModal(false);
                return;
            }
            
            const response: any = await dispatch(updateCancel(cancelDTO));

            if (response.payload.status) {
                setIsOpenModal(false);
                notify({
                    type: "success",
                    label: "Updating cancel status successfully."
                })
            } else {
                throw "Updating cancel status failed, please try again later.";
            }
        } catch (error) {
            setIsOpenModal(false);
            notify({
                type: "error",
                label: error as string
            });
        }
    };

    const StatusList = [
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
        if (cancelDetail) setcancelStatusSelected(cancelDetail.cancelStatus as "confirmed" | "panding" | "failed");
    }, [cancelDetail]);

    return(
        <>
        <ConfirmModal
            title="Do you wanna cancel booking?"
            description="This process is cancel a booking."
            cancalFunc={() => setIsOpenModal(false)}
            confirmFunc={handlerComfirmCancel}
            open={isOpenfirmModal}
        />
        <div className="mt-[24px] w-full flex flex-col gap-[24px] border border-gray-200 rounded-[15px] p-[20px]">
            <div className="flex flex-col">
                <span className="text-[18px] font-semibold">Cancel Detail</span>
                <span>Get detailed information about the cancel.</span>
            </div>
            <div className="grid grid-cols-2 2xl:grid-cols-4 gap-[15px] justify-between">
                <div className="flex flex-col">
                    <span className="font-semibold">Booking No.</span>
                    <span>{cancelDetail?.bookingId}</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold">Name of booking</span>
                    <span>{cancelDetail?.bookerName}</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold">Payment Status</span>
                    <div>
                        {
                            cancelDetail?.paymentStatus === 'paid' &&
                            <div className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#ECFDF3] rounded-full">
                                <div className="w-[8px] h-[8px] rounded-full bg-[#12B76A]"></div>
                                <span className="text-[#027A48]">Paid</span>
                            </div>
                        }
                        {
                            cancelDetail?.paymentStatus === 'panding' &&
                            <div className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#FFA500]/5 rounded-full">
                                <div className="w-[8px] h-[8px] rounded-full bg-[#FFA500]"></div>
                                <span className="text-[#FFA500]">Peding</span>
                            </div>
                        }
                        {
                            cancelDetail?.paymentStatus === 'failed' &&
                            <div className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#F44336]/5 rounded-full">
                                <div className="w-[8px] h-[8px] rounded-full bg-[#F44336]"></div>
                                <span className="text-[#F44336]">Failed</span>
                            </div>
                        }
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold">Cancel Status</span>
                    <div className="w-fit relative">
                        {
                            cancelSelected === 'confirmed' &&
                            <button onClick={() => setIsOpencancelSelector(!isOpencancelSelector)} className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#ECFDF3] rounded-full">
                                <div className="w-[8px] h-[8px] rounded-full bg-[#12B76A]"></div>
                                <span className="text-[#027A48]">Confirmed</span>
                                <IoIosArrowDown className="text-[#12B76A]" />
                            </button>
                        }
                        {
                            cancelSelected === 'panding' &&
                            <button onClick={() => setIsOpencancelSelector(!isOpencancelSelector)} className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#FFA500]/5 rounded-full">
                                <div className="w-[8px] h-[8px] rounded-full bg-[#FFA500]"></div>
                                <span className="text-[#FFA500]">Peding</span>
                                <IoIosArrowDown className="text-[#FFA500]" />
                            </button>
                        }
                        {
                            cancelSelected === 'failed' &&
                            <button onClick={() => setIsOpencancelSelector(!isOpencancelSelector)} className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#F44336]/5 rounded-full">
                                <div className="w-[8px] h-[8px] rounded-full bg-[#F44336]"></div>
                                <span className="text-[#F44336]">Canceled</span>
                                <IoIosArrowDown className="text-[#F44336]" />
                            </button>
                        }
                        <div 
                            className={` ${ isOpencancelSelector ? '' : 'hidden' } cursor-pointer p-[5px] flex flex-col gap-[5px] duration-100 ease-in-out mt-[5px] rounded-[10px] absolute w-full drop-shadow-2xl bg-white`}
                        >
                            {
                                StatusList.map((data, key) => (
                                    <button
                                        key={key}
                                        className={` ${ data.key === cancelSelected ? 'bg-gray-100' : '' } w-full cursor-pointer py-[2px] hover:bg-gray-200 duration-100 ease-in-out rounded-[5px]`}
                                        onClick={() => handlerChangeCancelStatus(data.key as "confirmed" | "panding" | "failed")}
                                    >
                                        {data.value}
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-x-[15px] gap-y-[24px]">
                <div className="flex flex-col">
                    <span className="font-semibold">Phone number</span>
                    <span>{cancelDetail?.phoneNumber}</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold">Eamil</span>
                    <span>{cancelDetail?.email}</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold">Package name</span>
                    <span>{cancelDetail?.packageName}</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold">Total paid</span>
                    <span>{CurrencyConvert.currencyConvertToThai(cancelDetail?.amount as number)} THB</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold">Refund percent</span>
                    <span>{cancelDetail?.refundPercentage}%</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold">Refund amount</span>
                    <span>{CurrencyConvert.currencyConvertToThai(cancelDetail?.refundAmount as number)} THB</span>
                </div>
            </div>
        </div>
        </>
    );
}