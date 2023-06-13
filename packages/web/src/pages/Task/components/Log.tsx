import { DeleteButton, ProDrawer } from '@/components';
import { LogControllerLogSearch, LogControllerRemove } from '@/services/log';
import { FileSyncOutlined } from '@ant-design/icons';
import { useRequest } from '@umijs/max';
import { Button, Timeline, Typography } from 'antd';
import CronParser from 'cron-parser';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';

interface LogDrawerProps {
  envId: string;
  cronTime: string;
}

const colorMap: any = {
  1: '#52c41a',
  0: '#ff4d4f',
};

const { Title } = Typography;
const Log: React.FC<LogDrawerProps> = (props) => {
  const { envId, cronTime } = props;
  const { run, data, refresh } = useRequest(LogControllerLogSearch, {
    manual: true,
  });
  const items = useMemo(
    () =>
      data?.reduce(
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
            const { success } = await LogControllerRemove({ envId });
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

export default Log;
