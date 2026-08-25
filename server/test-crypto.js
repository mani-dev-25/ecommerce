const bcrypt = require('bcryptjs');
const { encrypt, decrypt } = require('./utils/crypto');

console.log('====================================================');
console.log('      RUNNING VYNEX SECURITY INTEGRITY TESTS');
console.log('====================================================\n');

// 1. Test Symmetric AES-256-GCM Encryption / Decryption
console.log('--- Test 1: Symmetric Encryption & Decryption ---');
const rawText = "Flat 102, Premium Heights, Sector 45, Gurugram, India";
console.log(`Original Text: "${rawText}"`);

try {
  const cipherText = encrypt(rawText);
  console.log(`Ciphertext:    "${cipherText}"`);
  
  if (cipherText === rawText) {
    console.error('FAIL: Ciphertext matches original text (No encryption occurred).');
    process.exit(1);
  }
  console.log('PASS: Text successfully encrypted.');

  const recoveredText = decrypt(cipherText);
  console.log(`Decrypted:     "${recoveredText}"`);

  if (recoveredText !== rawText) {
    console.error('FAIL: Decrypted text does not match original text.');
    process.exit(1);
  }
  console.log('PASS: Text successfully decrypted and integrity verified.\n');
} catch (err) {
  console.error('FAIL: Error encountered during encryption/decryption cycle:', err);
  process.exit(1);
}

// 2. Test Password Hashing with bcrypt
console.log('--- Test 2: Password Hashing ---');
const userPassword = "MySecurePassword123!";
console.log(`Plain Password: "${userPassword}"`);

async function testPasswordHashing() {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(userPassword, salt);
    console.log(`Bcrypt Hash:    "${hash}"`);

    if (hash === userPassword) {
      console.error('FAIL: Hash matches plain password (No hashing occurred).');
      process.exit(1);
    }
    console.log('PASS: Password successfully hashed.');

    const isMatchCorrect = await bcrypt.compare(userPassword, hash);
    console.log(`Match Check (Correct Password):   ${isMatchCorrect}`);
    if (!isMatchCorrect) {
      console.error('FAIL: Failed to verify correct password against hash.');
      process.exit(1);
    }
    console.log('PASS: Correct password successfully verified.');

    const isMatchIncorrect = await bcrypt.compare("WrongPassword123!", hash);
    console.log(`Match Check (Incorrect Password): ${isMatchIncorrect}`);
    if (isMatchIncorrect) {
      console.error('FAIL: Incorrect password matched the hash.');
      process.exit(1);
    }
    console.log('PASS: Incorrect password successfully rejected.\n');
    
    console.log('====================================================');
    console.log('    ALL SECURITY TEST SUITES PASSED SUCCESSFULLY');
    console.log('====================================================');
  } catch (err) {
    console.error('FAIL: Hashing verification encountered an error:', err);
    process.exit(1);
  }
}

testPasswordHashing();
