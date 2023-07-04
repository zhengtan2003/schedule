import { Term } from '@/components';
import { EnvControllerOptions } from '@/services/env';
import { ScriptControllerOptions } from '@/services/script';
import {
  ProForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Drawer } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';

type DebugProps = {
  taskId: string;
  trigger?: JSX.Element;
};

const Debug: React.FC<DebugProps> = (props) => {
  const { taskId, trigger } = props;
  const termRef = useRef<any>();
  const { socket } = useModel('socket');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    socket?.on('debug', (data) => {
      if (data === 'end') {
        setLoading(false);
        return;
      }
      termRef.current?.write(data);
    });
  }, []);
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
      {triggerDom}
      <Drawer
        title={'调试'}
        open={open}
        size={'large'}
        destroyOnClose
        onClose={() => setOpen(false)}
      >
        <div style={{ height: '60px' }}>
          <ProForm
            loading={loading}
            layout={'inline'}
            submitter={{
              resetButtonProps: false,
              searchConfig: {
                submitText: '运行',
              },
              render: (_, doms) => (
                <div className={'flex justify-end'}>{doms}</div>
              ),
            }}
            onFinish={async (values) => {
              socket?.emit('debug', values);
              termRef.current?.clear();
              setLoading(true);
            }}
          >
            <ProFormText hidden name={'taskId'} initialValue={taskId} />
            <ProFormSelect
              label={'ENV'}
              name={'envId'}
              width={'sm'}
              rules={[{ required: true }]}
              request={() => EnvControllerOptions({ params: { taskId } })}
            />
            <ProFormSelect
              label={'脚本'}
              width={'sm'}
              name={'scriptIds'}
              rules={[{ required: true }]}
              fieldProps={{
                mode: 'multiple',
                maxTagCount: 'responsive',
              }}
              request={() => ScriptControllerOptions({ params: { taskId } })}
            />
          </ProForm>
        </div>
        <Term
          style={{ minHeight: '500px' }}
          onMount={(term) => (termRef.current = term)}
        />
      </Drawer>
    </>
  );
};

export default Debug;
