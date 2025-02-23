const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = async (
  success_url,
  cancel_url,
  customer_email,
  line_items
) => {
  try {
    const session = await stripe.checkout.sessions.create({
      customer_email,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: line_items,
      success_url,
      cancel_url,
    });

    return session;
  } catch (error) {
    throw error;
  }
};
