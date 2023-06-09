import { Router } from "express";
import passport from 'passport';

const router = Router();

//REGISTER
router.post('/register', passport.authenticate('register', { failureRedirect: '/api/session/registerFail', failureMessage: true }), async (req, res) => {
    res.send({ status: "success", message: "Registered" });
})

//REGISTER FAIL
router.get('/registerFail', (req, res) => {
    console.log(req.session.messages);
    res.status(400).send({ status: "error", error: req.session.messages })
})

//LOGIN
router.post('/login', passport.authenticate('login', { failureRedirect: '/api/session/loginFail', failureMessage: true }), async (req, res) => {
    req.session.user = {
        name: req.user.name,
        role: req.user.role,
        id: req.user.id,
        email: req.user.email
    }
    return res.send({ status: "Login success" });
})

//LOGOUT
router.get("/logout", (req, res) => {
    req.session.destroy()
    return res.redirect("/login")
})

//LOGIN FAIL
router.get('/loginFail', (req, res) => {
    console.log(req.session.messages);
    res.status(400).send({ status: "error", error: req.session.messages });
})

//GITHUB
router.get("/github", passport.authenticate("github"), (req, res) => { })

router.get("/githubcallback", passport.authenticate("github"), (req, res) => {
    const user = req.user;
    req.session.user = {
        id: user.id,
        name: user.first_name,
        role: user.role,
        email: user.email
    }
    return res.redirect("/login")
})

export default router;