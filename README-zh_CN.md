<p align="center">
  <img width="300px" src="./package/assets/git.svg">
</p>

<p align="center">
  <a href="https://www.npmjs.org/package/gacm">
  <img src="https://img.shields.io/npm/v/gacm.svg">
  </a>
  <a href="https://npmcharts.com/compare/gacm?minimal=true">
  <img src="https://img.shields.io/npm/dm/gacm.svg?color=357C3C">
  </a>
  <a href="https://npmcharts.com/compare/gacm?minimal=true">
  <img src="https://img.shields.io/npm/l/gacm.svg?color=blue">
  </a>
  <a href="https://github.com/alqmc/gacm" target="__blank"><img alt="GitHub stars" src="https://img.shields.io/github/stars/alqmc/gacm?style=social">
  
  </a>
  <br>
</p>

<p align="center"> 极简的git账号管理工具（Git Account Management Tools ）</p>

简体中文 | [English](./README.md)

### Features

- ✨ git账户无缝切换

- 🚀 极简的操作方式，just like nvm

- 😊 gacm ls 自动添加本地git账户


### Getting Started

```
pnpm add gacm -g

yarn add gacm -g

npm install gacm -g

```

### Usage


```shell
## just like nvm

## 查看用户列表，会自动添加本地用户
gacm ls


## 切换git账户
gacm use xxx ---local  

gacm use xxx ---global


## 添加用户，--alias 可选  定义用户别名
gacm add --name xxx --email xxx --alias xxx

## 定义用户别名
gacm alias xxxx xxxx

## 删除用户
gacm delate user

```
### License

MIT License © 2022 [阿乐去买菜（alqmc）](https://github.com/alqmc)



