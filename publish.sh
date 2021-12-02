#!/usr/bin/env bash
set -e
npm config get registry
# 登陆输入自己的npm账号和密码，还有邮箱
echo '登录'
npm login
echo "发布中..."
npm publish

echo -e "\n发布成功\n"
exit
