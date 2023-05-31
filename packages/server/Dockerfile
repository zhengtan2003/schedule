FROM node:16-alpine

WORKDIR /app/server

# 复制 package.json 和 package-lock.json 文件到容器中
COPY /package*.json ./

# 安装项目依赖
RUN npm install --production

# 复制整个项目目录到容器中
COPY dist/ ./dist

# 暴露应用程序端口
EXPOSE 3000

# 定义启动命令
CMD ["npm", "run", "start:prod"]
