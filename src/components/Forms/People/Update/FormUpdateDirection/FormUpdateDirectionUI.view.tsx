import { FormUpdateDirectionUIHookProps } from "./FormUpdateDirectionUI.hook";
import { FormProvider } from "react-hook-form";
import { LoadingModule } from "@/components/Loadings/LoadingModule";
import { Button } from "@itsa-develop/itsa-fe-components";
import { FormDirectionDataUI } from "../../Create/FormDirectionData/FormDirectionDataUI.controller";

type FormUpdateDirectionUIViewProps = FormUpdateDirectionUIHookProps & {
  excludeAddressTypeCodes?: string[];
  excludeAddressTypeLabels?: string[];
};

export const FormUpdateDirectionUIView = ({
  methods,
  handleFormSubmit,
  isLoading,
  isLoadingTypesAddress,
  isLoadingUpdateDirection,
  excludeAddressTypeCodes,
  excludeAddressTypeLabels,
  canSubmit,
  personId,
  onRefresh,
}: FormUpdateDirectionUIViewProps) => {
  if (isLoading || isLoadingTypesAddress) {
    return <LoadingModule message="Cargando..." />;
  }
  
  return (
    <div className="flex flex-col h-full min-h-0 p-4 w-full">
      <FormProvider {...methods}>
        <div className="flex flex-col h-full min-h-0 p-2 w-full space-y-4">
          <FormDirectionDataUI
            excludeAddressTypeCodes={excludeAddressTypeCodes}
            excludeAddressTypeLabels={excludeAddressTypeLabels}
            personId={personId}
            onRefresh={onRefresh}
          />
        </div>
      </FormProvider>
      <div className="flex justify-end mt-2">
        <Button
          type="primary"
          label="Guardar Cambios"
          size="middle"
          onClick={handleFormSubmit}
          loading={isLoadingUpdateDirection}
          disabled={!canSubmit}
        />
      </div>
    </div>
  );
};
