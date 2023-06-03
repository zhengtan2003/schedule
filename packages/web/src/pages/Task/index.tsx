import React, { useRef, useState } from 'react';
import {
    PageContainer, ProColumns,
    ProTable,
} from '@ant-design/pro-components';
import type { ActionType } from '@ant-design/pro-components';

import { ActionButton, DeleteAction } from '@/components';
import { UpsertTask, EnvDrawer } from './components';
import { TaskControllerList, TaskControllerStart, TaskControllerRemove, TaskControllerStop } from '@/services/task';

export interface DataType {
    key: React.Key;
    id: string;
    name: string;
    version: string;
    updateTime: string;
    createTime: string;
    updateURL: string;
    status: 0 | 1 | 2;
}

const Task: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const columns: ProColumns<DataType>[] = [
        {
            title: '任务名称',
            width: '200px',
            dataIndex: 'name',
        },
        {
            title: '状态',
            width: '100px',
            dataIndex: 'status',
            valueEnum: () => (
                {
                    1: {
                        text: '待开始',
                        status: 'Warning',
                    },
                    2: {
                        text: '运行中',
                        status: 'Processing',
                    },
                }
            ),
        },
        {
            title: 'cronTime',
            width: '120px',
            dataIndex: 'cronTime',
            hideInSearch: true,
        },
        {
            title: '任务开始时间',
            width: '170px',
            dataIndex: 'startTime',
            valueType: 'date',
            hideInSearch: true,
        },
        {
            title: '任务结束时间',
            width: '170px',
            dataIndex: 'endTime',
            valueType: 'date',
            hideInSearch: true,
        },
        {
            title: '更新时间',
            width: '170px',
            dataIndex: 'updateTime',
            valueType: 'dateTime',
            hideInSearch: true,
        },
        {
            title: '创建时间',
            width: '170px',
            dataIndex: 'createTime',
            valueType: 'dateTime',
            hideInSearch: true,
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            hideInSearch: true,
            render: (_: any, record: DataType) => {
                return (
                    <>
                        <EnvDrawer taskId={record.id}
                                   taskName={record.name} />
                        {
                            record.status === 2 ?
                            <ActionButton request={() => TaskControllerStop({ id: record.id })}
                                          onSuccess={() => actionRef.current?.reload()}>停止</ActionButton> :

                            <ActionButton request={() => TaskControllerStart({ id: record.id })}
                                          onSuccess={() => actionRef.current?.reload()}>开始</ActionButton>
                        }
                        {/*{!!record.updateURL && <UpsertTask record={record} onSuccess={actionRef.current?.reload} />}*/}
                        <DeleteAction record={record}
                                      onOk={async () => {
                                          const { success } = await TaskControllerRemove({ id: record.id });
                                          if (success) {
                                              actionRef.current?.reload();
                                          }
                                      }} />
                    </>
                );
            },
        },
    ];
    const toolBarRender = () => {
        return [
            <UpsertTask key={'upsert'}
                        onSuccess={() => actionRef.current?.reload()} />,
            // <UploadButton key={'upload'}
            //               onSuccess={() => {
            //                   actionRef.current?.reload();
            //               }} />,
        ];
    };
    return (
        <PageContainer>
            <ProTable
                rowKey={'id'}
                columns={columns}
                scroll={{ x: 1300 }}
                actionRef={actionRef}
                toolBarRender={toolBarRender}
                request={(params, sort, filter) => TaskControllerList({ params, filter, sort })} />
        </PageContainer>
    );
};

export default Task;
