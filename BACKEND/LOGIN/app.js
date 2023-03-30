//1. Invocar express
const express = require('express');
const app = express();

//2. Setear urlencodede para capturar los datos del formulario
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//3. Invocar a dotenv
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});

//4. Setear el directorio public
app.use('/resources', express.static('public'));
app.use('/resource', express.static(__dirname + '/public'));

//5. Establecer el motor de plantillas
app.set('view engine', 'ejs')

//6. Invocar a bcryptjs
const bcryptjs = require('bcryptjs');

//7. Variable de sesion
const session = require('express-session');
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));

//8. Invocar al módulo de conexion de la base de datos
const connection = require('./database/db');

//9. Estableciendo rutas 
//ruta1

//ruta2  
app.get('/login', (req, res)=>{
    res.render('login');
})  
//ruta3  
app.get('/register', (req, res)=>{
    res.render('register');
})  

//10. para registrar

app.post("/register", async (req, res)=>{
    const user = req.body.user;
    const name = req.body.name;
    const apellido = req.body.apellido;
    const correo = req.body.correo;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    connection.query("INSERT INTO users SET ?", {user:user, name:name, apellido:apellido, correo:correo, pass:passwordHaash}, async (error, results)=>{
        if(error){
            console.log(error);
        }else{
            res.render("register",{
                alert: true,
                alertTitle: "SE REGISTRO CON EXITO",
                alertMessage: "¡BUEN TRABAJO!",
                alertIcon: "success",
                showConfirmButton:false,
                timer:1500,
                ruta: ""

            })
        }
    })
})

//11. login autenticacion
app.post("/auth", async (req, res) =>{
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass,  8);
    if(user && pass){
       connection.query("SELECT * FROM users WHERE user = ?", [user], async (error, results)=>{
            if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))){
                 res.render('login',{
                    alert: true,
                    alertTitle: "ERROR",
                    alertMessage: "USUARIO O CONTRASEÑA INCORRECTOS",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: false,
                    ruta : 'login'
                 });
            }else{
                req.session.loggedin =true;
                req.session.name = results[0].name
                res.render("login",{
                    alert: true,
                    alertTitle: "CONEXION EXITOSA",
                    alertMessage: "LOGIN CORRECTO",
                    alertIcon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta : "inicio"
                 });
            }
       })
    }else{
        res.render("login",{
            alert: true,
            alertTitle: "Advertencia",
            alertMessage: "AGREGAR USUARIO O CONTRASEÑA",
            alertIcon: "warning",
            showConfirmButton: false,
            timer: 1500,
            ruta : "login"
         });
    }
}) 

//12 auth pages
app.get('/inicio',(req, res)=>{
    if(req.session.loggedin){
        res.render('index',{
            login: true,
            name: req.session.name
        });
    }else{
        res.render('index', {
            login: false,
            name: 'debe iniciar sesion'
        })
    }
})     
     
//13 logout
app.get('/logout',(req, res)=>{
    req.session.destroy(()=>{
        res.redirect('/login')
    });
})
//14 rutaperfiles
app.get('/perfil', (req, res)=>{
    res.render('perfil');
}) 

//15 registro perfiles
app.post("/perfil", async (req, res)=>{
    const Nombre = req.body.Nombre;
    const Edad = req.body.Edad;
    const CursoAP = req.body.CursoAP;
    const Carrera = req.body.Carrera;
    const Estado = req.body.Estado;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    connection.query("INSERT INTO perfiles SET ?", {Nombre:Nombre, Edad:Edad, CursoAP:CursoAP, Carrera:Carrera, Estado:Estado, pass:passwordHaash}, async (error, results)=>{
        if(error){
            console.log(error);
        }else{
            res.render("perfil",{  
                alert: true,
                alertTitle: "SE REGISTRO CON EXITO",
                alertMessage: "¡BUEN TRABAJO!",
                alertIcon: "success",
                showConfirmButton:false,
                timer:1500,
                ruta: ""

            })
        }
    })
})

//16 rutaverperfil
app.get('/verperfil', (req, res)=>{
    res.render('verperfil');
})

//17 autentificacion de perfiles
app.post("/autth", async (req, res) =>{
    const Nombre = req.body.Nombre;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass,  8);
    if(Nombre && pass){
       connection.query("SELECT * FROM perfiles WHERE Nombre = ?", [Nombre], async (error, results)=>{
            if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))){
                 res.render('verperfil',{
                    alert: true,
                    alertTitle: "ERROR",
                    alertMessage: "USUARIO O CONTRASEÑA INCORRECTOS",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: false,
                    ruta : 'verperfil'
                 });
            }else{
                req.session.loggedin =true;
                req.session.Nombre = results[0].Nombre
                req.session.Edad = results[0].Edad
                req.session.CursoAP = results[0].CursoAP
                req.session.Carrera = results[0].Carrera
                req.session.Estado = results[0].Estado
                res.render("verperfil",{
                    alert: true,
                    alertTitle: "CONEXION EXITOSA",
                    alertMessage: "LOGIN CORRECTO",
                    alertIcon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta : "perfilees"
                 });
            }
       })
    }else{
        res.render("verperfil",{
            alert: true,
            alertTitle: "Advertencia",
            alertMessage: "AGREGAR USUARIO O CONTRASEÑA",
            alertIcon: "warning",
            showConfirmButton: false,
            timer: 1500,
            ruta : "verperfil"
         });
    }
}) 


//autentificacion de nombre
app.get('/perfilees',(req, res)=>{
    if(req.session.loggedin){
        res.render('perfilees',{
            verperfil: true,
            Nombre: req.session.Nombre,
            Edad: req.session.Edad,
            CursoAP: req.session.CursoAP,
            Carrera: req.session.Carrera,
            Estado: req.session.Estado
        });
    } 
})   
//autentificacion de edad
app.get('/perfilees',(req, res)=>{
    if(req.session.loggedin){
        res.render('perfilees',{
            verperfil: true,
            Edad: req.session.Edad
        });
    } 
})   
 

app.listen(3000, (req, res)=>{
    console.log("listening on http://localhost:3000/inicio")
})   