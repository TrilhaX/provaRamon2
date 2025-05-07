const { error } = require('console')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const dados = []

function writeFile(content) {
    try {
        fs.writeFileSync('logs.txt', content, { flag: 'a' })
        fs.readFileSync('logs.txt', 'utf-8', (err, data) => {
            console.log(data)
        })
    } catch {
        console.error("Erro")
    }
}

function createNewDados(name) {
    let id = uuidv4()
    let data = Date.now()
    data = new Date(data)
    const nome = name
    dados.push({
        ID: id,
        Data: data,
        Nome: nome
    })
    writeFile(JSON.stringify(dados))
}
createNewDados("João")