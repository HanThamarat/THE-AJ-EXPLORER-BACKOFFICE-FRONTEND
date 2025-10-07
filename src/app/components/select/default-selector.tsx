import { Select, ConfigProvider } from 'antd';

interface DefaultSelectorProps {
 value?: any;
 onChange?: (e: any) => void;
 placeholder?: string;
 label?: string;
 option?: SelectorOptionTpye[];
}

export interface SelectorOptionTpye {
    label: any;
    value: any;
}

export default function DefaultSelector({
    value,
    label,
    placeholder,
    onChange,
    option
}: DefaultSelectorProps) {
    return(
        <ConfigProvider
            theme={{
                components: {
                    Select: {
                        activeBorderColor: "#002B3F",
                        hoverBorderColor: "#002B3F"
                    },
                },
            }}
        >
            <div className='w-full'>
                {
                    label && 
                    <div className='mb-[1.5px]'>
                        <span className="font-medium text-[12px]">{label}</span>
                    </div>
                }
                
                <Select
                    className='w-full'
                    size='large'
                    showSearch
                    placeholder={placeholder}
                    optionFilterProp="label"
                    onChange={onChange}
                    value={value}
                    options={option}
                />
            </div>
        </ConfigProvider>
    );
};