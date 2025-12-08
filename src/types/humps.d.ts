declare module "humps" {
  interface Humps {
    camelizeKeys<T = unknown>(object: unknown): T;
    decamelizeKeys<T = unknown>(object: unknown): T;
    camelize(str: string): string;
    decamelize(str: string, options?: { separator?: string }): string;
  }

  const humps: Humps;
  export default humps;
}
