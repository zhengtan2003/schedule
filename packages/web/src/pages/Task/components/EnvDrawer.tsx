import React, {useRef} from 'react';
import {Drawer, Space} from 'antd';
import {DrawerProps} from 'antd/es/drawer';
import {envSearch, envDelete} from "@/services/env";
import {ActionType, ProColumns, ProTable} from "@ant-design/pro-components";
import UpsertEnv from "./UpsertEnv";
import {DeleteButton} from '@/components';

interface EnvDrawerProps {
    record: any;
    onClose: DrawerProps['onClose']
}

interface DataType {
    key: React.Key;
    id: string;
    remark: string;
    updateTime: string;
    createTime: string;
}

const request = (params: any, sort: any, filter: any) => envSearch({data: {params, filter, sort}});

const EnvDrawer: React.FC<EnvDrawerProps> = (props) => {
    const {record: PRecord = {}} = props;
    const actionRef = useRef<ActionType>();
    const columns: ProColumns<DataType>[] = [
        {
            title: "序号",
            width: "60px",
            valueType: "indexBorder"
        },
        {
            title: "备注",
            dataIndex: "remark"
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
                        <UpsertEnv record={record}
                                   taskId={PRecord.id}
                                   onSuccess={actionRef.current?.reload}/>
                        <DeleteButton record={record}
                                      onOk={() => envDelete({data: {id: record.id}}).then(() => {
                                          actionRef.current?.reload()
                                      })}/>
                    </>
                )
            }
        }
    ]
    const toolBarRender = () => {
        return [
            <UpsertEnv key={"upsert"}
                       record={props.record}
                       onSuccess={() => {
                           actionRef.current?.reload()
                       }}/>
        ]
    }
    return (
        <Drawer size={'large'}
                destroyOnClose
                open={!!PRecord.id}
                title={PRecord.name}
                onClose={props.onClose}>
            <ProTable rowKey={"id"}
                      cardBordered
                      columns={columns}
                      request={request}
                      scroll={{x: 1300}}
                      actionRef={actionRef}
                      toolBarRender={toolBarRender}/>
        </Drawer>
    );
};

export default EnvDrawer;