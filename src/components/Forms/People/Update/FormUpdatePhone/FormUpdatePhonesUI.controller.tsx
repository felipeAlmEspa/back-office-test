import { useFormUpdatePhonesUI } from "./FormUpdatePhonesUI.hook";
import { FormUpdatePhonesUIView } from "./FormUpdatePhonesUI.view";

export interface FormUpdatePhonesUIProps {
  personId: number;
  onSuccessUpdate?: () => void;
}
export const FormUpdatePhonesUI = ({ personId, onSuccessUpdate }: FormUpdatePhonesUIProps) => {
  const hook = useFormUpdatePhonesUI(personId, { onSuccessUpdate });

  return (
    <FormUpdatePhonesUIView
      {...hook}
    />
  );
};
