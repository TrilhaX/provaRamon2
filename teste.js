const fs = require('fs');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = 8000;
app.use(express.json());

function writeLog(name) {
    const id = uuidv4();
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const linha = `${id}, ${now}, ${name}\n`;

    try {
        fs.appendFileSync('logs.txt', linha, 'utf8');
        return { ID: id, Data: now, Nome: name };
    } catch (err) {
        console.error('Erro ao escrever no arquivo', err);
        return null;
    }
}

app.post('/logs', (req, res) => {
    const { nome } = req.body;

    if (!nome) {
        return res.status(400).json({ erro: 'Campo "nome" é obrigatório' });
    }

    const log = writeLog(nome);
    if (!log) {
        return res.status(500).json({ erro: 'Erro ao registrar o log' });
    }

    console.log('Log criado:', log);
    res.status(201).json(log);
});

app.get('/logs', (req, res) => {
    fs.readFile('logs.txt', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ erro: 'Erro ao ler os logs' });
        }

        const linhas = data.trim().split('\n').map(line => {
            const [ID, Data, Nome] = line.split(', ');
            return { ID, Data, Nome };
        });

        res.status(200).json(linhas);
    });
});

app.get('/logs/:id', (req, res) => {
    const { id } = req.params;

    fs.readFile('logs.txt', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ erro: 'Erro ao ler os logs' });
        }

        const linha = data.split('\n').find(line => line.startsWith(id));
        if (!linha) {
            return res.status(404).json({ erro: 'Log não encontrado' });
        }

        const [ID, Data, Nome] = linha.split(', ');
        res.status(200).json({ ID, Data, Nome });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});