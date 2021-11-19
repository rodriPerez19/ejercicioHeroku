// import Express from "express";
// import cors from "cors";
// import methodOverride  from "method-override";
// import axios from "axios";
// import path from"path";

const Express= require("express");
const cors= require("cors");
const path= require("path");
const methodOverride =require("method-override");
const multer = require("multer")

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



const multerConfig= multer.diskStorage({
    destination:function(res,file,cb){
        cb(null,"./bucket")// aca puede ser cualquier nombre de carpeta, esta es la carpeta de destino
    },
    filename:function(res,file,cb){
        let idImage=uuid().split("-")[0];//con esto genero un id random
        let day= dayjs().format('DD-MM-YYYY') //esto me da la fecha en el formato q le indico
        cb(null,`${day}.${idImage}.${file.originalname}`);//el file originalname, me toma el nombre q tiene el archivos en mi computadora
                                                    //es decir yo tengo una img llamada auto.jpg, me lo guarda con ese nombre tb en mi carpeta
    },
});

const multerMiddle =multer({storage:multerConfig})

app.post("/registro/usuario",multerMiddle.single("imgFile"),(req,res)=>{
    let nombre= req.body.nombre;
    let mail= req.body.email;
    let pass= req.body.pass;

    let user={"email":mail, "name":nombre, "password":pass};
    users.push(user);
    if(req.file){
        res.send("usuario guardado")
    }
    else{
        res.send("error al crear un usuario, falta imagen")
    }
})

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
