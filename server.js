/**
 * 🚀 SIGMA PRIVATE SERVER - ZERO BUG FULL BACKEND
 * Fixes: Token Exchange, RCT Handshake, Major Info, Header Mismatches & Socket Ack
 */

const express = require('express');
const cors = require('cors');

const app = express();

// Crash Handlers
process.on('uncaughtException', (err) => {
    console.error('🔥 [CRASH PREVENTION] Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
    console.error('🔥 [CRASH PREVENTION] Unhandled Rejection:', reason);
});

// Middleware setup
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Strict Headers for Client Compatibility
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// Logging
app.use((req, res, next) => {
    console.log(`\n📥 [HTTP REQUEST] ${req.method} -> ${req.originalUrl}`);
    if (req.body && Object.keys(req.body).length) {
        console.log(`📦 Body:`, JSON.stringify(req.body));
    }
    next();
});

const getTimestamp = () => Math.floor(Date.now() / 1000);
const getHostUrl = (req) => `${req.protocol}://${req.get('host')}`;

const MASTER_TOKEN = "NEXUS_MASTER_SECURE_TOKEN_2026";
const MASTER_UID = "100000001";

// ==========================================
// 1. RCT & VERSION HANDSHAKE
// ==========================================
app.all([
    '/rct', 
    '/rct/', 
    '/rct/*', 
    '/rct/ver.php', 
    '/ver.php',
    '/rct/ver'
], (req, res) => {
    const hostUrl = getHostUrl(req);
    const clientVer = req.query.version || "1.0.0";

    if (req.headers['accept'] && req.headers['accept'].includes('text/plain')) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        return res.status(200).send(`code=0\nmsg=success\nis_server_open=1\nis_maintenance=0\nremote_version=${clientVer}\ncdn_url=${hostUrl}/\nserver_url=${hostUrl}/\n`);
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json({
        "code": 0,
        "ret": 0,
        "status": 0,
        "msg": "success",
        "result": true,
        "is_server_open": true,
        "is_firewall_open": true,
        "is_maintenance": false,
        "remote_version": clientVer,
        "client_version": clientVer,
        "cdn_url": `${hostUrl}/`,
        "server_url": `${hostUrl}/`,
        "country_code": "IN",
        "sigma_login": true,
        "sigma_switch": true,
        "overlay_config_url": `${hostUrl}/rct/ver.php`,
        "data": {
            "is_server_open": true,
            "is_maintenance": false,
            "version": clientVer
        }
    });
});

// ==========================================
// 2. BEETALK OAUTH LOGIN & REDIRECTS
// ==========================================
app.all(['/oauth/login'], (req, res) => {
    const redirectUri = req.query.redirect_uri ? decodeURIComponent(req.query.redirect_uri) : 'gop100138://auth/';
    const targetUrl = redirectUri.includes('?') 
        ? `${redirectUri}&code=${MASTER_TOKEN}` 
        : `${redirectUri}?code=${MASTER_TOKEN}`;
    return res.redirect(targetUrl);
});

// ==========================================
// 3. AUTH, GUEST GRANT & TOKEN EXCHANGE
// ==========================================
app.all([
    '/oauth/token/exchange',
    '/token/exchange',
    '/oauth/guest/token/grant',
    '/oauth/guest/register', 
    '/guest/register', 
    '/oauth/access_token',
    '/oauth/token/refresh',
    '/oauth/grant',
    '/login',
    '/guest_login'
], (req, res) => {
    const now = getTimestamp();

    if (req.query && req.query.redirect_uri) {
        const redirect = decodeURIComponent(req.query.redirect_uri);
        return res.redirect(`${redirect}?code=${MASTER_TOKEN}&access_token=${MASTER_TOKEN}`);
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json({
        "error": 0,
        "error_code": 0,
        "ret": 0,
        "result": true,
        "status": "success",
        "msg": "success",
        "account_id": MASTER_UID,
        "uid": MASTER_UID,
        "user_id": MASTER_UID,
        "open_id": "op_100000001",
        "openid": "op_100000001",
        "access_token": MASTER_TOKEN,
        "refresh_token": MASTER_TOKEN,
        "token_type": "Bearer",
        "create_time": now,
        "expiry_time": now + 31536000,
        "expires_in": 31536000,
        "platform": 4,
        "is_valid": 1,
        "session_key": MASTER_TOKEN,
        "data": {
            "uid": MASTER_UID,
            "access_token": MASTER_TOKEN,
            "open_id": "op_100000001"
        }
    });
});

// ==========================================
// 4. TOKEN INSPECT & VERIFICATION
// ==========================================
app.all([
    '/oauth/token/inspect', 
    '/oauth/inspect',
    '/token/inspect',
    '/api/v1/token/inspect'
], (req, res) => {
    const now = getTimestamp();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    return res.status(200).json({
        "error": 0,
        "error_code": 0,
        "ret": 0,
        "result": true,
        "status": "success",
        "msg": "success",
        "account_id": MASTER_UID,
        "uid": MASTER_UID,
        "user_id": MASTER_UID,
        "open_id": "op_100000001",
        "openid": "op_100000001",
        "access_token": MASTER_TOKEN,
        "app_id": 100138,
        "platform": 4,
        "is_valid": 1,
        "expiry_time": now + 31536000,
        "expires_in": 31536000,
        "data": {
            "uid": MASTER_UID,
            "is_valid": 1
        }
    });
});

// ==========================================
// 5. USER PROFILE & APP CONFIG
// ==========================================
app.all([
    '/oauth/user/info/get', 
    '/user/info', 
    '/app/info/get', 
    '/api/app/info/get',
    '/client_init',
    '/get_region_list'
], (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json({
        "error": 0,
        "error_code": 0,
        "ret": 0,
        "result": true,
        "code": 0,
        "msg": "success",
        "data": {
            "uid": MASTER_UID,
            "user_id": MASTER_UID,
            "open_id": "op_100000001",
            "nickname": "Master_Sigma",
            "level": 99,
            "gold": 9999999,
            "diamond": 999999,
            "status": 1,
            "version": "1.0.0",
            "region": "IND"
        }
    });
});

// ==========================================
// 6. LOBBY SERVER & MAJOR INFO
// ==========================================
app.all([
    '/major_info', 
    '/api/major_info', 
    '/major_info/get', 
    '/server/list',
    '/get_lobby_info',
    '/lobby/info',
    '/api/v1/major_info'
], (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    const hostDomain = req.get('host');
    return res.status(200).json({
        "error": 0,
        "error_code": 0,
        "ret": 0,
        "result": true,
        "code": 0,
        "msg": "success",
        "data": {
            "uid": MASTER_UID,
            "nickname": "Master_Sigma",
            "region": "IND",
            "lobby_ip": hostDomain,
            "lobby_port": 443,
            "chat_ip": hostDomain,
            "chat_port": 443,
            "allow_login": 1,
            "is_ban": 0,
            "gate_server": {
                "ip": hostDomain,
                "port": 443
            },
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
// 7. UNIVERSAL FALLBACK CATCH-ALL
// ==========================================
app.all('*', (req, res) => {
    console.log(`⚠️ [FALLBACK HIT]: ${req.method} ${req.originalUrl}`);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    const hostDomain = req.get('host');
    const now = getTimestamp();

    return res.status(200).json({
        "error": 0,
        "error_code": 0,
        "ret": 0,
        "result": true,
        "code": 0,
        "msg": "success",
        "status": "success",
        "is_valid": 1,
        "open_id": "op_100000001",
        "openid": "op_100000001",
        "uid": MASTER_UID,
        "user_id": MASTER_UID,
        "access_token": MASTER_TOKEN,
        "refresh_token": MASTER_TOKEN,
        "create_time": now,
        "expires_in": 31536000,
        "data": {
            "uid": MASTER_UID,
            "nickname": "Master_Sigma",
            "lobby_ip": hostDomain,
            "lobby_port": 443
        }
    });
});

// Listener & TCP Socket Connection
const PORT = process.env.PORT || 10000;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server fully operational on port ${PORT}`);
});

server.on('connection', (socket) => {
    socket.on('data', () => {
        try {
            // Echo Handshake Back to keep TCP Socket alive
            const ackBuffer = Buffer.from([0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00]);
            socket.write(ackBuffer);
        } catch (e) {
            console.error('Socket error ignored:', e.message);
        }
    });

    socket.on('error', () => {});
});
