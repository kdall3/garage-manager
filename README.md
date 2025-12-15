# Setup
## Install dependencies
Make sure node is installed, then run `npm install` to install dependencies

## Add .env file
Add a .env file to the root directory with format:
```.env
SESSION_SECRET='{random string of 128 characters}'
DB_HOST=
DB_NAME=
DB_PORT=
DB_USER=
DB_PASSWORD=
```

You can generate a random string of 128 characters by running the following in any shell:
```shell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Run
Run the server in dev mode by running `npm run dev` in the terminal.
Run the server in prod mode by running `npm run build` and then `npm run start` in the terminal.

Webhook Test