import { FormPhoneDataUIView } from "./FormPhoneDataUI.view";
import { useFormPhoneDataUI } from "./FormPhoneDataUI.hook";


export const FormPhoneDataUI = () => {
  const hook = useFormPhoneDataUI();

  return (
    <FormPhoneDataUIView
      {...hook}
    />
  );
};
