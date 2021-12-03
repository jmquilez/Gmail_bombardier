const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const passport = require('passport');
const multa = require('multer');
var nodemailer = require('nodemailer');
const LocalStrategy = require('passport-local').Strategy;
const customStrat = require('passport-custom').Strategy;
const Users = require('../models/User');
const path = require('path');
const fs = require('fs');
const upload = multa({
    storage: multa.memoryStorage(),
    limits: {
        fileSize: 30 * 1024 * 1024,
    },
});
//require('../test/la')
const { google } = require('googleapis');

const CLIENT_ID = "<CLIENT_ID>";
const CLIENT_SECRET = "<CLIENT_SECRET>";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "<REFRESH_TOKEN>";

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const accessToken = oAuth2Client.getAccessToken();

const transport = nodemailer.createTransport({
    /*port: 587,
    secure: false,
    host: "smtp.example.com",*/
    /*host: 'molylosrockeros.herokuapp.com',
    port: 123,*/
    service: 'gmail',
    /*auth: {
        user: 'finalizer2869@gmail.com',
        pass: '<PASSWORD>',
    }*/
    auth: {
        type: "OAuth2",
        user: 'molylosrockeros@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
    },
});




passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser((id, done) => {
   //const user = await Users.findById(id);
    done(/*null*/null, id);
});


passport.use('new_register', new customStrat(
    async function (req, done) {
        var sentCount = 0
        function sendMs(transporter, options, header, erase, x, extins, done, req, firstTime) {
            return new Promise(function (resolve, reject) {
                transport.sendMail(options, function (err, info) {
                    if (err) {
                        console.error(err);
                        if (firstTime == false) {
                            done(null, true, req.flash('alrreg', `Failed to resend email stack, Mr/Mrs ${req.body.mail}. Please try again ☄️☄️☄️.`))
                        } else {
                            done(null, true, req.flash('alrreg', `Failed to send 1st email stack, Mr/Mrs ${req.body.mail}. Please try again ☄️☄️☄️.`))
                        }
                        
                        return
                    } else {
                        console.log('Email sent: ' + info.response);
                        
                        sentCount++;
                        console.log(sentCount);
                        console.log(extins);
                        if(sentCount == extins) {
                            if (firstTime == false) {
                                done(null, true, req.flash('registered', `Resending email stack, Mr/Mrs ${req.body.mail}. Check your email to verify changes ☄️☄️☄️.`))
                            } else {
                                done(null, true, req.flash('registered', `Sending 1st email stack, Mr/Mrs ${req.body.mail}. Check your email to verify changes ☄️☄️☄️.`))
                            }
                            
                            console.log(erase);
                        //if (erase == true) {
                            header.forEach(x => {
                                console.log("header: " + x);
                                //fs.exists(x, e => {
                                    /*if (e) {
                                        console.error(e)
                                        return
                                    } else {*/
                                        fs.unlink(x, err => {
                                            console.error(err)
                                        })
                                        console.log(`file ${x} unlinked successfully`);
                                    //}
                                //})
                                
                                //console.log(`file ${x} unlinked successfully`);
                            })
                        //}
                        }
                        resolve()
                    }
                })
            })
        };

        async function bombardEmail(header, text, attachments, mail, req, done, erase, x, extins, firstTime) {
            try {
        
                var attachmentsHeader = [];
        
                attachments.forEach(x => {
                    var p = {
                        path: x
                    }
                    console.log('equis: ' + x);
                    attachmentsHeader.push(p);
                })
        
                console.log('attachments: ' + attachmentsHeader);
        
                const mailOpts = {
                    from: 'molylosrockeros@gmail.com',
                    //from: 'finalizer2869@gmail.com',
                    to: mail,
                    subject: header,
                    text: text,//'Mol y los rockeros 🥶🥶🥶. Enhorabuena, te ganaste unas láminas',
                    attachments: attachmentsHeader,
                }
                const res = sendMs(transport, mailOpts, attachments, erase, x, extins, done, req, firstTime).then(function () {
                    /*attachments.forEach(x => {
                        fs.exists(x, e => {
                            if (e) {
                                console.error(e)
                                return
                            } else {
                                fs.unlink(x, err => {
                                    console.error(err)
                                })
                                console.log(`file ${x} unlinked successfully`);
                            }
                        })
                    })*/
                    //done(null, true, req.flash('registered', `Resending theemail, Mr/Mrs ${req.body.mail}. Check your email to verify changes ☄️☄️☄️.`))
                    console.log("promise");
                    return false;
                });
        
                /*await attachments.forEach(x => {
                    fs.unlink(x, err => {
                        console.error(err)
                        return 0;
                    })
                    console.log(`file ${x} unlinked successfully`);
                })*/
        
                return res;
            } catch (err) {
                console.error(err);
            }
        }
        
        console.log('sddsfd');
        console.log(req.files);
        console.log(req.body.header);
        console.log(req.body.body);
        const mail = req.body.mail;
        var files = req.files;
        var filePaths = [];
        if (req.files != undefined) {
            files.forEach(x => {
                fs.writeFile(path.resolve(__dirname, `../test/${x.originalname}`), x.buffer, function (err) {
                    console.error(err);
                })
                filePaths.push(path.resolve(__dirname, `../test/${x.originalname}`));
            });
        }

        const user = await Users.findOne({ email: req.body.mail })
        if (user) {
            console.log(user);
            console.log("usuarioyaregistrado");
            if (!user.comparePassword(req.body.password)) {
                console.log("nopase")
                return done(null, false, req.flash('alrreg', `Incorrect password, Mr/Mrs ${req.body.mail}`));
            }
            if (req.body.textins < 10) {
                
                for (x = 0; x <= req.body.textins; x++) {

                    var bool
                    if (x == req.body.textins) {
                        bool = true
                    } else {
                        bool = false
                    }

                    console.log('x' + x);
                    console.log('textins' + req.body.textins);
                    console.log(bool)
                    
                    bombardEmail(req.body.header, req.body.text, filePaths, req.body.mail, req, done, bool, 2, req.body.textins, false);
                    /*setTimeout(function () {
                        console.log('waiting...')
                    }, 100)*/
                    
                }
                    
            } else if (req.body.textins >= 20) {
                return done(null, false, req.flash('alrreg', `We are afraid you can't resend exactly ${req.body.textins} emails, Mr/Mrs ${req.body.mail}. Try a smaller number ☄️☄️☄️.`));
            }

            /*transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });*/
            return true
            //return done(null, true, req.flash('registered', `Resending email, Mr/Mrs ${req.body.mail}. Check your email to verify changes ☄️☄️☄️.`));
        } else {
            const nwUser = new Users();
            nwUser.email = req.body.mail;
            nwUser.password = nwUser.encryptPassword(req.body.password);
            await nwUser.save();
            if (req.body.textins < 10) {
                
                for (x = 0; x <= req.body.textins; x++) {

                    var bool
                    if (x == req.body.textins) {
                        bool = true
                    } else {
                        bool = false
                    }

                    console.log('x' + x);
                    console.log('textins' + req.body.textins);
                    console.log(bool)
                    
                    bombardEmail(req.body.header, req.body.text, filePaths, req.body.mail, req, done, bool, 2, req.body.textins, true);
                    /*setTimeout(function () {
                        console.log('waiting...')
                    }, 100)*/
                    
                }
                    
            } else if (req.body.textins >= 10) {
                return done(null, false, req.flash('alrreg', `We are afraid you can't send exactly ${req.body.textins} first emails, Mr/Mrs ${req.body.mail}. Try a smaller number ☄️☄️☄️.`));
            }
                
            
            /*transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });*/
            done(null, nwUser, req.flash('registered', `Registered properly, Mr/Mrs ${nwUser.email} 🧐🧐🧐. Check your email in order to verify your account`));



        }
    }
));



router.post('/newsletter', upload.array('attachments'), passport.authenticate('new_register', {
    successRedirect: '/',
    failureRedirect: '/members',
    passReqToCallback: true
}));


const multer = multa({
    storage: multa.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

router.get('/', (req, res) => {
    res.render('index')
});

router.get('/disco', (req, res) => {
    res.render('disco');
})

router.get('/members', (req, res) => {
    res.render('members');
})

router.get('/concerts', (req, res) => {
    res.render('concerts');
})

router.get('/prizes', (req, res) => {
    res.render('prizes');
})
module.exports = router;