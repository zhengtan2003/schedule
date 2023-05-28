import React from 'react';
import {Button, Modal} from "antd";
import {ExclamationCircleFilled} from '@ant-design/icons'

const {confirm} = Modal;

interface DeleteButtonProps {
    record: any;
    onOk?: (...args: any[]) => any;
    onCancel?: (...args: any[]) => any;
}

const DeleteButton: React.FC<DeleteButtonProps> = (props) => {
    const {record} = props;
    const onClick = () => {
        confirm({
            title: `确定删除${record.name ? `【${record.name}】` : ''}吗？`,
            icon: <ExclamationCircleFilled/>,
            content: '删除后不可恢复',
            okType: 'danger',
            onOk: props.onOk,
            onCancel: props.onCancel,
        });
    }
    return (
        <Button danger
                type={"link"}
                size={"small"}
                onClick={onClick}>
            删除
        </Button>
    );
};

export default DeleteButton;
