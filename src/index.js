const express = require("express");
const engine = require("ejs-mate");
const path = require("path");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");

//Inicializacion
const app = express();
require("./database");
require("./passport/local-auth");

//Configuracion
app.set("views", path.join(__dirname,"views"));
app.engine("ejs",engine);
app.use(express.static("public"));
app.set("view engine","ejs");
app.set('port',process.env.PORT || 3000)

//Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(session({
    secret: 'maisicret',
    resave:false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
    app.locals.signupMessage=req.flash("signupMessage");
    app.locals.signinMessage=req.flash("signinMessage");
    app.locals.errorMessage=req.flash("errorMessage");
    next();
})
//Rutas
app.use("/",require("./routes/index"))

//Empezando el servidor
app.listen(app.get('port'),()=>{
    console.log("Servidor en el Puerto", app.get('port'))
})

