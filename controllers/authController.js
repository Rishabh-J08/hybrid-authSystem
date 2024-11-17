const { generateToken } = require("../utils/jwt");
const redis = require("../config/redis");
const User = require("../model/User");
const otpGenerator = require("otp-generator");
const otpSender = require("../utils/otp");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio = require("twilio");
const client = twilio(accountSid, authToken);
const utils = require("../utils/utlis");
const { Fido2Lib } = require("fido2-lib");

//signup logic

exports.signup = async (req, res) => {
  const { username, email, password, phoneNumber } = req.body;
  try {
    if (email && !phoneNumber) {
      const user = new User({ username, email, password });
      await user.save();
      const token = generateToken(user._id);
      res.status(201).json({ message: "User Created and saved to db", token });
    } else if (!email && phoneNumber) {
      const user = new User({ username, phoneNumber, password });
      await user.save();
      const token = generateToken(user._id);
      res.status(201).json({ message: "User Created and saved to db", token });
    } else {
      res.status(400).json({ message: "Email or phoneNumber is required" });
    }
  } catch (error) {
    res.staus(400).json({ messsage: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(400)
        .json({ message: "Invalid email or password, try again" });
    }
    const token = generateToken(user._id);
    await redis.set(`user:${user._id}`, token, "EX", 1800); // 1800 seconds expiry || 30 mints expiry
    res.json({ message: `Login successful, Welcome ${token}` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// logout

exports.logout = async (req, res) => {
  const userId = req.user.id;
  await redis.del(`user${userId}`);
  res.json({ message: "Logged out Successfuly" });
};

// otp login

exports.optLogin = async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;
    if (email && !phoneNumber) {
      const otp = otpGenerator.generate(4, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      await redis.set(`otp${email}`, otp, "EX", 300);
      const storedOtp = await redis.get(`otp${email}`);

      console.log(storedOtp);
      otpSender.sendingMail(email, otp);

      res.json({ message: "OTP sent successfull" });
    } else if (phoneNumber && !email) {
      const otp = otpGenerator.generate(4, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      await redis.set(`otp${phoneNumber}`, otp, "EX", 300);
      client.messages.create({
        body: `This is the otp for you to login ${otp}`,
        from: "+16503977542",
        to: phoneNumber,
      });
      res.json({ message: "OTP sent succesfuly" });
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

//otp verify

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp, phoneNumber } = req.body;
    if(email && !phoneNumber){
    const storedOtp = await redis.get(`otp${email}`);
    if (storedOtp === otp) {
      res.json({ verfied: true });
    } else {
      res.json({ verified: false });
    }} else if(phoneNumber && !email){
        const storedOtp = await redis.get(`otp${phoneNumber}`);
        if(storedOtp === otp){
            res.json({verified: true});
        } else {
            res.json({verified:false});
        }
    }
  } catch (error) {
    console.error("error while verifying" + error.message);
  }
};

// fingerprint signup

exports.fingerpirntSignup =  async(req, res) => {
  const {email,phoneNumber, domainName} = req.body;
  try {
    const user = await User.findOne({email})
    if(!user){
      res.status(404).json({message: "User not found"})
    }
    const fido2 = new Fido2Lib({
      timeout: 60000,
      rpId: domainName,
      rpName: "Your App Name",
      attestation: "direct",
      challengeSize: 64,
    });
    const registrationOptions = fido2.attestationOptions();
    user.fingerprintChallenge = registrationOptions.challenge;
    await user.save() 
    res.json({registrationOptions})
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
