import { Debug, Toggle, UpdateTask } from '@/pages/Task/components';
import Context from '@/pages/Task/Details/Context';
import Env from '@/pages/Task/Details/Env';
import Script from '@/pages/Task/Details/Script';
import { TaskControllerDetails } from '@/services/task';
import {
  BugOutlined,
  ClockCircleOutlined,
  FormOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { useRequest, useSearchParams } from '@umijs/max';
import { Button, Tag } from 'antd';

const Details = () => {
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get('id');
  const { data = {}, refresh } = useRequest(
    () => TaskControllerDetails({ id: taskId as string }),
    {
      ready: !!taskId,
    },
  );
  const taskName = data.name;
  if (!taskId) return null;
  return (
    <Context.Provider
      value={{
        taskId,
      }}
    >
      <PageContainer
        title={
          <>
            {data.status === 0 && (
              <Tag icon={<ClockCircleOutlined />} color="default">
                waiting
              </Tag>
            )}
            {data.status === 1 && (
              <Tag icon={<SyncOutlined spin />} color="processing">
                processing
              </Tag>
            )}
            {taskName}
          </>
        }
        extra={[
          <Debug
            key="debug"
            taskId={taskId}
            trigger={<Button icon={<BugOutlined />}>调试</Button>}
          />,
          <Toggle key="toggle" onSuccess={refresh}>
            {({ loading, run }) => {
              return (
                <Button
                  type="primary"
                  loading={loading}
                  icon={
                    <>
                      {data.status === 0 && <PlayCircleOutlined />}
                      {data.status === 1 && <PauseCircleOutlined />}
                    </>
                  }
                  onClick={() => run({ data: { id: taskId } })}
                >
                  {data.status === 0 && '开始'}
                  {data.status === 1 && '停止'}
                </Button>
              );
            }}
          </Toggle>,
          <UpdateTask
            key={'edit'}
            taskId={taskId}
            onSuccess={refresh}
            trigger={
              <Button type="primary" icon={<FormOutlined />}>
                编辑
              </Button>
            }
          />,
        ]}
      >
        <ProCard direction="column" ghost gutter={[0, 16]}>
          <ProCard ghost>
            <Env taskId={taskId} />
          </ProCard>
          <ProCard ghost>
            <Script id={taskId} taskName={taskName} />
          </ProCard>
        </ProCard>
      </PageContainer>
    </Context.Provider>
  );
};

export default Details;
