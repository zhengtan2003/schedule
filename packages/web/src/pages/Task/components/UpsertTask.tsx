import { ScriptControllerAntdSelect } from '@/services/script';
import { TaskControllerUpsert } from '@/services/task';
import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button } from 'antd';
import CronParser from 'cron-parser';

interface UpsertTaskProps {
  onSuccess: () => void;
}

const UpsertTask: React.FC<UpsertTaskProps> = (props) => {
  return (
    <ModalForm
      title={'新建任务'}
      width={'400px'}
      trigger={
        <Button type="primary">
          <PlusOutlined />
          新建
        </Button>
      }
      onFinish={async (body) => {
        const { success } = await TaskControllerUpsert(body);
        if (success) props.onSuccess();
        return success;
      }}
      modalProps={{ destroyOnClose: true }}
    >
      <ProFormSelect
        label="脚本"
        name="scriptId"
        rules={[{ required: true }]}
        request={ScriptControllerAntdSelect}
      />
      <ProFormText name="name" label="任务名称" rules={[{ required: true }]} />
      <ProFormText
        name={'cronTime'}
        label={'执行频率'}
        rules={[
          { required: true },
          {
            validator: (_, value) => {
              try {
                // 尝试解析 Cron 表达式
                CronParser.parseExpression(value);
                return Promise.resolve();
              } catch (error) {
                return Promise.reject('Cron 表达式无效');
              }
            },
          },
        ]}
      />
      <ProFormDateRangePicker
        label={'生效时间'}
        width={'100%' as any}
        name={'effectiveDateRange'}
        tooltip={'不填无限执行，永不停止'}
      />
    </ModalForm>
  );
};

export default UpsertTask;
