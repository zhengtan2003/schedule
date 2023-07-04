import { TaskControllerCreat } from '@/services/task';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate, useRequest } from '@umijs/max';
import { Button } from 'antd';
import { v4 as uuidv4 } from 'uuid';

const Create = () => {
  const navigate = useNavigate();
  const { loading, run } = useRequest(TaskControllerCreat, {
    manual: true,
    onSuccess: ({ id }) => {
      navigate(`../details?id=${id}`);
    },
  });
  return (
    <Button
      onClick={() => run({ name: uuidv4() })}
      type="primary"
      loading={loading}
      icon={<PlusOutlined />}
    >
      新建
    </Button>
  );
};

export default Create;
