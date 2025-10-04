import { Button, ConfigProvider } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { ButtonHTMLType } from "antd/es/button";
import DotLoader from "../loader/dot";
import React from "react";

interface ButtonPropType {
    label?: string | any; 
    onClick?: () => void;
    size?: SizeType;
    color?: string;
    type?: ButtonHTMLType;
    isLoading?: boolean;
    icon?: any;
}

export default function DefaultOutlineButton({
    label,
    onClick,
    size,
    color,
    type,
    isLoading,
    icon
}: ButtonPropType) {
    return(
        <ConfigProvider
        theme={{
            components: {
                Button: {
                    // defaultBg: color ? color : '#002B3F',
                    // defaultHoverBg: color ? color : '#002B3F',
                    defaultHoverBorderColor: color ? color : '#002B3F',
                    // defaultBorderColor: color ? color : '#002B3F',
                    // defaultActiveBg: color ? color : '#002B3F',
                    // defaultActiveBorderColor: color ? color : '#002B3F',
                },
            },
        }}
        >
            <Button 
                size={ size === undefined ? 'large' : size} 
                className="w-full"
                onClick={onClick}
                htmlType={ type === undefined ? 'button' : type }
            >
                {
                    isLoading === false || isLoading === undefined ?
                    <div className="flex justify-center items-center gap-[5px] p-[2px]">
                        {icon}
                        <span className="text-gray-800 text-[12px]">{label}</span>
                    </div>
                    :
                    <DotLoader Colors="#FFFFFF" />
                } 
            </Button>
        </ConfigProvider>
    );

};