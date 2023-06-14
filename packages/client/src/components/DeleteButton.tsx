import { DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import type { ButtonProps, ModalFuncProps } from 'antd';
import { Button, Modal, Tooltip } from 'antd';
import React from 'react';

const { confirm } = Modal;

interface DeleteButtonProps {
  type?: ButtonProps['type'];
  size?: ButtonProps['size'];
  children?: React.ReactNode;
  title?: ModalFuncProps['title'];
  onOk?: ModalFuncProps['onOk'];
  onCancel?: ModalFuncProps['onCancel'];
}

const DeleteButton: React.FC<DeleteButtonProps> = (props) => {
  const { title, type = 'link', size = 'small' } = props;
  const onClick = () => {
    confirm({
      title,
      okType: 'danger',
      content: '删除后不可恢复',
      onOk: props.onOk,
      onCancel: props.onCancel,
      icon: <ExclamationCircleFilled />,
    });
  };
  return (
    <Tooltip title={'删除'}>
      <Button danger type={type} size={size} onClick={onClick}>
        <DeleteOutlined />
      </Button>
    </Tooltip>
  );
};

export default DeleteButton;
