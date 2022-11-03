export type TableListItem = {
  key: number;
  disabled?: boolean;
  href: string;
  avatar: string;
  name: string;
  owner: string;
  desc: string;
  callNo: number;
  status: string;
  updatedAt: Date;
  createdAt: Date;
  progress: number;
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
};

export type TableListParams = {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};


export type AppConfigParam = {
  id: number;
  pkg: string;
  pn: string;
  channelId: string;
  appConfigTypes: AppConfigTypeParam;
}

export type AppConfigEntity = {
  id: number;
  pkg: string;
  pn: string;
  channelId: string;
  created: string;
  status: Status;
  appConfigTypes: AppConfigType;
}

export type AppConfigType = {
  id: number;
  pkg: string;
  typeName: string;
  typeValue: string;
  typeCode: string;
  appConfigId: number;
}

export type AppConfigTypeParam = {
  id: number;
  appConfigId: string;
  pkg: string;
  typeName: string;
  typeCode: string;
  typeValue: string;
  status: boolean;
}
