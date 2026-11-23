import jwt from "jsonwebtoken";

const accessTokenKey = process.env.ACCESS_TOKEN_SECRETKEY;
const accessTokenExpireTime = process.env.ACCESS_TOKEN_EXPIRETIME;

const refreshTokenKey = process.env.REFRESH_TOKEN_SECRETKEY;
const refreshTokenExpireTime = process.env.REFRESH_TOKEN_EXPIRETIME;

export const generateAccessToken = (userId, role) => {
    return jwt.sign(
        { id: userId, role },
        accessTokenKey,
        { expiresIn: accessTokenExpireTime }
    );
};

export const generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId },
        refreshTokenKey,
        { expiresIn: refreshTokenExpireTime }
    );
};