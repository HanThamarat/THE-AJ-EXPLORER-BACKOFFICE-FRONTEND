"use client";

import DefaultInput from "@/app/components/input/default-input";
import TimePickerComponent from "@/app/components/datePIcker/timePicker";
import DefaultOutlineButton from "@/app/components/button/outline-button";
import { LuPlus } from "react-icons/lu";
import { useState, useEffect } from "react";
import { packageAttractionEntity } from "@/app/types/package";
import DefaultSwitch from "@/app/components/switch/default-switch";
import globeSvg from "@/app/assets/images/svg/globe-05.svg";
import luggage from "@/app/assets/images/svg/luggage.svg";
import Image from "next/image";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { IoIosMore } from "react-icons/io";

interface AttractionListProps {
  value?: packageAttractionEntity[];
  onChange?: (value: packageAttractionEntity[]) => void;
}

export default function AttractionList({ 
    value = [], 
    onChange
 }: AttractionListProps) {
  const [attractionName, setAttractionName] = useState<string>("");
  const [attractionTime, setAttractionTime] = useState<string>("");
  const [attractionArr, setAttractionArr] = useState<packageAttractionEntity[]>(value);

  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    onChange?.(attractionArr);
  }, [attractionArr]);

  const handlerAttraction = () => {
    const newAttraction: packageAttractionEntity = {
      attractionName: attractionName,
      attractionTime: attractionTime,
      status: true,
    };

    if (!attractionName || !attractionTime) return; // Prevent empty input

    if (editIndex !== null) {
      // Edit mode
      setAttractionArr((prev) =>
        prev.map((item, i) => (i === editIndex ? newAttraction : item))
      );
      setEditIndex(null);
    } else {
      // Add mode
      setAttractionArr((prev) => [...prev, newAttraction]);
    }

    setAttractionName("");
    setAttractionTime("");
  };

  const handlerChangeSwitch = (index: number, value: boolean) => {
    setAttractionArr((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, status: value } : item
      )
    );
  };

  const handlerEdit = (index: number) => {
    const selected = attractionArr[index];
    setAttractionName(selected.attractionName);
    setAttractionTime(selected.attractionTime.toString());
    setEditIndex(index);
  };

  const handlerDelete = (index: number) => {
    setAttractionArr((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      <span className="font-semibold">Attraction List</span>
      <p className="text-gray-500 mb-[5px]">
        Enter attraction list below to set package attraction timeline.
      </p>

      <div className="border border-gray-200 rounded-[10px] p-[10px]">
        {/* Input Row */}
        <div className="flex justify-between w-full gap-2">
          <DefaultInput
            label="Attraction Name"
            placeholder="Enter attraction name"
            value={attractionName}
            onChange={(e) => setAttractionName(e.target.value)}
          />

          <TimePickerComponent
            label="Time"
            placeholder="Select time"
            value={attractionTime}
            onChange={(e) => setAttractionTime(e as string)}
          />

          <div className="mt-[20px]">
            <DefaultOutlineButton
              label={<LuPlus className="text-[20px]" />}
              onClick={handlerAttraction}
            />
          </div>
        </div>

        {/* List Display */}
        {attractionArr.length !== 0 && (
          <div className="mt-[20px] grid-cols-1 grid w-full gap-[10px]">
            {attractionArr.map((data, index) => {
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

              return (
                <div
                  key={index}
                  className="flex justify-between items-center gap-[10px]"
                >
                  <div className="w-full py-[10px] px-[24px] border border-gray-200 rounded-[8px] flex items-center gap-[18px]">
                    <DefaultSwitch
                      value={data.status}
                      onChange={(e) => handlerChangeSwitch(index, e)}
                    />
                    <div className="flex gap-[12px] items-center">
                      <Image src={globeSvg} alt="" />
                      <span>{data.attractionTime.toString()}</span>
                    </div>
                    <div className="flex gap-[12px] items-center">
                      <Image src={luggage} alt="" />
                      <span>{data.attractionName}</span>
                    </div>
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
            })}
          </div>
        )}
      </div>
    </div>
  );
}
