import Context from '@/pages/Task/Details/Context';
import { ScriptControllerOptions } from '@/services/script';
import { TaskControllerSyncScrip } from '@/services/task';
import { useRequest } from 'ahooks';
import { Select } from 'antd';
import { useContext, useEffect, useState } from 'react';

type SyncScripSelectProps = {
  value?: number[];
  onSuccess?: () => void;
};
const SyncScripSelect: React.FC<SyncScripSelectProps> = (props) => {
  const { taskId } = useContext(Context);
  const [value, setValue] = useState<number[]>([]);
  const { loading, data } = useRequest(ScriptControllerOptions);
  useEffect(() => {
    if (Array.isArray(props.value)) setValue(props.value);
  }, [props.value]);
  return (
    <Select
      value={value}
      loading={loading}
      options={data}
      mode={'multiple'}
      maxTagCount={'responsive'}
      style={{ minWidth: '200px' }}
      onChange={async (value: number[]) => {
        const { success } = await TaskControllerSyncScrip({
          id: taskId,
          scriptIds: value,
        });
        if (success) props.onSuccess?.();
      }}
    />
  );
};

export default SyncScripSelect;
