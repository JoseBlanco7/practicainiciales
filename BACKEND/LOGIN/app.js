//1. Invocar express
const express = require('express');
const app = express();

const router = express.Router();

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
app.get('/coment', (req, res)=>{
    connection.query('SELECT * FROM coments', (error, results) =>{
        if (error){
            throw error;    
        } else {
            res.render('coments', {results:results});
        }
    });
})

//crear publicaciones
app.get('/create', (req, res) =>{
    res.render('create');
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
//14 perfiles
app.get('/perfiles', (req, res)=>{
    res.render('perfiles');
}) 


app.listen(3000, (req, res)=>{
    console.log("listening on http://localhost:3000/inicio")
})  