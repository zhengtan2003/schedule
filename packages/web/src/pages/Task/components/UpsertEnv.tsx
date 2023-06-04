import {
  EnvControllerCreate,
  EnvControllerForm,
  EnvControllerUpdate,
} from '@/services/env';
import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import Editor from '@monaco-editor/react';
import { Button, Form } from 'antd';
import { useRef } from 'react';

interface UpsertEnvProps {
  envId?: string;
  taskId?: string;
  onSuccess: () => void;
}

const UpsertEnv: React.FC<UpsertEnvProps> = (props) => {
  const { envId, taskId } = props;
  const formRef = useRef<ProFormInstance>();
  const trigger = !!envId ? (
    <Button type={'link'} size={'small'}>
      编辑
    </Button>
  ) : (
    <Button type={'primary'}>
      <PlusOutlined />
      新建
    </Button>
  );
  return (
    <ModalForm
      formRef={formRef}
      trigger={trigger}
      title={envId ? '编辑' : '新建'}
      modalProps={{ destroyOnClose: true }}
      request={!!envId ? () => EnvControllerForm({ id: envId }) : undefined}
      onFinish={async (body) => {
        const { success } = !!envId
          ? await EnvControllerUpdate(body)
          : await EnvControllerCreate(body);
        if (success) props.onSuccess();
        return success;
      }}
    >
      <ProFormText hidden name={'id'} initialValue={envId} />
      <ProFormText hidden name={'taskId'} initialValue={taskId} />
      <Form.Item label={'env'} name={'processEnv'} rules={[{ required: true }]}>
        <Editor
          height="50vh"
          theme={'vs-dark'}
          language={'json'}
          onValidate={(markers) => {
            if (!markers.length) return;
            const errorMessages = markers.map((marker) => marker.message);
            formRef.current?.setFields([
              { name: 'processEnv', errors: errorMessages },
            ]);
          }}
          options={{
            automaticLayout: true,
            suggestOnTriggerCharacters: true, // 启用编辑提示
          }}
        />
      </Form.Item>
      <ProFormText label="备注" name="remark" />
    </ModalForm>
  );
};
export default UpsertEnv;
