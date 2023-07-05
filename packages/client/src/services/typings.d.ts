declare namespace API {
  type CreateTaskDto = {};

  type CreateUserDto = {
    /** 用户名 */
    username: string;
    /** 密码 */
    password: string;
  };

  type EnvControllerFormParams = {
    id: string;
  };

  type EnvControllerRemoveParams = {
    id: string;
  };

  type EnvControllerSearchParams = {
    taskId: string;
  };

  type LoggerControllerRemoveParams = {
    envId: string;
  };

  type LoginDto = {
    /** 邮箱 */
    username: string;
    /** 密码 */
    password: string;
  };

  type ScriptControllerFromParams = {
    id: string;
  };

  type ScriptControllerRemoveParams = {
    id: string;
  };

  type SearchDto = {};

  type SyncScripDto = {};

  type TaskControllerDetailsParams = {
    id: string;
  };

  type TaskControllerFromParams = {
    id: string;
  };

  type TaskControllerRemoveParams = {
    id: string;
  };

  type TaskControllerScriptParams = {
    id: string;
  };

  type UpdateScripExtDto = {};

  type UpdateScriptDto = {};

  type UpdateTaskDto = {
    id: number;
  };

  type UpsertTaskEnvDto = {};
}
