/**
 * SWAGGER DOCUMENTATION EXAMPLES FOR ALL ROUTES
 * Copy these examples and add them to your route files above the router definitions
 */

// ======================== PLACES ROUTES ========================
/**
 * @swagger
 * /places:
 *   get:
 *     summary: Get all travel places
 *     tags:
 *       - Places
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by place name
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: List of places
 *   post:
 *     summary: Create a new place
 *     tags:
 *       - Places
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Place created
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /places/{id}:
 *   get:
 *     summary: Get place by ID
 *     tags:
 *       - Places
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Place details
 *       404:
 *         description: Place not found
 *   put:
 *     summary: Update place
 *     tags:
 *       - Places
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Place updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Place not found
 *   delete:
 *     summary: Delete place
 *     tags:
 *       - Places
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Place deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Place not found
 */

// ======================== POSTS ROUTES ========================
/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of posts
 *   post:
 *     summary: Create a new post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               placeId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /posts/{postId}:
 *   get:
 *     summary: Get post by ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post details
 *       404:
 *         description: Post not found
 *   put:
 *     summary: Update post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Post updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 *   delete:
 *     summary: Delete post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */

// ======================== TIPS ROUTES ========================
/**
 * @swagger
 * /tips:
 *   get:
 *     summary: Get all travel tips
 *     tags:
 *       - Tips
 *     responses:
 *       200:
 *         description: List of travel tips
 *   post:
 *     summary: Create a new tip
 *     tags:
 *       - Tips
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tip created
 *       401:
 *         description: Unauthorized
 */

// ======================== COMPANION ROUTES ========================
/**
 * @swagger
 * /companions:
 *   get:
 *     summary: Get travel companions
 *     tags:
 *       - Companions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of potential companions
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Send companion request
 *     tags:
 *       - Companions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companionId:
 *                 type: string
 *               tripId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Request sent
 *       401:
 *         description: Unauthorized
 */

// ======================== EMERGENCY ROUTES ========================
/**
 * @swagger
 * /emergency:
 *   post:
 *     summary: Send emergency alert
 *     tags:
 *       - Emergency
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *               severity:
 *                 type: string
 *                 enum: [low, medium, high, critical]
 *     responses:
 *       200:
 *         description: Emergency reported
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /emergency/status:
 *   get:
 *     summary: Get emergency status
 *     tags:
 *       - Emergency
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Emergency status
 *       401:
 *         description: Unauthorized
 */
