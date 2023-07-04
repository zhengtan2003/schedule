import { TaskControllerToggle } from '@/services/task';
import { useRequest } from '@umijs/max';

type ToggleProps = {
  children: (result: any) => any;
  onSuccess: any;
};
const Toggle: React.FC<ToggleProps> = (props) => {
  const result = useRequest(TaskControllerToggle, {
    manual: true,
    onSuccess: props.onSuccess,
  });

  return props.children(result);
};

export default Toggle;
