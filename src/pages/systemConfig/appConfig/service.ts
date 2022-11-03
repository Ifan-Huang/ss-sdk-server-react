// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { TableListItem } from './data';
import {AppConfigEntity} from "@/pages/systemConfig/tempConfig/data";

export async function updateAppConfigStatus(
  param: {
    id?: number;
    status?: number;
  }
) {
  return request<{
  }>('/api/master/appConfig/updateStatus', {
    method: 'POST',
    data: param
  })
}

export async function deleteConfig(
  param: {
    id?: number
  }
) {
  return request<{
  }>('/api/master/appConfig/delete', {
    method: 'DELETE',
    params: {
      id: param,
    }
  })
}

export async function cloneConfigById(
  param: {
    id?: number;
    pkg?: string;
    channel?: string;
    pn?: string;
  }
) {
  return request<{}>('/api/master/appConfig/cloneConfigById', {
    method: 'POST',
    data: param
  })
}

export async function save(
  param: {
    id?: number;
    status?: number;
    pkg?: string;
    channelId: string;
    pn?: string;
  }
) {
  return request<{
    msg?: string;
    success?: boolean;
  }>('/api/master/appConfig/saveOrUpdateV2', {
    method: 'POST',
    data: param
  })
}

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
  }>('/api/master/appConfig/pageList', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}



/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: TableListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/api/rule', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/api/rule', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(data: { key: number[] }, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}
