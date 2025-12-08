import type {
  ICheckSessionResult,
  ILoginRequest,
} from "@/view/Security/interfaces";
import { useState } from "react";
import { z } from "zod";
import {
  Control,
  FieldErrors,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KEY_STORE } from "@/constants";
import {
  useModalResponsive,
  useNotification,
} from "@itsa-develop/itsa-fe-components";
import { useNavigate } from "react-router-dom";
import {
  useCheckSession,
  useGetPermissions,
} from "@/services/security/security.service";
import { useExchangeCode } from "@/services/security/security.service";
import { useLogin } from "@/services/security/security.service";
import { useAuthStore } from "@/store/auth.store";

import { Button } from "@itsa-develop/itsa-fe-components";
import { useErrorFormulario } from "@/hooks/useErrorNotification";
import { AxiosErrorType } from "@/types/axios";

const schema = z.object({
  username: z.string().min(1, "Usuario es requerido"),
  password: z.string().min(1, "Contraseña es requerida"),
});

export interface ILoginUIHook {
  activeSessions: ICheckSessionResult[];
  setActiveSessions: (data: ICheckSessionResult[]) => void;
  control: Control<ILoginRequest>;
  register: UseFormRegister<ILoginRequest>;
  onSubmit?: (data: ILoginRequest) => void;
  errorFormMessage: (errors: FieldErrors) => void;
  isLoading: boolean;
}

export const useLoginUI = (): ILoginUIHook => {
  const { openNotificationWithIcon } = useNotification();
  const token = useAuthStore().token;
  const { control, register } = useForm<ILoginRequest>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const [activeSessions, setActiveSessions] = useState<ICheckSessionResult[]>(
    []
  );
  const { errorFormMessage } = useErrorFormulario();
  const { openModal, closeModal } = useModalResponsive();
  const navigate = useNavigate();
  const { mutate: checkSession, isPending: isPendingCheckSession } = useCheckSession();
  const { mutate: exchangeCode, isPending: isPendingExchangeCode } = useExchangeCode();
  const { mutate: login, isPending: isPendingLogin } = useLogin();

  const isLoading = isPendingCheckSession || isPendingExchangeCode || isPendingLogin;

  const { setToken } = useAuthStore();

  const { refetch: refetchPermissions } = useGetPermissions({
    enabled: !!token,
  });

  const handleOpenModal = (activeSessions: ICheckSessionResult[]) => {
    openModal({
      title: "Sesiones activas",
      height: "50vh",
      content: (
        <div>testss{activeSessions.length}</div>
      ),
      footer: (
        <div className="flex flex-row w-full justify-end gap-2">
          <Button
            size={"middle"}
            label={"Cerrar"}
            type="secondary"
            default={true}
            onClick={() => {
              closeModal();
            }}
          />
          <Button
            size={"middle"}
            label={"Continuar"}
            type="primary"
            onClick={() => {
              closeModal();
            }}
          />
        </div>
      ),
    });
  };

  const handleErrorMessage = (error: AxiosErrorType) => {
    openNotificationWithIcon({
      type: "error",
      message: error.response?.data?.message ?? "Error al verificar la sesión",
    });
  };

  const onSubmitLogin = (dataLogin: ILoginRequest) => {
    const password = dataLogin.password;
    // if (password) {
    //   password = encryptData(password);
    // }
    const newDataLogin = { ...dataLogin, password };

    checkSession(newDataLogin, {
      onSuccess: (dataCheckSession) => {
        if (dataCheckSession.length > 0) {
          handleOpenModal(dataCheckSession);
        } else {
          login(newDataLogin, {
            onSuccess: (data) => {
              exchangeCode(
                {
                  claimCode: data,
                },
                {
                  onSuccess: (data) => {
                    setToken(data.access);
                    localStorage.setItem(KEY_STORE.REFRESH_TOKEN, data.refresh);
                    refetchPermissions();
                    navigate("/home");
                  },
                  onError: (error) => {
                    handleErrorMessage(error);
                  },
                }
              );
            },
            onError: (error) => {
              handleErrorMessage(error);
            },
          });
        }
      },
      onError: (error) => {
        handleErrorMessage(error);
      },
    });
  };

  return {
    activeSessions,
    setActiveSessions,
    control,
    register,
    onSubmit: onSubmitLogin,
    errorFormMessage,
    isLoading,
  };
};
