import { PageContainer, ProCard } from '@ant-design/pro-components';
import { useWebSocket } from 'ahooks';
import { useEffect, useRef } from 'react';
import { Terminal as Xterm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const baseTheme = {
  foreground: '#F8F8F8',
  background: '#2D2E2C',
  selection: '#5DA5D533',
  black: '#1E1E1D',
  brightBlack: '#262625',
  red: '#CE5C5C',
  brightRed: '#FF7272',
  green: '#5BCC5B',
  brightGreen: '#72FF72',
  yellow: '#CCCC5B',
  brightYellow: '#FFFF72',
  blue: '#5D5DD3',
  brightBlue: '#7279FF',
  magenta: '#BC5ED1',
  brightMagenta: '#E572FF',
  cyan: '#5DA5D5',
  brightCyan: '#72F0FF',
  white: '#F8F8F8',
  brightWhite: '#FFFFFF',
};

const Terminal = () => {
  const term = useRef<Xterm>();
  const command = useRef('');
  const terminalDOM = useRef(null);
  const { sendMessage } = useWebSocket(`ws://${location.host}/ws`, {
    onMessage: ({ data }) => {
      term.current?.write(data.replace(/\n/g, '\r\n'));
    },
    onError: (event) => {
      console.log(event);
    },
  });
  useEffect(() => {
    if (!terminalDOM.current) return;
    term.current = new Xterm({
      fontFamily: '"Cascadia Code", Menlo, monospace',
      theme: baseTheme,
      cursorBlink: true,
      allowProposedApi: true,
    });
    const fitAddon = new FitAddon();
    term.current.loadAddon(fitAddon);
    term.current.open(terminalDOM.current);
    fitAddon.fit();
    term.current?.write('$ ');
    term.current.onData((e) => {
      if (e === '\r') {
        // @ts-ignore
        sendMessage(
          JSON.stringify({
            event: 'COMMAND',
            data: command.current,
          }),
        );
        command.current = '';
        term.current?.write('\r\n');
      } else if (e === '\u007F') {
        // @ts-ignore
        if (term.current?._core.buffer.x > 2) {
          term.current?.write('\b \b');
          if (command.current.length > 0) {
            command.current = command.current.substring(
              0,
              command.current.length - 1,
            );
          }
        }
      } else if (
        (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7e)) ||
        e >= '\u00a0'
      ) {
        command.current += e;
        term.current?.write(e);
      }
    });
  }, []);
  return (
    <PageContainer>
      <ProCard>
        <div style={{ minHeight: '700px' }} ref={terminalDOM} />
      </ProCard>
    </PageContainer>
  );
};

export default Terminal;
