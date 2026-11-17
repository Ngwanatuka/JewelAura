import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) {
        console.error('Token verification failed:', err.message);
        return res.status(403).json("Token is not valid!");
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    // Check both id and userId params for authorization
    const paramId = req.params.id || req.params.userId;
    if (req.user.id === paramId || req.user.isAdmin) {
      next();
    } else {
      console.log('Authorization failed:', { userId: req.user.id, paramId, isAdmin: req.user.isAdmin });
      res.status(403).json("You are not allowed to do that!");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    console.log('Admin check:', { userId: req.user?.id, isAdmin: req.user?.isAdmin });
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      console.log('Admin access denied for user:', req.user?.id);
      res.status(403).json("You are not allowed to do that!");
    }
  });
};

export { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };
