const fs = require('fs')
const express = require('express')
const { v4: uuidv4 } = require('uuid')
const { get } = require('http')
const dados = []
const app = express()
app.use(express.json());
const PORT = 8000

function writeFile(linha, registro) {
    try {
        fs.writeFileSync('logs.txt', linha, 'utf8');
        return registro
    } catch (err) {
        console.error('Erro ao escrever no arquivo', err);
        return
    }
}

function getDados() {
    const id = uuidv4();
    const dataNow = new Date();
    const data = dataNow.toISOString().replace('T', ' ').slice(0, 19);
    return { id, data };
}

function createNewDados(name) {
    const { id, data } = getDados();
    const logString = `${id} - ${data} - ${name}`;
    const logObject = { ID: id, Data: data, Nome: name };
    return { logString, logObject };
}

function registerDados(name) {
    const { logString, logObject } = createNewDados(name);
    writeFile(logString);
    dados.push(logObject);
    return logObject;
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
    const { nome } = req.body;
    if (!nome) {
        return res.status(400).json({ erro: 'Campo "nome" é obrigatório' });
    }
    const log = registerDados(nome);
    if (!log) {
        return res.status(500).json({ erro: 'Erro ao registrar o log' });
    }
    console.log('Log criado:', log);
    res.status(201).json(log);
});

app.listen(PORT, () => {
    console.log("Servidor online")
})