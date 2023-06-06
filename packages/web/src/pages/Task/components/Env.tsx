import { DeleteButton, ProDrawer } from '@/components';
import {
  TaskControllerEnvSearch,
  TaskControllerRemoveEnv,
} from '@/services/task';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import React, { useRef } from 'react';
import UpsertEnv from './UpsertEnv';

interface EnvProps {
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

const Env: React.FC<EnvProps> = (props) => {
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
              id={record.id}
              title={'编辑'}
              onSuccess={() => actionRef.current?.reload()}
              trigger={
                <Button type={'link'} size={'small'}>
                  编辑
                </Button>
              }
            />
            <DeleteButton
              title={`确定删除吗？`}
              onOk={() =>
                TaskControllerRemoveEnv({ taskId, id: record.id }).then(() =>
                  actionRef.current?.reload(),
                )
              }
            />
          </>
        );
      },
    },
  ];
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
        toolBarRender={() => [
          <UpsertEnv
            key={'upsert'}
            taskId={taskId}
            onSuccess={() => {
              actionRef.current?.reload();
            }}
            trigger={
              <Button type={'primary'} icon={<PlusOutlined />}>
                新建
              </Button>
            }
          />,
        ]}
        request={(params, sort, filter) =>
          TaskControllerEnvSearch({ params, filter, sort })
        }
      />
    </ProDrawer>
  );
};

export default Env;
