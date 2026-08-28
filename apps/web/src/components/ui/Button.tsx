import { type ButtonHTMLAttributes, type AnchorHTMLAttributes, type ReactNode } from "react";
import "./Button.css";

type Variant = "primary" | "secondary" | "ghost";

interface CommonProps {
  variant?: Variant;
  children: ReactNode;
}

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: "button";
    href?: never;
  };

type LinkProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: "a";
    href: string;
  };

export function Button(props: ButtonProps | LinkProps) {
  const { variant = "primary", children, className, as = "button", ...rest } = props;
  const classes = ["ve-btn", `ve-btn--${variant}`, className].filter(Boolean).join(" ");

  if (as === "a") {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a className={classes} href={href} {...anchorRest}>
        {children}
      </a>
    );
  }

  const { type, ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} type={type ?? "button"} {...buttonRest}>
      {children}
    </button>
  );
}
