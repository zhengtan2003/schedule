import {
  TaskEnvControllerForm,
  TaskEnvControllerUpsertEnv,
} from '@/services/taskEnv';
import {
  DrawerForm,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import Editor from '@monaco-editor/react';
import { Form } from 'antd';
import { useRef } from 'react';

interface UpsertEnvProps {
  id?: string;
  taskId?: string;
  title?: string;
  onSuccess: () => void;
  trigger?: JSX.Element;
}

const UpsertEnv: React.FC<UpsertEnvProps> = (props) => {
  const { id, taskId, trigger, title } = props;
  const formRef = useRef<ProFormInstance>();
  return (
    <DrawerForm
      title={title}
      formRef={formRef}
      trigger={trigger}
      params={{ id, taskId }}
      initialValues={{
        id,
        taskId,
      }}
      drawerProps={{ destroyOnClose: true }}
      request={TaskEnvControllerForm as any}
      onFinish={async (body) => {
        const { success } = await TaskEnvControllerUpsertEnv(body);
        if (success) props.onSuccess();
        return success;
      }}
    >
      <ProFormText hidden name={'id'} />
      <ProFormText hidden name={'taskId'} />
      <Form.Item label={'.env'} name={'code'} rules={[{ required: true }]}>
        <Editor
          height="50vh"
          theme={'vs-dark'}
          options={{
            automaticLayout: true,
            suggestOnTriggerCharacters: true,
          }}
        />
      </Form.Item>
      <ProFormText label="描述" name="description" />
    </DrawerForm>
  );
};
export default UpsertEnv;
