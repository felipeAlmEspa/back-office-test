import { useCatalogs } from "@/hooks/useCatalogs";
import { schemaPhoneDataArray } from "@/view/Core/Maintenance/People/create/schemaCreatePerson";
import { useGetPhones } from "@/services/people/people.service";
import { IPhonePersonResponse } from "@/view/Core/Maintenance/People/interfaces";
import { useEffect, useMemo } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdatePhonePeople } from "@/services/people/peopleUpdate.services";
import { IUpdatePhonePeopleRequest } from "../interfaces";
import { useNotification } from "@itsa-develop/itsa-fe-components";
import { isEcuadorMobile, isEcuadorFixedLine } from "@/utils/phone";

export interface FormUpdatePhonesUIHookProps {
  methods: UseFormReturn<{ phoneData: IPhonePersonResponse[] }>;
  handleFormSubmit: () => void;
  isLoading: boolean;
  isLoadingTypesPhone: boolean;
  isLoadingUpdatePhonePeople: boolean;
}

export interface UseFormUpdatePhonesUIOptions {
  onSuccessUpdate?: () => void;
}

export const useFormUpdatePhonesUI = (
  personId: number,
  options?: UseFormUpdatePhonesUIOptions
): FormUpdatePhonesUIHookProps => {
  const { openNotificationWithIcon } = useNotification();
  const { data: phonesData, isLoading } = useGetPhones({ personId });
  const phonesDataArray = useMemo(() => phonesData ?? [], [phonesData]);
  const { isLoadingTypesPhone, listTypesPhone } = useCatalogs();
  const { mutate: updatePhonePeople, isPending: isLoadingUpdatePhonePeople } =
    useUpdatePhonePeople();

  const methods = useForm<{ phoneData: IPhonePersonResponse[] }>({
    resolver: zodResolver(schemaPhoneDataArray),
    mode: "all",
  });

  const { setValue } = methods;

  useEffect(() => {
    if (phonesDataArray.length > 0) {
      setValue("phoneData", phonesDataArray);
    }
  }, [phonesDataArray, setValue]);

  const handleFormSubmit = methods.handleSubmit(async () => {
      const phoneData = methods.getValues("phoneData") || [];
      if (phoneData && phoneData.length > 0 && listTypesPhone && listTypesPhone.length > 0) {
        const nonDomicilioTypeValues = listTypesPhone
          .filter((t) => (t.label || "").toString().trim().toLowerCase() !== "domicilio")
          .map((t) => t.value);

          if (nonDomicilioTypeValues.length > 0) {
            let hasInvalid = false;
            const domicilioValue = listTypesPhone.find((t) => (t.label || "").toString().trim().toLowerCase() === "domicilio")?.value;
            phoneData.forEach((p: IPhonePersonResponse, idx: number) => {
              const number = p.phoneNumber || "";
              if (p.phoneTypeId === domicilioValue) {
                const valid = isEcuadorFixedLine(number);
                if (!valid) {
                  hasInvalid = true;
                  methods.setError(`phoneData.${idx}.phoneNumber`, {
                    type: "manual",
                    message: "Domicilio: debe tener 9 dígitos y comenzar con 02,03,04,05,06 o 07",
                  });
                }
              } else if (nonDomicilioTypeValues.includes(p.phoneTypeId)) {
                const valid = isEcuadorMobile(number);
                if (!valid) {
                  hasInvalid = true;
                  methods.setError(`phoneData.${idx}.phoneNumber`, {
                    type: "manual",
                    message: "El número debe ser un teléfono válido de Ecuador",
                  });
                }
              }
            });
            if (hasInvalid) {
              return;
            }
          }
      }


    const data: IUpdatePhonePeopleRequest = {
      personId,
      phones: methods.getValues("phoneData").map((phone) => ({
        phoneId: phone.id,
        phoneTypeId: phone.phoneTypeId,
        phoneNumber: phone.phoneNumber,
        primary: phone.primary,
      })),
    };
    updatePhonePeople({ data }, {
      onSuccess: () => {
        openNotificationWithIcon({
          type: "success",
          message: "Teléfonos actualizados correctamente",
        });
        options?.onSuccessUpdate?.();
      },
    });
  });

  return {
    methods,
    handleFormSubmit,
    isLoading,
    isLoadingTypesPhone,
    isLoadingUpdatePhonePeople,
  };
};
