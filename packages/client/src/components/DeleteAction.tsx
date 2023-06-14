import React from 'react';
import { Button, Modal } from 'antd';
import { ModalFuncProps } from 'antd/es/modal';
import { ExclamationCircleFilled } from '@ant-design/icons';

const { confirm } = Modal;

interface DeleteActionProps {
    record: any;
    onOk?: ModalFuncProps['onOk'];
    onCancel?: ModalFuncProps['onCancel'];
}

const DeleteAction: React.FC<DeleteActionProps> = (props) => {
    const { record } = props;
    const onClick = () => {
        confirm({
            title: `确定删除${record.name ? `【${record.name}】` : ''}吗？`,
            icon: <ExclamationCircleFilled />,
            content: '删除后不可恢复',
            okType: 'danger',
            onOk: props.onOk,
            onCancel: props.onCancel,
        });
    };
    return (
        <Button danger
                type={'link'}
                size={'small'}
                onClick={onClick}>
            删除
        </Button>
    );
};

export default DeleteAction;
