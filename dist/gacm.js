#!/usr/bin/env node
'use strict';

var cac = require('cac');
var kolorist = require('kolorist');
var path = require('path');
var fs = require('fs');
var child_process = require('child_process');
var process$1 = require('process');
var execa = require('execa');
var prompts = require('prompts');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var cac__default = /*#__PURE__*/_interopDefaultLegacy(cac);
var execa__default = /*#__PURE__*/_interopDefaultLegacy(execa);
var prompts__default = /*#__PURE__*/_interopDefaultLegacy(prompts);

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

const run = (command, dir = process$1.cwd()) => {
  const [cmd, ...args] = command.split(" ");
  return new Promise((resolve, reject) => {
    const app = child_process.spawn(cmd, args, {
      cwd: dir,
      stdio: "inherit",
      shell: process.platform === "win32"
    });
    const processExit = () => app.kill("SIGHUP");
    app.on("close", (code) => {
      process.removeListener("exit", processExit);
      if (code === 0)
        resolve();
      else
        reject(new Error(`command failed: 
 command:${cmd} 
 code:${code}`));
    });
    process.on("exit", processExit);
  });
};
const execCommand = async (cmd, args) => {
  const res = await execa__default["default"](cmd, args);
  return res.stdout.trim();
};

var name$1 = "gacm";
var version$1 = "1.2.8";
var description$1 = "gacm";
var author$1 = "alqmc";
var license$1 = "MIT";
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
var dependencies$1 = {
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
var pkg$1 = {
	name: name$1,
	version: version$1,
	description: description$1,
	author: author$1,
	license: license$1,
	scripts: scripts,
	dependencies: dependencies$1,
	devDependencies: devDependencies
};

const isExistAlias = (users, alias, name, email) => {
  return users.some((x) => x.alias === alias || !x.alias && x.name === alias || name && email && x.name === name && x.email === email);
};
const insertUser = async (name, email, alias = name) => {
  let userConfig = await getFileUser(registriesPath);
  if (!userConfig)
    userConfig = {
      version: pkg$1.version,
      users: [],
      registry: []
    };
  if (!userConfig.version)
    userConfig = transformData(userConfig);
  if (isExistAlias(userConfig.users, alias, name, email)) {
    userConfig.users.forEach((user) => {
      if (user.alias === alias || !user.alias && user.name === alias || name && email && user.name === name && user.email === email) {
        user.alias = alias === name ? user.alias ? user.alias : alias : alias;
        user.email = email;
        user.name = name;
        log.success(`[update]:${alias} ${user.alias !== name ? `(${user.name})` : ""}`);
      }
    });
  } else {
    userConfig.users.push({
      name,
      email,
      alias
    });
    log.success(`[add]: ${alias} ${alias !== name ? `(${name})` : ""}`);
  }
  await writeFileUser(registriesPath, userConfig);
};

var name = "gacm";
var version = "1.2.8";
var description = "git account manage";
var author = "alqmc";
var license = "MIT";
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
var dependencies = {
	cac: "^6.7.14",
	execa: "5.1.1",
	kolorist: "^1.5.1",
	"node-fetch": "2.6.6",
	prompts: "^2.4.2"
};
var pkg = {
	name: name,
	version: version,
	"private": false,
	description: description,
	author: author,
	license: license,
	keywords: keywords,
	bin: bin,
	publishConfig: publishConfig,
	dependencies: dependencies
};

const useLs = async () => {
  const userList = await getFileUser(registriesPath) || { version: pkg.version, users: [], registry: [] };
  const currectUser = await execCommand("git", ["config", "user.name"]).catch(() => {
  });
  const currectEmail = await execCommand("git", ["config", "user.email"]).catch(() => {
  });
  if (userList.users.length === 0 && (!currectUser || !currectEmail))
    return log.info("no user");
  if (!userList.users.some((x) => x.name === currectUser) && currectUser && currectEmail) {
    await insertUser(currectUser, currectEmail);
    log.info(`[found new user]: ${currectUser}`);
    userList.users.push({
      name: currectUser,
      email: currectEmail,
      alias: currectUser
    });
  }
  const length = Math.max(...userList.users.map((user) => user.alias.length + (user.alias !== user.name ? user.name.length : 0))) + 3;
  const prefix = "  ";
  const messages = userList.users.map((user) => {
    const currect = user.name === currectUser && user.email === currectEmail ? `${kolorist.green("*")}` : " ";
    const isSame = user.alias === user.name;
    return `${prefix + currect}${isSame ? user.alias : `${user.alias}(${kolorist.gray(user.name)})`}${geneDashLine(user.name, length)}${user.email}`;
  });
  printMessages(messages);
};

const useDelete = async (name) => {
  const userList = await getFileUser(registriesPath);
  if (!userList)
    return log.error("no user");
  const useUser = userList.users.find((x) => x.alias === name || !x.alias && x.name === name);
  if (!useUser)
    return log.error(`${name} not found`);
  for (let i = 0; i < userList.users.length; i++)
    if (!userList.users[i].alias && userList.users[i].name === name || userList.users[i].alias === name) {
      log.success(`[delete]: ${userList.users[i].alias}${userList.users[i].alias !== userList.users[i].name ? `(${userList.users[i].name})` : ""}`);
      userList.users.splice(i, 1);
    }
  await writeFileUser(registriesPath, userList);
};

const useAdd = async (cmd) => {
  if (cmd.name && cmd.email)
    await insertUser(cmd.name, cmd.email, cmd.alias);
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

const useUse = async (name, cmd) => {
  const userList = await getFileUser(registriesPath);
  if (!userList)
    return log.error("no user exists");
  let useUser;
  if (name) {
    useUser = userList.users.find((x) => x.alias === name);
  } else {
    const { user } = await prompts__default["default"]({
      type: "select",
      name: "user",
      message: "Pick a account",
      choices: userList.users.map((x) => {
        return {
          title: `${x.alias}${x.alias === x.name ? "" : `(${x.name})`} ${x.email}`,
          value: x
        };
      })
    });
    if (!user) {
      log.error("user cancel operation");
      return;
    }
    useUser = user;
  }
  if (!useUser)
    return log.error(`${name} not found`);
  let env = "local";
  if (cmd.system)
    env = "system";
  if (cmd.global)
    env = "global";
  if (cmd.local)
    env = "local";
  await run(`git config --${env} user.name ${useUser.name}`);
  await run(`git config --${env} user.email ${useUser.email}`);
  log.success(`git user changed [${env}]:${useUser.alias}${useUser.alias !== useUser.name ? `(${useUser.name})` : ""}`);
};

const useVersion = () => {
  return pkg.version;
};

const program = cac__default["default"]("gacm");
program.version(useVersion());
program.command("ls", "\u5F53\u524D\u7528\u6237\u5217\u8868").action(useLs);
program.command("use [name]", "\u5207\u6362\u7528\u6237").option("-l, --local", "\u5F53\u524D\u7528\u6237").option("-g, --global", "\u5168\u5C40\u7528\u6237").option("-s, --system", "\u7CFB\u7EDF\u7528\u6237").action(useUse);
program.command("add", "\u6DFB\u52A0\u7528\u6237").option("-n, --name <name>", "\u7528\u6237\u540D\u79F0").option("-e, --email <email>", "\u7528\u6237\u90AE\u7BB1").option("-a, --alias <alias>", "\u7528\u6237\u522B\u540D").action(useAdd);
program.command("alias <origin> <target>", "\u6DFB\u52A0\u522B\u540D").action(useAlias);
program.command("delete <name>", "\u5220\u9664\u7528\u6237").action(useDelete);
program.help();
program.parse(process.argv);
