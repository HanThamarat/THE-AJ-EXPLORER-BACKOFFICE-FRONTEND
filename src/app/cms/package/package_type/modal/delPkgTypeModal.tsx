import notify from "@/app/components/alert/toastify";
import { DeleteConfirmModal } from "@/app/components/modal/default-modal";
import { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { deletePkgType } from "@/app/store/slice/pkgTypeManangementSlice";
import { useAppDispatch } from "@/app/hook/appDispatch";

interface PkgTypeModalProps {
    pkgTypeId:     number;
}

export default function DelPkgTypeModal({
    pkgTypeId
}: PkgTypeModalProps) {

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
            const response: any = await dispatch(deletePkgType(pkgTypeId));

            if (response.payload.status) {
                await setModalOpen(false);
               
                notify({
                    label: "Deleting a package type successfully!",
                    type: 'success'
                });
            } else {
                throw response?.payload?.error ?  response?.payload?.error : "Deleting package type something wrong."
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
                title="Do you want to Delete package type?"
                description="Confirm to proceed with delete this cpackage type."
            />
        </>
    );
}