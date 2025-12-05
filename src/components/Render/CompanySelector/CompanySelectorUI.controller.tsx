import { useCompanySelectorUI, CompanySelectorUIProps } from "./CompanySelectorUI.hook";
import { CompanySelectorUIView } from "./CompanySelectorUI.view";

export const CompanySelectorUI = (props: CompanySelectorUIProps) => {
  const hook = useCompanySelectorUI(props);
  return <CompanySelectorUIView {...hook} />;
};
