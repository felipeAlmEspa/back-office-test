import { useCatalogs } from "@/hooks/useCatalogs";
import { useEffect, useMemo } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IEmailResponse } from "@/view/Core/Maintenance/People/interfaces";
import { useGetEmails } from "@/services/people/people.service";
import { schemaEmailDataArray } from "@/view/Core/Maintenance/People/create/schemaCreatePerson";
import { useErrorFormulario } from "@/hooks/useErrorNotification";
import { useUpdateEmailPeople } from "@/services/people/peopleUpdate.services";
import { IUpdateEmailPeopleRequest } from "../interfaces";
import { useNotification } from "@itsa-develop/itsa-fe-components";
export interface FormUpdateEmailUIHookProps {
  methods: UseFormReturn<{ emailData: IEmailResponse[] }>;
  handleFormSubmit: () => void;
  isLoading: boolean;
  isLoadingTypesEmail: boolean;
}

export interface UseFormUpdateEmailUIOptions {
  onSuccessUpdate?: () => void;
}

export const useFormUpdateEmailUI = (
  personId: number,
  options?: UseFormUpdateEmailUIOptions
): FormUpdateEmailUIHookProps => {
  const { openNotificationWithIcon } = useNotification();
  const { errorFormMessage } = useErrorFormulario();
  const { data: emailsData, isLoading } = useGetEmails({ personId });
  const { mutate: updateEmail } = useUpdateEmailPeople();

  const { isLoadingTypesEmail } = useCatalogs();

  const methods = useForm<{ emailData: IEmailResponse[] }>({
    resolver: zodResolver(schemaEmailDataArray),
    mode: "onChange",
  });

  const { setValue } = methods;

  const emailsDataArray = useMemo(() => {
    if (!emailsData) return [];
    return emailsData.map((email) => ({
      emailId: email.id,
      emailTypeId: email.emailTypeId,
      email: email.email,
      primary: email.primary,
    }));
  }, [emailsData]);

  useEffect(() => {
    if (emailsDataArray.length > 0) {
      setValue("emailData", emailsDataArray);
    }
  }, [emailsDataArray, setValue]);

  const onSubmit = (data: IEmailResponse[]) => {
    const dataToUpdate: IUpdateEmailPeopleRequest = {
      personId: personId,
      emails: data,
    };
    updateEmail(
      { data: dataToUpdate },
      {
        onSuccess: () => {
          openNotificationWithIcon({
            type: "success",
            message: "Emails actualizados correctamente",
          });
          options?.onSuccessUpdate?.();
        },
      }
    );
  };

  const handleFormSubmit = methods.handleSubmit((data) => {
    onSubmit(data.emailData);
  }, errorFormMessage);

  return {
    methods,
    handleFormSubmit,
    isLoading,
    isLoadingTypesEmail,
  };
};
