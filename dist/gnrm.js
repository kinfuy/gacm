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

var name = "gacm";
var version = "1.1.5";
var description = "git account manage";
var keywords = [
	"git",
	"account",
	"manage"
];
var license = "MIT";
var author = "alqmc";
var bin = {
	gacm: "gacm.js",
	gnrm: "gnrm.js"
};
var publishConfig = {
	access: "public"
};
var dependencies = {
	commander: "^9.3.0",
	execa: "5.1.1",
	kolorist: "^1.5.1",
	prompts: "^2.4.2"
};
var pkg = {
	name: name,
	version: version,
	"private": false,
	description: description,
	keywords: keywords,
	license: license,
	author: author,
	bin: bin,
	publishConfig: publishConfig,
	dependencies: dependencies
};

const useVersion = async (cmd) => {
  if (cmd.version)
    console.log(`v${pkg.version}`);
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

const insertUser = async (name, email, alias = name) => {
  let userList = await getFileUser(registriesPath);
  if (!userList)
    userList = { version: "", users: [] };
  if (!userList.version)
    userList = transformData(userList);
  if (isExistAlias(userList.users, alias, name, email)) {
    userList.users.forEach((user) => {
      if (user.alias === alias || !user.alias && user.name === alias || name && email && user.name === name && user.email === email) {
        user.alias = alias === name ? user.alias ? user.alias : alias : alias;
        user.email = email;
        user.name = name;
        log.success(`[update]:${alias} ${user.alias !== name ? `(${user.name})` : ""}`);
      }
    });
  } else {
    userList.users.push({
      name,
      email,
      alias
    });
    log.success(`[add]: ${alias} ${alias !== name ? `(${name})` : ""}`);
  }
  await writeFileUser(registriesPath, userList);
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
const isExistAlias = (users, alias, name, email) => {
  return users.some((x) => x.alias === alias || !x.alias && x.name === alias || name && email && x.name === name && x.email === email);
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

const useDelete = async (name) => {
  const userList = await getFileUser(registriesPath);
  if (!userList)
    return log.error(`no user`);
  const useUser = userList.users.filter((x) => x.alias === name || !x.alias && x.name === name);
  if (useUser.length === 0)
    return log.error(`${name} not found`);
  for (let i = 0; i < userList.users.length; i++) {
    if (!userList.users[i].alias && userList.users[i].name === name || userList.users[i].alias === name) {
      log.success(`[delete]: ${userList.users[i].alias}${userList.users[i].alias !== userList.users[i].name ? `(${userList.users[i].name})` : ""}`);
      userList.users.splice(i, 1);
    }
  }
  await writeFileUser(registriesPath, userList);
};

const useAdd = async (cmd) => {
  if (cmd.name && cmd.email) {
    await insertUser(cmd.name, cmd.email, cmd.alias);
  }
};

const useAlias = async (origin, target) => {
  if (!origin || !target)
    return;
  let userList = await getFileUser(registriesPath);
  if (!userList)
    userList = { version: "", users: [] };
  let changed = false;
  userList.users.forEach((x) => {
    if (x.alias === origin) {
      if (userList && !isExistAlias(userList?.users, target)) {
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
  await writeFileUser(registriesPath, userList);
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
  let registry = defaultNpmMirror;
  if (userConfig && userConfig.registry)
    registry = userConfig.registry;
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
  const length = Math.max(...registry.map((x) => {
    return x.alias.length + (x.alias !== x.name ? x.name.length : 0);
  })) + 3;
  const prefix = "  ";
  const messages = registry.map((item) => {
    const currect = item.registry === currectRegistry ? `${kolorist.green("*")}` : "";
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
  log.success(`${packageManager} registry changed :${useRegistry.alias}${useRegistry.alias !== useRegistry.name ? `(${useRegistry.name})` : ""}`);
};

const program = new commander.Command();
program.option("-v, --version", "\u67E5\u770B\u5F53\u524D\u7248\u672C").usage("command <option>").description("\u67E5\u770B\u5F53\u524D\u7248\u672C").action(useVersion);
program.command("ls").option("-p, --packageManager <packageManager>", "\u5305\u7BA1\u7406\u5668").description("\u5F53\u524D\u7528\u6237\u5217\u8868").action(useLs);
program.command("use [name...]").option("-p, --packageManager <packageManager>", "\u5305\u7BA1\u7406\u5668").description("\u5207\u6362\u955C\u50CF\u6E90").action(useUse);
program.command("add").option("-n, --name <name>", "\u7528\u6237\u540D\u79F0").option("-e, --email <email>", "\u7528\u6237\u90AE\u7BB1").option("-a, --alias <alias>", "\u7528\u6237\u522B\u540D").description("\u6DFB\u52A0\u7528\u6237").action(useAdd);
program.command("alias <origin> <target>").description("\u6DFB\u52A0\u522B\u540D").action(useAlias);
program.command("delete <name>").description("\u5220\u9664\u7528\u6237").action(useDelete);
program.parse(process.argv);
