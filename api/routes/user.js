import { Router } from "express";
import { verifyTokenAndAuthorization } from "./verifyToken.js";
import User from "../models/User.js";

const router = Router();

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
      ).toString();
    }
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
        console.log(err);
      res.status(500).json(err);
    }
  });
  
export default router;
