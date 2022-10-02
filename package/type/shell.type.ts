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
