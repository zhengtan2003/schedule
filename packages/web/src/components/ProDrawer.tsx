import type { DrawerProps } from 'antd';
import { Drawer } from 'antd';
import React, { useMemo, useState } from 'react';

export type ProDrawerProps = Omit<DrawerProps, 'open'> & {
  trigger?: JSX.Element;
};
const ProDrawer: React.FC<ProDrawerProps> = (props) => {
  const { trigger, children, ...drawerProps } = props;
  const [open, setOpen] = useState<boolean>(false);
  const triggerDom = useMemo(() => {
    if (!trigger) return null;
    return React.cloneElement(trigger, {
      key: 'trigger',
      ...trigger.props,
      onClick: async (e: any) => {
        setOpen(!open);
        trigger.props?.onClick?.(e);
      },
    });
  }, [setOpen, trigger, open]);
  return (
    <>
      <Drawer
        {...drawerProps}
        open={open}
        onClose={(e) => {
          setOpen(false);
          drawerProps?.onClose?.(e);
        }}
      >
        {children}
      </Drawer>
      {triggerDom}
    </>
  );
};

export default ProDrawer;
