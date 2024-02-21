import { Router } from "express";

const router = Router();

router.get("/usertest", (req, res)=> {
    res.send("User Test API");
})

router.post("/userposttest", (req, res)=> {
    const username = req.body.username;
    console.log(username);
    res.send("Usernae: " + username);
});

export default router;