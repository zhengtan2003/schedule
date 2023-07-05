import { TaskControllerFrom, TaskControllerUpdate } from '@/services/task';
import { DrawerForm, ProFormText } from '@ant-design/pro-components';

type UpdateTaskProps = {
  taskId: string;
  onSuccess: any;
  trigger?: JSX.Element;
};
const UpdateTask: React.FC<UpdateTaskProps> = (props) => {
  return (
    <DrawerForm
      title={'编辑任务'}
      drawerProps={{
        size: 'default',
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        const { success } = await TaskControllerUpdate(values);
        if (success) props.onSuccess?.();
        return success;
      }}
      request={() => TaskControllerFrom({ id: props.taskId })}
      trigger={props.trigger}
    >
      <ProFormText name={'id'} hidden initialValue={props.taskId} />
      <ProFormText name={'name'} label="名称" rules={[{ required: true }]} />
    </DrawerForm>
  );
};

export default UpdateTask;
