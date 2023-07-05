import Context from '@/pages/Task/Details/Context';
import SyncScripSelect from '@/pages/Task/Details/SyncScripSelect';
import UpsertCronTime from '@/pages/Task/Details/UpsertCronTime';
import { DataType } from '@/pages/Task/List';
import { TaskControllerScript } from '@/services/task';
import { toMomentFormat } from '@/utils';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import CronParser from 'cron-parser';
import React, { useContext, useRef, useState } from 'react';

type ScriptProps = {
  id: string;
  taskName: string;
};
const Script: React.FC<ScriptProps> = () => {
  const { taskId } = useContext(Context);
  const [scriptIds, setScriptIds] = useState([]);
  const actionRef = useRef<ActionType>();
  const tableReload = () => actionRef.current?.reload();
  const columns: ProColumns<DataType>[] = [
    {
      title: '脚本名称',
      width: '200px',
      dataIndex: 'name',
    },
    {
      title: 'cronTime',
      width: '100px',
      dataIndex: 'cronTime',
    },
    {
      title: '下次执行时间',
      width: '170px',
      dataIndex: 'cronTime',
      render: (text) => {
        const interval = CronParser.parseExpression(text as string);
        return toMomentFormat(interval.next().toDate());
      },
    },
    {
      title: 'language',
      width: '90px',
      dataIndex: 'language',
    },
    {
      title: '版本',
      width: '70px',
      dataIndex: 'version',
    },
    {
      title: '描述',
      width: '160px',
      ellipsis: true,
      dataIndex: 'description',
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
      dataIndex: 'action',
      fixed: 'right',
      width: '50px',
      render: (_, record) => {
        return (
          <UpsertCronTime
            initialValues={{
              id: taskId,
              scriptId: record.id,
              cronTime: record.cronTime,
            }}
            onSuccess={() => tableReload()}
          />
        );
      },
    },
  ];
  return (
    <ProTable
      rowKey={'id'}
      search={false}
      columns={columns}
      pagination={false}
      scroll={{ x: 1300 }}
      actionRef={actionRef}
      headerTitle={'Script'}
      toolBarRender={() => [
        <SyncScripSelect
          key={1}
          value={scriptIds}
          onSuccess={() => tableReload()}
        />,
      ]}
      request={() =>
        TaskControllerScript({ id: taskId }).then((response) => {
          setScriptIds(response.data?.map(({ id }: { id: number }) => id));
          return response;
        })
      }
    />
  );
};

export default Script;
