import { DeleteButton, ProDrawer } from '@/components';
import {
  TaskLogControllerLogSearch,
  TaskLogControllerRemove,
} from '@/services/taskLog';
import { FieldTimeOutlined } from '@ant-design/icons';
import { useRequest } from '@umijs/max';
import { Button, Timeline, Tooltip, Typography } from 'antd';
import CronParser from 'cron-parser';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';

interface TaskLogDrawerProps {
  taskId: string;
  taskName: string;
  cronTime: string;
}

const colorMap: any = {
  1: '#52c41a',
  0: '#ff4d4f',
};

const { Title } = Typography;
const TaskLog: React.FC<TaskLogDrawerProps> = (props) => {
  const { taskId, taskName, cronTime } = props;
  const { run, data, refresh } = useRequest(TaskLogControllerLogSearch, {
    manual: true,
  });
  const items = useMemo(() => data?.reduce(
    (result: any, item: any) => {
      result.push({
        color: colorMap[item.status],
        children: (
          <Typography>
            <Title level={5}>
              {dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')}
            </Title>
            <pre style={{ background: '#000', color: '#F8F8F8' }}>
                {item.log}
              </pre>
          </Typography>
        ),
      });
      return result;
    },
    [
      {
        color: 'gray',
        children: (
          <Typography>
            <Title level={5}>
              {dayjs(
                CronParser.parseExpression(cronTime).next().toDate(),
              ).format('YYYY-MM-DD HH:mm:ss')}
            </Title>
          </Typography>
        ),
      },
    ],
  ), [data]);

  return (
    <ProDrawer
      extra={
        <DeleteButton
          size={'middle'}
          type={'default'}
          onOk={async () => {
            const { success } = await TaskLogControllerRemove({ taskId });
            if (success) refresh();
          }}
        >
          清空日志
        </DeleteButton>
      }
      size={'large'}
      destroyOnClose
      title={`${taskName}-日志`}
      trigger={
        <Tooltip title={'日志'}>
          <Button
            type={'link'}
            size={'small'}
            onClick={() =>
              run({
                sort: { updateTime: 'descend' },
                params: { current: 1, pageSize: 100, taskId },
              })
            }
          >
            <FieldTimeOutlined />
          </Button>
        </Tooltip>
      }
    >
      <Timeline items={items} />
    </ProDrawer>
  );
};

export default TaskLog;
