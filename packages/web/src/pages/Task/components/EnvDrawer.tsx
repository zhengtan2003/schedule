import { DeleteButton, ProDrawer } from '@/components';
import { EnvControllerRemove, EnvControllerSearch } from '@/services/env';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import React, { useRef } from 'react';
import UpsertEnv from './UpsertEnv';

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

const EnvDrawer: React.FC<EnvDrawerProps> = (props) => {
  const { taskId, taskName } = props;
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
      sorter: true,
      defaultSortOrder: 'descend',
    },
    {
      title: '创建时间',
      width: '170px',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      sorter: true,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: (_: any, record: DataType) => {
        return (
          <>
            <UpsertEnv
              taskId={taskId}
              envId={record.id}
              onSuccess={() => actionRef.current?.reload()}
            />
            <DeleteButton
              record={record}
              onOk={() =>
                EnvControllerRemove({ id: record.id }).then(() =>
                  actionRef.current?.reload(),
                )
              }
            />
          </>
        );
      },
    },
  ];
  const toolBarRender = () => {
    return [
      <UpsertEnv
        key={'upsert'}
        taskId={taskId}
        onSuccess={() => {
          actionRef.current?.reload();
        }}
      />,
    ];
  };
  return (
    <ProDrawer
      size={'large'}
      destroyOnClose
      title={taskName}
      trigger={
        <Button type={'link'} size={'small'}>
          配置ENV
        </Button>
      }
    >
      <ProTable
        rowKey={'id'}
        cardBordered
        search={false}
        params={{ taskId }}
        columns={columns}
        scroll={{ x: 1300 }}
        actionRef={actionRef}
        toolBarRender={toolBarRender}
        request={(params, sort, filter) =>
          EnvControllerSearch({ params, filter, sort })
        }
      />
    </ProDrawer>
  );
};

export default EnvDrawer;
