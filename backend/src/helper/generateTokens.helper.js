import jwt from 'jsonwebtoken'

const generateTokens = (user) => {
    const accessToken = jwt.sign({ id: user._id, role: user.role, image: user.image, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' })
    const refreshToken = jwt.sign({ id: user._id, role: user.role }, process.env.REFRESH_JWT_SECRET, { expiresIn: '30d' })
    return { accessToken, refreshToken }
}

export default generateTokens  