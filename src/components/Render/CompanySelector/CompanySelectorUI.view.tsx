import { Divider, FormLabel, Select } from "@itsa-develop/itsa-fe-components";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import { CompanySelectorHookProps } from "./CompanySelectorUI.hook";
import { ItemCompany } from "./components/ItemCompany";

export const CompanySelectorUIView = ({
  options,
  onSearch,
  loading,
  value,
  onChange,
  validLabelInfo,
  viewAddItem,
  openModalAddItem,
  label,
  status,
  infoCompany,
}: CompanySelectorHookProps) => {
  return (
    <div className="flex flex-col gap-1">
      <FormLabel label={label} />
      <Select
        showSearch
        status={status}
        options={options}
        optionRender={(option) => (
          <ItemCompany company={infoCompany(option.data.value as number)} />
        )}
        onChange={onChange}
        onSearch={onSearch}
        loading={loading}
        value={value}
        allowClear={true}
        placeholder={`Seleccionar ${label}`}
        filterOption={false}
        notFoundContent={validLabelInfo}
        popupRender={(menu) => (
          <>
            {menu}
            {viewAddItem && (
              <>
                <Divider style={{ margin: "8px 0" }} />
                <Space style={{ padding: "0 8px 4px" }}>
                  <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={openModalAddItem}
                  >
                    Agregar nueva empresa
                  </Button>
                </Space>
              </>
            )}
          </>
        )}
      />
    </div>
  );
};
