import { useEffect, useState } from "react";
import { SelectorOptionTpye } from "@/app/components/select/default-selector";
import DefaultSelector from "@/app/components/select/default-selector";
import DefaultInput from "@/app/components/input/default-input";
import AgeRateInput, { AgeRateEntiry } from "@/app/components/input/ageRateInput";
import DefaultTextArea from "@/app/components/textarea/default-textarea";
import DefaultButton from "@/app/components/button/default-button";
import { PackageOptionDTO } from "@/app/types/package";
import { FaRegTrashAlt } from "react-icons/fa";
import { DeleteConfirmModal } from "@/app/components/modal/default-modal";
import { CurrencyConvert } from "@/app/hook/currencyConvertion";

interface PackageOptionProps {
    value?: PackageOptionDTO[],
    onChange?: (vale: PackageOptionDTO[]) => void;
}

export default function PackageOption({
    value = [],
    onChange
}: PackageOptionProps) { 
    
    const packageOptionTYP : SelectorOptionTpye[] = [
        {
            value: 1,
            label: 'Normal',
        },
        {
            value: 2,
            label: 'Group',
        },
    ];

    const [packageOptionTYPSelected, setPackageOptionTYPSelected] = useState<number>(1);
    const [optionName, setOptionName] = useState<string>("");
    const [adultPrice, setAdultPrice] = useState<string>("");
    const [childPrice, setChildPrice] = useState<string>("");
    const [GroupPrice, setGroupPrice] = useState<string>("");
    const [adultAgeRate, setAdultAgeRate] = useState<AgeRateEntiry>({
        from: "",
        to: ""
    });
    const [childAgeRate, setchildAgeRate] = useState<AgeRateEntiry>({
        from: "",
        to: ""
    });
    const [GroupAgeRate, setGroupAgeRate] = useState<AgeRateEntiry>({
        from: "",
        to: ""
    });
    const [description, setDescription] = useState<string>("");
    const [packageOptionArr, setPackageOptionArr] = useState<PackageOptionDTO[]>(value);
    const [openMoreData, setOpenMoreData] = useState<number | null>(null);
    const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

    const handleAddpackageOption = () => {
        if (packageOptionTYPSelected === 1) {
            if (optionName === "" || adultPrice === "" || adultAgeRate.from === "" || adultAgeRate.to === "" || childPrice === "" || childAgeRate.from === "" || childAgeRate.to === "") return;

            const newPackageOption: PackageOptionDTO = {
                pkgOptionTypeId: Number(packageOptionTYPSelected),
                name: optionName,
                description: description,
                adultFromAge: adultAgeRate?.from ?? "",
                adultToAge: adultAgeRate?.to ?? "",
                childFromAge: childAgeRate?.from ?? "",
                childToAge: childAgeRate?.to ?? "",
                groupFromAge: "",
                groupToAge: "",
                adultPrice: Number(adultPrice),
                childPrice: Number(childPrice),
                groupPrice: 0
            }

            setPackageOptionArr((prev) => [...prev, newPackageOption]);
        } else {
            if (optionName === "" || GroupPrice === "" || GroupAgeRate.from === "" || GroupAgeRate.to === "") return;

            const newPackageOption: PackageOptionDTO = {
                pkgOptionTypeId: Number(packageOptionTYPSelected),
                name: optionName,
                description: description,
                adultFromAge: "",
                adultToAge: "",
                childFromAge: "",
                childToAge: "",
                groupFromAge: GroupAgeRate?.from ?? "",
                groupToAge: GroupAgeRate?.to ?? "",
                adultPrice: 0,
                childPrice: 0,
                groupPrice: Number(GroupPrice)
            }

            setPackageOptionArr((prev) => [...prev, newPackageOption]);
        }

        setPackageOptionTYPSelected(1);
        setOptionName("");
        setAdultPrice("");
        setChildPrice("");
        setGroupPrice("");
        setAdultAgeRate({ from: "", to: "" });
        setchildAgeRate({ from: "", to: "" });
        setGroupAgeRate({ from: "", to: "" });
        setDescription("");
    };

    const handlerOpenModal = (index: number) => {
        setDeleteIndex(index);
        setOpenModalDelete(true);
    }


    const handlerDeletePackageOption = () => {
        setPackageOptionArr((prev) => prev.filter((_, i) => i !== deleteIndex));
        setDeleteIndex(null);
        setOpenModalDelete(false);
    };

    useEffect(() => {
        onChange?.(packageOptionArr);
    }, [packageOptionArr]);

    return(
        <div className="w-full">
            <DeleteConfirmModal
                title="Do you want to delete pakcage option ?"
                description="Confirm to proceed with delete this package option."
                confirmFunc={handlerDeletePackageOption}
                cancalFunc={() => setOpenModalDelete(false)}
                open={openModalDelete}
            />
            <div className="w-full p-[10px] border border-gray-200 rounded-[10px]">
                <div className="w-full flex justify-between items-center gap-[10px]">
                    <div className="w-[30%]">
                        <DefaultSelector
                            value={packageOptionTYPSelected}
                            onChange={(e) => setPackageOptionTYPSelected(e)}
                            option={packageOptionTYP}
                            label="Package Option Type*"
                            placeholder="Select package option type"
                        />
                    </div>
                    <div className="w-[70%]">
                        <DefaultInput
                            label="Package option name*"
                            placeholder="Enter package option name"
                            value={optionName}
                            onChange={(e) => setOptionName(e.target.value)}
                        />
                    </div>
                </div>
                {
                    packageOptionTYPSelected === 1 &&
                    <div className="w-full">
                        <div className="w-full flex justify-between items-center gap-[10px] mt-[10px]">
                            <DefaultInput    
                                label="Adult Price *"
                                placeholder="Please enter price."
                                value={adultPrice}
                                type="number"
                                onChange={(e) => setAdultPrice(e.target.value)}
                            />
                            <AgeRateInput
                                onChage={(e) => setAdultAgeRate(e)}
                                value={adultAgeRate}
                            />
                        </div>
                        <div className="w-full flex justify-between items-center gap-[10px] mt-[10px]">
                            <DefaultInput    
                                label="Child Price *"
                                placeholder="Please enter price."
                                value={childPrice}
                                type="number"
                                onChange={(e) => setChildPrice(e.target.value)}
                            />
                            <AgeRateInput
                                onChage={(e) => setchildAgeRate(e)}
                                value={childAgeRate}
                            />
                        </div>
                    </div>
                }
                {
                    packageOptionTYPSelected === 2 &&
                    <div className="w-full flex justify-between items-center gap-[10px] mt-[10px]">
                        <DefaultInput    
                            label="Group Price *"
                            placeholder="Please enter price."
                            value={GroupPrice}
                            type="number"
                            onChange={(e) => setGroupPrice(e.target.value)}
                        />
                        <AgeRateInput
                            onChage={(e) => setGroupAgeRate(e)}
                            value={GroupAgeRate}
                        />
                    </div>
                }
                <div className="w-full mt-[10px]">
                    <DefaultTextArea
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        placeholder="Enter description"
                        label="Description"
                    />
                </div>
                <div className="w-full flex justify-end mt-[10px]">
                    <div className="w-[30%]">
                        <DefaultButton
                            label="Add package option"
                            onClick={handleAddpackageOption}
                        />
                    </div>
                </div>
            </div>
            {
                packageOptionArr.length !== 0 &&
                <div className="grid grid-cols-1 w-full gap-[10px] mt-[20px]">
                    {
                        packageOptionArr.map((data, index) => {
                            return(
                                <div className="border border-gray-200 rounded-[10px]" key={index}>
                                    <div className="p-[10px] flex justify-between items-center">
                                        <span className="text-[20px] font-semibold">{data.name}</span>
                                        <div>
                                            <span className="font-medium">{data.pkgOptionTypeId === 2 ? CurrencyConvert.formatAsThb(data.groupPrice) : CurrencyConvert.formatAsThb(data.adultPrice)}</span>
                                            <button type="button" onClick={() => setOpenMoreData(index)} className="underline block">See more</button>
                                        </div>
                                    </div>
                                    {
                                        openMoreData === index &&
                                        <div className="w-full">
                                            <div className="w-full border-t border-gray-200"></div>
                                            <div className="p-[10px]">
                                                {
                                                    data.pkgOptionTypeId === 1 ?
                                                    <div className="w-full grid grid-cols-3 gap-[20px]">
                                                        <div>
                                                            <span className="font-semibold text-[14px]">Adult Price</span>
                                                            <span className="block">{CurrencyConvert.formatAsThb(data.adultPrice)}</span>
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold text-[14px]">Adult age rate</span>
                                                            <span className="block">{data.adultFromAge} - {data.adultToAge}y</span>
                                                        </div>
                                                        <div className="flex justify-end">
                                                            <button type="button" onClick={() => handlerOpenModal(index)} >
                                                                <FaRegTrashAlt className="text-[18px] font-semibold text-gray-500" />
                                                            </button>
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold text-[14px]">Child Price</span>
                                                            <span className="block">{CurrencyConvert.formatAsThb(data.childPrice)}</span>
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold text-[14px]">Child age rate</span>
                                                            <span className="block">{data.childFromAge} - {data.childToAge}y</span>
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className="w-full grid grid-cols-3 gap-[20px]">
                                                        <div>
                                                            <span className="font-semibold text-[14px]">Group Price</span>
                                                            <span className="block">{CurrencyConvert.formatAsThb(data.groupPrice)}</span>
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold text-[14px]">Adult age rate</span>
                                                            <span className="block">{data.groupFromAge} - {data.groupToAge}y</span>
                                                        </div>
                                                        <div className="flex justify-end">
                                                            <button type="button" onClick={() => handlerOpenModal(index)} >
                                                                <FaRegTrashAlt className="text-[18px] font-semibold text-gray-500" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                }
                                                <div className="mt-[20px]">
                                                    <span className="font-semibold text-[14px]">Description</span>
                                                    <div className="w-full p-[5px] rounded-[8px] border border-gray-200">
                                                        {data.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            }
        </div>
    );
};