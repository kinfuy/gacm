export interface BaseCmd {
  version?: boolean;
  list?: boolean;
}
export interface UseCmd {
  local?: boolean;
  global?: boolean;
  system?: boolean;
}

export interface AddCmd {
  name: string;
  email: string;
  alias: string;
}
export interface UserInfo {
  name: string;
  email: string;
  alias: string;
}

export interface UserInfoJson {
  version: string;
  users: Array<UserInfo>;
}
export interface UserOldInfoJson extends Record<string, any> {
  key: UserInfo;
}
