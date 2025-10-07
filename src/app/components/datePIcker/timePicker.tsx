import React from "react";
import { TimePicker, ConfigProvider } from 'antd';
import type { TimePickerProps } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

interface InputPropType {
  label?: string;
  color?: string;
  placeholder: string;
  value?: string;
  size?: SizeType;
  onChange?: (value: string  | string[]) => void;
}

const TimePickerComponent = React.forwardRef<any, InputPropType>(
  ({ placeholder, label, color, onChange, value, size, ...rest }, ref) => {
    const handlerChange: TimePickerProps["onChange"] = (time, timeString) => {
      console.log("Selected:", time, timeString);
      onChange?.(timeString);
    };

    return (
      <div className="w-full grid grid-cols-1 gap-[2px]">
        {label && <span className="font-medium text-[12px]">{label}</span>}
        <ConfigProvider
            theme={{
                components: {
                        DatePicker: {
                            activeBorderColor: color ? color : '#002B3F',
                            hoverBorderColor: color ? color : '#002B3F',
                        },
                    },
                }}
            >
            <TimePicker
                ref={ref}
                onChange={handlerChange}
                defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                value={value ? dayjs(value, "HH:mm:ss") : undefined} 
                format="HH:mm:ss"
                placeholder={placeholder}
                size={ size === undefined ? 'large' : size } 
                {...rest}
            />
        </ConfigProvider>
      </div>
    );
  }
);

export default TimePickerComponent;
