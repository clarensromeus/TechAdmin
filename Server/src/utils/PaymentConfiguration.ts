import braintree from "braintree";
import * as dotenv from "dotenv";

// a function to call env variables
dotenv.config();

console.log(process.env.MERCHANT_ID);
// create payment gateway
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: `${process.env.MERCHANT_ID}`,
  publicKey: `${process.env.PUBLIC_KEY}`,
  privateKey: `${process.env.PRIVATE_KEY}`,
});

export default gateway;
