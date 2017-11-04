const esprima = require('esprima');
const readline = require('readline');

const CYAN = '\x1b[36m';
const RESET = '\x1b[0m'
let source = '';

readline.createInterface({ input: process.stdin, terminal: false })
.on('line', line => { source += line + '\n' })
.on('close', () => {
    const tokens = esprima.tokenize(source, { range: true });
    const ids = tokens.filter(x => x.type === 'Identifier');
    const markers = ids.sort((a, b) => { return b.range[0] - a.range[0] });
    markers.forEach(t => {
        const id = CYAN + t.value + RESET;
        const start = t.range[0];
        const end = t.range[1];
        source = source.slice(0, start) + id + source.slice(end);
    });
    console.log(source);
});