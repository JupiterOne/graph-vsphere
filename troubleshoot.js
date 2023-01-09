var urlExists = require('url-exists');
var dotenv = require('dotenv');
var path = require('path');

dotenv.config({
  path: path.join(__dirname, '.env'),
});

const sanitizedLogin = process.env.LOGIN.replace(/[\u{0080}-\u{FFFF}]/gu, '');
const sanitizedPassword = process.env.PASSWORD.replace(
  /[\u{0080}-\u{FFFF}]/gu,
  '',
);
console.log(`Checking for hidden characters in LOGIN and PASSWORD`);
console.log(
  `Found `,
  process.env.LOGIN.length - sanitizedLogin.length,
  ` hidden characters in LOGIN`,
);
console.log(
  `Found `,
  process.env.PASSWORD.length - sanitizedPassword.length,
  ` hidden characters in PASSWORD`,
);

var testUri = `https://${process.env.DOMAIN}/api/session`;

urlExists(process.env.DOMAIN, function (err, exists) {
  console.log(`${testUri} checking if it can be reached:  ${exists}`);
});
