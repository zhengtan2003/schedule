import React, { useState } from 'react';
import { useRequest } from '@umijs/max';
import { Drawer, Button, Timeline, Typography } from 'antd';
import { TaskControllerLogList } from '@/services/task';
import { ProColumns, ProTable } from '@ant-design/pro-components';

interface TaskLogDrawerProps {
    taskId: string;
    taskName: string;
}

interface DataType {
    key: React.Key;
    id: string;
    remark: string;
    updateTime: string;
    createTime: string;
}

const { Title } = Typography;
const TaskLogDrawer: React.FC<TaskLogDrawerProps> = (props) => {
    const { taskId, taskName } = props;
    const [open, setOpen] = useState<boolean>(false);
    const { data } = useRequest(() => TaskControllerLogList({ params: { current: 1, pageSize: 100 } }));
    const columns: ProColumns<DataType>[] = [
        {
            title: '创建时间',
            width: '170px',
            dataIndex: 'createTime',
            valueType: 'dateTime',
        },
        {
            title: '日志',
            dataIndex: 'log',
            valueType: 'code',
        },
    ];
    return (
        <>
            <Button type={'link'} size={'small'} onClick={() => setOpen(true)}>日志</Button>
            <Drawer open={open}
                    size={'large'}
                    destroyOnClose
                    title={`${taskName}-日志`}
                    onClose={() => setOpen(false)}>
                <Timeline items={data?.map((item) => {
                    return {
                        color: 'green',
                        // label: item.createTime,
                        children: (
                            <Typography>
                                <Title level={5}> {item.createTime}</Title>
                                <pre>{item.log}</pre>
                            </Typography>
                        ),
                    };
                })} />
            </Drawer>
        </>
    );
};

export default TaskLogDrawer;