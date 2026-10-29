import { lazy, type ComponentType } from "react";

/** The sections of one fold of a prerendered page, as dynamic imports (see src/components/landing/LazyFold.tsx). */
export type Loader = () => Promise<{ default: ComponentType }>;
export interface Fold<L extends readonly Loader[]> {
  load: () => Promise<ComponentType[]>;
  lazy: ComponentType[];
  loaders: L;
}

export const fold = <L extends readonly Loader[]>(...loaders: L): Fold<L> => ({
  loaders,
  lazy: loaders.map((l) => lazy(l)),
  load: () => Promise.all(loaders.map((l) => l().then((m) => m.default))),
});
