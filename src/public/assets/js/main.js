async function pm2AppAction(appName, action){
    await fetch(`${SUB_PATH}/api/apps/${appName}/${action}`, { method: 'POST'})
    location.reload();
}