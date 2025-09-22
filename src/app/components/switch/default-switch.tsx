import { Switch, ConfigProvider } from 'antd';

interface DefaultSwitchProps {
    onChange?: (e: boolean) => void;
    value?: boolean;
}

export default function DefaultSwitch({
    onChange,
    value = true
}: DefaultSwitchProps) {
    return(
        <ConfigProvider
            theme={{
                components: {
                    Switch: {
                        colorPrimary: "#2C0735",
                        colorPrimaryHover: "#2C0735"
                    },
                },
            }}
        >
            <Switch 
                value={value} 
                onChange={onChange} 
            />
        </ConfigProvider>
    );
}