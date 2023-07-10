import { TaskControllerUpdateScripExt } from '@/services/task';
import { toMomentFormat } from '@/utils';
import { FieldTimeOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormDependency,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Tooltip } from 'antd';
import CronParser from 'cron-parser';

type UpsertCronTimeProps = {
  initialValues: Record<string, any>;
  onSuccess: () => void;
};
const UpsertCronTime: React.FC<UpsertCronTimeProps> = (props) => {
  return (
    <>
      <ModalForm
        width={'350px'}
        title={`设置cronTime`}
        initialValues={props.initialValues}
        onFinish={async (values) => {
          const { success } = await TaskControllerUpdateScripExt(values);
          if (success) props.onSuccess?.();
          return success;
        }}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
        }}
        trigger={
          <Tooltip title={'设置cronTime'}>
            <Button type={'link'} size={'small'}>
              <FieldTimeOutlined />
            </Button>
          </Tooltip>
        }
      >
        <ProFormText hidden name={'taskId'} />
        <ProFormText hidden name={'scriptId'} />
        <ProFormText
          width="md"
          name="cronTime"
          label="cronTime"
          help={
            <ProFormDependency name={['cronTime']}>
              {({ cronTime }) => {
                if (!cronTime) return null;
                try {
                  const interval = CronParser.parseExpression(
                    cronTime as string,
                  );
                  return <div>{toMomentFormat(interval.next().toDate())}</div>;
                } catch (error) {
                  return null;
                }
              }}
            </ProFormDependency>
          }
          rules={[
            { required: true },
            {
              validator: async (_, value) => {
                try {
                  CronParser.parseExpression(value);
                } catch (error) {
                  throw new Error('Cron表达式无效');
                }
              },
            },
          ]}
        />
        <ProFormSelect
          label={'执行方式'}
          name={'executeType'}
          rules={[{ required: true }]}
          options={[
            { label: '固定', value: 1 },
            { label: '随机', value: 2 },
          ]}
        />
      </ModalForm>
    </>
  );
};
export default UpsertCronTime;
