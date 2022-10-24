#!/usr/bin/env node
'use strict';

var commander = require('commander');
var kolorist = require('kolorist');
var path = require('path');
var fs = require('fs');
require('child_process');
require('process');
var execa = require('execa');
var prompts = require('prompts');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var execa__default = /*#__PURE__*/_interopDefaultLegacy(execa);
var prompts__default = /*#__PURE__*/_interopDefaultLegacy(prompts);

var name$1 = "gacm";
var version$1 = "1.2.1";
var description$1 = "git account manage";
var keywords = [
	"git",
	"account",
	"manage"
];
var license$1 = "MIT";
var author$1 = "alqmc";
var bin = {
	gacm: "gacm.js",
	gnrm: "gnrm.js"
};
var publishConfig = {
	access: "public"
};
var dependencies$1 = {
	commander: "^9.3.0",
	execa: "5.1.1",
	kolorist: "^1.5.1",
	prompts: "^2.4.2"
};
var pkg$1 = {
	name: name$1,
	version: version$1,
	"private": false,
	description: description$1,
	keywords: keywords,
	license: license$1,
	author: author$1,
	bin: bin,
	publishConfig: publishConfig,
	dependencies: dependencies$1
};

const useVersion = async (cmd) => {
  if (cmd.version)
    console.log(`v${pkg$1.version}`);
};

const rootPath = __dirname;
__dirname;
path.resolve(rootPath, "package");
const HOME = process.env[process.platform === "win32" ? "USERPROFILE" : "HOME"] || "";
const registriesPath = path.join(HOME, ".gacmrc");

const success = (msg) => console.log(`
${kolorist.green(msg)}
`);
const error = (msg) => console.log(`
${kolorist.red(msg)}
`);
const warning = (msg) => console.log(`
${kolorist.yellow(msg)}
`);
const info = (msg) => console.log(`
${kolorist.blue(msg)}
`);
const log = {
  success,
  error,
  warning,
  info
};

var name = "gacm";
var version = "1.2.1";
var description = "gacm";
var scripts = {
	build: "gulp --require sucrase/register/ts --gulpfile build/gulpfile.ts",
	clear: "rimraf dist",
	link: "cd dist && pnpm link --global",
	push: "git push gitee master && git push github master",
	"update:version": "sucrase-node build/utils/version.ts",
	log: "changeloger",
	release: "sucrase-node script/release.ts",
	prepare: "husky install"
};
var author = "alqmc";
var license = "MIT";
var devDependencies = {
	"@alqmc/build-ts": "^0.0.8",
	"@alqmc/build-utils": "^0.0.3",
	"@alqmc/eslint-config": "0.0.4",
	"@commitlint/cli": "^8.3.5",
	"@commitlint/config-angular": "^8.3.4",
	"@commitlint/config-conventional": "^16.2.1",
	"@types/fs-extra": "^9.0.13",
	"@types/gulp": "^4.0.9",
	"@types/node": "^17.0.21",
	"@types/prompts": "^2.0.14",
	changeloger: "0.1.0",
	commitizen: "^4.1.2",
	"fs-extra": "^10.1.0",
	gulp: "^4.0.2",
	husky: "^8.0.1",
	"lint-staged": "^10.5.4",
	prettier: "^2.6.2",
	prompts: "^2.4.2",
	rimraf: "^3.0.2",
	sucrase: "^3.20.3",
	tslib: "^2.4.0",
	typescript: "^4.6.3"
};
var dependencies = {
	commander: "^9.3.0",
	execa: "5.1.1",
	kolorist: "^1.5.1",
	minimist: "^1.2.6",
	prompts: "^2.4.2"
};
var config = {
	commitizen: {
		path: "./node_modules/cz-conventional-changelog"
	}
};
var pkg = {
	name: name,
	version: version,
	description: description,
	scripts: scripts,
	author: author,
	license: license,
	devDependencies: devDependencies,
	dependencies: dependencies,
	config: config
};

const transformData = (data) => {
  const userInfo = { version: "", users: [] };
  Object.keys(data).forEach((x) => {
    userInfo.users.push({
      name: data[x].name,
      email: data[x].email,
      alias: data[x].name
    });
  });
  return userInfo;
};
const insertRegistry = async (name, alias, registry, home) => {
  let userConfig = await getFileUser(registriesPath);
  if (!userConfig)
    userConfig = {
      version: pkg.version,
      users: [],
      registry: []
    };
  if (!userConfig.registry)
    userConfig.registry = [];
  const isExist = userConfig.registry?.some((x) => x.alias === alias);
  if (isExist) {
    userConfig.registry?.forEach((x) => {
      if (x.alias === alias) {
        x.alias = alias;
        x.name = name;
        x.home = home || "";
        x.registry = registry;
      }
    });
  } else {
    userConfig.registry?.push({
      alias,
      name,
      home: home || "",
      registry
    });
  }
  await writeFileUser(registriesPath, userConfig);
};

const { readFile, writeFile } = fs.promises;
const getFileUser = async (rootPath) => {
  if (fs.existsSync(rootPath)) {
    const fileBuffer = await readFile(rootPath, "utf-8");
    let userList = fileBuffer ? JSON.parse(fileBuffer.toString()) : null;
    if (userList && !userList.version)
      userList = transformData(userList);
    return userList;
  }
  return null;
};
async function writeFileUser(dir, data) {
  writeFile(dir, JSON.stringify(data, null, 4)).catch((error) => {
    log.error(error);
    process.exit(0);
  });
}

const execCommand = async (cmd, args) => {
  const res = await execa__default["default"](cmd, args);
  return res.stdout.trim();
};

const geneDashLine = (message, length) => {
  const finalMessage = new Array(Math.max(2, length - message.length + 2)).join("-");
  return padding(kolorist.white(finalMessage));
};
const padding = (message = "", before = 1, after = 1) => {
  return new Array(before).fill(" ").join(" ") + message + new Array(after).fill(" ").join(" ");
};
const printMessages = (messages) => {
  console.log("\n");
  for (const message of messages) {
    console.log(message);
  }
  console.log("\n");
};

const defaultNpmMirror = [
  {
    name: "npm",
    alias: "npm",
    home: "https://www.npmjs.org",
    registry: "https://registry.npmjs.org/"
  },
  {
    name: "yarn",
    alias: "yarn",
    home: "https://yarnpkg.com",
    registry: "https://registry.yarnpkg.com/"
  },
  {
    name: "tencent",
    alias: "tencent",
    home: "https://mirrors.cloud.tencent.com/npm/",
    registry: "https://mirrors.cloud.tencent.com/npm/"
  },
  {
    name: "cnpm",
    alias: "cnpm",
    home: "https://cnpmjs.org",
    registry: "https://r.cnpmjs.org/"
  },
  {
    name: "taobao",
    alias: "taobao",
    home: "https://npmmirror.com",
    registry: "https://registry.npmmirror.com/"
  },
  {
    name: "npmMirror",
    alias: "npmMirror",
    home: "https://skimdb.npmjs.com/",
    registry: "https://skimdb.npmjs.com/registry/"
  }
];

const useLs = async (cmd) => {
  const userConfig = await getFileUser(registriesPath);
  let registryList = defaultNpmMirror;
  if (userConfig) {
    if (!userConfig.registry || userConfig.registry.length === 0) {
      userConfig.registry = registryList;
      writeFileUser(registriesPath, userConfig);
    } else
      registryList = userConfig.registry;
  }
  let packageManager = "npm";
  if (cmd.packageManager)
    packageManager = cmd.packageManager;
  let currectRegistry = "";
  try {
    currectRegistry = await execCommand(packageManager, [
      "config",
      "get",
      "registry"
    ]);
  } catch (error) {
    log.error(`${packageManager} is not found`);
    return;
  }
  if (registryList.every((x) => x.registry !== currectRegistry)) {
    try {
      const { name } = await prompts__default["default"]({
        type: "text",
        name: "name",
        message: `find new registry:${currectRegistry}, please give it a name`
      });
      await insertRegistry(name, name, currectRegistry);
      log.info(`[found new registry]: ${currectRegistry}`);
      registryList.push({
        name,
        registry: currectRegistry,
        home: "",
        alias: name
      });
    } catch (error) {
    }
  }
  const length = Math.max(...registryList.map((x) => {
    return x.alias.length + (x.alias !== x.name ? x.name.length : 0);
  })) + 3;
  const prefix = "  ";
  const messages = registryList.map((item) => {
    const currect = item.registry === currectRegistry ? `${kolorist.green("*")}` : " ";
    const isSame = item.alias === item.name;
    return `${prefix + currect}${isSame ? item.alias : `${item.alias}(${kolorist.gray(item.name)})`}${geneDashLine(item.name, length)}${item.registry}`;
  });
  printMessages(messages);
};

const useUse = async ([name], cmd) => {
  const userConfig = await getFileUser(registriesPath);
  let registrylist = defaultNpmMirror;
  if (userConfig && userConfig.registry)
    registrylist = userConfig.registry;
  let useRegistry = void 0;
  if (name) {
    useRegistry = registrylist.find((x) => x.alias === name);
  } else {
    const { registry } = await prompts__default["default"]({
      type: "select",
      name: "registry",
      message: "Pick a registry",
      choices: registrylist.map((x) => {
        return {
          title: `${x.alias}${x.alias === x.name ? "" : `(${x.name})`} ${x.registry}`,
          value: x
        };
      })
    });
    if (!registry) {
      log.error(`user cancel operation`);
      return;
    }
    useRegistry = registry;
  }
  if (!useRegistry)
    return log.error(`${name} not found`);
  let packageManager = "npm";
  if (cmd.packageManager)
    packageManager = cmd.packageManager;
  await execCommand(packageManager, [
    "config",
    "set",
    "registry",
    useRegistry.registry
  ]).catch(() => {
    log.error(`${packageManager} is not found`);
    return;
  });
  log.success(`${packageManager} registry has been set to:  ${useRegistry.registry}`);
};

const useAdd = async (cmd) => {
  if (cmd.name && cmd.registry) {
    await insertRegistry(cmd.name, cmd.alias, cmd.registry);
  }
};

const useAlias = async (origin, target) => {
  if (!origin || !target)
    return;
  let useConfig = await getFileUser(registriesPath);
  if (!useConfig)
    useConfig = { version: "", users: [], registry: [] };
  if (!useConfig.registry)
    useConfig.registry = [];
  let changed = false;
  useConfig.registry?.forEach((x) => {
    if (x.alias === origin) {
      if (useConfig && useConfig.registry?.every((x2) => x2.alias !== target)) {
        x.alias = target;
        log.success(`[update]: ${origin}=>${x.alias} (${x.name})`);
      } else {
        log.error(`${target} is exist, please enter another one `);
      }
      changed = true;
    }
  });
  if (!changed)
    return log.error(`${origin} not found`);
  await writeFileUser(registriesPath, useConfig);
};

const useDelete = async (name) => {
  const userConfig = await getFileUser(registriesPath);
  if (!userConfig)
    return log.error(`no registry`);
  if (!userConfig.registry)
    return log.error(`no registry`);
  const useRegistry = userConfig.registry.find((x) => x.alias === name);
  if (!useRegistry)
    return log.error(`${name} not found`);
  for (let i = 0; i < userConfig.registry.length; i++) {
    if (userConfig.registry[i].alias === name) {
      log.success(`[delete]: ${userConfig.registry[i].alias}  ${userConfig.registry[i].registry}`);
      userConfig.registry.splice(i, 1);
    }
  }
  await writeFileUser(registriesPath, userConfig);
};

const program = new commander.Command();
program.option("-v, --version", "\u67E5\u770B\u5F53\u524D\u7248\u672C").usage("command <option>").description("\u67E5\u770B\u5F53\u524D\u7248\u672C").action(useVersion);
program.command("ls").option("-p, --packageManager <packageManager>", "\u67E5\u770B\u5BF9\u5E94\u5305\u7BA1\u7406\u5668\uFF1A\u9ED8\u8BA4npm").description("\u5F53\u524D\u7528\u6237\u5217\u8868").action(useLs);
program.command("use [name...]").option("-p, --packageManager <packageManager>", "\u8BBE\u7F6E\u5BF9\u5E94\u5305\u7BA1\u7406\u5668\uFF1A\u9ED8\u8BA4npm").description("\u5207\u6362\u955C\u50CF\u6E90").action(useUse);
program.command("add").option("-n, --name <name>", "\u955C\u50CF\u540D\u79F0").option("-r, --registry <registry>", "\u955C\u50CF\u5730\u5740").option("-a, --alias <alias>", "\u955C\u50CF\u522B\u540D").description("\u6DFB\u52A0\u955C\u50CF").action(useAdd);
program.command("alias <origin> <target>").description("\u955C\u50CF\u6DFB\u52A0\u522B\u540D").action(useAlias);
program.command("delete <name>").description("\u5220\u9664\u955C\u50CF").action(useDelete);
program.parse(process.argv);
