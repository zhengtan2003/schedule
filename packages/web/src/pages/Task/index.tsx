import { ActionButton, DeleteButton } from '@/components';
import {
  TaskControllerDebug,
  TaskControllerRemove,
  TaskControllerSearch,
  TaskControllerStart,
  TaskControllerStop,
} from '@/services/task';
import type { ActionType } from '@ant-design/pro-components';
import {
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import React, { useRef } from 'react';
import { Env, TaskLog, UpsertTask } from './components';

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
      valueEnum: () => ({
        1: {
          text: '待开始',
          status: 'Warning',
        },
        2: {
          text: '运行中',
          status: 'Processing',
        },
      }),
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
      sorter: true,
      defaultSortOrder: 'descend',
    },
    {
      title: '创建时间',
      width: '170px',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: '280px',
      hideInSearch: true,
      render: (_: any, record: DataType) => {
        return (
          <>
            <TaskLog taskId={record.id} taskName={record.name} />
            <Env taskId={record.id} taskName={record.name} />
            <ActionButton
              request={() => TaskControllerDebug({ id: record.id })}
            >
              调试
            </ActionButton>
            {record.status === 2 ? (
              <ActionButton
                request={() => TaskControllerStop({ id: record.id })}
                onSuccess={() => actionRef.current?.reload()}
              >
                停止
              </ActionButton>
            ) : (
              <ActionButton
                request={() => TaskControllerStart({ id: record.id })}
                onSuccess={() => actionRef.current?.reload()}
              >
                开始
              </ActionButton>
            )}
            <DeleteButton
              title={`确认删除【${record.name}】吗？`}
              onOk={async () => {
                const { success } = await TaskControllerRemove({
                  id: record.id,
                });
                if (success) actionRef.current?.reload();
              }}
            >
              删除
            </DeleteButton>
          </>
        );
      },
    },
  ];
  return (
    <PageContainer>
      <ProTable
        rowKey={'id'}
        columns={columns}
        scroll={{ x: 1300 }}
        actionRef={actionRef}
        toolBarRender={() => [
          <UpsertTask
            key={'upsert'}
            onSuccess={() => actionRef.current?.reload()}
          />,
        ]}
        request={(params, sort, filter) =>
          TaskControllerSearch({ params, filter, sort })
        }
      />
    </PageContainer>
  );
};

export default Task;
