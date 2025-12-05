import { usePeopleSelectorUI } from "./PeopleSelectorUI.hook";
import { PeopleSelectorUIView } from "./PeopleSelectorUI.view";

export interface PeopleSelectorUIProps {
  onChange: (value?: number) => void;
  value?: number;
  openModalAddItem: () => void;
  label: string;
  status?: "error" | "warning";
  onSearchChange?: (identification: string) => void;
}

export interface IInitParamsHook {
  params: PeopleSelectorUIProps;
}

export const PeopleSelectorUI = ({
  value,
  onChange,
  openModalAddItem,
  label,
  status,
  onSearchChange,
}: PeopleSelectorUIProps) => {
  const hook = usePeopleSelectorUI({
    params: {
      onChange,
      value,
      openModalAddItem,
      label,
      status,
      onSearchChange,
    },
  });
  return <PeopleSelectorUIView {...hook} />;
};
