import React, {useRef, useMemo, useState} from 'react';
import {
    PageContainer, ProColumns,
    ProTable,
} from '@ant-design/pro-components';
import type {ActionType} from '@ant-design/pro-components';
import {Button} from 'antd';
import {taskSearch, taskDelete, taskStart, taskStop} from '@/services/task'
import DeleteButton from "@/components/DeleteButton";
import {ActionButton} from "@/components";
import {UpsertTask, UploadButton, EnvDrawer} from './components';

export interface DataType {
    key: React.Key;
    id: string;
    name: string;
    version: string;
    updateTime: string;
    createTime: string;
    status: "waiting" | "processing";
}

const request = (params: any, sort: any, filter: any) => {
    return taskSearch({
        data: {
            params,
            filter,
            sort
        }
    })
}
const Task: React.FC = () => {
    const [record, setRecord] = useState<DataType>();
    const actionRef = useRef<ActionType>();
    const columns: ProColumns<DataType>[] = [
        {
            title: "脚本名称",
            width: "200px",
            dataIndex: 'name',
        },
        {
            title: "状态",
            width: "100px",
            dataIndex: "status",
            valueEnum: () => (
                {
                    waiting: {
                        text: '待开始',
                        status: 'Warning',
                    },
                    processing: {
                        text: '运行中',
                        status: 'Processing',
                    }
                }
            )
        },
        {
            title: "cron",
            width: "120px",
            dataIndex: "cronTime",
        },
        {
            title: "版本",
            width: "70px",
            dataIndex: "version",
        },
        {
            title: "更新地址",
            width: "260px",
            ellipsis: true,
            copyable: true,
            dataIndex: "updateURL",
        },
        {
            title: "任务开始时间",
            width: "170px",
            dataIndex: "startTime",
            valueType: 'date',
        },
        {
            title: "任务结束时间",
            width: "170px",
            dataIndex: "endTime",
            valueType: 'date',
        },
        {
            title: "更新时间",
            width: "170px",
            dataIndex: 'updateTime',
            valueType: 'dateTime',
            hideInSearch: true
        },
        {
            title: "创建时间",
            width: "170px",
            dataIndex: 'createTime',
            valueType: 'dateTime',
            hideInSearch: true
        },
        {
            title: "操作",
            key: 'action',
            fixed: "right",
            render: (_: any, record: DataType) => {
                return (
                    <>
                        <Button type={"link"}
                                size={"small"}
                                onClick={() => {
                                    setRecord(record)
                                }}>配置ENV</Button>
                        {record.status === "waiting" && (
                            <ActionButton record={record}
                                          request={taskStart}
                                          onSuccess={actionRef.current?.reload}>开始</ActionButton>
                        )}
                        {record.status === "processing" && (
                            <ActionButton record={record}
                                          request={taskStop}
                                          onSuccess={actionRef.current?.reload}>停止</ActionButton>
                        )}
                        {!!record.updateURL && <UpsertTask record={record} onSuccess={actionRef.current?.reload}/>}
                        <DeleteButton record={record}
                                      onOk={async () => {
                                          const {success} = await taskDelete({params: {id: record.id}});
                                          if (success) {
                                              actionRef.current?.reload()
                                          }
                                      }}/>
                    </>
                )
            },
        }
    ]
    const toolBarRender = () => {
        return [
            <UpsertTask key={"remote"}
                        onSuccess={() => {
                            actionRef.current?.reload()
                        }}/>,
            <UploadButton key={"upload"}
                          onSuccess={() => {
                              actionRef.current?.reload()
                          }}/>
        ]
    }
    return (
        <PageContainer>
            <ProTable
                rowKey={'id'}
                request={request}
                columns={columns}
                scroll={{x: 1300}}
                actionRef={actionRef}
                toolBarRender={toolBarRender}/>
            <EnvDrawer record={record}
                       onClose={() => setRecord(undefined)}/>
        </PageContainer>
    );
};

export default Task;
