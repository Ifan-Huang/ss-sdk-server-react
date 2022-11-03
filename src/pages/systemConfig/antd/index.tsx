import {PageContainer} from "@ant-design/pro-layout";
import {Table} from "antd";
import React from "react";
import {pageList} from "@/pages/systemConfig/appConfig/service";

const Antd: () => void = () => {

  const columns = [
    {
      'title': '包名',
      'dataIndex': 'pkg',
      '': '',
      'tip': '提示项',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              alert('test')
            }}
          >
            {dom}
          </a>
        );

      },
    },
    {
      title: '渠道号',
      dataIndex: 'channelId',
      valueType: 'textarea',
      tip: '主要配置项，需要唯一'
    },
    {
      title: '产品名称',
      dataIndex: 'pn',
      valueType: 'textarea',
      tip: 'pn'
    },
    {
      title: '创建时间',
      dataIndex: 'created',
      valueType: 'date'
    },
  ]


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

  return (
    <PageContainer
      title='Ant design'
      content='Test ant design not ant design pro'
    >
      <Table
        columns={columns}
        request={pageAppConfigs}
      >

      </Table>

    </PageContainer>
  )
}

export default Antd;
