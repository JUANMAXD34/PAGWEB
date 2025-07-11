const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const crypto=require("crypto");
const transporter = require("../models/nodemailer");
const user = require("../models/user");

router.get("/", (req,res,next)=>{
    res.render("index")
});

router.get("/Nosotros",(req,res,next)=>{
    res.render("nosotros")
})

router.get("/marihuana", (req,res,next)=>{
    res.render("tipos-marihuana");
})

router.get("/alcohol", (req,res,next)=>{
    res.render("tipos-alcohol");
})
router.get("/cocaina", (req,res,next)=>{
    res.render("tipos-cocaina");
})
router.get("/metanfetamina", (req,res,next)=>{
    res.render("tipos-metanfetamina");
})
router.get("/tabaco", (req,res,next)=>{
    res.render("tipos-tabaco");
})
router.get("/centros", (req,res,next)=>{
    res.render("tipos-centros");
})
router.get("/otros", (req,res,next)=>{
    res.render("tipos-otros");
})
router.get("/cuidado", (req,res,next)=>{
    res.render("tipos-cuidado");
})

router.get("/registro",sesion, (req,res,next)=>{
    res.render("registro")
});

router.post("/registro", passport.authenticate("local-registro", {
    successRedirect: "/perfil",
    failureRedirect: "/registro",
    passReqToCallback: true
}))

router.get("/login",sesion,(req,res,next)=>{
    res.render("login")
});

router.post("/login",passport.authenticate("local-inicio",{
    successRedirect: "/perfil",
    failureRedirect: "/login",
    passReqToCallback: true
}));

router.get("/restablecer",sesion, (req,res,next)=>{
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
    const horas = Math.floor(((diferencia % (1000 * 60 * 60 * 24)) - (6 * 60 * 60 * 1000) + (1000 * 60 * 60 * 24)) % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));    
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
        subject: "Restablecer Contraseña",
        html: `<html lang='es'>
                <body>
                    <div style='font-family: system-ui, sans-serif, Arial; font-size: 14px; color: #333; padding: 20px 14px; background-color: #f5f5f5;'>
                        <div style='max-width: 600px; margin: auto; background-color: #fff;'>
                            <div style='text-align: center; background-color: #333; padding: 14px;'>
                                <a style='text-decoration: none; outline: none;' href='http://localhost:3000' target='_blank' rel='noopener'>
                                    <img style='height: 32px; vertical-align: middle;' src='https://i.imgur.com/jl2rWdt.png' alt='logo' height='32px'>
                                </a>
                            </div>
                            <div style='padding: 14px;'>
                                <h1 style='font-size: 22px; margin-bottom: 26px;'>Ha solicitado un cambio de contraseña</h1>
                                    <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Para continuar, haga clic en el botón enlace a continuación para crear una nueva contraseña:</p>
                                    <p><a href='http://192.168.135.199:3000/restablecer/${encodedToken}'>Restablecer</a></p>
                                    <p>Si no solicitaste este restablecimiento de contraseña, ignora este correo electrónico o háznoslo saber inmediatamente. Tu cuenta permanece segura.</p>
                                    <p>Saludos cordiales,<br>MyDrugs.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>`
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
    if(!user){
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
    user.token=null;
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

router.post("/reinicio", async (req, res) => {
    const user = await User.findById(req.user._id);
    
    if (!user) {
        return res.status(404).send("User not found");
    }
    const fecha = new Date(req.body.date)
    user.fecha_inicio = fecha;
    await user.save();
    res.redirect("/perfil");
});

router.get("/crud", async (req, res) => {
    const users = await User.find();
    res.render("crud", { users }); 
});

router.post("/update/:id", async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, {
        email: req.body.correo,
        username: req.body.nombre,
        addiction: req.body.adiccion,
        fecha_inicio: req.body.fechaInicio
    });
    res.redirect("/crud");
});

router.post("/delete/:id", async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/crud");
});





function isAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

function sesion(req,res,next){
    if(!req.user){
        return next();
    }
    res.redirect("/perfil")
}

module.exports=router;