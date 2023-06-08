declare namespace API {
  type CreateSchemaDto = {};

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

  type SchemaControllerFindOneParams = {
    id: string;
  };

  type SchemaControllerRemoveParams = {
    id: string;
  };

  type SchemaControllerUpdateParams = {
    id: string;
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

  type TaskControllerEnvRetrieveParams = {
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

  type UpdateSchemaDto = {};

  type UpsertScriptDto = {};

  type UpsertTaskDto = {};

  type UpsertTaskEnvDto = {};
}
