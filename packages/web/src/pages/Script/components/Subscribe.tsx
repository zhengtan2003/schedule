import { ScriptControllerSubscribe } from '@/services/script';
import { useRequest } from '@umijs/max';
import { Button, Input, Space } from 'antd';
import { useRef } from 'react';

interface SubscribeProps {
  onSuccess: () => void;
}

const Subscribe: React.FC<SubscribeProps> = (props) => {
  const valueRef = useRef<any>();
  const { run, loading } = useRequest(ScriptControllerSubscribe, {
    manual: true,
    onSuccess: props.onSuccess,
  });
  return (
    <Space.Compact>
      <Input
        placeholder={'请输入订阅地址'}
        onChange={(e) => (valueRef.current = e.target.value)}
      />
      <Button
        type="primary"
        loading={loading}
        onClick={() => {
          run({
            updateURL: valueRef.current,
          });
        }}
      >
        更新订阅
      </Button>
    </Space.Compact>
  );
};

export default Subscribe;
