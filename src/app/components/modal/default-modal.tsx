import { Modal } from "antd";
import featuredIcon from "@/app/assets/images/svg/featured.svg";
import Image from "next/image";
import DefaultButton from "../button/default-button";
import DefaultOutlineButton from "../button/outline-button";

interface ModalProps {
    confirmFunc?: () => void; 
    cancalFunc?: () => void;
    title?: string;
    description?: string;
    open?: boolean;
}

export const ConfirmModal = ({
    confirmFunc,
    cancalFunc,
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
                <Image src={featuredIcon} alt="" />
            </div>
            <div className="w-full flex justify-center mt-[10px]">
                <span className="text-center font-semibold text-[16px]">{title}</span>
            </div>
            <div className="w-full flex justify-center px-[20px]">
                <span className="text-center text-gray-700">{description}</span>
            </div>
            <div className="flex justify-between items-center gap-2 mt-[25px]">
                <DefaultOutlineButton label="Cancel" onClick={cancalFunc}/>
                <DefaultButton label="Confirm" color="#00CE86" onClick={confirmFunc} />
            </div>
        </Modal>
    );
};

export const DeleteConfirmModal = ({
    confirmFunc,
    cancalFunc,
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
                <Image src={featuredIcon} alt="" />
            </div>
            <div className="w-full flex justify-center mt-[10px]">
                <span className="text-center font-semibold text-[16px]">{title}</span>
            </div>
            <div className="w-full flex justify-center px-[20px]">
                <span className="text-center text-gray-700">{description}</span>
            </div>
            <div className="flex justify-between items-center gap-2 mt-[25px]">
                <DefaultOutlineButton label="Cancel" onClick={cancalFunc}/>
                <DefaultButton label="Confirm" color="#DA391C" onClick={confirmFunc} />
            </div>
        </Modal>
    );
};