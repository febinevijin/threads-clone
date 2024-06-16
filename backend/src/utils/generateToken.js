import jwt from 'jsonwebtoken';
const generateTokenAndSetCookies = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '15d',
  });

  res.cookie('threadsUser', token, {
    httpOnly: true, // more secure
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    sameSite: 'strict', // CSRF
  });

  return token;
};

export const verifyAccessKey = (token, secretKey) => {
  try {
    const payload = jwt.verify(token, secretKey);
    return payload;
  } catch (err) {
    console.log(err);
  }
};

export default generateTokenAndSetCookies;
