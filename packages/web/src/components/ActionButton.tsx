import React from 'react';
import { Button } from 'antd';
import { useRequest } from '@umijs/max';

interface ActionButtonProps {
    record: any;
    children?: React.ReactNode;
    request: (...args: any) => Promise<any>;
    onSuccess: (data: any, params: any) => void;
}

const ActionButton: React.FC<ActionButtonProps> = (props) => {
    const { loading, run } = useRequest(props.request, {
        manual: true,
        onSuccess: props.onSuccess,
    });
    return (
        <Button type={'link'}
                size={'small'}
                loading={loading}
                onClick={() => {
                    run({ id: props.record.id });
                }}>
            {props.children}
        </Button>
    );
};

export default ActionButton;