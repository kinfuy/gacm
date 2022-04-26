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
}
export interface UserInfo {
  name: string;
  email: string;
}
export interface UserInfoJson extends Record<string, any> {
  key: UserInfo;
}
