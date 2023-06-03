declare namespace API {
  type CreateEnvDto = {};

  type CreateScriptDto = {};

  type CreateTaskDto = {};

  type CreateTaskLogDto = {};

  type CreateUserDto = {
    /** 邮箱 */
    email: string;
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

  type ListBodyDto = {};

  type LoginDto = {
    /** 邮箱 */
    email: string;
    /** 密码 */
    password: string;
  };

  type ScriptControllerFindOneParams = {
    id: string;
  };

  type ScriptControllerRemoveParams = {
    id: string;
  };

  type ScriptControllerUpdateParams = {
    id: string;
  };

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

  type UpdateUserDto = {
    /** 邮箱 */
    email?: string;
    /** 密码 */
    password?: string;
  };

  type UserControllerFindOneParams = {
    id: string;
  };

  type UserControllerRemoveParams = {
    id: string;
  };

  type UserControllerUpdateParams = {
    id: string;
  };
}
