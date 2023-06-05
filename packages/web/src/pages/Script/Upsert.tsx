import {
  ScriptControllerCreat,
  ScriptControllerRetrieve,
  ScriptControllerUpdate,
} from '@/services/script';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProCard,
  ProForm,
  ProFormDependency,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import Editor from '@monaco-editor/react';
import { history, useParams, useRequest } from '@umijs/max';
import { Form } from 'antd';
import { useRef } from 'react';

const initialValues = {
  language: 'javascript',
};

const Upsert = () => {
  const params: any = useParams();
  const formRef = useRef<ProFormInstance>();
  const { loading } = useRequest(() => ScriptControllerRetrieve(params), {
    ready: !!params.id,
    onSuccess: (data) => formRef.current?.setFieldsValue(data),
  });
  const onFinish = async (body: any) => {
    const { success } = params.id
      ? await ScriptControllerUpdate(params, body)
      : await ScriptControllerCreat(body);
    if (success) history.push('/script');
  };
  return (
    <PageContainer>
      <ProCard>
        <ProForm
          formRef={formRef}
          loading={loading}
          submitter={{
            render: (_, dom) => <FooterToolbar>{dom.reverse()}</FooterToolbar>,
          }}
          onFinish={onFinish}
          initialValues={initialValues}
        >
          <ProFormText hidden name={'id'} />
          <ProForm.Group>
            <ProFormText
              width={'sm'}
              name={'name'}
              label={'脚本名称'}
              rules={[{ required: true }]}
            />
            <ProFormText
              width={'sm'}
              name={'updateURL'}
              label={'订阅更新地址'}
              rules={[
                { required: false },
                { type: 'url', message: '请输入有效的 URL' },
              ]}
            />
            <ProFormSelect
              disabled
              width={'sm'}
              name={'language'}
              label={'language'}
              tooltip={'暂时只支持javascript，后续开放python、typescript、ruby'}
              options={['javascript', 'python', 'typescript', 'ruby']}
            />
          </ProForm.Group>
          <ProFormDependency name={['language']}>
            {({ language }) => {
              return (
                <Form.Item
                  name={'code'}
                  label={'代码'}
                  rules={[{ required: true }]}
                >
                  <Editor
                    height="50vh"
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
          <ProFormTextArea label={'备注'} name={'remark'} />
        </ProForm>
      </ProCard>
    </PageContainer>
  );
};

export default Upsert;
