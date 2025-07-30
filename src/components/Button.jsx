import { cva } from "class-variance-authority";
/**
 * @param {Object} props - The properties for the Button component.
 *@param {boolean} props.isFullWidth - Determines if the button should take full width.
 *@param {boolean} props.isDisabled - Determines if the button should be disabled.
 *@param {string} props.variant - The variant of the button (primary, secondary, destructive).
 *@param {string} props.size - The size of the button (sm, lg).
 *@param {string} props.className - Additional class names for the button.
 *@param {JSX.Element} props.children - The content inside the button.
 * @returns {JSX.Element} - The rendered button component.
 */
const button = cva("rounded-full px-6 duration-200 text-[13px] font-bold", {
  variants: {
    variant: {
      primary: "text-white bg-main-purple hover:bg-main-purple-hover",
      secondary: "text-main-purple bg-main-purple/10 hover:bg-main-purple/25",
      destructive: "text-white bg-red hover:bg-red-hover",
    },
    size: {
      sm: "h-10",
      lg: "h-12",
    },
    isFullWidth: {
      true: "w-full",
    },
    isDisabled: {
      true: "cursor-not-allowed opacity-25 hover:bg-main-purple",
    },
  },

  defaultVariants: {
    variant: "primary",
    size: "lg",
  },
});

const Button = ({
  children,
  variant,
  size,
  isFullWidth,
  className,
  isDisabled,
  ...props
}) => {
  return (
    <button
      className={button({ variant, size, isFullWidth, className, isDisabled })}
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;
