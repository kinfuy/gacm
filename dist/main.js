#!/usr/bin/env node
'use strict';

var commander = require('commander');
var chalk = require('kolorist');
var path = require('path');
var fs = require('fs');
var child_process = require('child_process');
var process$1 = require('process');
var execa = require('execa');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
var execa__default = /*#__PURE__*/_interopDefaultLegacy(execa);

var name = "gacm";
var version$1 = "0.0.7";
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
	commander: "^2.4.2",
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

const { green, red, lightYellow, blue } = chalk__default["default"];
const success = (msg) => console.log(green(msg));
const error = (msg) => console.log(red(msg));
const warning = (msg) => console.log(lightYellow(msg));
const info = (msg) => console.log(blue(msg));
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
const outputPath = __dirname;
path.resolve(rootPath, "package");
const registriesPath = path.resolve(outputPath, "registries.json");

const { readFile, writeFile } = fs.promises;
const getFileUser = async (rootPath) => {
  const fileBuffer = await readFile(rootPath, "utf-8");
  const userList = fileBuffer ? JSON.parse(fileBuffer.toString()) : null;
  return userList;
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
  return padding(chalk.white(finalMessage));
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
  const userList = await getFileUser(registriesPath);
  if (!userList)
    return;
  if (!userList[name])
    return log.error(`${name} not found`);
  let env = "local";
  if (cmd.system)
    env = "system";
  if (cmd.global)
    env = "global";
  if (cmd.local)
    env = "local";
  await run(`git config --${env} user.name ${userList[name].name}`);
  await run(`git config --${env} user.email ${userList[name].email}`);
  log.success(`
   git user changed [${env}]:${userList[name].name}
`);
};
const lsAction = async () => {
  const userList = await getFileUser(registriesPath);
  if (!userList)
    return log.info("no user");
  if (Object.keys(userList).length === 0)
    return log.info("no user");
  const keys = Object.keys(userList);
  const length = Math.max(...keys.map((key) => key.length)) + 3;
  const prefix = "  ";
  const currectUser = await execCommand("git", ["config", "user.name"]);
  const currectEmail = await execCommand("git", ["config", "user.email"]);
  if (!keys.includes(currectUser) && currectUser && currectEmail) {
    await insertUser(currectUser, currectEmail);
    log.success(`[found new user]: ${currectUser}`);
    keys.push(currectUser);
    userList[currectUser] = {
      name: currectUser,
      email: currectEmail
    };
  }
  const messages = keys.map((key) => {
    const registry = userList[key];
    const currect = registry.name === currectUser ? `${chalk.green("*")}` : "";
    return prefix + currect + registry.name + geneDashLine(key, length) + registry.email;
  });
  printMessages(messages);
};
const addAction = async (cmd) => {
  if (cmd.name && cmd.email) {
    await insertUser(cmd.name, cmd.email);
    log.success(`[add]: ${cmd.name}`);
  }
};
const deleteAction = async (name) => {
  const userList = await getFileUser(registriesPath);
  if (!userList)
    return log.error(`no user`);
  if (!userList[name])
    return log.error(`${name} not found`);
  delete userList[name];
  await writeFileUser(path.resolve(outputPath, `registries.json`), userList);
  log.success(`[delete]: ${name}`);
};
const insertUser = async (name, email) => {
  let userList = await getFileUser(registriesPath);
  if (!userList)
    userList = {};
  userList[name] = {
    name,
    email
  };
  await writeFileUser(path.resolve(outputPath, `registries.json`), userList);
};

const program = new commander.Command();
program.option("-v, --version", "\u67E5\u770B\u5F53\u524D\u7248\u672C").usage("command <option>").description("template-node-cli").action(baseAction);
program.command("ls").description("\u5F53\u524D\u7528\u6237\u5217\u8868").action(lsAction);
program.command("use <name>").option("-l, --local", "\u5F53\u524D\u7528\u6237").option("-g, --global", "\u5168\u5C40\u7528\u6237").option("-s, --system", "\u7CFB\u7EDF\u7528\u6237").description("\u5207\u6362\u7528\u6237").action(useAction);
program.command("add").option("-n, --name <name>", "\u5F53\u524D\u7528\u6237").option("-e, --email <email>", "\u5168\u5C40\u7528\u6237").description("\u6DFB\u52A0\u7528\u6237").action(addAction);
program.command("delete <name>").description("\u5220\u9664\u7528\u6237").action(deleteAction);
program.parse(process.argv);
