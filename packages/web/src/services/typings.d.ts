declare namespace API {
  type CreateScriptDto = {};

  type CreateTaskDto = {};

  type CreateUserDto = {
    /** 邮箱 */
    email: string;
    /** 密码 */
    password: string;
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

  type ScriptControllerOptionsParams = {
    keyword: string;
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

  type TaskControllerUpdateParams = {
    id: string;
  };

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
