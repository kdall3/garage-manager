# Setup
## Install dependencies
Make sure node is installed, then run `npm install` to install dependencies

## Add .env file
Add a .env file to the root directory with format:
```.env
SESSION_SECRET = '{random string of 128 characters}'
```

You can generate a random string of 128 characters by running the following in any shell:
```shell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Run
Run the server by running `npm run devStart` in the terminal.
