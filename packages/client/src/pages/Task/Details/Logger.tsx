import { DeleteButton, ProDrawer } from '@/components';
import {
  LoggerControllerLogSearch,
  LoggerControllerRemove,
} from '@/services/logger';
import { toDateTimeString } from '@/utils';
import {
  CheckCircleFilled,
  CloseCircleFilled,
  MessageOutlined,
  ClearOutlined
} from '@ant-design/icons';
import { useRequest } from '@umijs/max';
import { Button, Empty, Tag, Timeline, Tooltip, Typography } from 'antd';

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
          <ClearOutlined />
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
            <MessageOutlined />
          </Button>
        </Tooltip>
      }
    >
      {!data?.length ? (
        <Empty description={false} />
      ) : (
        <Timeline
          items={data?.map((item: any) => {
            return {
              ...statusMaps[item.status],
              children: (
                <Typography>
                  <Title level={5}>{toDateTimeString(item.createTime)}</Title>
                  <Tag color="magenta">耗时：{item.executionTime}s</Tag>
                  <Tag color="geekblue">{item.scriptName}</Tag>
                  <pre style={{ background: '#000', color: '#F8F8F8' }}>
                    {item.log}
                  </pre>
                </Typography>
              ),
            };
          })}
        />
      )}
    </ProDrawer>
  );
};

export default Logger;
