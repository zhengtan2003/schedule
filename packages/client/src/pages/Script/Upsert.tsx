import {
  ScriptControllerFrom,
  ScriptControllerUpsert,
} from '@/services/script';
import { analysisComment } from '@/utils';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProCard,
  ProForm,
  ProFormDependency,
  ProFormGroup,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import Editor from '@monaco-editor/react';
import { history, useParams } from '@umijs/max';
import { Button, Form } from 'antd';
import { useRef } from 'react';

const Upsert = () => {
  const params = useParams();
  const formRef = useRef<ProFormInstance>();
  const onFinish = async (body: any) => {
    const { success } = await ScriptControllerUpsert(body);
    if (success) history.push('/script');
  };
  const analysis = () => {
    const code = formRef.current?.getFieldValue('code');
    if (!code) return;
    const { name, version, description } = analysisComment(code);
    formRef.current?.setFieldsValue({ name, version, description });
  };
  return (
    <PageContainer>
      <ProCard>
        <ProForm
          params={params}
          formRef={formRef}
          onFinish={onFinish}
          initialValues={{
            id: params.id,
            language: 'javascript',
          }}
          request={ScriptControllerFrom as any}
          submitter={{
            resetButtonProps: false,
            render: (_, dom) => (
              <FooterToolbar>
                {[
                  <Button key={'analysis'} onClick={analysis}>
                    一键解析注释
                  </Button>,
                  ...dom,
                ]}
              </FooterToolbar>
            ),
          }}
        >
          <ProFormText hidden name={'id'} />
          <ProFormGroup>
            <ProFormText
              width={'sm'}
              label={'名称'}
              name={'name'}
              rules={[{ required: true }]}
            />
            <ProFormSelect
              width={'sm'}
              name={'language'}
              label={'language'}
              options={['javascript']}
            />
            <ProFormText width={'sm'} label={'版本'} name={'version'} />
            <ProFormText width={'sm'} label={'描述'} name={'description'} />
          </ProFormGroup>
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
