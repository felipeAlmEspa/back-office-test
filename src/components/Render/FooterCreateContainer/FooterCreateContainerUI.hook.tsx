import {
  CustomFooterModal,
  useAppLayoutFooter,
} from "@itsa-develop/itsa-fe-components";
import { useCallback, useEffect } from "react";
import { FooterCreateContainerUIProps } from "./FooterCreateContainerUI.controller";



export const useFooterCreateContainerUI = ({
  children,
  onConfirm,
  onCancel,
  confirmLabel,
  cancelLabel,
  loading = false,
}: FooterCreateContainerUIProps) => {
  const { setFooterComponent, clearFooter } = useAppLayoutFooter();

  const handleOnConfirm = useCallback(() => {
    if (onConfirm) {
      onConfirm();
    }
  }, [onConfirm]);

  const handleOnCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  useEffect(() => {
    if (children) {
      setFooterComponent(children);
    } else {
      setFooterComponent(
        <CustomFooterModal
          onConfirm={handleOnConfirm}
          onCancel={handleOnCancel}
          confirmLabel={confirmLabel}
          cancelLabel={cancelLabel}
          confirmLoading={loading}
        />
      );
    }
    return () => {
      clearFooter();
    };
  }, [
    cancelLabel,
    children,
    clearFooter,
    confirmLabel,
    handleOnCancel,
    handleOnConfirm,
    loading,
    setFooterComponent,
  ]);
};
