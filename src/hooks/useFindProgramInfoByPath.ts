import { useCallback } from "react";
import { IAgency, IModule, ISubmodule, useAppLayoutStore } from "@itsa-develop/itsa-fe-components";

const stripParams = (value: string | null | undefined): string => {
  if (!value) return "";
  const [beforeQuery = ""] = String(value).split("?");
  const [beforeHash = ""] = beforeQuery.split("#");
  return beforeHash;
};

const normalizePath = (value: string | null | undefined): string => {
  const stripped = stripParams(value);
  return stripped.replace(/^\/+|\/+$/g, "").toLowerCase();
};



export const findParentPathFromAgencies = (
  agencies: IAgency[] | undefined,
  targetPath: string
): string | null => {
  if (!agencies || !Array.isArray(agencies) || !targetPath) return null;

  const target = normalizePath(targetPath);
  if (!target) return null;

  for (const agency of agencies) {
    const modules: IModule[] = agency?.modules ?? [];
    for (const mod of modules ?? []) {
      const submodules = mod?.submodules ?? [];
      for (const sub of submodules ?? []) {
        const subPath = (sub as ISubmodule)?.path ?? "";

        // 1) Coincide con Submódulo → retorna su pathPadre si existiera (fallback: intenta leer de primer programa)
        if (pathMatches(target, subPath)) {
          const firstProgram = ((sub as ISubmodule)?.programs ?? [])[0] as unknown as { pathPadre?: string | null; path_padre?: string | null };
          const parentFromSub = (sub as unknown as { pathPadre?: string | null; path_padre?: string | null })?.pathPadre
            ?? (sub as unknown as { pathPadre?: string | null; path_padre?: string | null })?.path_padre
            ?? firstProgram?.pathPadre
            ?? firstProgram?.path_padre
            ?? null;
          return parentFromSub;
        }

        // 2) Programas directos del submódulo → padre es pathPadre del submódulo
        const programs = (sub as ISubmodule)?.programs ?? [];
        for (const program of programs ?? []) {
          if (pathMatches(target, program?.path) || pathMatches(target, extractUrlPath((program as ISubmodule)?.url ?? null))) {
            const programParent = (program as unknown as { pathPadre?: string | null; path_padre?: string | null })?.pathPadre
              ?? (program as unknown as { pathPadre?: string | null; path_padre?: string | null })?.path_padre
              ?? null;
            return programParent;
          }
        }

        // 3) Programas dentro de grupos → padre también es pathPadre del submódulo
        const groups = (sub as ISubmodule)?.groups ?? [];
        for (const group of groups ?? []) {
          const groupPrograms = group?.programs ?? [];
          for (const program of groupPrograms ?? []) {
            if (pathMatches(target, program?.path) || pathMatches(target, extractUrlPath((program as ISubmodule)?.url ?? null))) {
              const programParent = (program as unknown as { pathPadre?: string | null; path_padre?: string | null })?.pathPadre
                ?? (program as unknown as { pathPadre?: string | null; path_padre?: string | null })?.path_padre
                ?? null;
              return programParent;
            }
          }
        }
      }
    }
  }

  return null;
};

export const useFindParentPath = () => {
  const agencies = useAppLayoutStore((state) => state.agencies);

  const findParentPath = useCallback(
    (path: string): string | null => {
      return findParentPathFromAgencies(agencies, path);
    },
    [agencies]
  );

  return { findParentPath };
};

// ---- New: Buscar información completa del programa por path ----
export interface IProgramLookupResult {
  module: Pick<IModule, "id" | "name" | "icon" | "entorno">;
  submodule: ISubmodule;
  group?: ISubmodule | null;
  program: ISubmodule;
  actions?: ISubmodule["actions"];
}

const pathMatches = (target: string | null | undefined, candidate: string | null | undefined): boolean => {
  const t = normalizePath(target);
  const c = normalizePath(candidate);
  if (!t || !c) return false;
  return t === c || t.startsWith(c) || c.startsWith(t);
};

const extractUrlPath = (url?: string | null): string => {
  if (!url) return "";
  try {
    const u = new URL(url);
    return u.pathname;
  } catch {
    // Fallback: si no es URL absoluta, tomar desde el primer '/'
    const idx = url.indexOf("/");
    return idx >= 0 ? url.slice(idx) : url;
  }
};

export const findProgramInfoByPathFromAgencies = (
  agencies: IAgency[] | undefined,
  rawPath: string
): IProgramLookupResult | null => {
  if (!agencies || !Array.isArray(agencies) || !rawPath) return null;
  const target = normalizePath(rawPath);
  if (!target) return null;

  for (const agency of agencies) {
    const modules: IModule[] = agency?.modules ?? [];
    for (const mod of modules ?? []) {
      const submodules = mod?.submodules ?? [];
      for (const sub of submodules ?? []) {
        // 1) Buscar en programas directos
        const programs = (sub as ISubmodule)?.programs ?? [];
        for (const program of programs ?? []) {
          if (pathMatches(target, program?.path) || pathMatches(target, extractUrlPath(program?.url))) {
            return {
              module: { id: mod.id, name: mod.name, icon: mod.icon, entorno: mod.entorno },
              submodule: sub as ISubmodule,
              group: null,
              program: program as ISubmodule,
              actions: (program as ISubmodule)?.actions ?? (sub as ISubmodule)?.actions,
            };
          }
        }

        // 2) Buscar en grupos.programas
        const groups = (sub as ISubmodule)?.groups ?? [];
        for (const group of groups ?? []) {
          const groupPrograms = group?.programs ?? [];
          for (const program of groupPrograms ?? []) {
            if (pathMatches(target, program?.path) || pathMatches(target, extractUrlPath(program?.url))) {
              return {
                module: { id: mod.id, name: mod.name, icon: mod.icon, entorno: mod.entorno },
                submodule: sub as ISubmodule,
                group: group as ISubmodule,
                program: program as ISubmodule,
                actions: (program as ISubmodule)?.actions ?? (group as ISubmodule)?.actions ?? (sub as ISubmodule)?.actions,
              };
            }
          }
        }
      }
    }
  }

  return null;
};

export const useFindProgramInfoByPath = () => {
  const agencies = useAppLayoutStore((state) => state.agencies);

  const findProgramInfoByPath = useCallback(
    (path: string): IProgramLookupResult | null => {
      return findProgramInfoByPathFromAgencies(agencies, path);
    },
    [agencies]
  );

  return { findProgramInfoByPath };
};