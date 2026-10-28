const requireAuth = (req, res, next) => {
    if(!req.session.userId){
        return res.status(401).json({
            error: {
                code: 'UNAUTHENTICATED',
                message: 'no login found'
            }
        })
    }

    next();
}

module.exports = requireAuth;