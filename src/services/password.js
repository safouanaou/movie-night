const argon = require('argon2');


async function hashPass(password){

        const hash = await argon.hash(password);
        return hash;
 
}

async function verifyPass(hash, password){

    const isCorrect = await argon.verify(hash, password);
    return isCorrect;
}

module.exports = { hashPass, verifyPass};