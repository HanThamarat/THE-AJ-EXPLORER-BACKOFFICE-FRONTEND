import { useEffect, useState } from "react";
import DefaultInput from "@/app/components/input/default-input";
import DefaultOutlineButton from "@/app/components/button/outline-button";
import { LuPlus } from "react-icons/lu";
import { packageInclude } from "@/app/types/package";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { Dropdown, MenuProps } from "antd";
import { IoIosMore } from "react-icons/io";

interface IncludeListProps {
    value: packageInclude[],
    onChange?: (value: packageInclude[]) => void;
}

export default function IncludeList({
    value = [],
    onChange
}: IncludeListProps) {

    const [whatInclude, setWhatInclude] = useState<string>("");
    const [editIndex, setEditindex] = useState<number | null>(null);
    const [whatIncludeArr, setWhatIncludeArr] = useState<packageInclude[]>(value);

    useEffect(() => {
        onChange?.(whatIncludeArr);
    }, [whatIncludeArr]);

    const handleAddWhatInclude = () => {
        if (whatInclude === "") return;

        const newWhatinclude: packageInclude = {
            detail: whatInclude
        };

        if (editIndex !== null) {
            setWhatIncludeArr((prev) => prev.map((item, i) => (i === editIndex ? newWhatinclude : item)));
            setEditindex(null);
        } else {
            setWhatIncludeArr((prev) => [...prev, newWhatinclude]);
        }
        
        setWhatInclude("");
    }

    const handleEditWhatInclude = async (index: number) => {
        const selected = whatIncludeArr[index];
        setWhatInclude(selected.detail);
        setEditindex(index);
    }

    const handlerDeleteWhatInclude = async (index: number) => {
        setWhatIncludeArr((prev) => prev.filter((_, i) => i !== index));
    };

    return(
        <div className="w-full">
            <span>What's include</span>
            <div className="w-full border border-gray-200 p-[10px] rounded-[10px]">
                <div className="flex justify-between items-center gap-[10px]">
                    <DefaultInput
                        label="Include detail"
                        placeholder="Enter include detail"
                        value={whatInclude}
                        onChange={(e) => setWhatInclude(e.target.value)}
                    />
                    <div className="mt-[20px]">
                        <DefaultOutlineButton
                            label={<LuPlus className="text-[20px]" />}
                            onClick={handleAddWhatInclude}
                        />
                    </div>
                </div>
                {
                    whatIncludeArr.length !== 0 &&
                    <div className="mt-[20px] w-full grid grid-cols-1 gap-[10px]">
                        {
                            whatIncludeArr.map((data, index) => {

                                const items: MenuProps["items"] = [
                                    {
                                        key: "1",
                                        label: (
                                        <button
                                            type="button"
                                            onClick={() => handleEditWhatInclude(index)}
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
                                            onClick={() => handlerDeleteWhatInclude(index)}
                                            className="w-full text-left text-red-500"
                                        >
                                            Delete
                                        </button>
                                        ),
                                    },
                                ];

                                return(
                                    <div key={index} className="w-full flex justify-between gap-[10px]">
                                        <div className="w-full border border-gray-200 py-[10px] px-[20px] rounded-[8px] gap-[10px] flex justify-start items-center">
                                            <IoCheckmarkCircleOutline className="text-[24px]" />
                                            <span>{data.detail}</span>
                                        </div>
                                        <Dropdown menu={{ items }} placement="bottomRight" arrow>
                                            <button
                                            className="h-full border border-gray-200 rounded-[8px] px-[10px] flex justify-center items-center"
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