import {useRef} from 'react';
import {PlusOutlined} from '@ant-design/icons';
import {
    ModalForm,
    ProFormText,
    ProFormInstance,
} from '@ant-design/pro-components';
import {Button, Form, message} from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import {json} from '@codemirror/lang-json';
import {vscodeDark} from '@uiw/codemirror-theme-vscode';
import {envUpsert, envGet} from '@/services/env';
import {useRequest} from '@umijs/max';

interface UpsertEnvProps {
    record: any,
    taskId?: string;
    onSuccess: any;
}

const isJSON = (str: string) => {
    try {
        const parsed = JSON.parse(str);
        return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed);
    } catch (error) {
        return false;
    }
}

const UpsertEnv: React.FC<UpsertEnvProps> = (props) => {
    const {record = {}, taskId} = props;
    const formRef = useRef<ProFormInstance>();
    const {run, loading} = useRequest(envGet, {
        manual: true,
        onSuccess: (data) => {
            formRef.current?.setFieldsValue(data)
        }
    })
    const trigger = taskId ?
        <Button type={"link"}
                size={"small"}
                loading={loading}
                onClick={() => {
                    run({params: {id: record.id}})
                }}>编辑</Button> :
        <Button type={"primary"}><PlusOutlined/>新建</Button>;

    return (
        <ModalForm formRef={formRef}
                   trigger={trigger}
                   title={taskId ? "编辑" : "新建"}
                   modalProps={{destroyOnClose: true,}}
                   onFinish={(data) =>
                       envUpsert({data, params: {taskId: record.id}}).then(({success}) => {
                           if (success) {
                               props.onSuccess?.()
                           }
                           return success
                       })}>
            <ProFormText hidden name={"id"}/>
            <Form.Item label="process.env"
                       name={"processEnv"}
                       rules={[{required: true}, {validator: (_: any, value: any) => isJSON(value) ? Promise.resolve() : Promise.reject('JSON格式不正确')}]}>
                <CodeMirror theme={vscodeDark}
                            height={"200px"}
                            extensions={[json()]}/>
            </Form.Item>
            <ProFormText
                label="备注"
                name="remark"
                placeholder="请输入备注"/>
        </ModalForm>
    );
};
export default UpsertEnv;