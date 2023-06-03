import React, { useRef, useState } from 'react';
import UpsertEnv from './UpsertEnv';
import { Drawer, Button } from 'antd';
import { DeleteButton } from '@/components';
import { EnvControllerList, EnvControllerRemove } from '@/services/env';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';

interface EnvDrawerProps {
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

const request = (params: any, sort: any, filter: any) => EnvControllerList({ params, filter, sort });

const EnvDrawer: React.FC<EnvDrawerProps> = (props) => {
    const { taskId, taskName } = props;
    const [open, setOpen] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const columns: ProColumns<DataType>[] = [
        {
            title: 'env',
            dataIndex: 'processEnv',
            width: '260px',
            ellipsis: true,
        },
        {
            title: '备注',
            dataIndex: 'remark',
        },
        {
            title: '更新时间',
            width: '170px',
            dataIndex: 'updateTime',
            valueType: 'dateTime',
        },
        {
            title: '创建时间',
            width: '170px',
            dataIndex: 'createTime',
            valueType: 'dateTime',
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            render: (_: any, record: DataType) => {
                return (
                    <>
                        <UpsertEnv taskId={taskId}
                                   envId={record.id}
                                   onSuccess={() => actionRef.current?.reload()} />
                        <DeleteButton record={record}
                                      onOk={() => EnvControllerRemove({ id: record.id }).then(() => actionRef.current?.reload())} />
                    </>
                );
            },
        },
    ];
    const toolBarRender = () => {
        return [
            <UpsertEnv key={'upsert'}
                       taskId={taskId}
                       onSuccess={() => {
                           actionRef.current?.reload();
                       }} />,
        ];
    };
    return (
        <>
            <Button type={'link'} size={'small'} onClick={() => setOpen(true)}>配置ENV</Button>
            <Drawer open={open}
                    size={'large'}
                    destroyOnClose
                    title={taskName}
                    onClose={() => setOpen(false)}>
                <ProTable rowKey={'id'}
                          cardBordered
                          search={false}
                          params={{ taskId }}
                          columns={columns}
                          request={request}
                          scroll={{ x: 1300 }}
                          actionRef={actionRef}
                          toolBarRender={toolBarRender} />
            </Drawer>
        </>
    );
};

export default EnvDrawer;