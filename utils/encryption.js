const crypto = require("node:crypto");

const algorithm = "aes-256-ctr";
const secretKey = process.env.SECRET_KEY;

// -------------------------------------------------

// encrypt data and generate iv
const encrypt = (plainText) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(plainText), cipher.final()]);

  // convert the iv and encrypted string to hex
  const hexIV = iv.toString("hex");
  const hexString = encrypted.toString("hex");

  console.log(hexIV);
  console.log(hexString);

  // combine and return the full string
  return hexIV + hexString;
};

// -------------------------------------------------

// decrypt
const decrypt = (encrypted) => {
  // extract the iv from the encrypted string
  let iv = encrypted.substring(0, 32);
  let content = encrypted.substring(32);

  // create the cipher from the iv and secretKey
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(iv, "hex")
  );

  // decrypt the payload
  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(content, "hex")),
    decipher.final(),
  ]);
  return decrpyted.toString();
};

// -------------------------------------------------

// export methods
module.exports = { encrypt, decrypt };
