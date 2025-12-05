import { Input, Button, Space, Typography } from "antd";
import { SearchOutlined, PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { SpouseSelectorHookProps } from "./SpouseSelectorUI.hook.tsx";
import { FormLabel } from "@itsa-develop/itsa-fe-components";

export const SpouseSelectorUIView = ({
  identification,
  setIdentification,
  handleSearch,
  handleClear,
  isSearching,
  spouseData,
  value,
  label,
  placeholder,
  disabled,
  handleOpenCreateModal,
}: SpouseSelectorHookProps) => {
  return (
    <div className="w-full border border-primary-700 rounded p-2">
      <FormLabel label={label} />
      
      {!value ? (
        <Space.Compact className="w-full">
          <Input
            placeholder={placeholder}
            value={identification}
            onChange={(e) => setIdentification(e.target.value)}
            disabled={disabled}
            onPressEnter={handleSearch}
          />
          <Button
            danger
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            loading={isSearching}
            disabled={disabled || !identification}
          >
            Buscar
          </Button>
          <Button
            danger
            icon={<PlusOutlined />}
            onClick={handleOpenCreateModal}
            disabled={disabled}
          >
            Crear
          </Button>
        </Space.Compact>
      ) : (
        <div className="flex items-center gap-2 p-2 border rounded bg-gray-50">
          <div className="flex-1">
            <Typography.Text strong>{spouseData?.person || "Cargando..."}</Typography.Text>
            <br />
            <Typography.Text type="secondary" className="text-xs">
              ID: {spouseData?.identification || value}
            </Typography.Text>
          </div>
          <Button
            danger
            icon={<CloseOutlined />}
            size="small"
            onClick={handleClear}
          >
            Quitar
          </Button>
        </div>
      )}
    </div>
  );
};
