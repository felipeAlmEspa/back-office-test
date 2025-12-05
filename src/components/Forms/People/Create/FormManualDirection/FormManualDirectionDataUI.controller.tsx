import { IDirection } from "@/view/Core/Maintenance/People/interfaces";
import { useFormManualDirectionDataUI } from "./FormManualDirectionDataUI.hook";
import { FormManualDirectionDataUIView } from "./FormManualDirectionDataUI.view";
import { IGoogleAutoCompleteProps } from "node_modules/@itsa-develop/itsa-fe-components/dist/components/InputAddress";

export interface FormManualDirectionDataUIControllerProps {
  onSaveDirection: (directionData: IDirection) => void;
  googleAutoCompleteProps: IGoogleAutoCompleteProps;
  excludeAddressTypeCodes?: string[];
  excludeAddressTypeLabels?: string[];
}

export const FormManualDirectionDataUI = ({ onSaveDirection, googleAutoCompleteProps, excludeAddressTypeCodes, excludeAddressTypeLabels }: FormManualDirectionDataUIControllerProps) => {
  const hook = useFormManualDirectionDataUI({onSaveDirection, googleAutoCompleteProps});

  return (
    <FormManualDirectionDataUIView
      {...hook}
      excludeAddressTypeCodes={excludeAddressTypeCodes}
      excludeAddressTypeLabels={excludeAddressTypeLabels}
    />
  );
};
