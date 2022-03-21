import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string | React.ReactNode;
  variant?: "primary" | "secondary";
  size?: string;
}

const Button = ({
  text,
  variant = "primary",
  size = "sm",
  ...props
}: ButtonProps) => {
  const textSize = `text-${size}`;

  if (variant === "secondary") {
    return (
      <button
        className={`relative inline-flex items-center justify-center p-0.5 overflow-hidden font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 ${textSize}`}
        {...props}
      >
        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
          {text}
        </span>
      </button>
    );
  }

  return (
    <button
      className={`text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg px-5 py-3 text-center ${textSize}`}
      {...props}
    >
      {text}
    </button>
  );
};

export default Button;
