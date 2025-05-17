const bcrypt = require("bcryptjs");

const enteredPassword = "123456"; // Use the exact password you enter in login
const storedHash = "$2a$10$ywm1c9F2cSuGvoz1T6NvhOaSBAzSnmBzotgAd4eGtDTlAPW8rT0ie"; // Use the hashed password from DB

bcrypt.compare(enteredPassword, storedHash).then(isMatch => {
    console.log("Manual Check - Password Match:", isMatch);
});
