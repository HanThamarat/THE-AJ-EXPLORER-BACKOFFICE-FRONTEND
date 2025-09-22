import { Button, Modal } from 'antd';
import { useState } from "react";
import DefaultButton from '@/app/components/button/default-button';
import DefaultInput from '@/app/components/input/default-input';
import { useForm, SubmitHandler } from 'react-hook-form';
import { packageTypeDTO, packageTypeEntity, pkgTypeSchema, pkgTypeSchemaType } from '@/app/types/package';
import { zodResolver } from '@hookform/resolvers/zod';
import DefaultOutlineButton from '@/app/components/button/outline-button';
import DefaultSwitch from '@/app/components/switch/default-switch';
import { ConfirmModal } from '@/app/components/modal/default-modal';
import { useAppDispatch } from '@/app/hook/appDispatch';
import { createPkgType, updatePkgType, updatePkgTypeProps } from '@/app/store/slice/pkgTypeManangementSlice';
import { FiEdit } from "react-icons/fi";
import notify from '@/app/components/alert/toastify';

interface PkgTypeModalProps {
    pkgType?:     packageTypeEntity;
}

export default function PkgTypeModal({
    pkgType
}: PkgTypeModalProps) {

    const dispatch = useAppDispatch();
    const [openResponsive, setOpenResponsive] = useState<boolean>(false);
    const [switchValue, setSwitchValue] = useState<boolean>(true);
    const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
    const [pkgFormData, setPkgFormData] = useState<packageTypeDTO>({
        name: '',
        status: true
    });

    const handlerOpen = async () => {
        setOpenResponsive(true);
        if (pkgType) {
           reset({
            name: pkgType.name
           });
           setSwitchValue(pkgType.status);
        }
    }

    const handlerClose = async () => {
        setOpenResponsive(false);
    }

    const {
        register,
        handleSubmit,
        // reset use for reset fields in the schema
        reset,
        formState: { errors }
    } = useForm<pkgTypeSchemaType>({ resolver: zodResolver(pkgTypeSchema) });

    const onSubmit: SubmitHandler<pkgTypeSchemaType> = async (data) => {
        await setPkgFormData({
            name: data.name,
            status: switchValue
        });
        setOpenResponsive(false);
        setOpenConfirmModal(true);
    }

    const hanlderCancenConfirmModal = () => {
        setOpenResponsive(true);
        setOpenConfirmModal(false);
    }

    const hanlderConConfirmModal = async () => {
        try {
            let updatedata;

            if (pkgType) {
                updatedata = {
                    id: pkgType?.id ? pkgType.id : 0,
                    data: pkgFormData
                }
            }

            const response : any = pkgType === undefined ? 
            await dispatch(createPkgType(pkgFormData)) : 
            await dispatch(updatePkgType(updatedata as updatePkgTypeProps));
            
            if (response.payload.status) {
                await setOpenConfirmModal(false);
                await setOpenResponsive(false);
                await setSwitchValue(true);
                await reset({
                    name: ''
                });
                notify({
                    label: pkgType === undefined ? "Createing a package type successfully!" : "Updating a package type successfully!",
                    type: 'success'
                });
            } else {
                throw response?.payload?.error ?  response?.payload?.error : "Createing package type something wrong."
            }
        } catch (error: any) {
            console.log(error);
            await setOpenConfirmModal(false);
            await setOpenResponsive(true);
            notify({
                label: error,
                type: 'error'
            });
        }
    }

    return(
        <>
            <ConfirmModal 
                open={openConfirmModal} 
                cancalFunc={hanlderCancenConfirmModal} 
                confirmFunc={hanlderConConfirmModal}
                title={ pkgType === undefined ? "Do you want to Create Package Type ?" : "Do you want to Update Package Type ?" }
                description={ pkgType === undefined ? "Confirm to proceed with create this package type." : "Confirm to proceed with update this package type." }
            />
            {
                pkgType === undefined ?
                <DefaultButton label="Create New Package Type" onClick={handlerOpen} />
                :
                <button  onClick={handlerOpen} >
                    <FiEdit className="text-[18px] font-semibold text-gray-500" />
                </button>
            }
            <Modal
                title={pkgType === undefined ? "Create Package Type" : "Edit Package Type"}
                centered
                open={openResponsive}
                footer={false}
                onCancel={() => setOpenResponsive(false)}
                width={{
                xs: '90%',
                sm: '80%',
                md: '70%',
                lg: '60%',
                xl: '50%',
                xxl: '40%',
                }}
            >
                <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
                    <div className='my-[20px] flex items-start gap-2'>
                        <DefaultSwitch value={switchValue} onChange={(e) => setSwitchValue(e)} />
                            <div>
                                <span className='font-medium'>Available for active</span>
                                <p className='block text-gray-700'>The package type is currently in use and available.</p>
                            </div>
                    </div>
                    <div>
                        <DefaultInput label='Type name *' placeholder='Please enter package type name' {...register("name")} />
                        { errors.name && <span className='text-red-500'>{errors.name.message}</span> }
                    </div>
                    <div className='flex justify-end w-full mt-[20px] gap-2'>
                        <div>
                              <DefaultOutlineButton onClick={handlerClose} label="Cancel" />
                        </div>
                        <div>
                             <DefaultButton type='submit' label={pkgType === undefined ? "Create New Package Type" : "Update Package Type"} />
                        </div>
                    </div>
                </form>
            </Modal>
        </>
    );
}