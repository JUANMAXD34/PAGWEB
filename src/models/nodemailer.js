const correo= require("nodemailer");

const transporter= correo.createTransport({
    service:"gmail",
    auth:{
        user:"mydrugs0000@gmail.com",
        pass:"ojuo ksdc aych lxlf"
    }
});

module.exports= transporter;