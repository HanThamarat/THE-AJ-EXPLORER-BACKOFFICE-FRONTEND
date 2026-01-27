import notify from "@/app/components/alert/toastify";
import TableLoader from "@/app/components/loader/tableLoader";
import { ConfirmModal } from "@/app/components/modal/default-modal";
import { useAppDispatch } from "@/app/hook/appDispatch";
import { CurrencyConvert } from "@/app/hook/currencyConvertion";
import { updateRefund, updateRefundProps } from "@/app/store/slice/refundSlice";
import { refundDetailType } from "@/app/types/refund";
import { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

interface RefundDetailProps {
    isLoading: boolean;
    refundData?: refundDetailType | null;
}

export default function RefundDetail({
    isLoading,
    refundData
}: RefundDetailProps) {

    if (isLoading === true || refundData == null) {
        return(
            <div className="flex flex-col gap-[20px]">
            <TableLoader />
            <TableLoader />
            </div>
        );
    }

    const dispatch = useAppDispatch();
    const [refundDTO, setRefundDTO] = useState<updateRefundProps | null>();
    const [refundSelected, setRefundStatusSelected] = useState<"refunded" | "panding" | "failed">("panding");
    const [isOpenRefundSelector, setIsOpenRefundSelector] = useState<boolean>(false);
    const [isOpenfirmModal, setIsOpenModal] = useState<boolean>(false);

    const StatusList = [
        {
            key: "refunded",
            value: "Refunded"
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

    const handleChangeStatus = async (value: "refunded" | "panding" | "failed") => {
        setRefundStatusSelected(value);
        setIsOpenRefundSelector(false);

        if (value === refundSelected) return;

        setRefundDTO({
            booking: refundData.bookingId as string,
            refundStatus: value
        });
        
        setIsOpenModal(true);
    }

    const handlerComfirmRefund = async () => {
        try {
            if (!refundDTO) {
                setIsOpenModal(false);
                return;
            }
            
            const response: any = await dispatch(updateRefund(refundDTO));

            if (response.payload.status) {
                setIsOpenModal(false);
                notify({
                    type: "success",
                    label: "Updating refund status successfully."
                })
            } else {
                throw "Updating refund status failed, please try again later.";
            }
        } catch (error) {
            setIsOpenModal(false);
            notify({
                type: "error",
                label: error as string
            });
        }
    };

    useEffect(() => {

        if (refundData) setRefundStatusSelected(refundData.refundStatus as "refunded" | "panding" | "failed");

    } , [refundData]);


    return(
        <>
        <ConfirmModal
            title="Do you wanna refund booking?"
            description="This process is refund a booking."
            cancalFunc={() => setIsOpenModal(false)}
            confirmFunc={handlerComfirmRefund}
            open={isOpenfirmModal}
        />
        <div className="mt-[24px] w-full flex flex-col gap-[24px] border border-gray-200 rounded-[15px] p-[20px]">
            <div className="flex flex-col">
                <span className="text-[18px] font-semibold">Refund Detail</span>
                <span>Get detailed information about the refund.</span>
            </div>
            <div className="grid grid-cols-2 2xl:grid-cols-4 gap-[15px] justify-between">
                <div className="flex flex-col">
                    <span className="font-semibold">Booking No.</span>
                    <span>{refundData?.bookingId}</span>
                </div>
                 <div className="flex flex-col">
                    <span className="font-semibold">Name of booking</span>
                    <span>{refundData?.bookerName}</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold">Payment Status</span>
                    <div>
                        {
                            refundData?.paymentStatus === 'paid' &&
                            <div className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#ECFDF3] rounded-full">
                                <div className="w-[8px] h-[8px] rounded-full bg-[#12B76A]"></div>
                                <span className="text-[#027A48]">Paid</span>
                            </div>
                        }
                        {
                            refundData?.paymentStatus === 'panding' &&
                            <div className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#FFA500]/5 rounded-full">
                                <div className="w-[8px] h-[8px] rounded-full bg-[#FFA500]"></div>
                                <span className="text-[#FFA500]">Peding</span>
                            </div>
                        }
                        {
                            refundData?.paymentStatus === 'failed' &&
                            <div className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#F44336]/5 rounded-full">
                                <div className="w-[8px] h-[8px] rounded-full bg-[#F44336]"></div>
                                <span className="text-[#F44336]">Failed</span>
                            </div>
                        }
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold">Refund Status</span>
                    {
                        (refundData?.refundStatus !== 'refunded' && refundData?.refundStatus !== 'failed') &&
                        <div className="w-fit relative">
                            {
                                refundSelected === 'refunded' &&
                                <button onClick={() => setIsOpenRefundSelector(!isOpenRefundSelector)} className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#ECFDF3] rounded-full">
                                    <div className="w-[8px] h-[8px] rounded-full bg-[#12B76A]"></div>
                                    <span className="text-[#027A48]">Refunded</span>
                                    <IoIosArrowDown className="text-[#12B76A]" />
                                </button>
                            }
                            {
                                refundSelected === 'panding' &&
                                <button onClick={() => setIsOpenRefundSelector(!isOpenRefundSelector)} className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#FFA500]/5 rounded-full">
                                    <div className="w-[8px] h-[8px] rounded-full bg-[#FFA500]"></div>
                                    <span className="text-[#FFA500]">Peding</span>
                                    <IoIosArrowDown className="text-[#FFA500]" />
                                </button>
                            }
                            {
                                refundSelected === 'failed' &&
                                <button onClick={() => setIsOpenRefundSelector(!isOpenRefundSelector)} className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#F44336]/5 rounded-full">
                                    <div className="w-[8px] h-[8px] rounded-full bg-[#F44336]"></div>
                                    <span className="text-[#F44336]">Canceled</span>
                                    <IoIosArrowDown className="text-[#F44336]" />
                                </button>
                            }
                            <div 
                                className={` ${ isOpenRefundSelector ? '' : 'hidden' } cursor-pointer p-[5px] flex flex-col gap-[5px] duration-100 ease-in-out mt-[5px] rounded-[10px] absolute w-full drop-shadow-2xl bg-white`}
                            >
                                {
                                    StatusList.map((data, key) => (
                                        <button
                                            key={key}
                                            className={` ${ data.key === refundSelected ? 'bg-gray-100' : '' } w-full cursor-pointer py-[2px] hover:bg-gray-200 duration-100 ease-in-out rounded-[5px]`}
                                            onClick={() => handleChangeStatus(data.key as "refunded" | "panding" | "failed")}
                                        >
                                            {data.value}
                                        </button>
                                    ))
                                }
                            </div>
                        </div>
                    }
                    {
                        (refundData?.refundStatus === 'refunded' || refundData?.refundStatus === 'failed') &&
                        <div>
                            {
                                refundData?.refundStatus === 'refunded' &&
                                <div className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#ECFDF3] rounded-full">
                                    <div className="w-[8px] h-[8px] rounded-full bg-[#12B76A]"></div>
                                    <span className="text-[#027A48]">Refunded</span>
                                </div>
                            }
                            {
                                refundData?.refundStatus === 'panding' &&
                                <div className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#FFA500]/5 rounded-full">
                                    <div className="w-[8px] h-[8px] rounded-full bg-[#FFA500]"></div>
                                    <span className="text-[#FFA500]">Peding</span>
                                </div>
                            }
                            {
                                refundData?.refundStatus === 'failed' &&
                                <div className="flex items-center w-fit py-[2px] px-[10px] gap-[10px] bg-[#F44336]/5 rounded-full">
                                    <div className="w-[8px] h-[8px] rounded-full bg-[#F44336]"></div>
                                    <span className="text-[#F44336]">Failed</span>
                                </div>
                            }
                        </div>
                    }
                </div>
            </div>
            <div className="grid grid-cols-2 gap-x-[15px] gap-y-[24px]">
                <div className="flex flex-col">
                    <span className="font-semibold">Package name</span>
                    <span>{refundData?.packageName}</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold">Payment method</span>
                    <span>{refundData?.paymentMethod}</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold">Total paid</span>
                    <span>{CurrencyConvert.currencyConvertToThai(refundData?.amount as number)} THB</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold">Refund percent</span>
                    <span>{refundData?.refundPercentahe}%</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold">Refund amount</span>
                    <span>{CurrencyConvert.currencyConvertToThai(refundData?.refundAmount as number)} THB</span>
                </div>
            </div>
        </div>
        {
            refundData.bankInfo.accountNumber !== "no data" &&
            <div className="mt-[24px] w-full flex flex-col gap-[24px] border border-gray-200 rounded-[15px] p-[20px]">
                <div className="flex flex-col">
                    <span className="text-[18px] font-semibold">Bank Information</span>
                    <span>Get detailed information about the client bank.</span>
                </div>
                <div className="grid grid-cols-2 gap-[15px] justify-between">
                    <div className="flex flex-col">
                        <span className="font-semibold">Account First Name</span>
                        <span>{refundData.bankInfo.accountFirstName}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold">Account Last Name</span>
                        <span>{refundData.bankInfo.accountLastName}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold">Bank</span>
                        <span>{refundData.bankInfo.bankName}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold">Account Number</span>
                        <span>{refundData.bankInfo.accountNumber}</span>
                    </div>
                </div>
            </div>
        }
        </>
    )
}