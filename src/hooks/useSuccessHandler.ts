import { useCallback } from "react";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import {
  useModalResponsive,
  useNotification,
} from "@itsa-develop/itsa-fe-components";

export type NotificationKind = "success" | "info" | "warning" | "error";

export interface SuccessHandlerOptions {
  message: string;
  type?: NotificationKind;
  description?: string;
  queryKey?: QueryKey | QueryKey[];
  exact?: boolean;
  ejecuteCloseModal?: boolean;
}

export const useSuccessHandler = () => {
  const queryClient = useQueryClient();
  const { openNotificationWithIcon } = useNotification();
  const { closeModal } = useModalResponsive();

  const onSuccessAction = useCallback(
    ({
      message,
      description,
      queryKey,
      exact = false,
      type = "success",
      ejecuteCloseModal = false,
    }: SuccessHandlerOptions) => {
      openNotificationWithIcon({ type, message, description });

      if (Array.isArray(queryKey)) {
        queryKey.forEach((key) => {
          console.log('key =>',key);
          queryClient.invalidateQueries({ queryKey: key, exact });
        });
      } else if (queryKey) {
        queryClient.invalidateQueries({ queryKey, exact });
      }

      if (ejecuteCloseModal) {
        closeModal();
      }
    },
    [closeModal, openNotificationWithIcon, queryClient]
  );

  return { onSuccessAction };
};
