import { TaskControllerLogList } from '@/services/task';
import { useRequest } from '@umijs/max';
import { Button, Drawer, Timeline, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';

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
  const [open, setOpen] = useState<boolean>(false);
  const { data } = useRequest(
    () =>
      TaskControllerLogList({ params: { current: 1, pageSize: 100, taskId } }),
    {
      ready: open,
    },
  );
  return (
    <>
      <Button type={'link'} size={'small'} onClick={() => setOpen(true)}>
        日志
      </Button>
      <Drawer
        open={open}
        size={'large'}
        destroyOnClose
        title={`${taskName}-日志`}
        onClose={() => setOpen(false)}
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
      </Drawer>
    </>
  );
};

export default TaskLogDrawer;
