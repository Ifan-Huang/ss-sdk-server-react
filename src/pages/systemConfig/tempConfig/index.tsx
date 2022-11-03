import {PageContainer} from "@ant-design/pro-layout";
import type {ProColumns} from "@ant-design/pro-table";
import {ProTable} from "@ant-design/pro-table";
import type {AppConfigEntity} from "@/pages/systemConfig/tempConfig/data";
import {Tag, Tooltip} from "antd";
import {QuestionCircleOutlined} from "@ant-design/icons";
import React from "react";
import {pageList} from "@/pages/systemConfig/tempConfig/service";

function updateAppConfig() {
  alert('updateAppConfig')
}

const appConfigColumns: ProColumns<AppConfigEntity>[] = [
  {
    title: '包名',
    width: 120,
    dataIndex: 'pkg',
    align: 'center'
  },
  {
    title: (
      <>
        产品名称
        <Tooltip placement="top" title="pn">
          <QuestionCircleOutlined style={{ marginInlineStart: 4 }} />
        </Tooltip>
      </>
    ),
    width: 120,
    dataIndex: 'pn',
    align: 'center'
  },
  {
    title: '渠道号',
    width: 120,
    dataIndex: 'channelId',
    align: 'center',
  },
  {
    title: '状态',
    width: 120,
    dataIndex: 'status',
    align: 'center',
    render: (_, record) => <Tag color={record.status.color}>{record.status.text}</Tag>
  },
  {
    title: '创建时间',
    width: 140,
    key: 'since',
    dataIndex: 'created',
    valueType: 'date',
  },
  {
    title: '操作',
    width: 164,
    key: 'option',
    valueType: 'option',
    render: () => [
      <a key="1" onClick={updateAppConfig}>修改</a>,
      <a key="2">删除</a>,
    ],
  },
];


const pageAppConfigs = async (params: any) => {
  const query = {
    pageSize: params.pageSize,
    current: params.current
  };
  const result = await pageList(query);
  return {
    data: result.data.records,
    success: result.success,
    total: result.total
  }
}

const AppConfig: React.FC = () => {

  return (
    <PageContainer title='应用配置' content="用于配置以pkg和channel为主的相关配置，如登录、支付等。">
      <ProTable
        columns={appConfigColumns}
        rowKey='id'
        request={pageAppConfigs}
        pagination={{pageSize: 5}}
       />
    </PageContainer>
  )
}

export default AppConfig;
