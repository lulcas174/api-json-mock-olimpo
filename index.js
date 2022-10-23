const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs');
const jsonMock = require('./arquivo.json')
const app = express()
const jsonParser = bodyParser.json()

// Porta que vai rodar o servidor e uma mensagem para indicar que ligou
app.listen(3000, () => console.log('servidor rodando na porta 3000'))

// Rota para criar o arquivo pela primeira vez
app.post('/register',jsonParser, (req, res) => {
    const treatedValue = validateValues(req);
    res.status(201).send(
        fs.writeFileSync('arquivo.json', treatedValue)
    )
})

app.get('/getRegister', (req, res) => {
    res.status(200).send(
        fs.readFileSync('arquivo.json')
    )
})


function validateValues(req){
    let jsonLength = Object.keys(jsonMock).length;
    let reqObject =  {
        "name": req.body.name,
        "password": req.body.password
        }
    if(jsonLength === 0){
        let objeto = {
            users:[reqObject]
        }
    
        return JSON.stringify(objeto)
    } else {
        jsonMock.users.push(reqObject)
        return JSON.stringify(jsonMock)
    }

}