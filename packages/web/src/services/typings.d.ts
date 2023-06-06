declare namespace API {
  type CreateTaskDto = {};

  type CreateUserDto = {
    /** 用户名 */
    username: string;
    /** 密码 */
    password: string;
  };

  type LoginDto = {
    /** 邮箱 */
    username: string;
    /** 密码 */
    password: string;
  };

  type ScriptControllerAntdFromParams = {
    id: string;
  };

  type ScriptControllerRemoveParams = {
    id: string;
  };

  type SearchDto = {};

  type SubscribeDto = {};

  type TaskControllerDebugParams = {
    id: string;
  };

  type TaskControllerEnvAntdFromParams = {
    id: string;
    taskId: string;
  };

  type TaskControllerRemoveAllLogParams = {
    taskId: string;
  };

  type TaskControllerRemoveEnvParams = {
    id: string;
    taskId: string;
  };

  type TaskControllerRemoveParams = {
    id: string;
  };

  type TaskControllerStartParams = {
    id: string;
  };

  type TaskControllerStopParams = {
    id: string;
  };

  type UpsertScriptDto = {};

  type UpsertTaskEnvDto = {};
}
