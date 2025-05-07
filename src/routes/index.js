const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const crypto=require("crypto");
const transporter = require("../models/nodemailer");

router.get("/", (req,res,next)=>{
    res.render("index")
});


router.get("/registro", (req,res,next)=>{
    res.render("registro")
});

router.post("/registro", passport.authenticate("local-registro", {
    successRedirect: "/perfil",
    failureRedirect: "/registro",
    passReqToCallback: true
}))

router.get("/login", (req,res,next)=>{
    res.render("login")
});

router.post("/login",passport.authenticate("local-inicio",{
    successRedirect: "/perfil",
    failureRedirect: "/login",
    passReqToCallback: true
}));

router.get("/restablecer", (req,res,next)=>{
    res.render("restablecer");
});

router.get("/CIJ",(req,res,next)=>{
    res.render("cij");
})

router.get("/logout",(req,res,next)=>{
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
})

router.get("/perfil",isAuthenticated, (req,res,next)=>{
    if (!req.user) {
        return res.redirect("/login");
    }
    res.render("perfil", { user: req.user }); 
});

router.get("/contador/:userId", async(req,res)=>{
    const user = await User.findById(req.params.userId);

    if(!user || !user.fecha_inicio){
        return res.json({dias:0, horas:0, minutos:0, segundos:0});
    }

    const inicio = new Date(user.fecha_inicio);
    const ahora = new Date();
    const diferencia = ahora-inicio;

    const años = Math.floor(diferencia / (1000 * 60 * 60 * 24 * 365));
    const meses = Math.floor((diferencia % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30.44));
    const dias = Math.floor((diferencia % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia%(1000*60*60*24)) / (1000*60*60));
    const minutos = Math.floor((diferencia%(1000*60*60)) / (1000*60));
    const segundos = Math.floor((diferencia%(1000*60)) / 1000);
    res.json({años,meses,dias,horas,minutos,segundos})
})

router.post("/restablecer", async(req,res)=>{
    const email=req.body.email;
    const user = await User.findOne({email:email});
    if(!user){
        return done(null, false, req.flash("errorMessage", "El usuario no existe"));
    }
    const token = crypto.randomBytes(20).toString("hex");
    const encodedToken = encodeURIComponent(token);
    user.token = token;

    await user.save();

    const emailOption = {
        from: email,
        to: email,
        subject: "Bienvenido a MyDrugs",
        html: `<p>Hola</p> <br> <a href='http://localhost:3000/restablecer/${encodedToken}'>Restablecer</a>`
    };

    transporter.sendMail(emailOption, (error, info,res) => {
        if (error) {
            console.error("Error enviando correo:", error);
            return done(error);
        } else {
            console.log("Correo enviado:", info.response);
            return done(null, user);
        }
    });
    res.redirect("/login")
})

router.get("/restablecer/:token", async (req,res)=>{
    const { token } = req.params;
    const user = await User.findOne({token:token});
    if(user.length===0){
        return res.status(404).send("Token inválido o no encontrado");
    }
    const email = user.email;
    res.send(`
<header id="Header">
    <img src="/img/logo.png" alt="Logo" class="logo">
    <input type="checkbox" id="menu"/>
</header>

<form action="/cambiar" method="post">
    <h2>Restablecer contraseña</h2>
    
    <label for="user_pass">Ingresa una nueva contraseña:</label>
    <input type="password" name="contrasena" id="contrasena" required>
    
    <button type="submit" class="btn">Enviar</button>
    
    <input type="hidden" name="token" value="${token}">
    <input type="hidden" name="correo" value="${email}">
</form>

<style>
    form {
        padding: 50px;
        display: flex;
        flex-direction: column;
        width: 400px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
        border-radius: 15px;
        background-color: #eeeeee;
        margin: auto;
        margin-top: 150px;
    }

    h2 {
        text-align: center;
        font-size: 30px;
        text-transform: uppercase;
        color: #2e2e2e;
        margin-bottom: 25px;
        font-family: "montserrat-black";
    }

    label {
        font-size: 22px;
        color: #575757;
        padding: 20px;
    }

    input {
        padding: 17px 11px;
        border: 1px solid #56ae72;
        border-radius: 25px;
        margin-bottom: 25px;
        background-color: #ffffff;
        outline: none;
        color: #000000;
        font-size: 20px;
        font-family: "montserrat-regular";
    }

    .btn {
        border-radius: 25px;
        padding: 17px 11px;
        border: 1px solid #00adef;
        background-color: #56ae72;
        font-size: 20px;
        color: #ffffff;
        text-transform: uppercase;
        cursor: pointer;
    }

    .btn:hover {
        background-color: #a772bb;
    }

    .crear {
        display: flex;
        justify-content: space-between;
        margin-bottom: 25px;
    }

    header {
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 5%;
        height: 100px;
        background-color: #000000;
    }

    .logo {
        height: 100px;
    }

    .menu {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .item a {
        margin: 0 15px;
        font-size: 18px;
        font-weight: 600;
        cursor: pointer;
        color: #F2F2F2;
        list-style: none;
    }

    .item a:hover {
        color: #FF2258;
    }

    #menu {
        display: none;
    }

    .menu-icono {
        width: 25px;
    }

    @media (max-width:991px) {
        input {
            font-size: 22px;
        }
        
        .menu {
            padding: 30px;
            margin: 0;
        }

        label {
            display: initial;
            font-size: 25px;
        }

`);
})

router.post("/cambiar", async(req,res)=>{
    const email = req.body.correo;
    const password = req.body.contrasena;
    const user = await User.findOne({email:email});

    if(!user){
        console.log("Usuario no encontrado en la base de datos.");
        return res.status(404).send("Usuario no encontrado");
    }

    user.password=user.encryptPassword(password);
    await user.save();

    const emailOption={
        from:email,
        to:email,
        subject:"Cambio",
        html:"<p>Cambio de contraseña</p>"
    };

    transporter.sendMail(emailOption, (error, info)=>{ 
        if(error){
            console.log("Error",error);
        }else{
            console.log("Correo enviado"+info.response);
            res.redirect("/login");
        }
    });
})


function isAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

module.exports=router;