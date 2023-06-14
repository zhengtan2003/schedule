import { DeleteButton } from '@/components';
import Debug from '@/pages/Task/components/Debug';
import { EnvControllerRemove, EnvControllerSearch } from '@/services/env';
import { DeleteOutlined, FormOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import React, { useRef } from 'react';
import Logger from './components/Logger';
import UpsertEnv from './components/UpsertEnv';

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
  cronTime: string;
}

const EnvProTable: React.FC<EnvProps> = (props) => {
  const { taskId, cronTime } = props;
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<DataType>[] = [
    {
      title: 'env',
      dataIndex: 'code',
      width: '300px',
      ellipsis: true,
      // render: (_, record) => {
      //   return <pre className="whitespace-pre-wrap">{record.code}</pre>;
      // },
    },
    {
      title: '描述',
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
      render: (_: any, record: DataType) => {
        return (
          <>
            <Debug envId={record.id} taskId={taskId}/>
            <Logger envId={record.id} cronTime={cronTime} />
            <UpsertEnv
              taskId={taskId}
              id={record.id}
              title={'编辑'}
              onSuccess={() => actionRef.current?.reload()}
              trigger={
                <Button type={'link'} size={'small'}>
                  <FormOutlined />
                </Button>
              }
            />
            <DeleteButton
              title={`确定删除吗？`}
              onOk={() =>
                EnvControllerRemove({ id: record.id }).then(() =>
                  actionRef.current?.reload(),
                )
              }
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
        EnvControllerSearch({ params, filter, sort })
      }
    />
  );
};

export default EnvProTable;
