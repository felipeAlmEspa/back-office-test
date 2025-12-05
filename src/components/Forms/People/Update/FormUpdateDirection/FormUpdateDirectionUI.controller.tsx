import { useFormUpdateDirectionUI } from "./FormUpdateDirectionUI.hook";
import { FormUpdateDirectionUIView } from "./FormUpdateDirectionUI.view";

export interface FormUpdateDirectionUIProps {
  personId: number;
  excludeAddressTypeCodes?: string[];
  excludeAddressTypeLabels?: string[];
  onSuccessUpdate?: () => void;
}
export const FormUpdateDirectionUI = ({ personId, excludeAddressTypeCodes, excludeAddressTypeLabels, onSuccessUpdate }: FormUpdateDirectionUIProps) => {
  const hook = useFormUpdateDirectionUI(personId, { onSuccessUpdate });

  return (
    <FormUpdateDirectionUIView
      {...hook}
      excludeAddressTypeCodes={excludeAddressTypeCodes}
      excludeAddressTypeLabels={excludeAddressTypeLabels}
    />
  );
};
