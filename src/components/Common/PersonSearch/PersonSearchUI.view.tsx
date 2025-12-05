import {
  FormLabel,
  InputSearch,
  Input,
  Title,
} from "@itsa-develop/itsa-fe-components";

import { PersonSearchUIHookProps } from "./PersonSearchUI.hook";

export const PersonSearchUIView = ({
  //personIdentificationSearch,
  onChangePersonIdentificationSearch,
  isLoading,
  personExists,
}: PersonSearchUIHookProps) => {
  return (
    <div className="flex flex-col gap-1">
      {/*<Input
        type="text"
        value={personIdentificationSearch}
        onChange={(e) => onChangePersonIdentificationSearch?.(e.target.value)}
        placeholder="Buscar"
        suffix={isLoading ? <Spin /> : null}
      />*/}
      <FormLabel label="Buscar Persona" />
      <InputSearch
        type="text"
        placeholder="Buscar por Identificación"
        //value={personIdentificationSearch}
        onSearch={onChangePersonIdentificationSearch}
        loading={isLoading}
      />
      {personExists && (
        <div className="flex flex-col gap-0 p-4 bg-gray-250 rounded-lg mt-2">
          <Title title="Información Personal" level={5} />
          <div className="flex flex-col gap-1">
            <FormLabel label="Identificación" />
            <Input
              type="text"
              name="identification"
              placeholder="Identificación"
              value={personExists.identification}
              disabled
            />
          </div>
          <div className="flex flex-col gap-1">
            <FormLabel label="Persona" />
            <Input
              type="text"
              name="person"
              placeholder="Persona"
              value={personExists.person}
              disabled
            />
          </div>
        </div>
      )}
    </div>
  );
};
