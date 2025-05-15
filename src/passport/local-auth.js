const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const transporter = require("../models/nodemailer");


passport.serializeUser((user,done)=>{
    done(null,user.id);
})

passport.deserializeUser(async(id,done)=>{
    const user = await User.findById(id);
    done(null,user)
})

passport.use("local-registro", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
},async(req,email,password,done) => {
    const user = await User.findOne({email:email});
    const emailOption = {
        from: email,
        to: email,
        subject: "Bienvenido a MyDrugs",
        html: "<div style='font-family: system-ui, sans-serif, Arial; font-size: 16px; background-color: #fff8f1;'><div style='max-width: 600px; margin: auto; padding: 16px;'><a style='text-decoration: none; outline: none;' href='[Website Link]' target='_blank' rel='noopener'>&nbsp;</a> <img src='/img/icondrugs-removebg-preview.png' width='51' height='51'><p>&iexcl;Bienvenido a la familia MyDrugs! Nos entusiasma tenerte con nosotros.</p><p>Su cuenta se ha creado correctamente y ahora est&aacute; listo para explorar todas las excelentes funciones que ofrecemos.</p><p>&iquest;Necesitas Ayuda? Marca para recibir atenci&oacute;n profesional</p><table style='border-collapse: collapse; width: 100%; height: 97.6px;' border='1'><colgroup><col style='width: 50%;'><col style='width: 50%;'></colgroup><tbody><tr style='height: 24.4px;'><td>Nombre de Centro de Apoyo</td><td>N&uacute;mero</td></tr><tr style='height: 24.4px;'><td><a href='https://pinardelbosque.com.mx/?gad_source=1&amp;gclid=Cj0KCQiAz6q-BhCfARIsAOezPxkTxq2V-oCXyknzuQh86OqvBulZ98yW78lmkzkROxLDwkZoFBvzfm4aAjG2EALw_wcB' target='_blank' rel='noopener'>Tu recuperaci&oacute;n es posible&nbsp;</a> &nbsp;</td><td>&nbsp;7771936677</td></tr><tr style='height: 24.4px;'><td><a href='https://www.clinicalyr.org/?https://www.clinicalyr.org/&amp;gad_source=1&amp;gclid=Cj0KCQiAz6q-BhCfARIsAOezPxkehg67Gd-UJWK-aZa0qqaABfKEQCfNiqDLqs-7E2IZd26HK4P5gGkaAp10EALw_wcB' target='_blank' rel='noopener'>Ayuda Profesional&nbsp; &nbsp;</a></td><td>&nbsp;5559378548</td></tr><tr style='height: 24.4px;'><td><a href='https://iapa.cdmx.gob.mx/preguntas-frecuentes#:~:text=%C2%BFExiste%20alg%C3%BAn%20lugar%20d%C3%B3nde%20pueden,informaci%C3%B3n%20y%20apoyo%20al%20respecto' target='_blank' rel='noopener'>IAPA&nbsp; &nbsp;&nbsp;</a></td><td>5556583911</td></tr></tbody></table><p><br>Si tiene alguna pregunta o necesita ayuda para comenzar, nuestro equipo de soporte est&aacute; a solo un correo electr&oacute;nico de mydrugs0000@gmail.com . &iexcl;Estamos aqu&iacute; para ayudarle en cada paso de tu proceso!</p><p>Atentamente,<br>El equipo de MyDrugs</p></div></div>"
    };
    
    if(user){
        return done(null,false,req.flash("signupMessage","Ya existe una cuenta con este email"))
    }else{
        const Newuser=new User()
            Newuser.email= email;
            Newuser.password = Newuser.encryptPassword(password);
            Newuser.fecha_inicio = req.body.date;
            Newuser.username = req.body.name;
            Newuser.addiction = req.body.adiccion;
        await Newuser.save();
        done(null,Newuser);
        transporter.sendMail(emailOption, (error, info)=>{
            if(error){
                console.log("Error",error);
            }else{
                console.log("Correo enviado"+info.response);
            }
        })
    }
    
}));

passport.use("local-inicio", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
},async (req,email,password,done)=>{
    const user =await User.findOne({email:email});
    if(!user){
        return done(null,false,req.flash("signinMessage","El Usuario no existe"));
    }
    if(!user.validarPassword(password)){
        return done(null,false,req.flash("signinMessage","Contraseña incorrecta"));
    }
    done(null,user);
}));
