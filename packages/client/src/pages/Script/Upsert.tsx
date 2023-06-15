import {
  ScriptControllerFrom,
  ScriptControllerUpsert,
} from '@/services/script';
import {
  FooterToolbar,
  PageContainer,
  ProCard,
  ProForm,
  ProFormDependency,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import Editor from '@monaco-editor/react';
import { history, useParams } from '@umijs/max';
import { Form } from 'antd';

const Upsert = () => {
  const params = useParams();
  const onFinish = async (body: any) => {
    const { success } = await ScriptControllerUpsert(body);
    if (success) history.push('/script');
  };
  return (
    <PageContainer>
      <ProCard>
        <ProForm
          params={params}
          onFinish={onFinish}
          initialValues={{
            id: params.id,
            language: 'javascript',
          }}
          request={ScriptControllerFrom as any}
          submitter={{
            resetButtonProps: {
              style: {
                display: 'none',
              },
            },
            render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>,
          }}
        >
          <ProFormText hidden name={'id'} />
          <ProFormSelect
            width={'sm'}
            name={'language'}
            label={'language'}
            options={['javascript', 'python', 'ruby']}
          />
          <ProFormDependency name={['language']}>
            {({ language }) => {
              return (
                <Form.Item
                  name={'code'}
                  label={'代码'}
                  rules={[{ required: true }]}
                >
                  <Editor
                    height="60vh"
                    theme={'vs-dark'}
                    language={language}
                    options={{
                      automaticLayout: true,
                      suggestOnTriggerCharacters: true, // 启用编辑提示
                    }}
                  />
                </Form.Item>
              );
            }}
          </ProFormDependency>
        </ProForm>
      </ProCard>
    </PageContainer>
  );
};

export default Upsert;
