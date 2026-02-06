const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * Verify JWT token from Authorization header
 * Format: "Bearer <token>"
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token required'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }
        
        return res.status(403).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

/**
 * Check if user has required roles
 * @param {...string} allowedRoles - Roles permitted to access
 */
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions'
            });
        }

        next();
    };
};

/**
 * Check if user owns the resource or is admin
 * @param {string} resourceParam - URL param name containing resource ID
 * @param {string} ownerField - Database field storing owner ID
 */
const authorizeResource = (resourceParam = 'id', ownerField = 'user_id') => {
    return async (req, res, next) => {
        try {
            // Admins can access all resources
            if (req.user.role === 'admin') {
                return next();
            }

            const resourceId = req.params[resourceParam];
            const pool = require('../config/database');
            
            let query;
            let params;
            
            // Build query based on resource type
            if (req.baseUrl.includes('/tickets')) {
                query = 'SELECT client_id FROM tickets WHERE id = ?';
                params = [resourceId];
            } else if (req.baseUrl.includes('/clients')) {
                query = 'SELECT id FROM clients WHERE id = ?';
                params = [resourceId];
            } else if (req.baseUrl.includes('/agents')) {
                query = 'SELECT id FROM agents WHERE id = ?';
                params = [resourceId];
            }
            
            const [rows] = await pool.execute(query, params);
            
            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Resource not found'
                });
            }
            
            // Check ownership
            const resource = rows[0];
            const isOwner = req.user.id === resource.client_id || 
                          req.user.id === resource.id;
            
            if (!isOwner) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied'
                });
            }
            
            next();
        } catch (error) {
            next(error);
        }
    };
};

/**
 * Basic authentication (username:password)
 */
const basicAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({
            success: false,
            message: 'Basic auth required'
        });
    }
    
    try {
        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [email, password] = credentials.split(':');
        
        const pool = require('../config/database');
        
        // Find user in clients or agents table
        const [users] = await pool.execute(
            `SELECT id, email, password, 'client' as role FROM clients WHERE email = ?
             UNION
             SELECT id, email, password, 'agent' as role FROM agents WHERE email = ?
             LIMIT 1`,
            [email, email]
        );
        
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        const user = users[0];
        
        // Compare passwords
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        // Attach user to request
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role
        };
        
        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Validate API key from header or query
 */
const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    
    if (!apiKey) {
        return res.status(401).json({
            success: false,
            message: 'API key required'
        });
    }
    
    const validApiKeys = process.env.API_KEYS ? process.env.API_KEYS.split(',') : [];
    
    if (!validApiKeys.includes(apiKey)) {
        return res.status(403).json({
            success: false,
            message: 'Invalid API key'
        });
    }
    
    next();
};

/**
 * Log request details for debugging
 */
const requestLogger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
};

/**
 * Rate limiting middleware
 * @param {number} maxRequests - Max requests per window
 * @param {number} windowMs - Time window in milliseconds
 */
const rateLimiter = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
    const requests = new Map();
    
    return (req, res, next) => {
        const ip = req.ip;
        const now = Date.now();
        
        if (!requests.has(ip)) {
            requests.set(ip, []);
        }
        
        const timestamps = requests.get(ip);
        const windowStart = now - windowMs;
        
        // Clean old timestamps
        while (timestamps.length > 0 && timestamps[0] < windowStart) {
            timestamps.shift();
        }
        
        // Check limit
        if (timestamps.length >= maxRequests) {
            return res.status(429).json({
                success: false,
                message: 'Too many requests'
            });
        }
        
        // Add current timestamp
        timestamps.push(now);
        
        // Add rate limit headers
        res.setHeader('X-RateLimit-Limit', maxRequests);
        res.setHeader('X-RateLimit-Remaining', maxRequests - timestamps.length);
        res.setHeader('X-RateLimit-Reset', Math.ceil((timestamps[0] + windowMs) / 1000));
        
        next();
    };
};

/**
 * Check if user is a client
 */
const isClient = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Login required'
        });
    }
    
    if (req.user.role !== 'client') {
        return res.status(403).json({
            success: false,
            message: 'Clients only'
        });
    }
    
    next();
};

/**
 * Check if user is an agent
 */
const isAgent = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Login required'
        });
    }
    
    if (req.user.role !== 'agent') {
        return res.status(403).json({
            success: false,
            message: 'Agents only'
        });
    }
    
    next();
};

/**
 * Check if user is admin
 */
const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Login required'
        });
    }
    
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Admins only'
        });
    }
    
    next();
};

module.exports = {
    authenticateToken,
    authorizeRoles,
    authorizeResource,
    basicAuth,
    validateApiKey,
    requestLogger,
    rateLimiter,
    isClient,
    isAgent,
    isAdmin
};