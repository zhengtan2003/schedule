import { MoreOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Dropdown } from 'antd';
import React from 'react';
import Env from './Env';
import TaskLog from './TaskLog';

type ActionDropdownProps = {
  taskId: string;
  taskName: string;
};
const ActionDropdown: React.FC<ActionDropdownProps> = (props) => {
  const { taskId, taskName } = props;
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <TaskLog taskId={taskId} taskName={taskName} />,
    },
    {
      key: '2',
      label: <Env taskId={taskId} taskName={taskName} />,
    },
  ];
  return (
    <Dropdown menu={{ items }}>
      <Button type={'link'} size={'small'}>
        <MoreOutlined />
      </Button>
    </Dropdown>
  );
};

export default ActionDropdown;
