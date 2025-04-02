import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    try {
        const jwtToken = req.header("token");

        if (!jwtToken) {
            return res.json({ message: "Not authorizated" });
        }

        const result = jwt.verify(jwtToken, process.env.JWT_SECRET);

        req.user = result.user;
        next();
    }
    catch (err) {
        console.error(err.message);
        return res.json({ message: err.message });
    }

};

export default auth;