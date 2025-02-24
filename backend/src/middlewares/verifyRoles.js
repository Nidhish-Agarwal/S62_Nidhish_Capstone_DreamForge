// A middleware to correctly authorize a user based on their roles
const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // If no roles is available return unauthorized
    if (!req?.roles) return res.sendStatus(401);
    const rolesArray = [...allowedRoles];

    // Checking if the user role is in the allowed roles
    const result = req.roles.some((role) => rolesArray.includes(role));

    // If the user does not have correct roles, send forbidden
    if (!result) return res.sendStatus(403);

    next();
  };
};

module.exports = verifyRoles;
