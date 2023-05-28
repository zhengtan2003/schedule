import React from 'react';
import {Form} from "antd";
import {json} from "@codemirror/lang-json";
import CodeMirror from "@uiw/react-codemirror";
import {vscodeDark} from "@uiw/codemirror-theme-vscode";

interface FormCodeMirrorProps {
    onChange: (value: string) => void;
}

function isJSON(str: string) {
    try {
        const parsed = JSON.parse(str);
        return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed);
    } catch (error) {
        return false;
    }
}

const FormCodeMirror: React.FC<FormCodeMirrorProps> = (props) => {
    const onChange = (value: string) => {
        props.onChange(value)
    }
    const validator = (_: any, value: any) => {
        return isJSON(value) ? Promise.resolve() : Promise.reject('JSON格式不正确')
    }
    return (
        <Form.Item name={"processEnv"}
                   rules={[{validator}]}>
            <CodeMirror theme={vscodeDark}
                        extensions={[json()]}
                        onChange={onChange}/>
        </Form.Item>
    );
};

export default FormCodeMirror;