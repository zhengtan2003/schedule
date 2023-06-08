import { ScriptControllerEnum } from '@/services/script';
import { TaskControllerUpsert } from '@/services/task';
import { PlusOutlined } from '@ant-design/icons';
import {
  DrawerForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button } from 'antd';

interface UpsertTaskProps {
  onSuccess: () => void;
}

const UpsertTask: React.FC<UpsertTaskProps> = (props) => {
  return (
    <DrawerForm
      title={'新建任务'}
      width={'400px'}
      trigger={
        <Button type="primary">
          <PlusOutlined />
          新建
        </Button>
      }
      drawerProps={{ destroyOnClose: true }}
      onFinish={async (body) => {
        const { success } = await TaskControllerUpsert(body);
        if (success) props.onSuccess();
        return success;
      }}
    >
      <ProFormSelect
        label={'脚本'}
        name={'scriptId'}
        rules={[{ required: true }]}
        request={ScriptControllerEnum}
      />
      <ProFormText name={'name'} label={'任务名称'} />
      <ProFormText name={'cronTime'} label={'执行频率'} />
      <ProFormDateRangePicker
        label={'生效时间'}
        width={'100%' as any}
        name={'effectiveDateRange'}
        tooltip={'不填无限执行，永不停止'}
      />
    </DrawerForm>
  );
};

export default UpsertTask;
