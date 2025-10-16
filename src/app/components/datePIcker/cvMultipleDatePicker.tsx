"use client";

import React from "react";
import { DatePicker, ConfigProvider } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import dayjs, { Dayjs } from "dayjs";

interface CvMultipleDatePickerPropsType {
  label?: string;
  value?: [string | null, string | null];
  onChange?: (value: [string | null, string | null]) => void;
  placeholder?: [string, string];
  color?: string;
}

export default function CvMultipleDatePicker({
  label,
  value,
  onChange,
  placeholder = ["Start date", "End date"],
  color,
}: CvMultipleDatePickerPropsType) {
  const { RangePicker } = DatePicker;

  // Convert incoming ISO strings to Dayjs objects for display
  const displayValue: [Dayjs | null, Dayjs | null] = [
    value?.[0] ? dayjs(value[0]) : null,
    value?.[1] ? dayjs(value[1]) : null,
  ];

  const handleChange: RangePickerProps["onChange"] = (dates) => {
    const isoValue: [string | null, string | null] = [
      dates?.[0] ? dates[0].toISOString() : null,
      dates?.[1] ? dates[1].toISOString() : null,
    ];
    onChange?.(isoValue);
  };

  return (
    <div className="w-full grid grid-cols-1 gap-[2px]">
      {label && <span className="font-medium text-[12px]">{label}</span>}
      <ConfigProvider
        theme={{
          components: {
            DatePicker: {
              activeBorderColor: color ?? "#002B3F",
              hoverBorderColor: color ?? "#002B3F",
            },
          },
        }}
      >
        <RangePicker
          size="large"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full"
          format="YYYY-MM-DD"
        />
      </ConfigProvider>
    </div>
  );
}