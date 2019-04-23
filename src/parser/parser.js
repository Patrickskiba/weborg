const parser = text => {
    const ast = []

    const getLastEntry = arr => {
        if (arr.length === 0) return { children: [] }
        return arr[arr.length - 1]
    }


    const findPlacement = (line, node) => {
        if(line.level === 1) return node.push(line)

        const lastEntry = getLastEntry(node)

        if(lastEntry.level === line.level) return node.push(line)

        if(lastEntry.level > line.level) return node.push(line)

        if(lastEntry.children.length === 0) return lastEntry.children.push(line)

        if(lastEntry.level < line.level) return findPlacement(line, lastEntry.children)

    }

    text.forEach(line => { 
        if(ast.length === 0) return ast.push(line)

        return findPlacement(line, ast)
    })
    
    return ast
}

module.exports = parser
