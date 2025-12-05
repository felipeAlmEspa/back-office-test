import { useCatalogs } from "@/hooks/useCatalogs";
import { IDataType } from "@/interface";
import { IEmail } from "@/view/Core/Maintenance/People/interfaces";
import { useMemo } from "react";
import { Control, FieldValues, useFieldArray, UseFieldArrayAppend, UseFieldArrayRemove, useFormContext } from "react-hook-form";



export interface FormEmailDataUIHookProps {
  typesEmail: IDataType[];
  control: Control<FieldValues>;
  fields: Record<"id", string>[];
  remove: UseFieldArrayRemove;
  append: UseFieldArrayAppend<FieldValues, "emailData">;
  handleUpdateEmailPrincipal: (index: number) => void;
}

export const useFormEmailDataUI = (): FormEmailDataUIHookProps => {

    const { listTypesEmail, isLoadingTypesEmail } = useCatalogs();
    const { getValues, setValue, control } = useFormContext();
    const { fields, remove,append } = useFieldArray({
      control,
      name: "emailData",
    });
    
    const typesEmail = useMemo(() => {
      if (listTypesEmail && !isLoadingTypesEmail) {
        return listTypesEmail;
      }
      return [];
    }, [listTypesEmail, isLoadingTypesEmail]);

    const handleUpdateEmailPrincipal = (index: number) => {
      const currentEmailData = getValues("emailData") || [];
      const updatedEmailData = currentEmailData.map(
        (email: IEmail, i: number) => ({
          ...email,
          primary: i === index ? true : false,
        })
      );
      setValue("emailData", updatedEmailData);
    };

  return {
    control,
    typesEmail,
    fields,
    remove,
    append,
    handleUpdateEmailPrincipal,
  };
};
