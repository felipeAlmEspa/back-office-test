import { PeopleSelectorHookProps } from "./PeopleSelectorUI.hook";
import { Divider, FormLabel, Select } from "@itsa-develop/itsa-fe-components";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import { ItemPerson } from "./components/ItemPerson";
export const PeopleSelectorUIView = ({
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
  infoPerson,
}: PeopleSelectorHookProps) => {
  return (
    <div className="flex flex-col gap-1">
      <FormLabel label={label} />
      <Select
        showSearch
        status={status}
        options={options}
        optionRender={(option) => (
          <ItemPerson person={infoPerson(option.data.value as number)} />
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
                    Agregar nueva persona
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
