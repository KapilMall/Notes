import type React from "react";


interface ButtonProps {
    name?: string,
    handleClick?: () => void;
    Icon? : React.ReactNode;
    isBackground?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ name, handleClick, Icon, isBackground = true}) => {
    return (
        <button 
            className={`${isBackground ? 'bg-amber-600' : 'transparent'} rounded-[5px] px-[16px] py-[8px] text-[#fff] cursor-pointer min-h-[100%] dark:hover:bg-gray-700 hover:bg-gray-300`}
            onClick={handleClick}
        >
            {Icon ? Icon : name }
        </button>
    )
} 