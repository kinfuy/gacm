import pkg from '../../package.json';
export interface BaseCmd {
  version?: boolean;
}
export const useVersion = async (cmd: BaseCmd) => {
  if (cmd.version) console.log(pkg.version);
};
