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

    if (
        displayName.length === 0 ||
        [...displayName].length > 80 ||
        /\p{Cc}/u.test(body.displayName)
    ) {
        return res.status(400).json({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Check the registration fields.',
                fields: {
                    displayName: 'Display name must contain 1–80 characters and no control characters.'
                }
            }
        });
    }

    const passwordLength = [...body.password].length;

    if (
        passwordLength < 15 ||
        passwordLength > 128 ||
        body.password.trim().length === 0
    ) {
        return res.status(400).json({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Check the registration fields.',
                fields: {
                    password: 'Password must contain 15–128 characters and cannot be only whitespace.'
                }
            }
        });
    }

    const emailParts = email.split('@');
    const localPart = emailParts[0];
    const domain = emailParts[1] || '';
    const domainLabels = domain.split('.');
    const validLocalPart = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/;
    const validDomainLabel = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

    if (
        email.length < 3 ||
        email.length > 254 ||
        /[^\x21-\x7e]/.test(email) ||
        emailParts.length !== 2 ||
        localPart.length > 64 ||
        !validLocalPart.test(localPart) ||
        domainLabels.length < 2 ||
        !domainLabels.every(label => validDomainLabel.test(label))
    ) {
        return res.status(400).json({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Check the registration fields.',
                fields: {
                    email: 'Enter a supported email address, such as sam@example.com.'
                }
            }
        });
    }

    // Temporary response: account creation and remaining request checks follow later.
    return res.json({
        message: 'Input types accepted; account creation is not implemented yet.',
        input: { email, displayName }
    });
});

module.exports = authRouter;
