/**
 * 🚀 NEXUS-SIGMA BEETALK MSDK COMPATIBLE SERVER
 * Synced directly with Lcom/beetalk/sdk/p smali routes
 */

const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cors());

// Global CORS & Bypass
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

// Live Traffic Logger
app.use((req, res, next) => {
    console.log(`\n📡 [BEETALK HIT] ➔ ${new Date().toISOString()}`);
    console.log(`🔌 METHOD : ${req.method} | PATH : ${req.path}`);
    if (Object.keys(req.query).length) console.log(`🔍 QUERY  :`, JSON.stringify(req.query));
    if (Object.keys(req.body).length) console.log(`📦 BODY   :`, JSON.stringify(req.body));
    console.log(`──────────────────────────────────────────────────────`);
    next();
});

const MASTER_TOKEN = "NEXUS_OFFICIAL_SECURE_TOKEN_VALID_2026_PRODUCTION_MATRIX";

const NEXUS_DB = {
    app_config: { app_id: 100067, app_name: "Sigma Private Server", version: "5.131", status: 1 },
    player_profile: {
        uid: "100000001",
        open_id: "op_100000001",
        nickname: "Master_Sigma",
        level: 99,
        gold: 9999999,
        diamond: 999999,
        region: "IND"
    }
};

const getDynamicTime = () => {
    const current = Math.floor(Date.now() / 1000);
    const expiry = current + (365 * 24 * 60 * 60);
    return { current, expiry };
};

const getHostDomain = (req) => req.get('host');
const getHostUrl = (req) => `${req.protocol}://${req.get('host')}`;

// ==========================================
// 1. BEETALK APP CONFIG & VER (Smali: b())
// ==========================================
app.all(['/app/info/get', '/api/app/info/get'], (req, res) => {
    const hostUrl = getHostUrl(req);
    return res.status(200).json({
        "ret": 0, "result": 0, "msg": "success",
        "data": { 
            "app_id": NEXUS_DB.app_config.app_id, 
            "app_name": NEXUS_DB.app_config.app_name, 
            "status": NEXUS_DB.app_config.status, 
            "version": NEXUS_DB.app_config.version 
        },
        "overlay_config_url": `${hostUrl}/rct/ver.php`
    });
});

app.all(['/rct/ver.php', '/ver.php'], (req, res) => {
    const hostUrl = getHostUrl(req);
    return res.status(200).json({
        "code": 0, "is_server_open": true, "is_firewall_open": true, 
        "remote_version": NEXUS_DB.app_config.version,
        "cdn_url": `${hostUrl}/`, "server_url": `${hostUrl}/`, "country_code": "IN", 
        "sigma_login": true, "sigma_switch": true
    });
});

// ==========================================
// 2. BEETALK GUEST REGISTER (Smali: H())
// ==========================================
app.all(['/oauth/guest/register', '/guest/register'], (req, res) => {
    const times = getDynamicTime();
    return res.status(200).json({
        "ret": 0, "result": true, "msg": "success", "is_valid": 1,
        "open_id": NEXUS_DB.player_profile.open_id, 
        "uid": NEXUS_DB.player_profile.uid, 
        "user_id": NEXUS_DB.player_profile.uid,
        "access_token": MASTER_TOKEN, 
        "refresh_token": MASTER_TOKEN,
        "create_time": times.current, 
        "expiry_time": times.expiry, 
        "expires_in": 31536000, 
        "platform": 4
    });
});

// ==========================================
// 3. BEETALK TOKEN INSPECT & REFRESH (Smali: K(), L())
// ==========================================
app.all(['/oauth/token/inspect', '/oauth/token/refresh', '/token/inspect'], (req, res) => {
    const times = getDynamicTime();
    const inboundToken = req.query.access_token || req.body.access_token || MASTER_TOKEN;
    return res.status(200).json({
        "ret": 0, "result": true, "error_code": 0, "msg": "success",
        "open_id": NEXUS_DB.player_profile.open_id, 
        "uid": NEXUS_DB.player_profile.uid, 
        "user_id": NEXUS_DB.player_profile.uid,
        "access_token": inboundToken, 
        "refresh_token": inboundToken,
        "create_time": times.current, 
        "expiry_time": times.expiry, 
        "expires_in": 31536000,
        "platform": 1, "is_valid": 1
    });
});

// ==========================================
// 4. BEETALK USER PROFILE (Smali: M())
// ==========================================
app.all(['/oauth/user/info/get', '/user/info'], (req, res) => {
    return res.status(200).json({
        "ret": 0, "result": true, "msg": "success",
        "data": {
            "uid": NEXUS_DB.player_profile.uid, 
            "user_id": NEXUS_DB.player_profile.uid, 
            "open_id": NEXUS_DB.player_profile.open_id,
            "nickname": NEXUS_DB.player_profile.nickname, 
            "level": NEXUS_DB.player_profile.level,
            "gold": NEXUS_DB.player_profile.gold, 
            "diamond": NEXUS_DB.player_profile.diamond
        },
        "info": { "user_id": NEXUS_DB.player_profile.uid, "nickname": NEXUS_DB.player_profile.nickname, "region": "IN" }
    });
});

// ==========================================
// 5. MAJOR INFO & SERVER LIST (Tap To Begin Fix)
// ==========================================
app.all(['/major_info', '/api/major_info', '/major_info/get'], (req, res) => {
    const hostDomain = getHostDomain(req);
    return res.status(200).json({
        "ret": 0, "result": true, "msg": "success",
        "data": {
            "uid": NEXUS_DB.player_profile.uid,
            "nickname": NEXUS_DB.player_profile.nickname,
            "region": NEXUS_DB.player_profile.region,
            "lobby_ip": hostDomain,
            "lobby_port": 443,
            "chat_ip": hostDomain,
            "chat_port": 443,
            "allow_login": 1,
            "is_ban": 0
        }
    });
});

app.all(['/server/list', '/api/server/list'], (req, res) => {
    const hostDomain = getHostDomain(req);
    return res.status(200).json({
        "ret": 0, "msg": "success", "maintenance": false, "status": "online",
        "data": {
            "servers": [
                { "server_id": 1, "server_name": "Nexus Master Core", "ip": hostDomain, "port": 443, "status": "smooth", "is_recommend": true }
            ],
            "recommend_server_id": 1
        }
    });
});

// ==========================================
// 6. BEETALK OTHER AUXILIARY ENDPOINTS (c, d, J, D, E, F, G)
// ==========================================
app.all([
    '/oauth/logout',
    '/bind/app/platform/create',
    '/bind/app/platform/info/get',
    '/game/user/request/send',
    '/api/msdk/*',
    '/pay/event/*',
    '/info/rebates',
    '/rebates/redeem'
], (req, res) => {
    return res.status(200).json({
        "ret": 0, "result": true, "msg": "success", "code": 0, "data": {}
    });
});

// ==========================================
// 7. UNIVERSAL FALLBACK FOR ANY UNHANDLED ROUTE
// ==========================================
app.all('*', (req, res) => {
    const times = getDynamicTime();
    const hostDomain = getHostDomain(req);
    return res.status(200).json({
        "ret": 0, "result": true, "msg": "success", "is_valid": 1,
        "open_id": NEXUS_DB.player_profile.open_id, 
        "uid": NEXUS_DB.player_profile.uid, 
        "user_id": NEXUS_DB.player_profile.uid,
        "access_token": MASTER_TOKEN, 
        "refresh_token": MASTER_TOKEN,
        "create_time": times.current, 
        "expiry_time": times.expiry, 
        "expires_in": 31536000,
        "data": {
            "uid": NEXUS_DB.player_profile.uid,
            "nickname": NEXUS_DB.player_profile.nickname,
            "lobby_server": "connected",
            "lobby_ip": hostDomain,
            "lobby_port": 443
        }
    });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`\n🔥 BEETALK SYNCED SERVER ONLINE ON PORT: ${PORT}`);
});
