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
