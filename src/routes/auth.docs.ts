/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints managed by Better-Auth
 */

/**
 * @swagger
 * /api/auth/sign-in/social:
 *   post:
 *     summary: Initiate Social Sign-In (e.g., Google)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - provider
 *             properties:
 *               provider:
 *                 type: string
 *                 enum: [google, github]
 *                 description: The social provider to use.
 *               callbackURL:
 *                 type: string
 *                 description: The URL to redirect to after successful login.
 *     responses:
 *       200:
 *         description: Successful initiation. Returns the redirection URL or auth data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: The URL to redirect the user to for authentication.
 *       400:
 *         description: Invalid provider or missing parameters.
 *       500:
 *         description: Internal server error.
 */
