const bcrypt = require('bcrypt');

const enteredPassword = 'yan123';  // The entered password
const storedHash = '$2b$10$wWCU12nuei65/B2Jjiyczuc/nWh41mZAmih3t8EqCexfZWk662r26';  // The stored hash

bcrypt.compare(enteredPassword, storedHash, (err, result) => {
  if (err) {
    console.error('Error comparing hashes:', err);
  }
  console.log('Password match result:', result);  // Should log true if matched
});
