import { fetchAccessToken } from "@/api/config";
import { redirect, type LoaderFunction } from "react-router-dom";

const resolveSession = async () => {
  const token = await fetchAccessToken();
  return {
    token,
    isAuthenticated: Boolean(token),
  };
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Simulates an async validation call for route-level access.
const simulateRouteAccessValidation = async (routePath?: string) => {
  await wait(1000);
  // Example rule: block access to a specific route name.
  return routePath !== "forbidden-route";
};

/**
 * Loader used by private routes (dashboard and nested paths).
 * Redirects unauthenticated users to the login page and lets the request continue otherwise.
 */
export const validataAccessRefreshToken: LoaderFunction = async () => {

  const { isAuthenticated } = await resolveSession();

  if (!isAuthenticated) {
    return redirect("/login");
  }

  return null;
};

/**
 * Loader for the login page – if a session already exists, send the user to the dashboard.
 */
export const redirectIfAuthenticatedLoader: LoaderFunction = async () => {
  const { isAuthenticated } = await resolveSession();

  if (isAuthenticated) {
    return redirect("/home");
  }

  return null;
};

/**
 * Loader for the root route. Chooses the correct initial page based on the session.
 */
export const rootRedirectLoader: LoaderFunction = async () => {
  const { isAuthenticated } = await resolveSession();
  return redirect(isAuthenticated ? "/home" : "/login");
};


export const validateAccessRouteAsync =
  (routePath?: string): LoaderFunction =>
  async () => {
    console.log('routePath =>',routePath);
    console.warn('TEST => INGRESAMOS AL VALIDACION');
    
    const { isAuthenticated } = await resolveSession();

    if (!isAuthenticated) {
      return redirect("/login");
    }

    const canAccess = await simulateRouteAccessValidation(routePath);

    if (!canAccess) {
      return redirect("/home");
    }

    return null;
  };