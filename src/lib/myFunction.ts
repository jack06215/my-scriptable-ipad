import { HmacSHA256, enc } from 'crypto-js';

function hmac256Signature(message: string, secret: string): string {
  const hashedMessage = HmacSHA256(message, secret);
  const signature = enc.Base64.stringify(hashedMessage);

  return signature;
}

export { hmac256Signature };
