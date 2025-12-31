import { promises } from 'fs';
import { registriesPath } from '../../config/path';
import { getFileUser } from '../../utils/getUserList';
import { log } from '../../utils/log';

const { writeFile } = promises;

export interface ExportCmd {
  output?: string
}

export const useExport = async (cmd: ExportCmd) => {
  const userConfig = await getFileUser(registriesPath);

  if (!userConfig) {
    log.error('No configuration found to export');
    return;
  }

  const outputPath = cmd.output || './gacm-config.json';

  try {
    await writeFile(outputPath, JSON.stringify(userConfig, null, 2));
    log.success(`Configuration exported to: ${outputPath}`);
  }
  catch (error: any) {
    log.error(`Failed to export configuration: ${error.message}`);
  }
};
