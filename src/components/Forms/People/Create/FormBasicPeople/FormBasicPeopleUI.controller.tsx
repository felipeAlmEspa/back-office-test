import { useFormBasicPeopleUI } from "./FormBasicPeopleUI.hook";
import { FormBasicPeopleUIView } from "./FormBasicPeopleUI.view";

export const FormBasicPeopleUI = () => {
  const hook = useFormBasicPeopleUI();

  return (
    <FormBasicPeopleUIView
      {...hook}
    />
  );
};
