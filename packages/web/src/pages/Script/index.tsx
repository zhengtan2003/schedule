import { DataType } from '@/pages/Task';
import { ScriptControllerList } from '@/services/script';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { DeleteAction } from '@/components';
import { ScriptControllerRemove } from '@/services/script';
import { useRef } from 'react';

const request = (params: any, sort: any, filter: any) => ScriptControllerList({ params, sort, filter });

const Script = () => {
    const actionRef = useRef<ActionType>();
    const toolBarRender = () => {
        return [
            <Button type={'primary'}
                    icon={<PlusOutlined />}
                    onClick={() => history.push('/script/create')}>
                新建
            </Button>,
        ];
    };
    const columns: ProColumns<DataType>[] = [
        {
            title: '脚本名称',
            width: '200px',
            dataIndex: 'name',
        },
        {
            title: 'language',
            width: '70px',
            dataIndex: 'language',
            hideInSearch: true,
        },
        {
            title: '更新地址',
            width: '260px',
            ellipsis: true,
            copyable: true,
            dataIndex: 'updateURL',
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
            dataIndex: 'action',
            fixed: 'right',
            hideInSearch: true,
            render: (text, record) => [
                <Button key={'edit'}
                        type={'link'}
                        size={'small'}
                        onClick={() => history.push(`/script/update/${record.id}`)}>编辑</Button>,
                <DeleteAction key={'delete'}
                              record={record}
                              onOk={async () => {
                                  const { success } = await ScriptControllerRemove({ id: record.id });
                                  if (success) actionRef.current?.reload();
                              }}
                />,
            ],
        },
    ];
    return (
        <PageContainer>
            <ProTable
                rowKey={'id'}
                request={request}
                columns={columns}
                scroll={{ x: 1300 }}
                actionRef={actionRef}
                toolBarRender={toolBarRender}
            />
        </PageContainer>
    );
};

export default Script;
