import { DeleteButton, ProDrawer } from '@/components';
import {
  TaskControllerLogSearch,
  TaskControllerRemoveAllLog,
} from '@/services/task';
import { BugOutlined } from '@ant-design/icons';
import { useRequest } from '@umijs/max';
import { Button, Empty, Timeline, Typography } from 'antd';
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
const TaskLog: React.FC<TaskLogDrawerProps> = (props) => {
  const { taskId, taskName } = props;
  const { run, data, refresh } = useRequest(TaskControllerLogSearch, {
    manual: true,
  });
  return (
    <ProDrawer
      extra={
        <DeleteButton
          size={'middle'}
          type={'default'}
          onOk={async () => {
            const { success } = await TaskControllerRemoveAllLog({ taskId });
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
          日志
        </Button>
      }
    >
      {data?.length ? (
        <Timeline
          items={data?.map((item: any) => {
            return {
              dot: item.type === 'debug' && <BugOutlined />,
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
      ) : (
        <Empty />
      )}
    </ProDrawer>
  );
};

export default TaskLog;