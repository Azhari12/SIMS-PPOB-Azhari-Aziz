import * as React from "react";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

type CustomInputProps = {
	iconLeft?: string | React.ReactNode | JSX.Element;
	filled?: boolean;
	error?: boolean;
};

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
	CustomInputProps;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, iconLeft, filled, error, ...props }, ref) => {
		return (
			<div className="relative group">
				<div
					className={cn(
						"absolute left-3 top-[0.85rem] ",
						!filled && "text-muted-foreground "
					)}
				>
					{iconLeft}
				</div>
				<input
					type={type}
					className={cn(
						"flex h-10 w-full rounded-sm font-medium border bg-background  py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2  ",
						className,
						iconLeft ? "pl-8 pr-3" : "px-3",
						error ? "border-primary" : "border-input"
					)}
					ref={ref}
					{...props}
				/>
			</div>
		);
	}
);
Input.displayName = "Input";

const InputPassword = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, iconLeft, filled, error, ...props }, ref) => {
		const [showPassword, setShowPassword] = React.useState(false);
		return (
			<div className="relative group">
				<div
					className={cn(
						"absolute left-3 top-[0.85rem] ",
						!filled && "text-muted-foreground "
					)}
				>
					{iconLeft}
				</div>
				<input
					type={showPassword ? "text" : "password"}
					className={cn(
						"flex h-10 w-full rounded-sm font-medium border bg-background text-sm py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
						className,
						iconLeft ? "pl-8 pr-3" : "px-3",
						error ? "border-primary" : "border-input"
					)}
					ref={ref}
					{...props}
				/>
				<div
					className={cn(
						"absolute right-3 top-[0.85rem] cursor-pointer",
						!showPassword && "text-muted-foreground "
					)}
					onClick={() => setShowPassword(!showPassword)}
				>
					{!showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
				</div>
			</div>
		);
	}
);
InputPassword.displayName = "Input";

export { Input, InputPassword };
