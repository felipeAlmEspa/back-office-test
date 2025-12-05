import { useFormUpdateEmailUI } from "./FormUpdateEmailUI.hook";
import { FormUpdateEmailUIView } from "./FormUpdateEmailUI.view";

export interface FormUpdateEmailUIProps {
  personId: number;
  onSuccessUpdate?: () => void;
}
export const FormUpdateEmailUI = ({ personId, onSuccessUpdate }: FormUpdateEmailUIProps) => {
  const hook = useFormUpdateEmailUI(personId, { onSuccessUpdate });

  return (
    <FormUpdateEmailUIView
      {...hook}
    />
  );
};
