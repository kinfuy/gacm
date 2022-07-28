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

<p align="center"> Git Account Management Tools</p>

English | [简体中文](./README-zh_CN.md)

### Features

- ✨ Seamless switching of GIT account

- 🚀Minimalist operation，just like nvm

- 😊 gacm ls Automatically add local git account


### Getting Started

```
pnpm add gacm -g

yarn add gacm -g

npm install gacm -g

```

### Usage


```shell
## just like nvm

## View the user list, and local users will be automatically added
gacm ls


## Switch git account
gacm use xxx ---local  

gacm use xxx ---global


## Add user，--alias Optional  define user alias
gacm add --name xxx --email xxx --alias xxx

## Define user alias
gacm alias xxxx xxxx

## Delete user
gacm delate user

```
### License

MIT License © 2022 [阿乐去买菜（alqmc）](https://github.com/alqmc)



