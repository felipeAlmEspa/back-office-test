import { CollaboratorSelectorHookProps } from "./CollaboratorSelectorUI.hook";
import { FormLabel, Select } from "@itsa-develop/itsa-fe-components";
import { ItemCollaborator } from "./components/ItemCollaborator";

export const CollaboratorSelectorUIView = ({
  options,
  onSearch,
  loading,
  value,
  onChange,
  validLabelInfo,
  label,
  status,
  infoCollaborator,
}: CollaboratorSelectorHookProps) => {
  return (
    <div className="flex flex-col gap-1">
      <FormLabel label={label} />
      <Select
        showSearch
        status={status}
        options={options}
        optionRender={(option) => (
          <ItemCollaborator collaborator={infoCollaborator(option.data.value as number)} />
        )}
        onChange={onChange}
        onSearch={onSearch}
        loading={loading}
        value={value}
        allowClear={true}
        placeholder={`Seleccionar ${label}`}
        filterOption={false}
        notFoundContent={validLabelInfo}
      />
    </div>
  );
};
