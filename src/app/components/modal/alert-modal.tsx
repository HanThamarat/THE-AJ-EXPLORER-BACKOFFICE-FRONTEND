
import { Modal } from "antd";
import featuredIcon from "@/app/assets/images/svg/featured.svg";
import Image from "next/image";
import { IoWarningOutline } from "react-icons/io5";
import DefaultOutlineButton from "../button/outline-button";

interface ModalProps {
    confirmFunc?: () => void; 
    title?: string;
    description?: string;
    open?: boolean;
}

export const WarningModal = ({
    confirmFunc,
    title,
    description,
    open = false
}: ModalProps) => {
    return(
         <Modal
            centered
            footer={false}
            open={open}
            width={350}
            closable={false}
        >
            <div className="w-full flex justify-center">
                <div className="flex justify-center items-center w-[30px] h-[30px] rounded-full bg-[#99cc33]/10 outline-[5px] outline-[#99cc33]/30">
                    <IoWarningOutline className="text-[18px] text-[#99cc33]" />
                </div>
            </div>
            <div className="w-full flex justify-center mt-[10px]">
                <span className="text-center font-semibold text-[16px]">{title}</span>
            </div>
            <div className="w-full flex justify-center px-[20px]">
                <span className="text-center text-gray-700">{description}</span>
            </div>
            <div className="w-full mt-[25px]">
                <DefaultOutlineButton label="Confirm" onClick={confirmFunc}/>
            </div>
        </Modal>
    );
};