const parser = require('./parser')
const lexer = require('./lexer')

const parse = text => parser(text.split('\n').map((text, idx) => lexer(text, idx)))

module.exports = parse

