const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs');
const jsonMock = require('./arquivo.json')
require('dotenv-safe').config({path:'.env'});
const app = express()
const jsonParser = bodyParser.json()
app.use(express.json());

var jwt = require('jsonwebtoken');

// Porta que vai rodar o servidor e uma mensagem para indicar que ligou
app.listen(3000, () => console.log('servidor rodando na porta 3000'))

// Rota para criar o arquivo pela primeira vez
app.post('/register',jsonParser, (req, res) => {
    const treatedValue = validateValues(req);
    res.status(201).send(
        fs.writeFileSync('arquivo.json', treatedValue)
    )
})

// Retorna todos os usuarios
app.get('/getRegister', (req, res) => {
    res.status(200).send(
        fs.readFileSync('arquivo.json')
    )
})

app.post('/login', jsonParser, (req, res, next) => {
    console.log( "asd")
    console.log(req.body)
   
    if(req.body.nome === 'admin' && req.body.password === 'admin123'){
      const id = 1;
      var token = jwt.sign({ id }, process.env.SECRET, {
        expiresIn: 1000 // expires in 5min
      });
      let reqObject =  {
        "name": req.body.nome,
        "password": req.body.password,
        "token":token
    }
      res.status(200)
      res.json({ auth: true, users:[reqObject] });
     
    }else{
        res.status(403)
        res.json({ erro: "error" });
    }
})

app.get('/logout', function(req, res) {
    res.status(200).send({ auth: false, token: null });
});


  


function validateValues(req){
    let jsonLength = Object.keys(jsonMock).length;
    let reqObject =  {
        "name": req.body.name,
        "password": req.body.password,
        
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