import { DeleteButton } from '@/components';
import Logger from '@/pages/Task/Details/Logger';
import { EnvControllerRemove, EnvControllerSearch } from '@/services/env';
import { DeleteOutlined, FormOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Tooltip, Typography } from 'antd';
import React, { useRef } from 'react';
import UpsertEnv from './UpsertEnv';

const { Text } = Typography;

interface DataType {
  key: React.Key;
  id: string;
  code: string;
  remark: string;
  updateTime: string;
  createTime: string;
}

interface EnvProps {
  taskId: string;
}

const Env: React.FC<EnvProps> = (props) => {
  const { taskId } = props;
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<DataType>[] = [
    {
      title: 'env',
      dataIndex: 'code',
      width: '300px',
      ellipsis: true,
      render: (text) => {
        return (
          <Text ellipsis={{ tooltip: text }}>
            <pre style={{ margin: 0, padding: 0 }}>{text}</pre>
          </Text>
        );
      },
    },
    {
      title: '描述',
      ellipsis: true,
      dataIndex: 'description',
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
      width: '110px',
      render: (_: any, record: DataType) => {
        return (
          <>
            <Logger envId={record.id} />
            <UpsertEnv
              taskId={taskId}
              id={record.id}
              title={'编辑'}
              onSuccess={() => actionRef.current?.reload()}
              trigger={
                <Tooltip title={'编辑'}>
                  <Button type={'link'} size={'small'}>
                    <FormOutlined />
                  </Button>
                </Tooltip>
              }
            />
            <DeleteButton
              confirmProps={{
                title: `确定删除吗？`,
                onOk: () =>
                  EnvControllerRemove({ id: record.id }).then(() =>
                    actionRef.current?.reload(),
                  ),
              }}
            >
              <DeleteOutlined />
            </DeleteButton>
          </>
        );
      },
    },
  ];
  return (
    <ProTable
      headerTitle={'ENV'}
      rowKey={'id'}
      search={false}
      columns={columns}
      scroll={{ x: 1300 }}
      actionRef={actionRef}
      toolBarRender={() => [
        <UpsertEnv
          key={'upsert'}
          taskId={taskId}
          title={'新建'}
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
        EnvControllerSearch({ taskId }, { params, filter, sort })
      }
    />
  );
};

export default Env;
