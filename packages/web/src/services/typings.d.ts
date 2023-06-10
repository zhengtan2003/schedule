declare namespace API {
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

  type ScriptControllerRemoveParams = {
    id: string;
  };

  type ScriptControllerRetrieveParams = {
    id: string;
  };

  type SearchDto = {};

  type TaskControllerDebugParams = {
    id: string;
  };

  type TaskControllerFromParams = {
    id: string;
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

  type TaskEnvControllerFormParams = {
    id: string;
    taskId: string;
  };

  type TaskEnvControllerRemoveParams = {
    id: string;
  };

  type TaskEnvDto = {};

  type TaskLogControllerRemoveParams = {
    taskId: string;
  };

  type UpsertScriptDto = {};

  type UpsertTaskDto = {};
}
