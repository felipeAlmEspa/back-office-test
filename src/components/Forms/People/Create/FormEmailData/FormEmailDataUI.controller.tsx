import { FormEmailDataUIView } from "./FormEmailDataUI.view";
import { useFormEmailDataUI } from "./FormEmailDataUI.hook";

export const FormEmailDataUI = () => {
  const hook = useFormEmailDataUI();

  return <FormEmailDataUIView {...hook} />;
};
