/**
 * 🚀 SIGMA PRIVATE SERVER FULL STACK BACKEND
 * (Handles HTTP Endpoints + TCP Socket Gateway for Lobby Entry)
 */

const express = require('express');
const cors = require('cors');
const net = require('net');

const app = express();

// Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({ origin: '*', credentials: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') return res.status(200).end();
    next();
});

// Request Logger
app.use((req, res, next) => {
    console.log(`\n📥 [HTTP REQUEST] ${req.method} -> ${req.originalUrl}`);
    if (Object.keys(req.body).length) console.log(`📦 Body:`, JSON.stringify(req.body));
    next();
});

const getTimestamp = () => Math.floor(Date.now() / 1000);

// 1. RCT / VERSION HANDSHAKE
app.all(['/rct', '/rct/', '/rct/*', '/rct/ver.php', '/ver.php'], (req, res) => {
    const hostUrl = `${req.protocol}://${req.get('host')}`;
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

// 2. BEETALK AUTH & GUEST GRANT
app.all([
    '/oauth/guest/token/grant',
    '/oauth/guest/register', 
    '/guest/register', 
    '/oauth/access_token',
    '/oauth/token/inspect', 
    '/oauth/token/refresh',
    '/oauth/login',
    '/oauth/grant'
], (req, res) => {
    const now = getTimestamp();
    const token = "NEXUS_MASTER_SECURE_TOKEN_2026";
    const uid = req.body.uid || "100000001";

    return res.status(200).json({
        "error": 0,
        "error_code": 0,
        "ret": 0,
        "result": true,
        "status": "success",
        "msg": "success",
        "account_id": uid,
        "uid": uid,
        "user_id": uid,
        "open_id": "op_100000001",
        "openid": "op_100000001",
        "access_token": token,
        "refresh_token": token,
        "create_time": now,
        "expiry_time": now + 31536000,
        "expires_in": 31536000,
        "platform": 4,
        "is_valid": 1,
        "session_key": token
    });
});

// 3. USER PROFILE & APP CONFIG
app.all([
    '/oauth/user/info/get', 
    '/user/info', 
    '/app/info/get', 
    '/api/app/info/get',
    '/client_init',
    '/get_region_list'
], (req, res) => {
    return res.status(200).json({
        "error": 0,
        "error_code": 0,
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
            "version": "5.131",
            "region": "IND"
        }
    });
});

// 4. LOBBY SERVER & MAJOR INFO (DIRECT ENTRY BINDING)
app.all([
    '/major_info', 
    '/api/major_info', 
    '/major_info/get', 
    '/server/list',
    '/get_lobby_info',
    '/lobby/info'
], (req, res) => {
    const hostDomain = req.get('host');
    return res.status(200).json({
        "error": 0,
        "error_code": 0,
        "ret": 0,
        "result": true,
        "code": 0,
        "msg": "success",
        "data": {
            "uid": "100000001",
            "nickname": "Master_Sigma",
            "region": "IND",
            "lobby_ip": hostDomain,
            "lobby_port": 10000,
            "chat_ip": hostDomain,
            "chat_port": 10000,
            "allow_login": 1,
            "is_ban": 0,
            "gate_server": {
                "ip": hostDomain,
                "port": 10000
            },
            "servers": [
                {
                    "server_id": 1,
                    "server_name": "Nexus Core Server",
                    "ip": hostDomain,
                    "port": 10000,
                    "status": "smooth",
                    "is_recommend": true
                }
            ],
            "recommend_server_id": 1
        }
    });
});

// 5. CATCH-ALL FALLBACK
app.all('*', (req, res) => {
    console.log(`⚠️ [FALLBACK]: ${req.method} ${req.originalUrl}`);
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
        "uid": "100000001",
        "user_id": "100000001",
        "access_token": "NEXUS_MASTER_SECURE_TOKEN_2026",
        "refresh_token": "NEXUS_MASTER_SECURE_TOKEN_2026",
        "create_time": now,
        "expires_in": 31536000,
        "data": {
            "uid": "100000001",
            "nickname": "Master_Sigma",
            "lobby_ip": hostDomain,
            "lobby_port": 10000
        }
    });
});

const PORT = process.env.PORT || 10000;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 HTTP & Socket Gateway fully active on port ${PORT}`);
});

// TCP Gateway Handshake Handler (Socket Disconnect Fix)
server.on('connection', (socket) => {
    socket.on('data', (data) => {
        // Echo Handshake ACK back to client to prevent "Network Error"
        const ackBuffer = Buffer.from([0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00]);
        socket.write(ackBuffer);
    });
});
