import {
  Button,
  ButtonAddItem,
  FormCheckBox,
  FormInput,
  FormSelect,
} from "@itsa-develop/itsa-fe-components";
import { DeleteOutlined } from "@ant-design/icons";
import { FormEmailDataUIHookProps } from "./FormEmailDataUI.hook";


export const FormEmailDataUIView = ({
  typesEmail,
  fields,
  remove,
  append,
  control,
  handleUpdateEmailPrincipal,
}: FormEmailDataUIHookProps) => {
  return (
    <div className="flex flex-col bg-gray-250 rounded-md gap-0 ">
      <div className="flex flex-col gap-0 ">
        <div className="flex flex-row justify-between w-[80%] rounded-md p-2 gap-2 pl-4 pr-4">
          <div className="flex flex-row gap-6 ">
            <span className="text-gray-300">Principal</span>
            <span className="text-gray-300">Email</span>
          </div>
          <div className="flex flex-row">
            <span className="text-gray-300">Tipo</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 p-1 max-h-[300px] overflow-y-auto">
          {fields.map((field, index) => {
            return (
              <div
                key={field.id}
                className="flex flex-row bg-white-100 rounded-md gap-0 pr-2"
              >
                <div className="flex flex-row items-center gap-2 w-full rounded-md p-2 pl-4 pr-4">
                  <div className="flex justify-center items-center w-16">
                    <FormCheckBox
                      control={control}
                      name={`emailData.${index}.primary`}
                      label=""
                      onChange={() => handleUpdateEmailPrincipal(index)}
                    />
                  </div>
                  <div className="flex-1">
                    <FormInput
                      control={control}
                      name={`emailData.${index}.email`}
                      label=""
                      placeholder="Email"
                      autoComplete="on"
                      textTransform="lowercase"
                    />
                  </div>
                  <div className="flex-1 max-w-1/4">
                    <FormSelect
                      control={control}
                      name={`emailData.${index}.emailTypeId`}
                      label=""
                      options={typesEmail}
                    />
                  </div>
                </div>
                <div className="flex flex-row justi
                fy-center items-center">
                  <Button
                    type="secondary"
                    onClick={() => remove(index)}
                    label={<DeleteOutlined />}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-start p-1">
        <ButtonAddItem onClick={() => append({})} label={"Agregar email"} />
      </div>
    </div>
  );
};
