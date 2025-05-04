FROM node
WORKDIR /code
EXPOSE 5444
EXPOSE 3000
COPY package.json /code/package.json
COPY package-lock.json /code/package-lock.json
RUN npm install
CMD ["npm","run","start"]
COPY . /code