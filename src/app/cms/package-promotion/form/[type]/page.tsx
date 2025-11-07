"use client"

import DefaultSwitch from "@/app/components/switch/default-switch";
import { PromotionDTO, PromotionSchema, promotionType } from "@/app/types/promotion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useSearchParams } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import DefaultInput from "@/app/components/input/default-input";
import CvMultipleDatePicker from "@/app/components/datePIcker/cvMultipleDatePicker";
import DefaultTextArea from "@/app/components/textarea/default-textarea";
import DefaultOutlineButton from "@/app/components/button/outline-button";
import PromotionLink from "./component/promolink";
import { useRouter } from "next/navigation";
import DefaultButton from "@/app/components/button/default-button";
import { useEffect, useRef, useState } from "react";
import { ConfirmModal } from "@/app/components/modal/default-modal";
import notify from "@/app/components/alert/toastify";
import { useAppDispatch } from "@/app/hook/appDispatch";
import { createNewPromotion, UpdatePromoPropsType, updatePromotion } from "@/app/store/slice/promotionSlice";
import { useSelector } from "react-redux";
import { promotionSelector } from "@/app/store/slice/promotionSlice";
import { getPromotionById } from "@/app/store/slice/promotionSlice";
import TableLoader from "@/app/components/loader/tableLoader";

export default function PromotionForm() {

    const dispatch = useAppDispatch();
    const { promotion } = useSelector(promotionSelector);
    const param = useParams();
    const router = useRouter();
    const pageType  = param.type as 'promotion' | 'coupon';
    const searchParams = useSearchParams();
    const promo_id = searchParams.get("promo_id");
    const [promotionData, setPromotionData] = useState<PromotionDTO>();
    const [openConfirmModal, setopenConfirmModal] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [pageIsLoading, setPageLaoding] = useState<boolean>(true);
    const isFaching = useRef(false);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors }
    } = useForm<promotionType>({ resolver: zodResolver(PromotionSchema) });

    useEffect(() => {
        if (promo_id) {
            const fetchPromo = async () => {
            if (isFaching.current) return;
            isFaching.current = true;

            await dispatch(getPromotionById(Number(promo_id)));

            isFaching.current = false;
            };

            if (!promotion) fetchPromo();
        } else {
            reset();
            setPageLaoding(false);
        }
    }, [dispatch, promo_id]);

    useEffect(() => {
        if (promotion && promo_id) {
            reset({
                promoName: promotion.promoName,
                date: [
                    promotion.startDate instanceof Date ? promotion.startDate.toISOString() : promotion.startDate ?? null,
                    promotion.endDate instanceof Date ? promotion.endDate.toISOString() : promotion.endDate ?? null
                ],
                description: promotion?.description ?? "",
                couponCode: promotion?.couponCode ?? "",
                status: promotion.status as boolean,
                packagePromoLink: promotion.packagePromoLink
                    ? promotion.packagePromoLink.map((data) => ({
                        packageLink: data.pakcageId,
                        percentage: data.percentage,
                    }))
                    : [],
                });

                // delay state change to after reset takes effect
                setTimeout(() => {
                    setPageLaoding(false);
                }, 0);
        } 
    }, [promotion, reset]);

    const handlerSubmittion: SubmitHandler<promotionType> = async (data) => {
        const dataFormat: PromotionDTO = {
            promoName: data.promoName,
            type: pageType,
            couponCode: data?.couponCode ?? "",
            description: data?.description ?? "",
            startDate: data.date[0] ? data.date[0] : "",
            endDate: data.date[1] ? data.date[1] : "",
            PromoLink: data.packagePromoLink,
            status: data.status,
        };
        setPromotionData(dataFormat);
        setopenConfirmModal(true);
    };

    const handlerConfirm = async () => {
        try {
            setIsLoading(true);
            setopenConfirmModal(false);

            let data: UpdatePromoPropsType = {};

            if (promo_id) {
                data = {
                    id: Number(promo_id),
                    data: promotionData
                };
            }

            const response: any = promo_id ? await dispatch(updatePromotion(data)) : await dispatch(createNewPromotion(promotionData));
            if (response.payload.status) {
                await setIsLoading(false);
                await reset();
                notify({
                    label: pageType === 'promotion' ? (promo_id ? "Updating a package promotion successfully!" : "Createing a package promotion successfully!") : (promo_id ? "Updating a package coupon successfully!" : "Createing a package coupon successfully!"),
                    type: 'success'
                });
                router.push('/cms/package-promotion');
            } else {
                throw response?.payload?.error ?  response?.payload?.error :  "Updating something wrong.";
            }
        } catch (error: any) {
            await setIsLoading(false);
            await setopenConfirmModal(false);
            notify({
                label: error,
                type: 'error'
            });
        }
    };

    const handleGencode = () => {
        const length = 8;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            result += chars[randomIndex];
        }
        reset({
            couponCode: result,
        });
    }

    return(
        <>
        <ConfirmModal    
            title={ 
                pageType === "promotion" ? 
                `${promo_id ? 'Do you want to Update Package Promotion ?' : 'Do you want to Create Package Promotion ?'}`
                : 
                `${promo_id ? 'Do you want to Update Package Coupon ?' : 'Do you want to Create Package Coupon ?' }` 
            }
            description={ 
                pageType === "promotion" ? 
                `${promo_id ? 'Confirm to proceed with Updation this package promotion.' : 'Confirm to proceed with Creation this package promotion.' }`
                : 
                `${ promo_id ? 'Confirm to proceed with update this package coupon' : 'Confirm to proceed with Creation this package coupon' }` 
            }
            open={openConfirmModal}
            confirmFunc={handlerConfirm}
            cancalFunc={() => setopenConfirmModal(false)}
        />
        <form onSubmit={handleSubmit(handlerSubmittion)} className="w-full">
            <div className="mt-[20px]">
                <span className="text-[18px] font-medium">{ pageType === 'promotion' ? `${ promo_id ? 'Update Package Promotion'  : 'Create New Package Promotion'}` : `${ promo_id ? 'Update Coupon' : 'Create New Coupon' }` }</span>
                <span className="block text-gray-600">{ pageType === 'promotion' ? "Please enter form below for create your package promotion." : "Please enter form below for create your coupon." }</span>
            </div>
            <div className="w-full p-[20px] bg-white mt-[10px] rounded-[20px] gap-[10px]">
                {
                    pageIsLoading ?
                    <TableLoader />
                    :
                    <div className="w-full">
                        <div className="flex items-start gap-3">
                            <Controller
                                name="status"
                                control={control}
                                rules={{ required: "Package type is required" }}
                                render={({ field }) => (
                                    <DefaultSwitch 
                                        value={field.value ?? true}
                                        onChange={(e) => field.onChange(Boolean(e))} 
                                    />
                                )}
                            />
                            <div>
                                <span className="font-semibold">Active the package</span>
                                <p className="text-gray-700">The active status indicates that the package is currently available.</p>
                            </div>
                        </div>
                        <div className="mt-[24px] grid grid-cols-2 gap-[10px]">
                            <div className="w-full">
                                <DefaultInput
                                    label={pageType === 'promotion' ? "Promotiom name*" : "Coupon name*" }
                                    placeholder={ pageType === 'promotion' ? "Enter promotion name." : "Enter coupon name" }
                                    {...register("promoName")}
                                />
                                { errors.promoName && <span className='text-red-500'>{errors.promoName.message}</span> }
                            </div>
                            <div className="w-full">
                                <Controller
                                    control={control}
                                    name="date"
                                    render={({ field }) => (
                                        <CvMultipleDatePicker
                                            label={ pageType ? "Promotion Date*" : "Coupon Date*" }
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        {
                            pageType === 'coupon' && 
                            <div className="w-full flex justify-between gap-[10px] mt-[24px]">
                                <div className="w-full">
                                    <DefaultInput
                                        label="Coupon Code*"
                                        placeholder="Enter coupon code"
                                        {...register("couponCode")} 
                                    />
                                    { errors.couponCode && <span className='text-red-500'>{errors.couponCode.message}</span> }
                                </div>
                                <div className="w-[10%]">
                                    <div className="h-[19.5px]"></div>
                                    <DefaultOutlineButton
                                        label="Generate"
                                        onClick={handleGencode}
                                    />
                                </div>
                            </div>
                        }
                        <div className="mt-[24px]">
                            <DefaultTextArea
                                label="Description"
                                placeholder="Enter description"
                                {...register("description")}
                            />
                            { errors.description && <span className='text-red-500'>{errors.description.message}</span> }
                        </div>
                        <div className="w-full mt-[24px]">
                            { 
                                pageIsLoading ?
                                <TableLoader />
                                :
                                <Controller    
                                    control={control}
                                    name="packagePromoLink"
                                    render={({ field }) => (
                                        <PromotionLink 
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            }
                        
                        </div>
                        <div className="w-full mt-[24px] flex justify-end">
                            <div className="w-[45%] flex justify-between gap-[10px] items-center">
                                <DefaultOutlineButton
                                    type="button"
                                    onClick={() => router.back()}
                                    label="Cancel"
                                />
                                <DefaultButton
                                    type="submit"
                                    isLoading={isLoading}
                                    label={ pageType === 'promotion' ? `${ promo_id ? 'Update Promotion' : 'Create New Promotion' }` : `${promo_id ? 'Update Coupon' : 'Create New Coupon'}` }
                                />
                            </div>
                        </div>
                    </div>
                }
            </div>
        </form>
        </>
    );
}