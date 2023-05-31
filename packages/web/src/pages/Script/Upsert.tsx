import { scriptUpsert } from '@/services/script';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProCard,
  ProForm,
  ProFormText,
} from '@ant-design/pro-components';
import Editor from '@monaco-editor/react';
import { Form } from 'antd';
import { useRef } from 'react';
import { UpdateInput } from './components';

const Upsert = () => {
  const formRef = useRef<ProFormInstance>();
  return (
    <PageContainer title={'新建'}>
      <ProCard>
        <ProForm
          formRef={formRef}
          onFinish={async (values) => {
            await scriptUpsert(values);
          }}
          submitter={{
            render: (_, dom) => <FooterToolbar>{dom.reverse()}</FooterToolbar>,
          }}
        >
          <ProForm.Group>
            <ProFormText
              name="fileName"
              label="文件名称"
              rules={[
                { required: true },
                {
                  validator: (_, value) => {
                    if (/^[^/]*\.(js|ts|sh)$/.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('文件名必须以 .js、.ts 或 .sh 结尾且不包含 /'),
                    );
                  },
                },
              ]}
            />
            <Form.Item
              label={'更新地址'}
              name={'updateURL'}>
              <UpdateInput
                onSuccess={(values) => {
                  formRef.current?.setFieldsValue(values);
                }}
              />
            </Form.Item>
            <ProFormText width={'xl'} label={'描述'} name={'description'} />
          </ProForm.Group>
          <Form.Item name={'code'} label={'代码'} rules={[{ required: true }]}>
            <Editor
              height="90vh"
              theme={'vs-dark'}
              defaultLanguage="javascript"
              defaultValue={`
// ==UserScript==
// @description  This is an example script
// @version      1.0
// ==/UserScript==
          `}
              options={{
                automaticLayout: true,
                suggestOnTriggerCharacters: true, // 启用编辑提示
              }}
            />
          </Form.Item>
        </ProForm>
      </ProCard>
    </PageContainer>
  );
};

export default Upsert;
