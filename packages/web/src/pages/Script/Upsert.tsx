import type { ProFormInstance } from '@ant-design/pro-components';
import {
    FooterToolbar,
    PageContainer,
    ProCard,
    ProForm,
    ProFormText,
    ProFormSelect,
    ProFormDependency,
} from '@ant-design/pro-components';
import Editor from '@monaco-editor/react';
import { Form } from 'antd';
import { useRef } from 'react';
import { UpdateInput } from './components';
import { useParams, useRequest, history } from '@umijs/max';
import { ScriptControllerFindOne, ScriptControllerCreat, ScriptControllerUpdate } from '@/services/script';

const initialValues = {
    language: 'javascript',
};

const Upsert = () => {
    const editorRef = useRef(null);
    const params: any = useParams();
    const formRef = useRef<ProFormInstance>();
    const { loading } = useRequest(() => ScriptControllerFindOne(params), {
        ready: !!params.id,
        onSuccess: (data) => formRef.current?.setFieldsValue(data),
    });
    const onFinish = async (body: any) => {
        const { success } = params.id ? await ScriptControllerUpdate(params, body) : await ScriptControllerCreat(body);
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
                    initialValues={initialValues}>
                    <ProFormText hidden name={'id'} />
                    <ProForm.Group>
                        <ProFormText
                            name={'name'}
                            label={'脚本名称'}
                            rules={[{ required: true }]}
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
                        <ProFormText label={'描述'} name={'description'} />
                        <ProFormSelect name={'language'}
                                       label={'language'}
                                       options={['javascript', 'python', 'typescript', 'ruby']} />
                    </ProForm.Group>
                    <ProFormDependency name={['language']}>
                        {({ language }) => {
                            return (
                                <Form.Item name={'code'} label={'代码'} rules={[{ required: true }]}>
                                    <Editor
                                        height='50vh'
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
