#!/usr/bin/env node
'use strict';

var cac = require('cac');
var kolorist = require('kolorist');
var prompts = require('prompts');
var fs = require('fs');
var path = require('path');
require('child_process');
require('process');
var execa = require('execa');
var fetch = require('node-fetch');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var cac__default = /*#__PURE__*/_interopDefaultLegacy(cac);
var prompts__default = /*#__PURE__*/_interopDefaultLegacy(prompts);
var execa__default = /*#__PURE__*/_interopDefaultLegacy(execa);
var fetch__default = /*#__PURE__*/_interopDefaultLegacy(fetch);

var name$1 = "gacm";
var version$1 = "1.2.10";
var description$1 = "git account manage";
var author$1 = "alqmc";
var license$1 = "MIT";
var keywords = [
	"git",
	"account",
	"manage"
];
var bin = {
	gacm: "gacm.js",
	gnrm: "gnrm.js"
};
var publishConfig = {
	access: "public"
};
var dependencies$1 = {
	cac: "^6.7.14",
	execa: "5.1.1",
	kolorist: "^1.5.1",
	"node-fetch": "2.6.6",
	prompts: "^2.4.2"
};
var pkg$1 = {
	name: name$1,
	version: version$1,
	"private": false,
	description: description$1,
	author: author$1,
	license: license$1,
	keywords: keywords,
	bin: bin,
	publishConfig: publishConfig,
	dependencies: dependencies$1
};

const useVersion = () => {
  return pkg$1.version;
};

const rootPath = __dirname;
__dirname;
path.resolve(rootPath, "package");
const HOME = process.env[process.platform === "win32" ? "USERPROFILE" : "HOME"] || "";
const registriesPath = path.join(HOME, ".gacmrc");

const defaultPackageManager = ["npm", "yarn", "cnpm", "pnpm"];
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
const padding = (message = "", before = 1, after = 1) => {
  return new Array(before).fill(" ").join(" ") + message + new Array(after).fill(" ").join(" ");
};
const geneDashLine = (message, length) => {
  const finalMessage = new Array(Math.max(2, length - message.length + 2)).join("-");
  return padding(kolorist.white(finalMessage));
};
const printMessages = (messages) => {
  console.log("\n");
  for (const message of messages)
    console.log(message);
  console.log("\n");
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
const checkRegistry = async () => {
  const userConfig = await getFileUser(registriesPath);
  let registryList = defaultNpmMirror;
  if (userConfig)
    if (!userConfig.registry || userConfig.registry.length === 0) {
      userConfig.registry = registryList;
      writeFileUser(registriesPath, userConfig);
    } else {
      registryList = userConfig.registry;
    }
  return registryList;
};

const execCommand = async (cmd, args) => {
  const res = await execa__default["default"](cmd, args);
  return res.stdout.trim();
};

var name = "gacm";
var version = "1.2.10";
var description = "gacm";
var author = "alqmc";
var license = "MIT";
var scripts = {
	build: "gulp --require sucrase/register/ts --gulpfile build/gulpfile.ts",
	clear: "rimraf dist",
	link: "cd dist && pnpm link --global",
	push: "git push gitee master && git push github master",
	"update:version": "sucrase-node build/utils/version.ts",
	lint: "eslint . --fix",
	log: "changeloger",
	release: "sucrase-node script/release.ts",
	prepare: "husky install"
};
var dependencies = {
	execa: "5.1.1",
	kolorist: "^1.5.1",
	minimist: "^1.2.6",
	"node-fetch": "2.6.6",
	prompts: "^2.4.2"
};
var devDependencies = {
	"@alqmc/build-ts": "^0.0.8",
	"@alqmc/build-utils": "^0.0.3",
	"@alqmc/eslint-config-ts": "^0.0.9",
	"@commitlint/cli": "^8.3.5",
	"@commitlint/config-angular": "^8.3.4",
	"@commitlint/config-conventional": "^16.2.1",
	"@types/fs-extra": "^9.0.13",
	"@types/gulp": "^4.0.9",
	"@types/node": "^17.0.21",
	"@types/node-fetch": "^2.6.2",
	"@types/prompts": "^2.0.14",
	cac: "^6.7.14",
	changeloger: "0.1.0",
	commitizen: "^4.1.2",
	eslint: "^8.31.0",
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
var pkg = {
	name: name,
	version: version,
	description: description,
	author: author,
	license: license,
	scripts: scripts,
	dependencies: dependencies,
	devDependencies: devDependencies
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
    log.success(`[update]:${alias} ${alias !== name ? `(${name})` : ""} registry ${registry}`);
  } else {
    userConfig.registry?.push({
      alias,
      name,
      home: home || "",
      registry
    });
    log.success(`[add]:${alias} ${alias !== name ? `(${name})` : ""} registry ${registry}`);
  }
  await writeFileUser(registriesPath, userConfig);
};

const getRegistry = async (pkg) => {
  return await execCommand(pkg, [
    "config",
    "get",
    "registry"
  ]).catch(() => {
  });
};
const getRegistrys = async (pkgs = defaultPackageManager) => {
  const registrys = {
    npm: "",
    pnpm: "",
    cnpm: "",
    yarn: ""
  };
  const list = pkgs.map(async (pkg) => {
    return {
      pkg,
      handle: await getRegistry(pkg)
    };
  });
  for (const iterator of list) {
    const itme = await iterator;
    registrys[itme.pkg] = itme.handle || "";
  }
  return registrys;
};
const useLs = async (cmd) => {
  const registryList = await checkRegistry();
  const pkgs = [];
  if (cmd.packageManager)
    pkgs.push(cmd.packageManager);
  else
    pkgs.push(...defaultPackageManager);
  const currectRegistry = await getRegistrys(pkgs);
  if (registryList.every((x) => Object.values(currectRegistry).includes(x.registry)))
    try {
      const newRegistry = Object.keys(currectRegistry).map((x) => {
        if (registryList.every((val) => currectRegistry[x] && val.registry !== currectRegistry[x]))
          return currectRegistry[x];
        return "";
      });
      Array.from(new Set(newRegistry)).filter((x) => x).forEach(async (registry) => {
        const { name } = await prompts__default["default"]({
          type: "text",
          name: "name",
          message: `find new registry:${currectRegistry}, please give it a name`
        });
        await insertRegistry(name, name, registry);
        log.info(`[found new registry]: ${currectRegistry}`);
        registryList.push({
          name,
          registry,
          home: "",
          alias: name
        });
      });
    } catch (error) {
    }
  const length = Math.max(...registryList.map((x) => {
    return x.alias.length + (x.alias !== x.name ? x.name.length : 0);
  })) + 3;
  const prefix = "";
  const colorMap = {
    npm: kolorist.green,
    cnpm: kolorist.red,
    yarn: kolorist.blue,
    pnpm: kolorist.yellow
  };
  const currentTip = `current: ${Object.keys(currectRegistry).map((key) => {
    if (currectRegistry[key])
      return `${key}: ${colorMap[key]("\u25A0")}`;
    return "";
  }).filter((i) => i).join(" ")}

`;
  const messages = registryList.map((item) => {
    const currect = Object.keys(currectRegistry).map((key) => {
      if (currectRegistry[key] && item.registry.includes(currectRegistry[key]))
        return colorMap[key]("\u25A0");
      return "";
    }).filter((x) => x);
    const isSame = item.alias === item.name;
    const str = `${prefix}${isSame ? item.alias : `${item.alias}(${kolorist.gray(item.name)})`}${geneDashLine(item.name, length)}${item.registry}`;
    return `${currect.length > 0 ? padding(`${currect.join(" ")}`, 4 - currect.length, 1) : ""} ${padding(str, currect.length > 0 ? 0 : 4, 0)}`;
  });
  messages.unshift(currentTip);
  printMessages(messages);
};

const useUse = async (name, cmd) => {
  const userConfig = await getFileUser(registriesPath);
  let registrylist = defaultNpmMirror;
  let packageManager = "npm";
  if (userConfig && userConfig.registry)
    registrylist = userConfig.registry;
  let useRegistry;
  if (name) {
    useRegistry = registrylist.find((x) => x.alias === name);
  } else {
    const { registry, pkg } = await prompts__default["default"]([
      {
        type: "select",
        name: "registry",
        message: "Pick a registry",
        choices: registrylist.map((x) => {
          return {
            title: `${x.alias}${x.alias === x.name ? "" : `(${x.name})`} ${x.registry}`,
            value: x
          };
        })
      },
      {
        type: "select",
        name: "pkg",
        message: "Pick a packageManager,and you will set registry for it",
        initial: 0,
        choices: defaultPackageManager.map((x) => ({
          title: x,
          value: x
        }))
      }
    ]);
    if (pkg)
      packageManager = pkg;
    if (!registry) {
      log.error("user cancel operation");
      return;
    }
    useRegistry = registry;
  }
  if (!useRegistry)
    return log.error(`${name} not found`);
  if (cmd.packageManager)
    packageManager = cmd.packageManager;
  execCommand(packageManager, [
    "config",
    "set",
    "registry",
    useRegistry.registry
  ]).then(() => {
    log.success(`${packageManager} registry has been set to:  ${useRegistry.registry}`);
  }).catch(() => {
    log.error(`${packageManager} is not found`);
  });
};

const useAdd = async (cmd) => {
  if (cmd.name && cmd.registry) {
    const alias = cmd.alias || cmd.name;
    await insertRegistry(cmd.name, alias, cmd.registry);
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
    return log.error("no registry");
  if (!userConfig.registry)
    return log.error("no registry");
  const useRegistry = userConfig.registry.find((x) => x.alias === name);
  if (!useRegistry)
    return log.error(`${name} not found`);
  for (let i = 0; i < userConfig.registry.length; i++)
    if (userConfig.registry[i].alias === name) {
      log.success(`[delete]: ${userConfig.registry[i].alias}  ${userConfig.registry[i].registry}`);
      userConfig.registry.splice(i, 1);
    }
  await writeFileUser(registriesPath, userConfig);
};

const testRegistry = async (registry) => {
  const start = Date.now();
  const options = {
    timeout: 5e3
  };
  let status = false;
  let isTimeout = false;
  try {
    const response = await fetch__default["default"](registry, {
      ...options
    });
    status = response.ok;
  } catch (error) {
    isTimeout = error.type === "request-timeout";
  }
  return {
    status,
    isTimeout,
    start
  };
};
const useTest = async (cmd) => {
  const registryList = await checkRegistry();
  const test = async (registry2) => {
    const { status, start, isTimeout } = await testRegistry(new URL("", registry2.registry).href);
    if (isTimeout)
      console.log(`
 ${kolorist.red("\u3010Timeout\u3011")} ping ${registry2.alias}${registry2.alias === registry2.name ? "" : `${kolorist.gray(`(${registry2.name})`)}`}\uFF1A${registry2.registry}`);
    if (status) {
      const end = Date.now();
      console.log(`
 ${kolorist.green(`\u3010${end - start}ms\u3011`)} ping ${registry2.alias}${registry2.alias === registry2.name ? "" : `${kolorist.gray(`(${registry2.name})`)}`}\uFF1A${registry2.registry}`);
    }
  };
  if (cmd.all) {
    const list = registryList.map(async (r) => {
      return {
        handle: await test(r)
      };
    });
    for (const iterator of list)
      await iterator;
    return;
  }
  if (cmd.registry) {
    const registry2 = registryList.find((x) => x.alias === cmd.registry || x.name === cmd.registry);
    if (registry2)
      await test(registry2);
    return;
  }
  const { registry } = await prompts__default["default"]([
    {
      type: "select",
      name: "registry",
      message: "Pick a registry",
      choices: registryList.map((x) => {
        return {
          title: `${x.alias}${x.alias === x.name ? "" : `(${x.name})`} ${x.registry}`,
          value: x
        };
      })
    }
  ]);
  await test(registry);
};

const program = cac__default["default"]("gnrm");
program.version(useVersion());
program.command("ls", "\u5F53\u524D\u7528\u6237\u5217\u8868").option("-p, --packageManager <packageManager>", "\u67E5\u770B\u5BF9\u5E94\u5305\u7BA1\u7406\u5668\uFF1A\u9ED8\u8BA4npm").action(useLs);
program.command("use [name]", "\u5207\u6362\u955C\u50CF\u6E90").option("-p, --registry <packageManager>", "\u8BBE\u7F6E\u5BF9\u5E94\u5305\u7BA1\u7406\u5668\uFF1A\u9ED8\u8BA4npm").action(useUse);
program.command("test", "\u5207\u6362\u955C\u50CF\u6E90").option("-r, --registry <registry>", "\u6D4B\u8BD5\u6E90\u540D\u79F0\u6216\u8005\u522B\u540D").option("-a, --all", "\u6D4B\u8BD5\u5B58\u5728\u7684\u955C\u50CF\u6E90").action(useTest);
program.command("add", "\u6DFB\u52A0\u955C\u50CF").option("-n, --name <name>", "\u955C\u50CF\u540D\u79F0").option("-r, --registry <registry>", "\u955C\u50CF\u5730\u5740").option("-a, --alias <alias>", "\u955C\u50CF\u522B\u540D").action(useAdd);
program.command("alias <origin> <target>", "\u955C\u50CF\u6DFB\u52A0\u522B\u540D").action(useAlias);
program.command("delete <name>", "\u5220\u9664\u955C\u50CF").action(useDelete);
program.help();
program.parse(process.argv);
