FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 5000
EXPOSE 6000

CMD ["node", "index.js"]
# The only difference is the port number and the command to run the server. 
#  Now, let’s build the Docker images for both APIs. 
#  $ docker build -t graphql-api ./graphql-api