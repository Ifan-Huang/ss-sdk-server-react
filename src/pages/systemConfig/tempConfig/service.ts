import type {AppConfigEntity} from "@/pages/systemConfig/tempConfig/data";
import {request} from "umi";

export async function pageList(
  params: {
    current?: number;
    pageSize?: number;
  }
) {
  return request<{
    [x: string]: any;
    records: AppConfigEntity[];
    total?: number;
    msg?: string;
    success?: boolean;
  }>('/api/appConfig/pageList', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
