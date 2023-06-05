declare namespace API {
  type CreateEnvDto = {};

  type CreateScriptDto = {};

  type CreateTaskDto = {};

  type CreateUserDto = {
    /** 用户名 */
    username: string;
    /** 密码 */
    password: string;
  };

  type EnvControllerFindOneParams = {
    id: string;
  };

  type EnvControllerFormParams = {
    id: string;
  };

  type EnvControllerRemoveParams = {
    id: string;
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

  type ScriptControllerUpdateParams = {
    id: string;
  };

  type SearchDto = {};

  type SubscribeDto = {};

  type TaskControllerFindOneParams = {
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

  type TaskControllerUpdateParams = {
    id: string;
  };

  type UpdateEnvDto = {};

  type UpdateScriptDto = {};

  type UpdateTaskDto = {};
}
