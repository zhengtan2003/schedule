import { useRequest } from '@umijs/max';
import { Button } from 'antd';
import React from 'react';

interface ActionButtonProps {
  onSuccess: any;
  request: any;
  record: any;
  children: any;
}

const ActionButton: React.FC<ActionButtonProps> = (props) => {
  const { loading, run } = useRequest(props.request, {
    manual: true,
    onSuccess: () => {
      props.onSuccess?.();
    },
  });
  return (
    <Button
      type={'link'}
      size={'small'}
      loading={loading}
      onClick={() => {
        run({ params: { id: props.record.id } });
      }}
    >
      {props.children}
    </Button>
  );
};

export default ActionButton;
