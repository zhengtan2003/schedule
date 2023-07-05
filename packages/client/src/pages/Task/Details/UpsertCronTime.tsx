import { TaskControllerUpdateScripExt } from '@/services/task';
import { toMomentFormat } from '@/utils';
import { FieldTimeOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormDependency,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, message, Tooltip } from 'antd';
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
          if (success) {
            message.success('操作成功');
            props.onSuccess?.();
          }
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
        <ProFormText hidden name={'id'} />
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
      </ModalForm>
    </>
  );
};
export default UpsertCronTime;
