const port = 3085;
const jwtOption = {
    jwtSecretKey: 'iAmsecret',
    expiresIn: "7d"
}


module.exports = {
    port: port,
    jwtOption: jwtOption
};