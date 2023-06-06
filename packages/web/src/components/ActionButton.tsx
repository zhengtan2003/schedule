import { useRequest } from '@umijs/max';
import { Button } from 'antd';
import React from 'react';

interface ActionButtonProps {
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
    <Button type={'link'} size={'small'} loading={loading} onClick={run}>
      {props.children}
    </Button>
  );
};

export default ActionButton;
