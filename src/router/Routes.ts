

export const ROUTES_SPARES = {
  spares: () => "spares" as const,
  sparesItems: () => `${ROUTES_SPARES.spares()}/items` as const,
  sparesEquivalents: () => `${ROUTES_SPARES.spares()}/equivalents` as const,
  sparesOrigins: () => `${ROUTES_SPARES.spares()}/origins` as const,
  sparesItemsCreate: () => `${ROUTES_SPARES.sparesItems()}/create` as const,
  sparesItemsUpdate: () => `${ROUTES_SPARES.sparesItems()}/update` as const,
  sparesEquivalentsCreate: () => `${ROUTES_SPARES.sparesEquivalents()}/create` as const,
  sparesHolidays: () => `${ROUTES_SPARES.spares()}/holidays` as const,
};

export const ROUTES_INVENTORY = {
  inventory: () => "inventory" as const,
  inventoryClasses: () => `${ROUTES_INVENTORY.inventory()}/classes` as const,
  inventoryBrands: () => `${ROUTES_INVENTORY.inventory()}/brands` as const,
  inventorySubclasses: () => `${ROUTES_INVENTORY.inventory()}/subclasses` as const,
};

export const ROUTES_WORKSHOPS = {
  workshops: () => "workshops" as const,
  workshopsCustomersList: () => `${ROUTES_WORKSHOPS.workshops()}/customers-management` as const,
  workshopsCustomersCreate: () => `${ROUTES_WORKSHOPS.workshopsCustomersList()}/create` as const,
  workshopsCustomersUpdate: () => `${ROUTES_WORKSHOPS.workshopsCustomersList()}/update` as const,
  workshopsAdvisorsList: () => `${ROUTES_WORKSHOPS.workshops()}/advisors-management` as const,
  workshopsAdvisorsCreate: () => `${ROUTES_WORKSHOPS.workshops()}/advisors-management/create` as const,
  workshopsAdvisorsUpdate: () => `${ROUTES_WORKSHOPS.workshops()}/advisors-management/update` as const,
  workshopsTechniciansList: () => `${ROUTES_WORKSHOPS.workshops()}/technicians-management` as const,
  workshopsTechniciansCreate: () => `${ROUTES_WORKSHOPS.workshopsTechniciansList()}/create` as const,
  workshopsTechniciansUpdate: () => `${ROUTES_WORKSHOPS.workshopsTechniciansList()}/update` as const,
  workshopsWorkProcessesList: () => `${ROUTES_WORKSHOPS.workshops()}/work-processes-management` as const,
  workshopsWorkProcessesCreate: () => `${ROUTES_WORKSHOPS.workshopsWorkProcessesList()}/create` as const,
  workshopsWorkProcessesUpdate: () => `${ROUTES_WORKSHOPS.workshopsWorkProcessesList()}/update` as const,
};

export const ROUTES_WHOLESALE = {
  wholesale: () => "wholesale" as const,
  wholesaleList: () => `${ROUTES_WHOLESALE.wholesale()}/list` as const,
  wholesaleCreate: () => `${ROUTES_WHOLESALE.wholesale()}/create` as const,
  wholesaleUpdate: () => `${ROUTES_WHOLESALE.wholesale()}/update` as const,
  wholesaleView: () => `${ROUTES_WHOLESALE.wholesale()}/view` as const,
  wholesaleClientsList: () => `${ROUTES_WHOLESALE.wholesale()}/customers-management` as const,
  wholesaleSellersList: () => `${ROUTES_WHOLESALE.wholesale()}/sellers-management` as const,
  wholesaleSellersCreate: () => `${ROUTES_WHOLESALE.wholesaleSellersList()}/create` as const,
  wholesaleSellersUpdate: () => `${ROUTES_WHOLESALE.wholesaleSellersList()}/update` as const,
  wholesaleMotorcycleItemsList: () => `${ROUTES_WHOLESALE.wholesale()}/items/motorcycles` as const,
  wholesaleMotorcycleItemsCreate: () => `${ROUTES_WHOLESALE.wholesaleMotorcycleItemsList()}/create` as const,
  wholesaleMotorcycleItemsUpdate: () => `${ROUTES_WHOLESALE.wholesaleMotorcycleItemsList()}/update` as const,
};
export const ROUTES_VEHICLES_MODELS_ACCESSORIES = {
  vehiclesModelsAccessoriesList: () => `${ROUTES_VEHICLES.vehiclesModelsList()}/accessories` as const,
};

export const ROUTES_VEHICLES = {
  vehicles: () => "vehicles" as const,
  vehiclesSellersList: () => `${ROUTES_VEHICLES.vehicles()}/sellers-management` as const,
  vehiclesCdnAdvisorsList: () => `${ROUTES_VEHICLES.vehicles()}/cdn-advisors-management` as const,
  vehiclesCdnAdvisorsCreate: () => `${ROUTES_VEHICLES.vehiclesCdnAdvisorsList()}/create` as const,
  vehiclesSellersCreate: () => `${ROUTES_VEHICLES.vehiclesSellersList()}/create` as const,
  vehiclesSellersUpdate: () => `${ROUTES_VEHICLES.vehiclesSellersList()}/update` as const,
  
  /* Modelos de vehiculos */
  vehiclesModelsList: () => `${ROUTES_VEHICLES.vehicles()}/models-management` as const,

  /* Accesorios de modelos vehiculos */
  ...ROUTES_VEHICLES_MODELS_ACCESSORIES,
};


export const ROUTES_CORE_ITEMS = {
  coreItems: () => "items" as const,
  coreItemsList: () => `${ROUTES_CORE_ITEMS.coreItems()}/list` as const,
  coreItemsCreate: (type: string) => `${ROUTES_CORE_ITEMS.coreItems()}/${type}/create` as const,
  coreItemsUpdate: (type: string) => `${ROUTES_CORE_ITEMS.coreItems()}/${type}/update` as const,
};

export const ROUTES_KEYS = {
  home: () => "home" as const,
  core: () => "core" as const,
  coreClientsList: () => `${ROUTES_KEYS.core()}/customers-management` as const,
  coreClientsCreate: () => `${ROUTES_KEYS.coreClientsList()}/create` as const,
  coreClientsUpdate: () => `${ROUTES_KEYS.coreClientsList()}/update` as const,

  /**CARRIERS GENERIC*/
  coreCarriersList: () => `${ROUTES_KEYS.core()}/carriers` as const,
  coreCarriersCreate: () => `${ROUTES_KEYS.coreCarriersList()}/create` as const,
  coreCarriersUpdate: () => `${ROUTES_KEYS.coreCarriersList()}/update` as const,
  coreCarriersCompanyCreate: () =>
    `${ROUTES_KEYS.coreCarriersList()}/company/create` as const,

  /**HOLIDAYS GENERIC*/
  coreHolidaysList: () => `${ROUTES_KEYS.core()}/holidays` as const,
  coreHolidaysCreate: () =>
    `${ROUTES_KEYS.coreHolidaysList()}/holidays` as const,
  coreHolidaysUpdate: () => `${ROUTES_KEYS.coreHolidaysList()}/update` as const,
  /**SUPPLIERS*/
  coreSuppliersList: () => `${ROUTES_KEYS.core()}/suppliers` as const,
  coreSuppliersCreate: () => `${ROUTES_KEYS.coreSuppliersList()}/create` as const,
  coreSuppliersUpdate: () => `${ROUTES_KEYS.coreSuppliersList()}/update` as const,

  clientsList: (type: string) => `${type}/customers-management` as const,
  clientsCreateByType: (type: string) => `${ROUTES_KEYS.clientsList(type)}/create` as const,
  clientsUpdateByType: (type: string) => `${ROUTES_KEYS.clientsList(type)}/update` as const,

  ...ROUTES_SPARES,
  ...ROUTES_WHOLESALE,
  ...ROUTES_INVENTORY,
  ...ROUTES_WORKSHOPS,
  ...ROUTES_VEHICLES,
  ...ROUTES_CORE_ITEMS,
};
