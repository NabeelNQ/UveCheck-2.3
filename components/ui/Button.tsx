import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
    const baseStyles = "w-auto font-bold py-2.5 px-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform transform active:scale-95 disabled:cursor-not-allowed transition-colors";
    
    const variantStyles = {
        primary: 'bg-slate-800 text-white hover:bg-slate-700 focus:ring-slate-500 disabled:bg-slate-400 disabled:text-slate-50',
        secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-400 disabled:bg-slate-100 disabled:text-slate-400',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300',
    };

    return (
        <button className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default Button;