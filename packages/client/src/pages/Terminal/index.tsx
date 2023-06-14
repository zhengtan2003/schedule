import { Term } from '@/components';
import { useModel } from '@umijs/max';
import { PageContainer, ProCard } from '@ant-design/pro-components';

const Terminal = () => {
  const { socket } = useModel('socket');
  const onMount = (term: any) => {
    term?.write('$ ');
    let command = '';
    socket.on('terminal', (data) => {
      term?.write(data);
    });
    term.onData((e: any) => {
      if (/^[\x20-\x7E\u00A0]+$/.test(e)) {
        term.write(e);
        command += e;
      } else if (e === '\r') {
        socket.emit('terminal', command);
        command = '';
        term.write('\r\n');
      } else if (e === '\u007F') {
        if (term?._core.buffer.x > 2) {
          term.write('\b \b');
          if (command.length > 0) {
            command = command.substring(0, command.length - 1);
          }
        }
      }
    });
  };
  return (
    <PageContainer>
      <ProCard>
        <Term style={{ minHeight: '700px' }} onMount={onMount} />
      </ProCard>
    </PageContainer>
  );
};

export default Terminal;
