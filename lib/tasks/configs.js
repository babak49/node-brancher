const path = require('path');
const Config = require('../Config');
const Logger = require('../Logger');

class ConfigTask {
  constructor(repository, _branch) {
    if (!repository) {
      Logger.error('Please specify repository name');
    }

    if (global.config) {
      return global.config;
    }

    const config = Config.app(repository);
    const pm2 = Config.pm2(repository);
    const branch = _branch || config.defaultBranch;

    pm2.script = path.join(
      pm2.cwd,
      repository,
      branch,
      pm2.script,
    );

    const dir = path.join(pm2.cwd, repository);
    const appDir = path.join(pm2.cwd, repository, branch);
    const projectDir = pm2.cwd;

    delete pm2.cwd;
    global.config = {
      ...config,
      ...pm2,
      branch,
      dir,
      appDir,
      repository,
      projectDir,
    };

    if (_branch) {
      Logger.info('Selected configurations: ');
      Logger.dir(global.config);
      Logger.space();
    }

    return global.config;
  }
}

module.exports = ConfigTask;