import { Term } from '@/components';
import { BugOutlined } from '@ant-design/icons';
import { Button,Modal } from 'antd';
import { useState } from 'react';
import { useModel } from '@umijs/max';

type DebugProps = {
  envId: string;
  taskId: string;
};
const Debug: React.FC<DebugProps> = (props) => {
  const { envId, taskId } = props;
  const { socket } = useModel('socket');
  const [open, setOpen] = useState<boolean>(false);
  const onMount = (term: any) => {
    socket?.on('debug', (data) => {
      term?.write(data);
    });
  };
  return (
    <>
      <Button
        type={'link'}
        size={'small'}
        icon={<BugOutlined />}
        onClick={() => {
          setOpen((open) => !open);
          socket?.emit('debug', { envId, taskId });
        }}
      />
      <Modal
        open={open}
        title={'调试'}
        footer={null}
        destroyOnClose
        onCancel={() => setOpen((open) => !open)}
      >
        <Term style={{ minHeight: '400px' }} onMount={onMount} />
      </Modal>
    </>
  );
};

export default Debug;
