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
const sanitizedDomain = process.env.DOMAIN.replace(/[\u{0080}-\u{FFFF}]/gu, '');
console.log(`Checking for hidden characters in LOGIN, PASSWORD, and DOMAIN`);
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
console.log(
  `Found `,
  process.env.DOMAIN.length - sanitizedDomain.length,
  ` hidden characters in DOMAIN`,
);

var testUri = `https://${sanitizedDomain}`;

// Disable TLS certificate verification
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

urlExists(testUri, function (err, exists) {
  console.log(
    `${testUri} checking if it can be reached with TLS certificate verification disabled:  ${exists}`,
  );
});
