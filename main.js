const fs = require('fs')
const express = require('express')
const { v4: uuidv4 } = require('uuid')
const dados = []
const app = express()
const PORT = 8000

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
    const data = new Date().toISOString().replace("T", " ").slice(0, 19)
    const nome = name
    try {
        const conteudo = fs.readFileSync('logs.txt', 'utf-8');
        if (conteudo.includes(id)){
            return
        }
    }catch (err){
        console.error(err)
    }
    const novosDados = {
        ID: id,
        Data: data,
        Nome: nome
    }
    dados.push(novosDados)
    writeFile(JSON.stringify(dados))
}
createNewDados("Joao")

app.get()

app.listen(PORT, () => {
    console.log("Servidor online")
})