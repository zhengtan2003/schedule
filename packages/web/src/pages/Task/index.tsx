import { ActionButton, DeleteButton } from '@/components';
import {
  // TaskControllerDebug,
  TaskControllerRemove,
  TaskControllerSearch,
  TaskControllerToggle,
} from '@/services/task';
import {
  FormOutlined,
  PauseOutlined,
  PlusOutlined,
  RightOutlined,
} from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import {
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Tooltip } from 'antd';
import React, { useRef } from 'react';
import { UpsertTask } from './components';
import Env from './components/Env';
import TaskLog from './components/TaskLog';

export interface DataType {
  key: React.Key;
  id: string;
  name: string;
  version: string;
  cronName: string;
  cronTime: string;
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
    // {
    //   title: '任务开始时间',
    //   width: '170px',
    //   dataIndex: 'startTime',
    //   valueType: 'date',
    //   hideInSearch: true,
    // },
    // {
    //   title: '任务结束时间',
    //   width: '170px',
    //   dataIndex: 'endTime',
    //   valueType: 'date',
    //   hideInSearch: true,
    // },
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
      hideInSearch: true,
      render: (_: any, record: DataType) => {
        return (
          <>
            <Env taskId={record.id} taskName={record.name} />
            <ActionButton
              onSuccess={() => actionRef.current?.reload()}
              tooltip={record.status === 2 ? '停止' : '开始'}
              icon={record.status === 2 ? <PauseOutlined /> : <RightOutlined />}
              request={() =>
                TaskControllerToggle({
                  id: +record.id,
                  cronName: record.cronName,
                  cronTime: record.cronTime,
                })
              }
            />
            {/*<ActionButton*/}
            {/*  request={() => TaskControllerDebug({ id: record.id })}*/}
            {/*>*/}
            {/*  <BugOutlined />*/}
            {/*</ActionButton>*/}
            <UpsertTask
              id={record.id}
              trigger={
                <Tooltip title={'编辑'}>
                  <Button type={'link'} size={'small'}>
                    <FormOutlined />
                  </Button>
                </Tooltip>
              }
              onSuccess={() => actionRef.current?.reload()}
            />
            <TaskLog
              taskId={record.id}
              taskName={record.name}
              cronTime={record.cronTime}
            />
            <DeleteButton
              title={`确认删除【${record.name}】吗？`}
              onOk={async () => {
                const { success } = await TaskControllerRemove({
                  id: record.id,
                });
                if (success) actionRef.current?.reload();
              }}
            />
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
            trigger={
              <Button type="primary">
                <PlusOutlined />
                新建
              </Button>
            }
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
