import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosError, AxiosRequestConfig } from "axios";
import { apiClient } from "./client";

export type AxiosBaseQueryArgs = {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
  signal?: AxiosRequestConfig["signal"];
};

export type AxiosBaseQueryError = {
  status?: number;
  data: unknown;
  message: string;
};

export const axiosBaseQuery =
  (): BaseQueryFn<AxiosBaseQueryArgs, unknown, AxiosBaseQueryError> =>
  async ({ url, method = "GET", data, params, headers, signal }) => {
    try {
      const result = await apiClient({
        url,
        method,
        data,
        params,
        headers,
        signal,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data ?? err.message,
          message: err.message,
        },
      };
    }
  };
