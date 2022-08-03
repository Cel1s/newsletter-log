//const's de pacotes instalados
const express = require("express");
//const https = require("https");
//const request = require("request");
const https = require("https");
//nova instância do Express
const app = express();
//necessário para usar filer locais como imagens e css
app.use('/public', express.static('public'));
//fazendo o app usar o express; necessário para ser usando junto com o post, retornando a resposta do usuário
app.use(express.urlencoded({extended:true}));


app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
//data objeto
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    }
//data jason
    const jsonData = JSON.stringify(data);
    const url = "https://us9.api.mailchimp.com/3.0/lists/bad4a52fec"
    const options = {
        method: "POST",
        auth: "arnold1:64ccc65bff7c9c8f1b3c725062071d96-us9"
    }
//apenas uma solicitação sem o caminho especificado p o servidor da api
    const request = https.request(url, options, function(response){
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/sucess.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })
    //solicitação p o sevidor da api especificando o caminho
    request.write(jsonData);
    request.end();
});
//API KEY
// 64ccc65bff7c9c8f1b3c725062071d96-us9

//API ID
//bad4a52fec
//solicitação para a pagina de formulario inicial, caso o envio do email caia na pagina de falha
app.post("/failure", function(req, res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000.");
});