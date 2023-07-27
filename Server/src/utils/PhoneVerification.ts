import { Twilio } from "twilio";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
const MY_NUMBER = process.env.MY_NUMBER;

export const SendPhone_Verification = () => {
  const client = new Twilio(`${TWILIO_ACCOUNT_SID}`, `${TWILIO_AUTH_TOKEN}`);

  if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER) {
    return client.messages
      .create({
        from: `${TWILIO_PHONE_NUMBER}`, // or a sender ID if a verified and ugraded number like ==> FACEBOOK, AMAZON etc..
        to: `${MY_NUMBER}`,
        body: "code: 4545clerville",
      })
      .then((message) => console.log(message));
  } else {
    console.log("none of the these infos does not have to be null ");
  }
};

// sending phone number verification by twilio platform using only a trial phone number
// meaning that i can only send message from a number caller ID referred to my number
// for testing purpose only but i hope to have a verified one to send sms with personalized
// sender id where the name of the compagny shows up as the message sender but it is paid
