#!/usr/bin/env node

const config = require('./config')
const { setEnvDataSync } = require('./utils/env.util')
const { generateRandomString } = require('./utils/random.util')
const path = require('path');
const serve = require('koa-static');
const render = require('koa-ejs');
const koaBody = require('koa-body');
const session = require('koa-session');
const Koa = require('koa');
const mount = require('koa-mount');

// Init Application

if(!config.APP_USERNAME || !config.APP_PASSWORD){
    console.log("You must first setup admin user. Run command -> npm run setup-admin-user")
    process.exit(2)
}

if(!config.APP_SESSION_SECRET){
    const randomString = generateRandomString()
    setEnvDataSync(config.APP_DIR, { APP_SESSION_SECRET: randomString})
    config.APP_SESSION_SECRET = randomString
}

// Create App Instance
const app = new Koa();

// App Settings
app.proxy = true;
app.keys = [config.APP_SESSION_SECRET];

// Middlewares
app.use(session(app));

app.use(koaBody());

app.use(serve(path.join(__dirname, 'public')));

const router = require("./routes");

// Mount the router to the app in the given sub-path if any:
app.use(mount(config.APP_SUB_PATH_REDIR, router.routes()));
// app.use(router.routes());

app.subpath = config.APP_SUB_PATH_REDIR;

render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'base',
    viewExt: 'html',
    cache: false,
    debug: false,
    locals: {
        subpath: function() { return config.APP_SUB_PATH_REDIR },
    }
});

app.listen(config.PORT, config.HOST, ()=>{
    console.log(`Application started at http://${config.HOST}:${config.PORT}${config.APP_SUB_PATH_REDIR}`)
    console.log(`Running from directory: ${config.APP_SUB_PATH_REDIR}`)
})

