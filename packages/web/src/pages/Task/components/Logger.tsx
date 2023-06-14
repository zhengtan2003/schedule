import { DeleteButton, ProDrawer } from '@/components';
import {
  LoggerControllerLogSearch,
  LoggerControllerRemove,
} from '@/services/logger';
import { toDateTimeString } from '@/utils';
import {
  CheckCircleFilled,
  ClockCircleOutlined,
  CloseCircleFilled,
  FileSyncOutlined,
} from '@ant-design/icons';
import { useRequest } from '@umijs/max';
import { Button, Tag, Timeline, Typography } from 'antd';
import CronParser from 'cron-parser';
import React, { useMemo } from 'react';

interface LogDrawerProps {
  envId: string;
  cronTime: string;
}

const statusMaps: any = {
  1: {
    color: '#52c41a',
    dot: <CheckCircleFilled />,
  },
  0: {
    color: '#ff4d4f',
    dot: <CloseCircleFilled />,
  },
};
const { Title } = Typography;
const Logger: React.FC<LogDrawerProps> = (props) => {
  const { envId, cronTime } = props;
  const { run, data, refresh } = useRequest(LoggerControllerLogSearch, {
    manual: true,
  });
  const items = useMemo(
    () =>
      data?.reduce(
        (result: any, item: any) => {
          result.push({
            ...statusMaps[item.status],
            children: (
              <Typography>
                <Title level={5}>{toDateTimeString(item.createTime)}</Title>
                <Tag color="magenta">耗时：{item.executionTime}s</Tag>
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
            dot: <ClockCircleOutlined />,
            color: 'gray',
            children: (
              <Typography>
                <Title level={5}>
                  {toDateTimeString(
                    CronParser.parseExpression(cronTime).next().toDate(),
                  )}
                </Title>
              </Typography>
            ),
          },
        ],
      ),
    [data],
  );

  return (
    <ProDrawer
      extra={
        <DeleteButton
          size={'middle'}
          type={'default'}
          onOk={async () => {
            const { success } = await LoggerControllerRemove({ envId });
            if (success) refresh();
          }}
        >
          清空日志
        </DeleteButton>
      }
      size={'large'}
      destroyOnClose
      title={'日志'}
      trigger={
        <Button
          type={'link'}
          size={'small'}
          onClick={() =>
            run({
              sort: { updateTime: 'descend' },
              params: { current: 1, pageSize: 100, envId },
            })
          }
        >
          <FileSyncOutlined />
        </Button>
      }
    >
      <Timeline items={items} />
    </ProDrawer>
  );
};

export default Logger;
