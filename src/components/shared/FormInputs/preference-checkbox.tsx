import { Checkbox } from "antd";

const CustomCheckbox = ({ className = "", ...props }: any) => {
    let additionalClasses = "";

    if (props.checked && !props.onlyCheckbox) {
        additionalClasses = " !border-canGreen bg-canGreen2 bg-opacity-30 ";
    }

    return (
        <Checkbox
            className={`${additionalClasses} border border-canGrey2 py-2.5 px-5 rounded-lg flex gap-2.5 group
                [&_.ant-checkbox-wrapper]:!m-0
                [&>.ant-checkbox-checked>.ant-checkbox-inner]:bg-canGreen
                [&>.ant-checkbox-checked>.ant-checkbox-inner]:border-canGreen
                [&>.ant-checkbox-inner]:focus:border-canGreen
                [&>.ant-checkbox-inner]:hover:border-canGreen
                [&>.ant-checkbox-wrapper]:hover:!border-canGreen
                
                [&>_.ant-checkbox>span]:rounded-full
                [&>span:nth-child(1)]:order-2 
                [&>span:nth-child(2)]:text-base
                [&>span:nth-child(2)]:font-regular
                [&>span:nth-child(2)]:text-canBlack
                [&>_.ant-checkbox-checked>span]:!border-green
                
                [&_.ant-checkbox-wrapper>span]:!text-base
                [&_.ant-checkbox-wrapper-checked]:!bg-canBlue 
                [&_.ant-checkbox-wrapper>span]:!p-0 
                [&>span]:p-0
                [&>_.ant-checkbox]:p-0 
                [&_.ant-checkbox-wrapper]:!ml-0
                [&.group:hover .ant-checkbox-inner]:!border-canGreen
                [&_.ant-checkbox-checked]:after:!hidden
                [&_.ant-checkbox-wrapper-checked]:!border-canGreen
           
                ${className}`}
            checked={props.checked}
            {...props}
        >
            {props.children}
        </Checkbox>
    );
};


export default CustomCheckbox;