import React, {useRef} from 'react';
import {useRequest} from '@umijs/max';
import {Button, Input, Space} from "antd";
import {taskUpsertRemote} from '@/services/task';
import {GithubOutlined} from '@ant-design/icons';

interface UpsertTaskProps {
    record?: any;
    onSuccess?: () => void;
    onError?: () => void;
}

const UpsertTask: React.FC<UpsertTaskProps> = (props) => {
    const valueRef = useRef<any>();
    const {run, loading} = useRequest(taskUpsertRemote, {
        manual: true,
        onError: props.onError,
        onSuccess: props.onSuccess,
    });
    if (props.record) {
        return (
            <Button type={"link"}
                    size={"small"}
                    loading={loading}
                    onClick={() => {
                        run({
                            data: {
                                id: props.record.id,
                                updateURL: props.record.updateURL
                            }
                        })
                    }}>更新</Button>
        )
    }
    return (
        <Space.Compact>
            <Input placeholder={"请输入远程地址"}
                   onChange={(e) => valueRef.current = e.target.value}/>
            <Button type="primary"
                    loading={loading}
                    onClick={() => {
                        run({data: {updateURL: valueRef.current}})
                    }}>
                <GithubOutlined/>
                远程获取
            </Button>
        </Space.Compact>
    );
};
export default UpsertTask