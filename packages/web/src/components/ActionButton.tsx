import React from 'react';
import {Button} from "antd";
import {useRequest} from "@umijs/max";

interface ActionButtonProps {
    request: () => Promise<any>;
    onSuccess: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = (props) => {
    const {loading, run} = useRequest(props.request, {
        manual: true,
        onSuccess: () => {
            props.onSuccess?.()
        },
    });
    return (
        <Button type={"link"}
                size={"small"}
                loading={loading}
                onClick={() => {
                    run({params: {id: props.record.id}})
                }}>
            {props.children}
        </Button>
    );
};

export default ActionButton;