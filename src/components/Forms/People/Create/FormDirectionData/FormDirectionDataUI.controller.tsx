import { FormDirectionDataUIView } from "./FormDirectionDataUI.view";
import { useFormDirectionDataUI } from "./FormDirectionDataUI.hook";

interface Props {
  excludeAddressTypeCodes?: string[];
  excludeAddressTypeLabels?: string[];
  personId?: number;
  onRefresh?: () => void;
}

export const FormDirectionDataUI = (props: Props) => {
  const hook = useFormDirectionDataUI({
    excludeAddressTypeCodes: props.excludeAddressTypeCodes,
    excludeAddressTypeLabels: props.excludeAddressTypeLabels,
    personId: props.personId,
    onRefresh: props.onRefresh,
  });

  return (
    <FormDirectionDataUIView
      {...hook}
      {...props}
    />
  );
};
