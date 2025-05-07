const fs = require('fs')
const express = require('express')
const { v4: uuidv4 } = require('uuid')
const dados = []
const app = express()
const PORT = 8000


function writeFile(obj) {
    try {
        fs.appendFileSync('logs.txt', JSON.stringify(obj) + '\n');
    } catch {
        console.error("Erro ao escrever no arquivo");
    }
}

function createNewDados(name) {
    let id = uuidv4()
    const data = new Date().toISOString().replace("T", "-").slice(0, 19)
    const nome = name
    try {
        const conteudo = fs.readFileSync('logs.txt', 'utf-8');
        if (conteudo.includes(id)) {
            return
        }
    } catch (err) {
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

app.get('/logs', (req, res) => {
    res.status(200).send(dados)
    console.log("dados pegos:\n", dados)
})

app.get('/logs/:id', (req, res) => {
    const { id } = req.params;
    const dado = dados.find(item => item.ID === id);
    if (dado) {
        return res.status(200).json(dado);
    } else {
        return res.status(404).send('Usuário não encontrado');
        
    }
});


app.post('/logs', (req, res) => {
    dado = createNewDados("Joao")
    res.status(201).send(dado)
    console.log("Criado com sucesso")
})

app.listen(PORT, () => {
    console.log("Servidor online")
})