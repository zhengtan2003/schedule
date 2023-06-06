import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { ButtonProps } from 'antd/es/button';
import { ModalFuncProps } from 'antd/es/modal';
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
  const { title, children, type = 'link', size = 'small' } = props;
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
    <Button danger type={type} size={size} onClick={onClick}>
      {children}
    </Button>
  );
};

export default DeleteButton;
