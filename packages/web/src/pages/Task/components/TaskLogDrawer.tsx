import React, { useState } from 'react';
import { Drawer, Button } from 'antd';
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

const TaskLogDrawer: React.FC<TaskLogDrawerProps> = (props) => {
    const { taskId, taskName } = props;
    const [open, setOpen] = useState<boolean>(false);
    const columns: ProColumns<DataType>[] = [
        {
            title: '创建时间',
            width: '170px',
            dataIndex: 'createTime',
            valueType: 'dateTime',
        },
        {
            title:"日志",
            dataIndex: 'log',
            valueType: 'code',
        }
    ];
    return (
        <>
            <Button type={'link'} size={'small'} onClick={() => setOpen(true)}>日志</Button>
            <Drawer open={open}
                    size={'large'}
                    destroyOnClose
                    title={`${taskName}-日志`}
                    onClose={() => setOpen(false)}>
                <ProTable rowKey={'id'}
                          cardBordered
                          search={false}
                          columns={columns}
                          params={{ taskId }}
                          scroll={{ x: "auto" }}
                          request={(params: any, sort: any, filter: any) => TaskControllerLogList({
                              params,
                              filter,
                              sort,
                          })} />
            </Drawer>
        </>
    );
};

export default TaskLogDrawer;