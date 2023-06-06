import {
  ScriptControllerAntdFrom,
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
  ProFormTextArea,
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
          request={ScriptControllerAntdFrom as any}
          submitter={{
            render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>,
          }}
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
