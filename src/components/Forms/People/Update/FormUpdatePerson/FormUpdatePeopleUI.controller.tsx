import { useFormBasicPeopleUI } from "./FormUpdatePeopleUI.hook";
import { FormBasicPeopleUIView } from "./FormUpdatePeopleUI.view";

export interface FormBasicPeopleUIProps {
  personId: number;
  onSuccessUpdate?: () => void;
}
export const FormBasicPeopleUI = ({ personId, onSuccessUpdate }: FormBasicPeopleUIProps) => {
  const hook = useFormBasicPeopleUI(personId, { onSuccessUpdate });

  return (
    <FormBasicPeopleUIView
      {...hook}
    />
  );
};
