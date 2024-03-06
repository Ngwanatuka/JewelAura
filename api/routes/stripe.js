import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_KEY);

console.log(process.env.STRIPE_KEY);

const router = express.Router();

router.post("/payment", async (req, res) => {
  try {
    const charge = await stripe.charges.create({
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    });

    res.status(200).send({ success: charge });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

export default router;
