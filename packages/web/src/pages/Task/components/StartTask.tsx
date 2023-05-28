import React from 'react';
import {Button} from "antd";
import {useRequest} from '@umijs/max';
import {taskStart} from '@/services/task';

const StartTask = (props) => {
    const {loading, run} = useRequest(taskStart, {
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

export default StartTask;