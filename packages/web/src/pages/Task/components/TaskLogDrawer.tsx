import { ProDrawer } from '@/components';
import { TaskControllerLogSearch } from '@/services/task';
import { useRequest } from '@umijs/max';
import { Button, Timeline, Typography } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

interface TaskLogDrawerProps {
  taskId: string;
  taskName: string;
}

const colorMap: any = {
  warning: '#faad14',
  success: '#52c41a',
  error: '#ff4d4f',
};

const { Title } = Typography;
const TaskLogDrawer: React.FC<TaskLogDrawerProps> = (props) => {
  const { taskId, taskName } = props;
  const { run, data } = useRequest(TaskControllerLogSearch, {
    manual: true,
  });
  return (
    <ProDrawer
      size={'large'}
      destroyOnClose
      title={`${taskName}-日志`}
      trigger={
        <Button
          type={'link'}
          size={'small'}
          onClick={() =>
            run({
              params: { current: 1, pageSize: 100, taskId },
            })
          }
        >
          日志
        </Button>
      }
    >
      <Timeline
        items={data?.map((item: any) => {
          return {
            color: colorMap[item.status],
            children: (
              <Typography>
                <Title level={5}>
                  {dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')}
                </Title>
                <pre>{item.log}</pre>
              </Typography>
            ),
          };
        })}
      />
    </ProDrawer>
  );
};

export default TaskLogDrawer;
