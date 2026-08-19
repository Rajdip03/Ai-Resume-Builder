import jwt from 'jsonwebtoken';

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization; // if user already loggedin then we will send header(authorization)

    if (!authHeader) {
        return res.status(401).json({ message: 'unauthorized' });
    }

    // Support both "Bearer <token>" and raw "<token>" formats
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.id
        next();
    } catch (error) {
        return res.status(401).json({ message: 'unauthorized' })
    }
}
export default protect;