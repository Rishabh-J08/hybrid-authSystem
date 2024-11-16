const otpGenerator = require('otp-generator')

const otp = otpGenerator.generate(4,{upperCaseAlphabets: false, specialChars:false ,lowerCaseAlphabets: false, digits:true});
console.log(otp);