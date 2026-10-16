const express = require('express');
const authRouter = express.Router();

authRouter.post('/register', (req, res) => {
    const body = req.body;

    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
        return res.status(400).json({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Request body must be a JSON object.'
            }
        });
    }

    if (
        typeof body.email !== 'string' ||
        typeof body.password !== 'string' ||
        typeof body.displayName !== 'string'
    ) {
        return res.status(400).json({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Email, password and displayName must be strings.'
            }
        });
    }

    const email = body.email.trim().toLowerCase();
    const displayName = body.displayName.trim();
    // Preserve body.password exactly as entered for the later hashing step.

    // Temporary response: this checks types only and does not create an account.
    return res.json({
        message: 'Input types accepted; account creation is not implemented yet.',
        input: { email, displayName }
    });
});

module.exports = authRouter;
