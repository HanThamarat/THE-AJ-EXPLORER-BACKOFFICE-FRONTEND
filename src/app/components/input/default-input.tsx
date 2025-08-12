import React from "react";

import type { InputRef } from "antd";

interface InputPropType {
  label?: string;
  color?: string;
  placeholder: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const DefaultInput = React.forwardRef<InputRef, InputPropType>(
  ({ placeholder, label, color, onChange, value, ...rest }, ref: any) => {
    return (
        <div className="w-full grid grid-cols-1 gap-[2px]">
          {label && <span className="font-medium text-[16px]">{label}</span>}
          <input
            className="border h-[40px] rounded-[6px] px-[10px] text-[14px] border-[#d7dade] focus:outline-primary"
            type="text" 
            {...rest} 
            ref={ref}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
           />
        </div>
    );
  }
);

export default DefaultInput;
