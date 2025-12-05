export const API_ROUTES = {
  // Security
  permissions: "security/get-permissions/",
  refreshToken: "security/refresh/",
  exchangeCode: "security/exchange-code/",
  logout: "security/logout/",
  login: "security/login/",
  checkSession: "security/check-session/",
  closeSession: "security/close-session/",
  validateRoute: "security/validate-route/",
  validatePermissions: "security/validate-permissions/",
  userInformation: "security/user-information/",
  securityModules: "security/modules/",
  securitySubModules: "security/submodules/",
  revaliteRefresh: "security/revalidate-refresh/",
  microFrontends: "security/micro-frontends/",
  securityPrograms: "security/programs/",
  securityGroups: "security/groups/",
  // Direction
  countries: "core/catalog/countries/",
  provinces: "core/catalog/provinces/",
  cantons: "core/catalog/cantons/",
  parishes: "core/catalog/parishes/",
  // People
  people: "core/people/",
  peopleIdentification: "core/people/identification/",
  // Phones
  phones: "core/phones/",
  // Emails
  emails: "core/emails/",
  // Directions
  directions: "core/directions/",
  // Customers
  customers: "core/customers/",
  // Clients Spare
  clientsSpare: "core-spares/customers/",
  coreSparesItems: "core-spares/items/",
  // Clients Wholesale
  clientsWholesale: "core-wholesales/customers/",
  // Sellers Wholesale
  sellersWholesale: "core-wholesales/sellers/",
  // Collaborators
  collaborators: "core/collaborators/",
  // Customers Workshops
  customersWorkshop: "core-auto-service-shops/customers/",
  // Technicians Workshops
  techniciansWorkshop: "core-auto-service-shops/technicians/",
  // Advisors Workshops
  advisorsWorkshop: "core-auto-service-shops/advisors/",
  // Work Processes Workshops
  workProcessesWorkshop: "core-auto-service-shops/work-processes/",
  // Carrier Companies
  carrierCompanies: "core/carrier-companies/",
  // Customers Vehicles
  customersVehicle: "core-vehicles/customers/",
  // Data Types
  dataTypes: "core/catalog/data-types/",
  securityCatalog: "security/catalog/",
  // Carriers
  carriers: "core/carriers/",
  // Holidays
  holidays: "core/holidays/",
  // Suppliers
  suppliers: "core/suppliers/",
  // Catalog
  coreCatalogTaxDetails: "core/catalog/tax-details/",
  typesActEconomical: "core/catalog/economic-activities/",
  typesSubactEconomical: "core/catalog/subeconomic-activities/",
  businessLines: "core/catalog/business-lines/",
  // Line Business Client
  lineBusinessClient: "core/line-business-customer-types/",
  // Items
  items: "inventory/items/",
  coreItems: "core/items/",
  // Spare
  // Inventory classes
  spareItems: "inventory/spares/items/",
  spareEquivalents: "inventory/spares/equivalents/",
  spareOrigins: "inventory/spares/spares-origin/",
  spareHolidays: "spares/holidays/",
  inventoryClasses: "inventory/classes/",
  inventorySubclasses: "inventory/subclasses/",
  inventoryBrands: "inventory/brands/",
  coreBrandBusinessLines: "core/brand-business-lines/",
  inventoryCatalog: "inventory/catalog/",
  // Vehicles - Salespeople
  salespeople: "core-vehicles/salespeople/",
  // Vehicles - CDN Advisors
  cdnAdvisors: "core-vehicles/cdn-advisors/",
  // Wholesale - Motorcycle Items
  motorcycleItems: "core-wholesales/motorcycles/items/",
  // Vehicles - Models
  vehicleModels: "core-vehicles/models/",
};
