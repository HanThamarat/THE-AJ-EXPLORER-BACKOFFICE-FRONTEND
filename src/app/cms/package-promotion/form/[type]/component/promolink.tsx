import DefaultInput from "@/app/components/input/default-input"
import { useState, useEffect, useRef } from "react";
import { useAppDispatch } from "@/app/hook/appDispatch";
import { useSelector } from "react-redux";
import { packageSelector } from "@/app/store/slice/packageManagement";
import { getAllPacakges } from "@/app/store/slice/packageManagement";
import { SelectorOptionTpye } from "@/app/components/select/default-selector";
import DefaultSelector from "@/app/components/select/default-selector";
import DefaultButton from "@/app/components/button/default-button";
import { promotionLinkType } from "@/app/types/promotion";
import { LuPlus } from "react-icons/lu";
import DefaultOutlineButton from "@/app/components/button/outline-button";
import { FiPercent } from "react-icons/fi";
import { Dropdown, MenuProps } from "antd";
import { IoIosMore } from "react-icons/io";
import luggage from "@/app/assets/images/svg/luggage.svg";
import Image from "next/image";

interface PromotionLinkPropsType {
    value?: promotionLinkType[],
    onChange?: (value: promotionLinkType[]) => void,
}

export default function PromotionLink({
    value = [],
    onChange
}: PromotionLinkPropsType) {

    const dispatch = useAppDispatch();
    const { packages } = useSelector(packageSelector);
    const isFaching = useRef(false);
    const [promotionPercentage, setPromotionPercentage] = useState<string>("");
    const [packageSelected, setPackageSelected] = useState<number | null>();
    const [packageOption, setPackageOption] = useState<SelectorOptionTpye[]>([]);
    const [packageLinkArr, setPackageLinkArr] = useState<promotionLinkType[]>(value);
    const [editIndex, setEditIndex] = useState<number | null>(null);

    useEffect(() => {
        const fecthAllPackage = async () => {
            if (isFaching.current) return;
            isFaching.current = true;
            await dispatch(getAllPacakges());
            isFaching.current = false;
        }

        packages === null && fecthAllPackage();

        if (packages?.length !== 0 && packages !== null) {
            const packageDataFilter: SelectorOptionTpye[] = packages ? packages.filter(pack => pack.status === true).map((data) => ({
                label: data.packageName,
                value: data.id,
            })) : [];
            setPackageOption(packageDataFilter);
        }
    }, [dispatch, packages]);


    useEffect(() => {
        onChange?.(packageLinkArr);
    }, [packageLinkArr]);

    const hanlerAddnewpackageLink = async () => {
        const newPackage: promotionLinkType = {
            percentage: Number(promotionPercentage),
            packageLink: Number(packageSelected),
        }

        if (promotionPercentage === "" || packageSelected === 0) return;

        if (editIndex !== null) {
            // Edit mode
            setPackageLinkArr((prev) =>
                prev.map((item, i) => (i === editIndex ? newPackage : item))
            );
            setEditIndex(null);
        } else {
            // Add mode
            setPackageLinkArr((prev) => [...prev, newPackage]);
        }

        setPromotionPercentage("");
        setPackageSelected(null);
    }

    const handlerEdit = (index: number) => {
        const selected = packageLinkArr[index];
        setPromotionPercentage(selected.percentage.toString());
        setPackageSelected(selected.packageLink);
        setEditIndex(index);
    };

    const handlerDelete = (index: number) => {
        setPackageLinkArr((prev) => prev.filter((_, i) => i !== index));
    };

    return(
        <div className="w-full">
            <span className="font-semibold">Coupon Link</span>
            <span className="text-[#535862] block">Enter information below for set and link promo price to package</span>
            <div className="w-full border border-gray-200 rounded-[10px] p-[10px]">
                <div className="flex justify-between items-center gap-[10px]">
                    <DefaultInput
                        label="Promotion Percentage*"
                        placeholder="Enter promotion percentage"
                        type="number"
                        value={promotionPercentage}
                        onChange={(e) => setPromotionPercentage(e.target.value)}
                    />
                    <DefaultSelector
                        label="Package*"
                        placeholder="Select package"
                        option={packageOption}
                        onChange={(e) => setPackageSelected(e)}
                        value={packageSelected}
                    />
                    <div className="w-[10%] mt-[19px]">
                        <DefaultOutlineButton
                            label={<LuPlus className="text-[20px]" />}
                            onClick={hanlerAddnewpackageLink}
                        />
                    </div>
                </div>
                {
                    packageLinkArr.length !== 0 &&
                    <div className="w-full mt-[24px] grid grid-cols-1 gap-[10px]">
                        {
                            packageLinkArr.map((data, index) => {

                                const items: MenuProps["items"] = [
                                    {
                                        key: "1",
                                        label: (
                                        <button
                                            type="button"
                                            onClick={() => handlerEdit(index)}
                                            className="w-full text-left"
                                        >
                                            Edit
                                        </button>
                                        ),
                                    },
                                    {
                                        key: "2",
                                        label: (
                                        <button
                                            type="button"
                                            onClick={() => handlerDelete(index)}
                                            className="w-full text-left text-red-500"
                                        >
                                            Delete
                                        </button>
                                        ),
                                    },
                                ];

                                return(
                                    <div key={index} className="w-full flex justify-between items-center gap-[10px]">
                                        <div className="w-full border border-gray-300 rounded-[8px] px-[20px] py-[10px] flex justify-start items-center gap-[10px]">
                                            <div className="flex items-center gap-[5px]">
                                                <FiPercent className="text-[24px]" />
                                                <span>{data.percentage}</span>
                                            </div>
                                            <div className="flex items-center gap-[5px]">
                                                 <Image src={luggage} alt="" />
                                                <span>{packageOption.filter(pack => pack.value === data.packageLink).map((data) => (data.label))}</span>
                                            </div>
                                        </div>
                                        <Dropdown menu={{ items }} placement="bottomRight" arrow>
                                            <button
                                            className="h-full border border-gray-200 rounded-[8px] p-[12px] flex justify-center items-center"
                                            type="button"
                                            >
                                                <IoIosMore className="text-[20px]" />
                                            </button>
                                        </Dropdown>
                                    </div>
                                );
                            })
                        }
                    </div>
                }
            </div>
        </div>
    );
};