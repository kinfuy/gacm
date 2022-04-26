#!/usr/bin/env node
'use strict';

var commander = require('commander');
var util = require('util');
var chalk = require('chalk');
var path = require('path');
var fs = require('fs');
var child_process = require('child_process');
var process$1 = require('process');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);

var name = "gacm";
var version$1 = "0.0.3";
var description = "gacm";
var scripts = {
	build: "gulp --require sucrase/register/ts --gulpfile build/gulpfile.ts",
	clear: "rimraf dist",
	link: "npm link",
	push: "git push gitee master && git push githup master",
	"update:version": "sucrase-node build/utils/version.ts",
	log: "conventional-changelog -p custom-config  -i CHANGELOG.md -s -n ./changelog-option.js"
};
var bin = {
	gacm: "./dist/main.js"
};
var author = "alqmc";
var license = "MIT";
var devDependencies = {
	"@alqmc/eslint-config": "^0.0.3",
	"@commitlint/cli": "^8.3.5",
	"@commitlint/config-angular": "^8.3.4",
	"@commitlint/config-conventional": "^16.2.1",
	"@rollup/plugin-commonjs": "^21.0.3",
	"@rollup/plugin-json": "^4.1.0",
	"@rollup/plugin-node-resolve": "^13.1.3",
	"@rollup/plugin-typescript": "^8.3.1",
	"@types/fs-extra": "^9.0.13",
	"@types/gulp": "^4.0.9",
	"@types/inquirer": "^8.2.0",
	"@types/inquirer-autocomplete-prompt": "^1.3.3",
	"@types/node": "^17.0.21",
	commitizen: "^4.1.2",
	"compare-func": "^2.0.0",
	"conventional-changelog-cli": "^2.0.34",
	"conventional-changelog-custom-config": "^0.3.1",
	"cz-conventional-changelog": "^3.2.0",
	"fs-extra": "^10.1.0",
	gulp: "^4.0.2",
	husky: "^4.2.5",
	"lint-staged": "^10.3.0",
	prettier: "^2.6.2",
	rimraf: "^3.0.2",
	rollup: "^2.70.1",
	"rollup-plugin-typescript2": "^0.31.2",
	sucrase: "^3.20.3",
	tslib: "^2.4.0",
	typescript: "^4.6.3"
};
var dependencies = {
	chalk: "4.1.2",
	commander: "^9.1.0",
	figlet: "^1.5.2",
	inquirer: "^8.2.1",
	ora: "^5.1.0"
};
var config = {
	commitizen: {
		path: "./node_modules/cz-conventional-changelog"
	}
};
var pkg = {
	name: name,
	version: version$1,
	description: description,
	scripts: scripts,
	bin: bin,
	author: author,
	license: license,
	devDependencies: devDependencies,
	dependencies: dependencies,
	config: config
};

/* eslint-disable no-console */
const { green, red, yellowBright, blueBright } = chalk__default["default"];
const success = (msg) => console.log(green(msg));
const error = (msg) => console.log(red(msg));
const warning = (msg) => console.log(yellowBright(msg));
const info = (msg) => console.log(blueBright(msg));
const log = {
    success,
    error,
    warning,
    info,
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const figlet = util.promisify(require('figlet'));
const version = async () => {
    const info = await figlet(`${pkg.name}`);
    log.success(`${info}  ${pkg.version}`);
};

const baseAction = async (cmd) => {
    if (cmd.version)
        await version();
};

// 基于打包后的路径 dist
const rootPath = __dirname;
const outputPath = __dirname;
path.resolve(rootPath, 'package');
const registriesPath = path.resolve(outputPath, 'registries.json');

const { readFile, writeFile } = fs.promises;
/**
 * 获取用户
 * @param path
 * @returns
 */
const getFileUser = async (rootPath) => {
    const fileBuffer = await readFile(rootPath, 'utf-8');
    const userList = fileBuffer
        ? JSON.parse(fileBuffer.toString())
        : null;
    return userList;
};
/**
 * 将shell写入文件
 * @param dir
 * @param data
 */
async function writeFileUser(dir, data) {
    writeFile(dir, JSON.stringify(data, null, 4)).catch((error) => {
        log.error(error);
        process.exit(0);
    });
}

// run shell
const run = (command, dir = process$1.cwd()) => {
    const [cmd, ...args] = command.split(' ');
    return new Promise((resolve, reject) => {
        const app = child_process.spawn(cmd, args, {
            cwd: dir,
            stdio: 'inherit',
            shell: process.platform === 'win32',
        });
        const processExit = () => app.kill('SIGHUP');
        app.on('close', (code) => {
            process.removeListener('exit', processExit);
            if (code === 0)
                resolve();
            else
                reject(new Error(`command failed: \n command:${cmd} \n code:${code}`));
        });
        process.on('exit', processExit);
    });
};

/* eslint-disable no-console */
const geneDashLine = (message, length) => {
    const finalMessage = new Array(Math.max(2, length - message.length + 2)).join('-');
    return padding(chalk__default["default"].dim(finalMessage));
};
const padding = (message = '', before = 1, after = 1) => {
    return (new Array(before).fill(' ').join(' ') +
        message +
        new Array(after).fill(' ').join(' '));
};
const printMessages = (messages) => {
    console.log('\n');
    for (const message of messages) {
        console.log(message);
    }
    console.log('\n');
};

/* eslint-disable no-console */
const useAction = async (name, cmd) => {
    const userList = await getFileUser(registriesPath);
    if (!userList)
        return;
    let env = 'local';
    if (cmd.system)
        env = 'system';
    if (cmd.global)
        env = 'global';
    if (cmd.local)
        env = 'local';
    await run(`git config --${env} user.name ${userList[name].name}`);
    await run(`git config --${env} user.email ${userList[name].email}`);
    log.success(`\n   git user changed [${env}]:${userList[name].name}\n`);
};
const lsAction = async () => {
    const userList = await getFileUser(registriesPath);
    if (!userList)
        return log.info('no user');
    if (Object.keys(userList).length === 0)
        return log.info('no user');
    const keys = Object.keys(userList);
    const length = Math.max(...keys.map((key) => key.length)) + 3;
    const prefix = '  ';
    const messages = keys.map((key) => {
        const registry = userList[key];
        return prefix + registry.name + geneDashLine(key, length) + registry.email;
    });
    printMessages(messages);
};
const addAction = async (cmd) => {
    let userList = await getFileUser(registriesPath);
    if (!userList)
        userList = {};
    userList[cmd.name] = {
        name: cmd.name,
        email: cmd.email,
    };
    await writeFileUser(path.resolve(outputPath, `registries.json`), userList);
    log.success(`[add]: ${cmd.name}`);
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

const program = new commander.Command();
program
    .option('-v, --version', '查看当前版本')
    .usage('command <option>')
    .description('template-node-cli')
    .action(baseAction);
program.command('ls').description('当前用户列表').action(lsAction);
program
    .command('use <name>')
    .option('-l, --local', '当前用户')
    .option('-g, --global', '全局用户')
    .option('-s, --system', '系统用户')
    .description('切换用户')
    .action(useAction);
program
    .command('add')
    .option('-n, --name <name>', '当前用户')
    .option('-e, --email <email>', '全局用户')
    .description('添加用户')
    .action(addAction);
program.command('delete <name>').description('删除用户').action(deleteAction);
program.parse(process.argv);
