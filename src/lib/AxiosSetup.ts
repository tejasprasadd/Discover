import type { AxiosInstance, AxiosError } from "axios";
import {
  AxiosInstanceGitHub,
  AxiosInstanceOmdb,
  AxiosInstanceRandomUser,
} from "@/lib/AxiosInstance";

export enum Environment {
  GITHUB = "GITHUB",
  OMDB = "OMDB",
  RANDOM_USER = "RANDOM_USER",
}

export const getAxiosInstanceByType = (instanceType: Environment): AxiosInstance => {
  switch (instanceType) {
    case Environment.GITHUB:
      return AxiosInstanceGitHub;
    case Environment.OMDB:
      return AxiosInstanceOmdb;
    case Environment.RANDOM_USER:
      return AxiosInstanceRandomUser;
    default:
      throw new Error(`Unsupported Axios instance type: ${instanceType}`);
  }
};

function attachResponseInterceptor(instance: AxiosInstance) {
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const status = error.response?.status;
      const statusText = error.response?.statusText;

      const message =
        typeof status === "number"
          ? `${status}${statusText ? ` ${statusText}` : ""}`
          : error.message;

      return Promise.reject(new Error(message));
    },
  );
}

const configured = new WeakSet<AxiosInstance>();

export const getAxiosInstance = (environment: Environment): AxiosInstance => {
  const instance = getAxiosInstanceByType(environment);

  if (!configured.has(instance)) {
    attachResponseInterceptor(instance);
    configured.add(instance);
  }

  return instance;
};

export const getParamsWithConfig = (
  params?: URLSearchParams | Record<string, unknown>,
  customHeaders?: Record<string, string>,
) => {
  const paramsObj =
    params instanceof URLSearchParams ? Object.fromEntries(params) : params;

  return {
    params: paramsObj,
    headers: customHeaders,
  };
};