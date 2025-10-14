"use client"

import Image from "next/image";
import Mockup from "@/app/assets/images/svg/mockup_1.svg";
import BenefitMockup from "@/app/assets/images/svg/benefit.svg";
import DefaultSwitch from "@/app/components/switch/default-switch";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/app/hook/appDispatch";
import MapMarker from "@/app/components/map/mapMarker";
import DefaultSelector, { SelectorOptionTpye } from "@/app/components/select/default-selector";
import DefaultInput from "@/app/components/input/default-input";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { PackageDTO, packageSchema } from "@/app/types/package";
import { zodResolver } from "@hookform/resolvers/zod";
import DefaultButton from "@/app/components/button/default-button";
import { getAllPkgType } from "@/app/store/slice/pkgTypeManangementSlice";
import { pkgTypeSelector } from "@/app/store/slice/pkgTypeManangementSlice";
import { geolocationSelector } from "@/app/store/slice/geolocationSlice";
import { getAllProvinces, getDistrictByProId } from "@/app/store/slice/geolocationSlice";
import { districtEntity, subDistrictEntity } from "@/app/types/geolocation";
import dynamic from "next/dynamic";
import TableLoader from "@/app/components/loader/tableLoader";
import PackagOtpSvg from "@/app/assets/images/svg/package_option_mockup.svg";
import FileMockup from "@/app/assets/images/svg/file_mocup.svg";
import { useRouter } from "next/navigation";
import DefaultOutlineButton from "@/app/components/button/outline-button";

// components
const AttractionList = dynamic(() => import("./components/atractionList"), {
    loading: () => <TableLoader />,
    ssr: false
});
const IncludeList = dynamic(() => import("./components/includeList"), {
    loading: () =>  <TableLoader />,
    ssr: false
});
const NotInclueList = dynamic(() => import("./components/not-includeList"), {
    loading: () => <TableLoader />,
    ssr: false
});
const TextEditor = dynamic(() => import("@/app/components/textarea/text-editor"), {
  ssr: false,
});
const PackageOption = dynamic(() => import("./components/pakcageOption"), {
    loading: () => <TableLoader />,
    ssr: false,
});
const FileUploadState = dynamic(() => import("./components/uploadState"), {
    loading: () => <TableLoader />,
    ssr: false,
});



export default function PacakageForm() {

    const dispatch = useAppDispatch();
    const router = useRouter();
    const { pkgTypes } = useSelector(pkgTypeSelector);
    const { province } = useSelector(geolocationSelector);
    const isFachingPkgType = useRef(false);
    const isFachingProvince = useRef(false);

    // option
    const [pkgTypeOption, setPkgTypeOption] = useState<SelectorOptionTpye[]>();
    const [provinceOption, setProvinceOption] = useState<SelectorOptionTpye[]>();
    const [districtOption, setDistrictOption] = useState<SelectorOptionTpye[]>();
    const [subdistrictOption, setSubdistrictOptionOption] = useState<SelectorOptionTpye[] | undefined>();

    // storange
    const [districtStore, setDistrictStore] = useState<districtEntity[]>();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors }
    } = useForm<PackageDTO>({ resolver: zodResolver(packageSchema) });

    const onSubmit: SubmitHandler<PackageDTO> = async (data) => {
        console.log(data);
    }

    const onInvalid = (errors: any) => {
    console.log("❌ Validation errors:", errors);
    };

    useEffect(() => {
        const getProvinces = async () => {
            if (isFachingProvince.current) return;
            isFachingProvince.current = true;
            await dispatch(getAllProvinces());
            isFachingProvince.current = false;
        }

        province === null && getProvinces();

        if (province?.length !== 0) {
            const provinceDataFormat: SelectorOptionTpye[] = province ? province.map((data) => ({
                value: Number(data.id),
                label: data.nameEn
            })) : [];
            setProvinceOption(provinceDataFormat);
        }
    }, [dispatch, province]);

    useEffect(() => {
        const getPkgTYP = async () => {
            if (isFachingPkgType.current) return;
            isFachingPkgType.current = true;
            await dispatch(getAllPkgType());
            isFachingPkgType.current = false;
        }

        pkgTypes === null && getPkgTYP();

        if (pkgTypes?.length !== 0) {
            const pkgTypeDataFormat: SelectorOptionTpye[] = pkgTypes ? pkgTypes.map((data) => ({
                value: Number(data.id),
                label: data.name
            })) : [];
            
            setPkgTypeOption(pkgTypeDataFormat);
        }
    }, [dispatch, pkgTypes]);

    const onChangeProvince = async (data: number) => {
        setDistrictOption([]);
        setSubdistrictOptionOption([]);
        const district: any = await dispatch(getDistrictByProId(data));
        setDistrictStore(district?.payload?.data);
        const districtFormat: SelectorOptionTpye[] = district?.payload?.data.map((data: districtEntity) => ({
            value: Number(data.id),
            label: data.nameEn
        }));

        setDistrictOption(districtFormat);
    }

    const handlerChangeDisTrict = async (data: number) => {
        setSubdistrictOptionOption([]);
        const fillterSubDis = await districtStore?.filter((dis) => dis.id === data);
        const subDistrictFormat : SelectorOptionTpye[] | undefined =  fillterSubDis ? fillterSubDis[0].subdistricts?.map((data: subDistrictEntity) => ({
            value: Number(data.id),
            label: data.nameEn
        })) : [];
        setSubdistrictOptionOption(subDistrictFormat);
    }

    return(
        <>
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="w-full">
            <div className="mt-[20px]">
                <span className="text-[18px] font-medium">Create New Package</span>
                <span className="block text-gray-600">Please enter form below for create your package.</span>
            </div>
            <div className="w-full p-[20px] bg-white mt-[10px] rounded-[20px] flex justify-between gap-[10px]">
                <div className="w-full">
                    <div className="flex items-start gap-3">
                        <Controller
                            name="status"
                            control={control}
                            rules={{ required: "Package type is required" }}
                            render={({ field }) => (
                                <DefaultSwitch 
                                    value={field.value} 
                                    onChange={(e) => field.onChange(Boolean(e))} 
                                />
                            )}
                        />
                        <div>
                            <span className="font-semibold">Active the package</span>
                            <p className="text-gray-700">The active status indicates that the package is currently available.</p>
                        </div>
                    </div>
                    <div className="mt-[20px] flex justify-center gap-[10px]">
                        <div className="w-[40%]">
                            <Controller
                                name="packageTypeId"
                                control={control}
                                rules={{ required: "Package type is required" }}
                                render={({ field }) => (
                                    <DefaultSelector
                                    label="Package type*"
                                    placeholder="Please select package type"
                                    option={pkgTypeOption}
                                    value={field.value}
                                    onChange={(value) => field.onChange(Number(value))}
                                    />
                                )}
                            />
                            {errors.packageTypeId && (<span className="text-red-500">{errors.packageTypeId.message}</span>)}
                        </div>
                        <div className="w-full">
                            <DefaultInput placeholder="Please enter package name" label="Package name*" {...register('packageName')} />
                            { errors.packageName && <span className='text-red-500'>{errors.packageName.message}</span> }
                        </div>
                    </div>
                    <div className="my-[20px]">
                        <span className="font-semibold">Attraction Address</span>
                        <p className="text-gray-500 mb-[5px]">Enter attraction address below for set package address.</p>
                        <div className="grid-cols-3 grid gap-[10px]">
                            <div className="w-full">
                                <Controller
                                    name="provinceId"
                                    control={control}
                                    rules={{ required: "Package type is required" }}
                                    render={({ field }) => (
                                        <DefaultSelector
                                        label="Province *"
                                        placeholder="Please select province"
                                        option={provinceOption}
                                        value={field.value}
                                        onChange={(value) => {
                                            field.onChange(Number(value));
                                            onChangeProvince(value);
                                        }}
                                        />
                                    )}
                                />
                                {errors.provinceId && (<span className="text-red-500">{errors.provinceId.message}</span>)}
                            </div>
                            <div className="w-full">
                                <Controller
                                    name="districtId"
                                    control={control}
                                    rules={{ required: "Package type is required" }}
                                    render={({ field }) => (
                                        <DefaultSelector
                                        label="District *"
                                        placeholder="Please select district"
                                        option={districtOption}
                                        value={field.value}
                                        onChange={(value) => {
                                            field.onChange(Number(value));
                                            handlerChangeDisTrict(Number(value));
                                        }}
                                        />
                                    )}
                                />
                                {errors.districtId && (<span className="text-red-500">{errors.districtId.message}</span>)}
                            </div>
                            <div className="w-full">
                                <Controller
                                    name="subDistrictId"
                                    control={control}
                                    rules={{ required: "Package type is required" }}
                                    render={({ field }) => (
                                        <DefaultSelector
                                        label="Sub District *"
                                        placeholder="Please select sub district"
                                        option={subdistrictOption}
                                        value={field.value}
                                        onChange={(value) => field.onChange(Number(value))}
                                        />
                                    )}
                                />
                                {errors.subDistrictId && (<span className="text-red-500">{errors.subDistrictId.message}</span>)}
                            </div>
                        </div>
                    </div>
                    <div className="my-[20px]">
                        <span className="font-semibold">Mark the location</span>
                        <p className="text-gray-500 mb-[5px]">Mark departure point and end point.</p>
                        <div className="border border-gray-200 rounded-[10px] p-[10px]">
                            <span className="mb-[2px]">Departure point *</span>
                            <Controller
                                name="depart_point"
                                control={control}
                                render={({ field }) => (
                                    <MapMarker 
                                        value={field.value}
                                        onChange={field.onChange} 
                                    />
                                )}
                            />
                            {errors.depart_point && (<span className="text-red-500">{errors.depart_point.message}</span>)}
                            <div className="h-[20px]"></div>
                            <span className="mb-[2px]">End point *</span>
                            <Controller
                                name="end_point"
                                control={control}
                                render={({ field }) => (
                                    <MapMarker 
                                        value={field.value}
                                        onChange={field.onChange} 
                                    />
                                )}
                            />
                            {errors.end_point && (<span className="text-red-500">{errors.end_point.message}</span>)}
                        </div>
                    </div>
                    <div className="my-[20px]">
                        <Controller
                            name="description"
                            control={control}
                            rules={{ required: "Package type is required" }}
                            render={({ field }) => (
                                <TextEditor
                                label="Description *"
                                    onChange={(value) => field.onChange(value)}
                                    value={field.value}
                                />
                            )}
                        />
                        { errors.description && <span className='text-red-500'>{errors.description.message}</span> }
                    </div>
                    <div className="my-[20px]">
                        <Controller
                            name="additional_description"
                            control={control}
                            rules={{ required: "Package type is required" }}
                            render={({ field }) => (
                                <TextEditor
                                label="Additional description"
                                    onChange={(value) => field.onChange(value)}
                                    value={field.value ?? ""}
                                />
                            )}
                        />
                        { errors.additional_description && <span className='text-red-500'>{errors.additional_description.message}</span> }
                    </div>
                    <div className="my-[20px]">
                        <Controller
                            name="packageAttraction"
                            control={control}
                            render={({ field }) => (
                                <AttractionList
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        { errors.packageAttraction && <span className='text-red-500'>{errors.packageAttraction.message}</span> }
                    </div>
                </div>
                <div className="w-[40%] flex justify-center items-center">
                   <div>
                        <div className="justify-center items-center flex w-full">
                            <Image src={Mockup} alt="" />
                        </div>
                        <div className="justify-center flex w-full">
                            <span className="text-center w-full">Create your package new to better your business</span>
                        </div>
                   </div>
                </div>
            </div>
            {/* benefit components */}
            <div className="mt-[30px]">
                <span className="text-[18px] font-medium">Add Benefit</span>
                <span className="block text-gray-600">Please enter form below for add benefit to customer.</span>
            </div>
            <div className="w-full p-[20px] bg-white mt-[10px] rounded-[20px] flex justify-between gap-[10px]">
                <div className="w-full">
                    <div>
                        <Controller
                            name="benefit_include"
                            control={control}
                            render={({ field }) => (
                                <IncludeList
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        { errors.benefit_include && <span className='text-red-500'>{errors.benefit_include.message}</span> }
                    </div>
                    <div className="mt-[20px]">
                        <Controller
                            name="benefit_not_include"
                            control={control}
                            render={({ field }) => (
                                <NotInclueList
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        { errors.benefit_include && <span className='text-red-500'>{errors.benefit_include.message}</span> }
                    </div>
                </div>
                <div className="w-[40%] flex justify-center items-center">
                   <div>
                        <div className="justify-center items-center flex w-full">
                            <Image src={BenefitMockup} alt="" />
                        </div>
                        <div className="justify-center flex w-full">
                            <span className="text-center w-full">give benefit to customer</span>
                        </div>
                   </div>
                </div>
            </div>
            {/* package option components */}
            <div className="mt-[30px]">
                <span className="text-[18px] font-medium">Add package option</span>
                <span className="block text-gray-600">Please enter form below for create package option.</span>
            </div>
            <div className="w-full p-[20px] bg-white mt-[10px] rounded-[20px] flex justify-between gap-[10px]">
                <div className="w-full">
                    <Controller
                        name="packageOption"
                        control={control}
                        render={({ field }) => (
                            <PackageOption 
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                    { errors.packageOption && <span className='text-red-500'>{errors.packageOption.message}</span> }
                </div>
                <div className="w-[40%] flex justify-center items-center">
                   <div>
                        <div className="justify-center items-center flex w-full">
                            <Image src={PackagOtpSvg} alt="" />
                        </div>
                        <div className="justify-center flex w-full">
                            <span className="text-center w-full">Add new for give choices to customer choose</span>
                        </div>
                   </div>
                </div>
            </div>
            {/* package file upload components */}
            <div className="mt-[30px]">
                <span className="text-[18px] font-medium">Add images to your package</span>
                <span className="block text-gray-600">Please upload images about this package.</span>
            </div>
            <div className="w-full p-[20px] bg-white mt-[10px] rounded-[20px] flex justify-between gap-[10px]">
                <div className="w-full">
                    <Controller
                        control={control}
                        name="packageImage"
                        render={({ field }) => (
                            <FileUploadState
                                value={field.value}
                                onChange={field.onChange}                            
                            />
                        )}
                    />
                    { errors.packageImage && <span className='text-red-500'>{errors.packageImage.message}</span> }
                    <div className="flex justify-end mt-[30px] gap-[10px]">
                        <div className="w-[20%]">
                            <DefaultOutlineButton
                                type="button"
                                label="Cancel"
                                onClick={() => router.back()}
                            />
                        </div>
                        <div className="w-[35%]">
                            <DefaultButton
                                label="Add new package"
                                type="submit"
                            />
                        </div>
                    </div>
                </div>
                <div className="w-[40%] flex justify-center items-center">
                   <div>
                        <div className="justify-center items-center flex w-full">
                            <Image src={FileMockup} alt="" />
                        </div>
                        <div className="justify-center flex w-full">
                            <span className="text-center w-full">Upload images to customer see & interesting your package</span>
                        </div>
                   </div>
                </div>
            </div>
        </form>
        </>
    );
}