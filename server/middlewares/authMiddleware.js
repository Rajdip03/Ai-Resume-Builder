import jwt from 'jsonwebtoken';

const protect = async (req, res, next) => {
    const token = req.headers.authorization; // if user already loggedin then we will send header(authorization)

    if (!token) {
        return res.status(401).json({ message: 'unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.id
        next();
    } catch (error) {
        return res.status(401).json({ message: 'unauthorized' })
    }
}
export default protect;