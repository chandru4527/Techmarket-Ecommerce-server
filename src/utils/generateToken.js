import jwt from "jsonwebtoken";

const accessTokenKey = process.env.ACCESS_TOKEN_SECRETKEY;
const accessTokenExpireTime = process.env.ACCESS_TOKEN_EXPIRETIME;

const refreshTokenKey = process.env.REFRESH_TOKEN_SECRETKEY;
const refreshTokenExpireTime = process.env.REFRESH_TOKEN_EXPIRETIME;

// access token
export const generateAccessToken = (userId) => {
    return jwt.sign(
        { id: userId },
        accessTokenKey,
        { expiresIn: accessTokenExpireTime }
    );
};

// refresh token
export const generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId },
        refreshTokenKey,
        { expiresIn: refreshTokenExpireTime }
    );
};