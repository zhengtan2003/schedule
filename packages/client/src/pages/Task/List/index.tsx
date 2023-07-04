import { DeleteButton } from '@/components';
import { Debug, Toggle, UpdateTask } from '@/pages/Task/components';
import Create from '@/pages/Task/List/Create';
import { TaskControllerRemove, TaskControllerSearch } from '@/services/task';
import {
  BugOutlined,
  ClockCircleOutlined,
  FormOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  ProfileOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import {
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { useNavigate } from '@umijs/max';
import { Button, Tag, Tooltip } from 'antd';
import React, { useRef } from 'react';

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
  status: 0 | 1;
}

const Task: React.FC = () => {
  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<DataType>[] = [
    {
      title: '任务名称',
      width: '200px',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '状态',
      width: '100px',
      dataIndex: 'status',
      render: (text) => {
        if (text === 0)
          return (
            <Tag icon={<ClockCircleOutlined />} color="default">
              waiting
            </Tag>
          );
        if (text === 1)
          return (
            <Tag icon={<SyncOutlined spin />} color="processing">
              processing
            </Tag>
          );
      },
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
      width: '100px',
      hideInSearch: true,
      render: (_: any, record: DataType) => {
        const { status, id } = record;
        return (
          <>
            <Tooltip title={'详情'}>
              <Button
                type={'link'}
                size={'small'}
                icon={<ProfileOutlined />}
                onClick={() => navigate(`../details?id=${record.id}`)}
              />
            </Tooltip>
            <Debug
              key="debug"
              taskId={id}
              trigger={
                <Button type={'link'} size={'small'} icon={<BugOutlined />} />
              }
            />
            <Toggle key="toggle" onSuccess={actionRef.current?.reload}>
              {({ run, loading }) => {
                return (
                  <Tooltip
                    title={
                      <>
                        {status === 0 && '开始'}
                        {status === 1 && '停止'}
                      </>
                    }
                  >
                    <Button
                      type={'link'}
                      size={'small'}
                      loading={loading}
                      onClick={() => run({ data: { id } })}
                      icon={
                        <>
                          {status === 0 && <PlayCircleOutlined />}
                          {status === 1 && <PauseCircleOutlined />}
                        </>
                      }
                    />
                  </Tooltip>
                );
              }}
            </Toggle>
            <UpdateTask
              key={'edit'}
              taskId={id}
              onSuccess={actionRef.current?.reload}
              trigger={
                <Button size={'small'} type={'link'} icon={<FormOutlined />} />
              }
            />
            <DeleteButton
              confirmProps={{
                title: `确认删除【${record.name}】吗？`,
                onOk: async () => {
                  const { success } = await TaskControllerRemove({
                    id: record.id,
                  });
                  if (success) actionRef.current?.reload();
                },
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
        toolBarRender={() => [<Create key={'create'} />]}
        request={(params, sort, filter) =>
          TaskControllerSearch({ params, filter, sort })
        }
      />
    </PageContainer>
  );
};

export default Task;
