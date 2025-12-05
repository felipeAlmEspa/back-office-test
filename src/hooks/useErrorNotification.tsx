import { errorMessageForm } from "@/helper";
import { useNotification } from "@itsa-develop/itsa-fe-components";
import { FieldErrors } from "react-hook-form";

export const useErrorFormulario = () => {
  const { openNotificationWithIcon } = useNotification();

  const errorFormMessage = (errors: FieldErrors) => {
    const message = errorMessageForm(errors);
    openNotificationWithIcon({
      type: "error",
      message: "Verificar campos",
      description: message,
    });
  };

  return {
    errorFormMessage,
  };
};
