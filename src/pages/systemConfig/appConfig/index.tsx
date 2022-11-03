import {PlusOutlined} from '@ant-design/icons';
import {Button, Descriptions, Drawer, message} from 'antd';
import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type {ProDescriptionsItemProps} from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type {FormValueType} from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import {cloneConfigById, deleteConfig, pageList, save, updateAppConfigStatus, updateRule} from './service';
import type {AppConfigEntity, TableListItem, TableListPagination} from './data';
import type {ProFormInstance} from "@ant-design/pro-form";
import {ModalForm, ProFormSelect, ProFormText} from "@ant-design/pro-form";
import {StepsForm} from "@ant-design/pro-form/es/layouts/StepsForm";


const handleUpdate = async (fields: FormValueType, currentRow?: AppConfigEntity) => {
  const hide = message.loading('正在配置');

  try {
    await updateRule({
      ...currentRow,
      ...fields,
    });
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

const TableList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [cloneModalVisible, handleCloneModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */

  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [deleteModalVisible, handleDeleteModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<AppConfigEntity>();
  const [selectedRowsState, setSelectedRows] = useState<AppConfigEntity[]>([]);
  const [record, setRecord] = useState<AppConfigEntity>();



  const doOnline = async (param: number) => {
    const query = {
      id: param,
      status: 1
    }
    await updateAppConfigStatus(query);
    if(actionRef.current) {
      actionRef.current.reload()
    }
  }

  const formMapRef = useRef<React.MutableRefObject<ProFormInstance<any> | undefined>[]>([]);

  const doDeleteConfig = async () => {
    const param = record.id;
    await deleteConfig(param);
    if(actionRef.current) {
      actionRef.current.reload()
    }
    handleDeleteModalVisible(false);
    setCurrentRow(undefined);
    setRecord(undefined);
  }

  const doOffline = async (param: number) => {
    const query = {
      id: param,
      status: 0
    }
    await updateAppConfigStatus(query);
    if(actionRef.current) {
      actionRef.current.reload()
    }
  }

  const doCloneConfig = async (value: any) => {

    const query = {
      id: record.id, ...value
    }
    await cloneConfigById(query);
    if(actionRef.current) {
        actionRef.current.reload();
    }
    handleCloneModalVisible(false);
    setCurrentRow(undefined);
    setRecord(undefined);
  }

  const columns: ProColumns<AppConfigEntity>[] = [
    {
      title: '包名',
      dataIndex: 'pkg',
      tip: '主要配置项，需要唯一',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
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
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '已下线',
          status: 'Error',
        },
        1: {
          text: '已上线',
          status: 'Success',
        }
      },
    },

    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        // <a
        //   key="edit"
        //   onClick={() => {
        //     handleUpdateModalVisible(true);
        //     setCurrentRow(record);
        //   }}
        // >
        //   编辑
        // </a>,
        <a key="online"
          onClick={() => {
            doOnline(record.id);
          }}
        >
          上线
        </a>,
        <a key="offline"
          onClick={() => {
            doOffline(record.id)
          }}
        >
          下线
        </a>,
       <a key="cloneConfig"
         onClick={() => {
           handleCloneModalVisible(true);
           setRecord(record);
         }}
       >
         克隆配置
       </a>,
        <a key="deleteConfig"
           onClick={() => {
             handleDeleteModalVisible(true);
             setRecord(record);
           }}
        >
          删除
        </a>,
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

  return (
    <PageContainer>
      <ProTable<AppConfigEntity, TableListPagination>
        headerTitle="应用配置"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={pageAppConfigs}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />

      <ModalForm
        title="新建应用配置"
        width="600px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        modalProps={{
          destroyOnClose: true
        }}
        submitter={false}
      >
        <StepsForm<AppConfigEntity>
          formMapRef={formMapRef}
          onFinish={
            async (value) => {
              const query = {
                ...value
              };
              console.log('submit param:', value);
              if(value.pkg == null || value.channelId == null || value.pn == null) {
                alert('请填写完整！');
                return;
              }

              const result = await save(query);
              console.log('saveAppConfig result: ', result)
              if(result.success) {
                handleModalVisible(false);
                message.success(result.msg);
                if(actionRef.current) {
                  actionRef.current.reload()
                }
              } else {
                message.error(result.msg)
              }
            }
          }
        >
          <StepsForm.StepForm name="step1" title="包和渠道信息">
            <ProFormText label="包名" name={'pkg'} rules={[{ required: true, message: '请输入包名' }]} />
            <ProFormText label="渠道号" name={'channelId'} rules={[{ required: true, message: '请输入渠道号' }]} />
            <ProFormText label="产品名称（pn）" name={'pn'} rules={[{ required: true, message: '请输入产品名称' }]} />
          </StepsForm.StepForm>
          <StepsForm.StepForm name="step2" title={'配置项信息'}>
            <ProFormSelect label="google登录" rules={[{ required: true, message: '请选择google登录是否启用' }]}  request={async () => [
              { label: '启用', value: 'true' },
              { label: '关闭', value: 'false' }
            ]} name={'googleLogin'}>
            </ProFormSelect>

            <ProFormText label="google client id"  name={'googleClientId'}  rules={[{ required: true, message: '请输入google client id' }]} />
            <ProFormText label="google client secret"  name={'googleClientSecret'} rules={[{ required: true, message: '请输入google client secret' }]} />

            <ProFormSelect label="facebook登录" rules={[{ required: true, message: '请选择facebook登录是否启用' }]}  request={async () => [
              { label: '启用', value: 'true' },
              { label: '关闭', value: 'false' }
            ]} name={'facebookLogin'} />
            <ProFormText label="facebook client id"  name={'facebookClientId'}  rules={[{ required: true, message: '请输入facebook client id' }]} />
            <ProFormText label="facebook client secret"  name={'facebookClientSecret'} rules={[{ required: true, message: '请输入facebook client secret' }]} />

            <ProFormSelect label="guest登录" rules={[{ required: true, message: '请选择guest登录是否启用' }]}   request={async () => [
              { label: '启用', value: 'true' },
              { label: '关闭', value: 'false' }
            ]} name={'guestLogin'} />
            <ProFormSelect label="phone登录" rules={[{ required: true, message: '请选择phone登录是否启用' }]}   request={async () => [
              { label: '启用', value: 'true' },
              { label: '关闭', value: 'false' }
            ]} name={'phoneLogin'} />

            <ProFormSelect label="google支付" rules={[{ required: true, message: '请选择google支付是否启用' }]}  request={async () => [
              { label: '启用', value: 'true' },
              { label: '关闭', value: 'false' }
            ]} name={'googlePay'} />
            <ProFormSelect label="vPay支付" rules={[{ required: true, message: '请选择vPay支付是否启用' }]} request={async () => [
              { label: '启用', value: 'true' },
              { label: '关闭', value: 'false' }
            ]} name={'vpay'} />

            <ProFormSelect label="vPay好友代付" rules={[{ required: true, message: '请选择vPay好友代付是否启用' }]} request={async () => [
              { label: '启用', value: 'true' },
              { label: '关闭', value: 'false' }
            ]} name={'vPayOnBehalf'} />
          </StepsForm.StepForm>
        </StepsForm>
      </ModalForm>

      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value, currentRow);
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />

      {/*
        doCloneConfig(record.id);
      */}
      <ModalForm
        visible={cloneModalVisible}
        onVisibleChange={handleCloneModalVisible}
        title="克隆应用配置,与选定数据相同的子配置"
        width="600px"
        modalProps={{
          destroyOnClose: true,
          okText: '克隆'
        }}
        onFinish={doCloneConfig}
        onReset={() => {
          handleCloneModalVisible(false);
          setCurrentRow(undefined);
          setRecord(undefined);
        }}
      >
          <ProFormText label='包名' rules={[{required: true, message: '请输入包名'}]} name={'pkg'}/>
          <ProFormText label='渠道号' rules={[{required: true, message: '请输入渠道号'}]} name={'channelId'}/>
          <ProFormText label='产品名称（pn）' rules={[{required: true, message: '请输入产品名称'}]} name={'pn'}/>
      </ModalForm>

      <ModalForm
        visible={deleteModalVisible}
        onVisibleChange={handleDeleteModalVisible}
        title="警告！!"
        width="400px"
        modalProps={{
          destroyOnClose: true,
          okText: '确认删除',
          okButtonProps: {
            danger: true
          }
        }}
        onFinish={doDeleteConfig}
        onReset={() => {
          handleDeleteModalVisible(false);
          setCurrentRow(undefined);
          setRecord(undefined);
        }}
      >
        你确认要删除么，该动作可能会影响对应渠道的正常运行，请确认无误后执行。
        {/*<Descriptions title="User Info">*/}
        {/*  <Descriptions.Item label="UserName">Zhou Maomao</Descriptions.Item>*/}
        {/*</Descriptions>*/}
        {/*<ProFormText label='你确认要删除么，该动作可能会影响对应渠道的正常运行，请确认无误后执行。'></ProFormText>*/}
      </ModalForm>

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.pkg && (
          <ProDescriptions<TableListItem>
            column={2}
            title={currentRow?.pkg}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.pkg,
            }}
            columns={columns as ProDescriptionsItemProps<TableListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
