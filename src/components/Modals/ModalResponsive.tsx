import { Modal } from "@itsa-develop/itsa-fe-components";


export interface ModalGenericProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any;
}


export const ModalResponsive = ({ isOpen, onClose, title, children }: ModalGenericProps) => {
  if (!isOpen) return null;
  
  return (
    <Modal
      title={title}
      open={isOpen}
      onOk={onClose}
      confirmLoading={false}
      onCancel={onClose}
    >
      {children}
    </Modal>
  );
};
