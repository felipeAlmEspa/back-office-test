declare module "humps" {
  interface Humps {
    camelizeKeys<T = any>(object: any): T;
    decamelizeKeys<T = any>(object: any): T;
    camelize(str: string): string;
    decamelize(str: string, options?: { separator?: string }): string;
  }

  const humps: Humps;
  export default humps;
}
