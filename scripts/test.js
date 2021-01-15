const clUtils = require('./cl-utils');
module.exports = async callback => {
    console.log(2)
    const accountAddr = await clUtils.getCookies();
    console.log(3)
}