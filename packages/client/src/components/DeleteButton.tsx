import { DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import type { ButtonProps, ModalFuncProps, TooltipProps } from 'antd';
import { Button, Modal, Tooltip } from 'antd';
import React from 'react';

const { confirm } = Modal;

interface DeleteButtonProps {
  tooltip?: TooltipProps['title'];
  type?: ButtonProps['type'];
  size?: ButtonProps['size'];
  children?: React.ReactNode;
  confirmProps?: ModalFuncProps;
}

const DeleteButton: React.FC<DeleteButtonProps> = (props) => {
  const {
    confirmProps,
    tooltip = '删除',
    type = 'link',
    size = 'small',
    children = <DeleteOutlined />,
  } = props;
  const onClick = () => {
    confirm({
      title: '确认删除吗?',
      okType: 'danger',
      content: '删除后不可恢复',
      // onOk: props.onOk,
      // onCancel: props.onCancel,
      icon: <ExclamationCircleFilled />,
      ...confirmProps,
    });
  };
  return (
    <Tooltip title={tooltip}>
      <Button danger type={type} size={size} onClick={onClick}>
        {children}
      </Button>
    </Tooltip>
  );
};

export default DeleteButton;
