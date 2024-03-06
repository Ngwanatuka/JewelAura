import router from 'express';
import stripe from 'stripe';

const stripe = stripeModule(process.env.STRIPE_SECRET_KEY);

router.post("/payment", (req, res) => {
    stripe.charges.create({
        source: req.body.token.id,
        amount: req.body.amount,
        currency: "usd",
    } , (stripeErr, stripeRes) => {
        if(stripeErr) {
            res.status(500).send({ error: stripeErr });
        } else {
            res.status(200).send({ success: stripeRes });
        }
    });
});


const router = express.Router();