import { useRequest } from '@umijs/max';
import { Button, Tooltip } from 'antd';
import React from 'react';

interface ActionButtonProps {
  tooltip?: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  request: (...args: any) => Promise<any>;
  onSuccess?: (data: any, params: any) => void;
}

const ActionButton: React.FC<ActionButtonProps> = (props) => {
  const { loading, run } = useRequest(props.request, {
    manual: true,
    onSuccess: props.onSuccess,
  });
  return (
    <Tooltip title={props.tooltip}>
      <Button
        icon={props.icon}
        type={'link'}
        size={'small'}
        loading={loading}
        onClick={run}
      >
        {props.children}
      </Button>
    </Tooltip>
  );
};

export default ActionButton;
