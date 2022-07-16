#!/usr/bin/env node
'use strict';

var commander = require('commander');
var kolorist = require('kolorist');
var path = require('path');
var fs = require('fs');
var child_process = require('child_process');
var process$1 = require('process');
var execa = require('execa');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var execa__default = /*#__PURE__*/_interopDefaultLegacy(execa);

var name = "gacm";
var version$1 = "1.0.1";
var description = "git account manage";
var keywords = [
	"git",
	"account",
	"manage"
];
var license = "MIT";
var author = "alqmc";
var bin = {
	gacm: "main.js"
};
var publishConfig = {
	access: "public"
};
var dependencies = {
	commander: "^9.3.0",
	execa: "5.0.1",
	kolorist: "^1.5.1",
	minimist: "^1.2.6"
};
var pkg = {
	name: name,
	version: version$1,
	"private": false,
	description: description,
	keywords: keywords,
	license: license,
	author: author,
	bin: bin,
	publishConfig: publishConfig,
	dependencies: dependencies
};

const success = (msg) => console.log(kolorist.green(msg));
const error = (msg) => console.log(kolorist.red(msg));
const warning = (msg) => console.log(kolorist.lightYellow(msg));
const info = (msg) => console.log(kolorist.blue(msg));
const log = {
  success,
  error,
  warning,
  info
};

const version = async () => {
  log.success(`${pkg.version}`);
};

const baseAction = async (cmd) => {
  if (cmd.version)
    await version();
};

const rootPath = __dirname;
__dirname;
path.resolve(rootPath, "package");
const HOME = process.env[process.platform === "win32" ? "USERPROFILE" : "HOME"] || "";
const registriesPath = path.join(HOME, ".gacmrc");

const { readFile, writeFile } = fs.promises;
const getFileUser = async (rootPath) => {
  if (fs.existsSync(rootPath)) {
    const fileBuffer = await readFile(rootPath, "utf-8");
    const userList = fileBuffer ? JSON.parse(fileBuffer.toString()) : null;
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

const useAction = async (name, cmd) => {
  let userList = await getFileUser(registriesPath);
  if (!userList)
    return log.error(`${name} not found`);
  if (!userList.version)
    userList = transformData(userList);
  if (userList.users.every((x) => x.name !== name && x.alias !== name))
    return log.error(`${name} not found`);
  const useUser = userList.users.filter((x) => x.alias === name || x.name === name);
  let env = "local";
  if (cmd.system)
    env = "system";
  if (cmd.global)
    env = "global";
  if (cmd.local)
    env = "local";
  await run(`git config --${env} user.name ${useUser[0].name}`);
  await run(`git config --${env} user.email ${useUser[0].email}`);
  log.success(`
   git user changed [${env}]:${useUser[0].alias && `(${useUser[0].alias})`}${useUser[0].name}
`);
};
const lsAction = async () => {
  let userList = await getFileUser(registriesPath) || {};
  const currectUser = await execCommand("git", ["config", "user.name"]);
  const currectEmail = await execCommand("git", ["config", "user.email"]);
  if (!userList.version)
    userList = transformData(userList);
  if (userList.users.length === 0 && (!currectUser || !currectEmail)) {
    return log.info("no user");
  }
  if (!userList.users.some((x) => x.name === currectUser) && currectUser && currectEmail) {
    await insertUser(currectUser, currectEmail);
    log.info(`[found new user]: ${currectUser}`);
    userList.users.push({
      name: currectUser,
      email: currectEmail,
      alias: ""
    });
  }
  const length = Math.max(...userList.users.map((user) => user.name.length + (user.alias ? user.alias.length : 0))) + 3;
  const prefix = "  ";
  const messages = userList.users.map((user) => {
    const currect = user.name === currectUser && user.email === currectEmail ? `${kolorist.green("*")}` : "";
    return `${prefix + currect + user.name}${user.alias && `(${user.alias})`}${geneDashLine(user.name, length)}${user.email}`;
  });
  printMessages(messages);
};
const addAction = async (cmd) => {
  if (cmd.name && cmd.email) {
    await insertUser(cmd.name, cmd.email, cmd.alias);
  }
};
const deleteAction = async (name, { alias }) => {
  let userList = await getFileUser(registriesPath);
  if (!userList)
    return log.error(`no user`);
  if (!userList.version)
    userList = transformData(userList);
  const useUser = userList.users.filter((x) => x.name === name || alias && x.alias === name);
  if (useUser.length === 0)
    return log.error(`${name} not found`);
  for (let i = 0; i < userList.users.length; i++) {
    if (alias && userList.users[i].alias === name) {
      log.success(`[delete]: ${userList.users[i].alias && `(${userList.users[i].alias})`}${userList.users[i].name}`);
      userList.users.splice(i, 1);
    } else if (userList.users[i].name === name) {
      if (!userList.users[i].alias) {
        log.success(`[delete]: ${userList.users[i].alias && `(${userList.users[i].alias})`}${userList.users[i].name}`);
        userList.users.splice(i, 1);
      } else {
        log.error(`${name} has alias, please use gacm delete <alias> -a to delete`);
      }
    }
  }
  await writeFileUser(registriesPath, userList);
};
const aliasAction = async (origin, target, { alias }) => {
  if (!origin || !target)
    return;
  let userList = await getFileUser(registriesPath);
  if (!userList)
    userList = { version: version$1, users: [] };
  if (!userList.version)
    userList = transformData(userList);
  let changed = false;
  userList.users.forEach((x) => {
    if (alias) {
      if (x.alias === origin) {
        if (userList && !isExistAlias(userList.users, target)) {
          x.alias = target;
          log.success(`[update]:(${origin}=>${x.alias}) ${x.name}`);
        } else {
          log.error(`${target} is Exist, please enter another one `);
        }
        changed = true;
      }
    } else {
      if (x.name === origin) {
        if (!x.alias) {
          if (userList && !isExistAlias(userList.users, target)) {
            x.alias = target;
            log.success(`[update]:(${origin}=>${x.alias}) ${x.name}`);
          } else {
            log.error(`${target} is Exist, please enter another one `);
          }
        } else {
          log.error(`${x.name} has alias, please use gacm alias <alias> <target> -a to alias`);
        }
        changed = true;
      }
    }
  });
  if (!changed)
    return log.error(`${origin} not found`);
  await writeFileUser(registriesPath, userList);
};
const insertUser = async (name, email, alias = "") => {
  let userList = await getFileUser(registriesPath);
  if (!userList)
    userList = { version: version$1, users: [] };
  if (!userList.version)
    userList = transformData(userList);
  if (isExist(userList.users, name, email, alias)) {
    userList.users.forEach((user) => {
      if (user.name === name && user.email === email || !alias && !user.alias && user.name === name || alias && user.alias === alias) {
        user.alias = alias || user.alias;
        user.email = email;
        user.name = name;
        log.success(`[update]:${user.alias && `(${user.alias})`} ${name}`);
      }
    });
  } else {
    userList.users.push({
      name,
      email,
      alias
    });
    log.success(`[add]:${alias && `(${alias})`} ${name}`);
  }
  userList.users.filter((x) => {
    return userList && userList.users.filter((y) => x.name === y.name && x.email === y.email).length === 1;
  });
  userList.users = uniqueFunc(userList.users, (item) => {
    return `${item.name + item.email}`;
  });
  await writeFileUser(registriesPath, userList);
};
const transformData = (data) => {
  const userInfo = { version: version$1, users: [] };
  Object.keys(data).forEach((x) => {
    userInfo.users.push({
      name: data[x].name,
      email: data[x].email,
      alias: ""
    });
  });
  return userInfo;
};
const isExist = (users, name, email, alias) => {
  return users.some((x) => x.name === name && x.email === email || !alias && !x.alias && x.name === name || alias && x.alias === alias);
};
const isExistAlias = (users, alias) => {
  return users.some((x) => x.alias === alias);
};
const uniqueFunc = (arr, uniId) => {
  const res = /* @__PURE__ */ new Map();
  return arr.filter((item) => !res.has(uniId(item)) && res.set(uniId(item), 1));
};

const program = new commander.Command();
program.option("-v, --version", "\u67E5\u770B\u5F53\u524D\u7248\u672C").usage("command <option>").description("\u67E5\u770B\u5F53\u524D\u7248\u672C").action(baseAction);
program.command("ls").description("\u5F53\u524D\u7528\u6237\u5217\u8868").action(lsAction);
program.command("use <name>").option("-l, --local", "\u5F53\u524D\u7528\u6237").option("-g, --global", "\u5168\u5C40\u7528\u6237").option("-s, --system", "\u7CFB\u7EDF\u7528\u6237").description("\u5207\u6362\u7528\u6237").action(useAction);
program.command("add").option("-n, --name <name>", "\u7528\u6237\u540D\u79F0").option("-e, --email <email>", "\u7528\u6237\u90AE\u7BB1").option("-a, --alias <alias>", "\u7528\u6237\u522B\u540D").description("\u6DFB\u52A0\u7528\u6237").action(addAction);
program.command("alias <origin> <target>").option("-a, --alias", "\u662F\u5426\u6709\u522B\u540D").description("\u6DFB\u52A0\u522B\u540D").action(aliasAction);
program.command("delete <name>").option("-a, --alias", "\u6309\u7167\u522B\u540D\u5220\u9664").description("\u5220\u9664\u7528\u6237").action(deleteAction);
program.parse(process.argv);
