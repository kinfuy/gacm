export interface UserInfo {
  name: string
  email: string
  alias: string
}

export interface RegistryInfo {
  name: string
  alias: string
  home: string
  registry: string
}
export interface UserInfoJson {
  version: string
  users: Array<UserInfo>
  registry?: Array<RegistryInfo>
}
export interface UserOldInfoJson extends Record<string, any> {
  key: UserInfo
}

export type PackageManagertype = 'pnpm' | 'npm' | 'cnpm' | 'yarn';
export interface NrmCmd {
  packageManager: PackageManagertype
}
