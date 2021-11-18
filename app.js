// import Express from "express";
// import cors from "cors";
// import methodOverride  from "method-override";
// import axios from "axios";
// import path from"path";

const Express= require("express");
const cors= require("cors");
const path= require("path");
const methodOverride =require("method-override");

const app= Express();
const log= console.log;
let port = process.env.PORT || 3000;
let users=[ {email:"ro@ro", name :"rodrigo", password:"123456789"},
            {email:"pa@pa", name :"pablo", password:"123456789"},
            {email:"ju@ju", name :"juan", password:"123456789"} 
        ];

app.use(cors());
app.use(Express.json());
app.use(Express.urlencoded({extended:true}))
app.use(methodOverride());



app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"/views/index.html"))
})

//aca pido el arreglo de usuarios de juan
// app.get("/getUsers",(req,res)=>{
//     clienteHTTP.get("/users")
//     .then(response=>{users.push(response)})
//     .catch(error=>{log(error)})
    
//     res.send("usuarios agregados")
// })

//aca pido todos los usuarios
app.get("/users",(req,res)=>{
    res.send(users)
})
//pido un usuario por 1 mail
app.get("/user/:mail",(req,res)=>{
    let mail= req.params.mail;
    users.forEach(user => {
        if(user.email==mail){
            res.send(user)
        }
    });
    res.send("no se encontro el usuario")
})

app.get("/usersEmail/:email",(req,res)=>{
    let email= req.params.email;
    let arrayEmail=email.split(",");

    let response=[];

    arrayEmail.forEach((email)=>{
        users.forEach((user)=>{
            if(user.email==email){
                response.push(user)
            }
        })
    })
    res.send(response);
})
//obtengo usuarios por nombre mediante query
app.get("/users/name",(req,res)=>{
    let arrayNombre= req.query.nombre;
    let resul=[];
    arrayNombre.forEach((nombre)=>{
        users.forEach((element)=>{
            if(nombre== element.name){
                resul.push(element)
            }
        })
    })
    res.send(resul)
})
//por formulario
app.post("/users/name",(req,res)=>{
    let email= req.body.email;
    let nombre= req.body.nombre;
    let pass= req.body.pass;

    let user={"email":email, "name":nombre, "password":pass};
    users.forEach((element)=>{
        if(user.email==element.email)
            res.send("este mail ya existe")
    })
    users.push(user);
    res.send("usuario creado");
})

app.delete("/user/delete/:mail",(req,res)=>{
    let mail= req.params.mail;
    users= users.filter((elemento)=>elemento.email!=mail) 
    res.send("usuario eliminado")
})

app.delete("/user/delete",(req,res)=>{
    let mail= req.query.mail;
    mail.forEach(para=>{   
        users= users.filter((elemento)=>elemento.email!=para) 
    })
    res.send("usuarios eliminado")
})

app.get("/update",(req,res)=>{

    res.sendFile(path.join(__dirname,"/views/update.html"))
})

app.post("/user/update",(req,res)=>{
    let email= req.body.email;
    let nombre= req.body.nombre;
    let pass= req.body.pass;
    let leng=users.length
    for(let i=0;i<leng;i++){
        if(users[i].email==email){
            users[i].name=nombre;
            users[i].password=pass
        }
    }
    res.send("el usuario fue actualizado")

})

app.listen(port,()=>{
    log("start server")
})