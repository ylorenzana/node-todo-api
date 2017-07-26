const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let password = 'nikawat';
bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  })
});

let hashedPassword = '$2a$10$f2XBUSbqbhu/IkmiYNSmb.L7qgp38NcOjVXm3hWnmUW8Mya5fvU.G';
bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
});


// let data = {
//   id: 10
// };

// let token = jwt.sign(data, 'salt');
// console.log(token);

// let decoded = jwt.verify(token, 'salt');
// console.log(decoded);

// let message = 'I am user #2';
// let hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// let data = {
//   id: 4
// };

// let token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'salt').toString()
// };

// let resultHash = SHA256(JSON.stringify(token.data) + 'salt').toString();

// if (resultHash === token.hash) {
//   console.log('Data is valid');
// }
// else {
//   console.log('Data is invalid');
// }