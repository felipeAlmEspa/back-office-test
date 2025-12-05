import { IDirectionResponse } from "@/view/Core/Maintenance/People/interfaces";
import { useFormEditDirectionUI } from "./FormEditDirectionUI.hook";
import { FormEditDirectionUIView } from "./FormEditDirectionUI.view";

export interface FormEditDirectionUIControllerProps {
  directionData: IDirectionResponse;
  personId: number;
  onSuccess?: () => void;
  excludeAddressTypeCodes?: string[];
  excludeAddressTypeLabels?: string[];
}

export const FormEditDirectionUI = ({
  directionData,
  personId,
  onSuccess,
  excludeAddressTypeCodes,
  excludeAddressTypeLabels,
}: FormEditDirectionUIControllerProps) => {
  const hook = useFormEditDirectionUI({
    directionData,
    personId,
    onSuccess,
  });

  return (
    <FormEditDirectionUIView
      {...hook}
      excludeAddressTypeCodes={excludeAddressTypeCodes}
      excludeAddressTypeLabels={excludeAddressTypeLabels}
    />
  );
};
