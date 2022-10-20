#!/usr/bin/env node
'use strict';

var commander = require('commander');
var kolorist = require('kolorist');
var path = require('path');
var fs = require('fs');
var child_process = require('child_process');
var process$1 = require('process');
var execa = require('execa');
var prompts = require('prompts');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var execa__default = /*#__PURE__*/_interopDefaultLegacy(execa);
var prompts__default = /*#__PURE__*/_interopDefaultLegacy(prompts);

var name = "gacm";
var version = "1.1.3";
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

const useVersion = async (cmd) => {
  if (cmd.version)
    console.log(pkg.version);
};

const rootPath = __dirname;
__dirname;
path.resolve(rootPath, "package");
const HOME = process.env[process.platform === "win32" ? "USERPROFILE" : "HOME"] || "";
const registriesPath = path.join(HOME, ".gacmrc");

const PREFIX = "[gacm]:";
const success = (msg) => console.log(`
${kolorist.green(PREFIX + msg)}
`);
const error = (msg) => console.log(`
${kolorist.red(PREFIX + msg)}
`);
const warning = (msg) => console.log(`
${kolorist.yellow(PREFIX + msg)}
`);
const info = (msg) => console.log(`
${kolorist.blue(PREFIX + msg)}
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

const useLs = async () => {
  const userList = await getFileUser(registriesPath) || {};
  const currectUser = await execCommand("git", ["config", "user.name"]);
  const currectEmail = await execCommand("git", ["config", "user.email"]);
  if (userList.users.length === 0 && (!currectUser || !currectEmail)) {
    return log.info("no user");
  }
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
    const currect = user.name === currectUser && user.email === currectEmail ? `${kolorist.green("*")}` : "";
    const isSame = user.alias === user.name;
    return `${prefix + currect}${isSame ? user.alias : `${user.alias}(${kolorist.gray(user.name)})`}${geneDashLine(user.name, length)}${user.email}`;
  });
  printMessages(messages);
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

const useUse = async ([name], cmd) => {
  const userList = await getFileUser(registriesPath);
  if (!userList)
    return log.error(`no user exists`);
  let useUser = void 0;
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
      log.error(`user cancels operation`);
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

const program = new commander.Command();
program.option("-v, --version", "\u67E5\u770B\u5F53\u524D\u7248\u672C").usage("command <option>").description("\u67E5\u770B\u5F53\u524D\u7248\u672C").action(useVersion);
program.command("ls").description("\u5F53\u524D\u7528\u6237\u5217\u8868").action(useLs);
program.command("use [name...]").option("-l, --local", "\u5F53\u524D\u7528\u6237").option("-g, --global", "\u5168\u5C40\u7528\u6237").option("-s, --system", "\u7CFB\u7EDF\u7528\u6237").description("\u5207\u6362\u7528\u6237").action(useUse);
program.command("add").option("-n, --name <name>", "\u7528\u6237\u540D\u79F0").option("-e, --email <email>", "\u7528\u6237\u90AE\u7BB1").option("-a, --alias <alias>", "\u7528\u6237\u522B\u540D").description("\u6DFB\u52A0\u7528\u6237").action(useAdd);
program.command("alias <origin> <target>").description("\u6DFB\u52A0\u522B\u540D").action(useAlias);
program.command("delete <name>").description("\u5220\u9664\u7528\u6237").action(useDelete);
program.parse(process.argv);
