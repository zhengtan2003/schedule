import { createContext } from 'react';

const Context = createContext<{ taskId: string }>({ taskId: '' });

export default Context;
