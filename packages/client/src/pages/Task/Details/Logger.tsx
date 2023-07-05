import { DeleteButton, ProDrawer } from '@/components';
import {
  LoggerControllerLogSearch,
  LoggerControllerRemove,
} from '@/services/logger';
import { toDateTimeString } from '@/utils';
import {
  CheckCircleFilled,
  CloseCircleFilled,
  FileSyncOutlined,
} from '@ant-design/icons';
import { useRequest } from '@umijs/max';
import { Button, Tag, Timeline, Tooltip, Typography } from 'antd';
import React, { useMemo } from 'react';

interface LogDrawerProps {
  envId: string;
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
  const { envId } = props;
  const { run, data, refresh } = useRequest(LoggerControllerLogSearch, {
    manual: true,
  });
  const items = useMemo(
    () =>
      data?.reduce((result: any, item: any) => {
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
      }, []),
    [data],
  );

  return (
    <ProDrawer
      extra={
        <DeleteButton
          size={'middle'}
          type={'default'}
          confirmProps={{
            title: '确定清空日志吗？',
            content: '',
            onOk: async () => {
              const { success } = await LoggerControllerRemove({ envId });
              if (success) refresh();
            },
          }}
        >
          清空日志
        </DeleteButton>
      }
      size={'large'}
      destroyOnClose
      title={'日志'}
      trigger={
        <Tooltip title={'日志'}>
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
        </Tooltip>
      }
    >
      <Timeline items={items} />
    </ProDrawer>
  );
};

export default Logger;
