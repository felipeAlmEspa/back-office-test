import { SpouseSelectorUIView } from "./SpouseSelectorUI.view";
import { useSpouseSelectorUI } from "./SpouseSelectorUI.hook.tsx";

interface ModalConfig {
  title: string;
  content: React.ReactNode;
  height?: string;
  closable?: boolean;
  footer?: React.ReactNode;
}

interface NotificationConfig {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  description?: string;
}

interface SpouseSelectorUIProps {
  value?: number;
  onChange: (value?: number) => void;
  label?: string;
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
  openNotificationWithIcon: (config: NotificationConfig) => void;
  initialIdentification?: string;
  initialValue?: number;
  initialIdentificationTypeId?: number;
  initialSpouseName?: string;
  title?: string;
  identificationFormPerson?: string;
}

export const SpouseSelectorUI = (props: SpouseSelectorUIProps) => {
  const hookProps = useSpouseSelectorUI(props);

  return <SpouseSelectorUIView {...hookProps} />;
};
