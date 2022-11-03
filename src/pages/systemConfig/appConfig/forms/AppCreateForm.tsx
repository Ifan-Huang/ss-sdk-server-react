// 主要处理新建和编辑的场景
import type {ProFormInstance} from '@ant-design/pro-form';
import {ProFormSelect, ProFormText} from '@ant-design/pro-form';
import type {Dayjs} from 'dayjs';
import dayjs from 'dayjs';
import React, {useEffect, useRef} from 'react';
import {StepsForm} from "@ant-design/pro-form/es/layouts/StepsForm";
import type {AppConfigEntity} from "@/pages/systemConfig/appConfig/data";

type FormValue = {
  AppConfigType: {
    id: number;
    pkg: string;
    typeName: string;
    typeValue: string;
    typeCode: string;
    appConfigId: number;
  }

  appConfigTypeEntity: {
    appConfigId: number;
    typeName: string;
    typeValue: string;
  }
  appConfigEntity: {
    pkg: string;
    channelId: string;
    pn: string;
    appConfigTypes: [];
  };
  syncTableInfo: {
    timeRange: [Dayjs, Dayjs];
    title: string;
  };

}

;
const formValue: FormValue = {
  appConfigEntity: {
    pkg: '',
    channelId: '',
    pn: ''
  },
  syncTableInfo: {
    timeRange: [dayjs().subtract(1, 'm'), dayjs()],
    title: 'example table title',
  },
};

export type AppConfigCreateFormProps = {
  onCancel: void;
  onSubmit: (values: AppConfigEntity) => Promise<void>;
  updateModalVisible: boolean;
};

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(formValue);
    }, time);
  });
};
const StatusType = [
  {
    value: true,
    label: '启用',
  },
  {
    value: false,
    label: '禁用',
  },
];
//UpdateForm: React.FC<UpdateFormProps> = (props) =>
const AppCreateForm: React.FC = (props) => {
  const formMapRef = useRef<React.MutableRefObject<ProFormInstance<any> | undefined>[]>([]);
  alert(props)
  useEffect(() => {
    waitTime(1000).then(() => {
      // 编辑场景下需要使用formMapRef循环设置formData
      formMapRef?.current?.forEach((formInstanceRef) => {
        formInstanceRef?.current?.setFieldsValue(formValue);
      });
    });
  }, []);

  return (
    <StepsForm
      formMapRef={formMapRef}
      onFinish={(values) => {
        console.log(values);
        return Promise.resolve(true);
      }}
    >
      <StepsForm.StepForm name="step1" title="包和渠道信息">
        <ProFormText label="包名" name={['appConfigEntity', 'pkg']} />
        <ProFormSelect label="渠道号" name={['appConfigEntity', 'channelId']}  />
        <ProFormSelect label="产品名称（pn）" name={['appConfigEntity', 'pn']} />
      </StepsForm.StepForm>
      <StepsForm.StepForm name="step2" title={'配置项信息'}>
        <ProFormText label="google支付" name={['appConfigTypeEntity', 'typeName']} />
        <ProFormSelect label="vPay支付" name={['appConfigTypeEntity', 'typeValue']} />
      </StepsForm.StepForm>
    </StepsForm>
  );
};
export default AppCreateForm;
