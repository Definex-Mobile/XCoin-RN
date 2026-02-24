import { fromByteArray } from 'base64-js';

const JWT_SECRET = 'xcoin-signup-secret-key';
const JWT_EXPIRATION_SECONDS = 7 * 24 * 60 * 60;

export interface SignUpJwtPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
}

const encodeBase64Url = (value: string): string => {
  const bytes = new TextEncoder().encode(value);

  return fromByteArray(bytes)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
};

const createPseudoSignature = (value: string): string => {
  let hash = 0;

  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }

  return encodeBase64Url(String(Math.abs(hash)));
};

export async function generateSignUpJwt(payload: SignUpJwtPayload): Promise<string> {
  const issuedAt = Math.floor(Date.now() / 1000);
  const header = encodeBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = encodeBase64Url(JSON.stringify({
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    phone: payload.phone,
    birthDate: payload.birthDate,
    iat: issuedAt,
    exp: issuedAt + JWT_EXPIRATION_SECONDS,
  }));
  const signature = createPseudoSignature(`${header}.${body}.${JWT_SECRET}`);

  return `${header}.${body}.${signature}`;
}
