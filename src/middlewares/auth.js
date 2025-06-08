const config = require('../config')

const checkAuthentication = async (ctx, next) => {
    if(ctx.session.isAuthenticated){
        return ctx.redirect(config.APP_SUB_PATH_REDIR+'/apps')
    }
    await next()
}

const isAuthenticated = async (ctx, next) => {
    if(!ctx.session.isAuthenticated){
        return ctx.redirect(config.APP_SUB_PATH_REDIR+'/login')
    }
    await next()
}

module.exports = {
    isAuthenticated,
    checkAuthentication,
};