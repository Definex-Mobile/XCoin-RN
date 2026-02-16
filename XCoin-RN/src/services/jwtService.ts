import * as jose from 'jose';

const JWT_SECRET = new TextEncoder().encode('xcoin-signup-secret-key');
const JWT_EXPIRATION = '7d';

export interface SignUpJwtPayload {
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: string;
}

export async function generateSignUpJwt(payload: SignUpJwtPayload): Promise<string> {
  const token = await new jose.SignJWT({
    firstName: payload.firstName,
    lastName: payload.lastName,
    phone: payload.phone,
    birthDate: payload.birthDate,
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(JWT_SECRET);

  return token;
}
