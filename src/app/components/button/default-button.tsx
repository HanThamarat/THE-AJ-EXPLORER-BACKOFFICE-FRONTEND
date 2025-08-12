import { Button, ConfigProvider } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { ButtonHTMLType } from "antd/es/button";
import DotLoader from "../loader/dot";

interface ButtonPropType {
    label?: string; 
    onClick?: () => void;
    size?: SizeType;
    color?: string;
    type?: ButtonHTMLType;
    isLoading?: boolean;
}

export default function DefaultButton({
    label,
    onClick,
    size,
    color,
    type,
    isLoading
}: ButtonPropType) {
    return(
        <ConfigProvider
        theme={{
            components: {
                Button: {
                    defaultBg: color ? color : '#002B3F',
                    defaultHoverBg: color ? color : '#002B3F',
                    defaultHoverBorderColor: color ? color : '#002B3F',
                    defaultBorderColor: color ? color : '#002B3F',
                    defaultActiveBg: color ? color : '#002B3F',
                    defaultActiveBorderColor: color ? color : '#002B3F',
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
                    <span className="text-white">{label}</span>
                    :
                    <DotLoader Colors="#FFFFFF" />
                } 
            </Button>
        </ConfigProvider>
    );

};