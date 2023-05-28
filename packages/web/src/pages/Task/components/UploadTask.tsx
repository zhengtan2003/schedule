import React, {useState} from 'react';
import {Button, Upload} from 'antd';
import {getAuthorization} from "@/utils";
import {UploadOutlined} from '@ant-design/icons';

interface UploadTaskProps {
    onSuccess?: () => void;
    onError?: () => void;
}

const UploadTask: React.FC<UploadTaskProps> = (props) => {
    const [loading, setLoading] = useState(false)
    return (
        <Upload showUploadList={false}
                action={'/api/task/upload'}
                headers={{
                    authorization: (getAuthorization() as any),
                }}
                onChange={({file}) => {
                    const {status} = file;
                    if (status === 'uploading') {
                        setLoading(true)
                    } else if (status === 'done') {
                        setLoading(false)
                        props.onSuccess?.()
                    } else if (status === 'error') {
                        setLoading(false)
                        props.onError?.()
                    }
                }}>
            <Button type={"primary"} loading={loading}>
                <UploadOutlined/>
                本地上传
            </Button>
        </Upload>
    )
};
export default UploadTask;