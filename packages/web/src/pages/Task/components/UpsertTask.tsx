import { ScriptControllerEnum } from '@/services/script';
import { TaskControllerFrom, TaskControllerUpsert } from '@/services/task';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  DrawerForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import CronParser from 'cron-parser';
import dayjs from 'dayjs';
import { useRef } from 'react';

interface UpsertTaskProps {
  id?: string;
  scriptId?: string;
  trigger?: JSX.Element;
  onSuccess: () => void;
}

const dateFormat = (date: Date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss');
const UpsertTask: React.FC<UpsertTaskProps> = (props) => {
  const { trigger, id } = props;
  const formRef = useRef<ProFormInstance>();
  // const cronTimeValue = Form.useWatch('cronTime', form);
  // const CronTimeExtra = () => {
  //   if (isEmpty(cronTimeValue)) return null;
  //   try {
  //     const interval = CronParser.parseExpression(cronTimeValue);
  //     return (
  //       <div>
  //         <div>接下来7次的执行时间：</div>
  //         <div>{dateFormat(interval.next().toDate())}</div>
  //         <div>{dateFormat(interval.next().toDate())}</div>
  //         <div>{dateFormat(interval.next().toDate())}</div>
  //         <div>{dateFormat(interval.next().toDate())}</div>
  //         <div>{dateFormat(interval.next().toDate())}</div>
  //         <div>{dateFormat(interval.next().toDate())}</div>
  //         <div>{dateFormat(interval.next().toDate())}</div>
  //       </div>
  //     );
  //   } catch (error) {
  //     return null;
  //   }
  // };
  return (
    <DrawerForm
      formRef={formRef}
      isKeyPressSubmit
      width={'400px'}
      params={{ id }}
      title={id ? '编辑任务' : '新建任务'}
      trigger={trigger}
      initialValues={{
        id,
        cronTime: '0 7 * * *',
      }}
      drawerProps={{ destroyOnClose: true }}
      request={TaskControllerFrom as any}
      onFinish={async (body) => {
        const { success } = await TaskControllerUpsert(body);
        if (success) props.onSuccess();
        return success;
      }}
    >
      <ProFormText name={'id'} hidden />
      <ProFormSelect
        label={'脚本'}
        name={'scriptId'}
        fieldProps={{
          disabled: !!id,
        }}
        rules={[{ required: true }]}
        request={ScriptControllerEnum}
      />
      <ProFormText name={'name'} label={'任务名称'} />
      {/*<ProFormDateRangePicker*/}
      {/*  label={'生效时间'}*/}
      {/*  width={'100%' as any}*/}
      {/*  name={'effectiveDateRange'}*/}
      {/*  tooltip={'不填无限执行，永不停止'}*/}
      {/*/>*/}
      <ProFormText
        label={'执行频率'}
        name={'cronTime'}
        // extra={<CronTimeExtra />}
        rules={[
          { required: true },
          {
            validator: (_, value) => {
              try {
                CronParser.parseExpression(value);
                return Promise.resolve();
              } catch (error) {
                return Promise.reject('Cron 表达式无效');
              }
            },
          },
        ]}
      />
    </DrawerForm>
  );
};

export default UpsertTask;
