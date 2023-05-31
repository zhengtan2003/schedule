import { scriptAnalysis } from "@/services/script";
import { SyncOutlined } from "@ant-design/icons";
import { useRequest } from "@umijs/max";
import { Button, Input, Space } from "antd";
import { useRef } from "react";

interface UpdateInputProps {
  onSuccess: (values: Record<string, any>) => void;
}

const UpdateInput: React.FC<UpdateInputProps> = (props) => {
  const valueRef = useRef<any>();
  const { run, loading } = useRequest(scriptAnalysis, {
    manual: true,
    // onError: props.onError,
    onSuccess: props.onSuccess
  });
  return (
    <Space.Compact>
      <Input
        placeholder={"请输入"}
        onChange={(e) => (valueRef.current = e.target.value)}
      />
      <Button
        loading={loading}
        icon={<SyncOutlined />}
        onClick={() => {
          if (!valueRef.current) return;
          run({ url: valueRef.current });
        }}
      />
    </Space.Compact>
  );
};

export default UpdateInput;
