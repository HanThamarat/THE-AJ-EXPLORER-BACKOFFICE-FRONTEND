import notify from "@/app/components/alert/toastify";
import { DeleteConfirmModal } from "@/app/components/modal/default-modal";
import { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { deletePkgType } from "@/app/store/slice/pkgTypeManangementSlice";
import { useAppDispatch } from "@/app/hook/appDispatch";
import { delPromotion } from "@/app/store/slice/promotionSlice";

interface DelPromoModalProps {
    promoId:     number;
}

export default function DelPromotionModal({
    promoId
}: DelPromoModalProps) {

    const dispatch = useAppDispatch(); 
    const [modalOpne, setModalOpen] = useState<boolean>(false);

    const handleOpen = () => {
        setModalOpen(true);
    };

    const handlerClose = () => {
        setModalOpen(false);
    };

    const handleConfirm = async () => {
        try {
            const response: any = await dispatch(delPromotion(promoId));

            if (response.payload.status) {
                await setModalOpen(false);
               
                notify({
                    label: "Deleting a promotion successfully!",
                    type: 'success'
                });
            } else {
                throw response?.payload?.error ?  response?.payload?.error : "Deleting promotion something wrong."
            }
        } catch (error: any) {
            setModalOpen(false);
            notify({
                label: error,
                type: 'error'
            });
        }
    }

    return(
        <>
            <button  onClick={handleOpen} >
                <FaRegTrashAlt className="text-[18px] font-semibold text-gray-500" />
            </button>
            <DeleteConfirmModal
                open={modalOpne}
                cancalFunc={handlerClose}
                confirmFunc={handleConfirm}
                title="Do you want to Delete package promotoin?"
                description="Confirm to proceed with delete this promotion."
            />
        </>
    );
}