/**
 * 🚀 SIGMA PRIVATE SERVER BACKEND (COMPLETE FIX EDITION)
 * Designed for Render Web Services & Express.js
 */

const express = require('express');
const cors = require('cors');

const app = express();

// Middleware: Body Parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Middleware: Strict CORS & Response Headers Fix
app.use(cors({ origin: '*', credentials: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// Middleware: Request Inspector (Render Console Logs)
app.use((req, res, next) => {
    console.log(`\n📥 [REQUEST] ${req.method} -> ${req.originalUrl}`);
    if (Object.keys(req.body).length) console.log(`📦 Body:`, JSON.stringify(req.body));
    next();
});

// Helper Functions
const getTimestamp = () => Math.floor(Date.now() / 1000);
const getHostUrl = (req) => `${req.protocol}://${req.get('host')}`;

// ==========================================
// 1. RCT & VERSION HANDSHAKE (Hex Edit Route)
// ==========================================
app.all(['/rct', '/rct/', '/rct/*', '/rct/ver.php', '/ver.php'], (req, res) => {
    const hostUrl = getHostUrl(req);
    return res.status(200).json({
        "code": 0,
        "ret": 0,
        "msg": "success",
        "is_server_open": true,
        "is_firewall_open": true,
        "remote_version": "5.131",
        "cdn_url": `${hostUrl}/`,
        "server_url": `${hostUrl}/`,
        "country_code": "IN",
        "sigma_login": true,
        "sigma_switch": true,
        "overlay_config_url": `${hostUrl}/rct/ver.php`
    });
});

// ==========================================
// 2. BEETALK AUTHENTICATION & GUEST LOGIN
// ==========================================
app.all(['/oauth/guest/register', '/guest/register', '/oauth/token/inspect', '/oauth/token/refresh'], (req, res) => {
    const now = getTimestamp();
    const token = "NEXUS_MASTER_SECURE_TOKEN_2026";

    return res.status(200).json({
        "ret": 0,
        "result": true,
        "code": 0,
        "msg": "success",
        "open_id": "op_100000001",
        "uid": "100000001",
        "user_id": "100000001",
        "access_token": token,
        "refresh_token": token,
        "create_time": now,
        "expiry_time": now + 31536000,
        "expires_in": 31536000,
        "platform": 4,
        "is_valid": 1
    });
});

// ==========================================
// 3. USER PROFILE & APP CONFIG
// ==========================================
app.all(['/oauth/user/info/get', '/user/info', '/app/info/get', '/api/app/info/get'], (req, res) => {
    return res.status(200).json({
        "ret": 0,
        "result": true,
        "code": 0,
        "msg": "success",
        "data": {
            "uid": "100000001",
            "user_id": "100000001",
            "open_id": "op_100000001",
            "nickname": "Master_Sigma",
            "level": 99,
            "gold": 9999999,
            "diamond": 999999,
            "status": 1,
            "version": "5.131"
        }
    });
});

// ==========================================
// 4. LOBBY & SERVER LIST ROUTING
// ==========================================
app.all(['/major_info', '/api/major_info', '/major_info/get', '/server/list'], (req, res) => {
    const hostDomain = req.get('host');
    return res.status(200).json({
        "ret": 0,
        "result": true,
        "code": 0,
        "msg": "success",
        "data": {
            "uid": "100000001",
            "nickname": "Master_Sigma",
            "region": "IND",
            "lobby_ip": hostDomain,
            "lobby_port": 443,
            "chat_ip": hostDomain,
            "chat_port": 443,
            "allow_login": 1,
            "is_ban": 0,
            "servers": [
                {
                    "server_id": 1,
                    "server_name": "Nexus Core Server",
                    "ip": hostDomain,
                    "port": 443,
                    "status": "smooth",
                    "is_recommend": true
                }
            ],
            "recommend_server_id": 1
        }
    });
});

// ==========================================
// 5. CATCH-ALL UNIVERSAL FALLBACK
// (Gives positive response to any unknown endpoint requested by the client)
// ==========================================
app.all('*', (req, res) => {
    console.log(`⚠️ [FALLBACK RESPONDED] Endpoint: ${req.method} ${req.originalUrl}`);
    const hostDomain = req.get('host');
    const now = getTimestamp();

    return res.status(200).json({
        "ret": 0,
        "result": true,
        "code": 0,
        "msg": "success",
        "is_valid": 1,
        "open_id": "op_100000001",
        "uid": "100000001",
        "user_id": "100000001",
        "access_token": "NEXUS_MASTER_SECURE_TOKEN_2026",
        "create_time": now,
        "expires_in": 31536000,
        "data": {
            "uid": "100000001",
            "nickname": "Master_Sigma",
            "lobby_ip": hostDomain,
            "lobby_port": 443
        }
    });
});

// Dynamic Port Binding for Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server fully operational on port ${PORT}`);
});
