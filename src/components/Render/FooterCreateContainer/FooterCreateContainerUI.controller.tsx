import { ReactNode } from "react";
import { useFooterCreateContainerUI } from "./FooterCreateContainerUI.hook";


export interface FooterCreateContainerUIProps {
  children?: ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

export const FooterCreateContainerUI = (props: FooterCreateContainerUIProps) => {  
    useFooterCreateContainerUI(props);
    return (
        <div/>
    )
}