import { IDataType } from "@/interface";
import { useMemo } from "react";
import { Control, FieldValues, UseFieldArrayRemove, useFormContext } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { IPhone } from "@/view/Core/Maintenance/People/interfaces";
import { useCatalogs } from "@/hooks/useCatalogs";




export interface FormPhoneDataUIHookProps {
  typesPhone: IDataType[],
  control: Control<FieldValues>;
  fields: Record<"id", string>[];
  remove: UseFieldArrayRemove;
  appendPhone: (value?: Partial<IPhone>) => Promise<void>;
  handleUpdatePhonePrincipal: (index: number) => void
}

export const useFormPhoneDataUI = (): FormPhoneDataUIHookProps => {
    const { listTypesPhone, isLoadingTypesPhone } = useCatalogs();
    const { control, getValues, setValue } = useFormContext();
    const { fields, remove, append } = useFieldArray({
      control,
      name: "phoneData",
    });
    const typesPhone = useMemo(() => {
      if (listTypesPhone && !isLoadingTypesPhone) {
        return listTypesPhone;
      }
      return [];
    }, [listTypesPhone, isLoadingTypesPhone]);

    const trigger = (control as any).trigger as ((name?: string | string[]) => Promise<boolean>);

    const handleUpdatePhonePrincipal = (index: number) => {
      const currentPhoneData = getValues("phoneData") || [];
      const updatedPhoneData = currentPhoneData.map(
        (phone: IPhone, i: number) => ({
          ...phone,
          primary: i === index ? true : false,
        })
      );
      setValue("phoneData", updatedPhoneData);
    };

    const appendPhone = async (value?: Partial<IPhone>) => {
      append({ ...(value || {}), primary: value?.primary ?? false });
        if (typeof trigger === "function") {
          await trigger("phoneData");
        }
    };
  return {
    typesPhone,
    control,
    fields,
    remove,
    appendPhone,
    handleUpdatePhonePrincipal,
  };
};
