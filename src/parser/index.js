const parser = require('./parser')
const lexer = require('./lexer')

const parse = text => parser(text.split('\n').map(text => lexer(text)))

module.exports = parse

