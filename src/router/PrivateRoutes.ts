
type LazyComponentModule<TComponent> = { default: TComponent };

export interface IRouteLazy {
  path: string;
  params?: string[];
  lazyComponent?: () => Promise<LazyComponentModule<React.ComponentType>>;
  children?: IRouteLazy[];
}

export const arrayRoutes: IRouteLazy[] = [
  
];
