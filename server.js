/**
 * 🚀 NEXUS-SIGMA ALL-IN-ONE MASTER PRIVATE SERVER
 * Developed for Master | Year: 2026
 * Handles full flow: Auth -> Handshake -> Major Info -> Lobby -> Config
 */

const express = require('express');
const cors = require('cors');
const app = express();

// ==========================================
// 📦 1. CORE MIDDLEWARE & CORS
// ==========================================
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cors());

// Global Headers Setup
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

// Live Terminal Console Logger
app.use((req, res, next) => {
    console.log(`\n📡 [NEXUS HIT] ➔ ${new Date().toISOString()}`);
    console.log(`🔌 METHOD : ${req.method} | PATH : ${req.path}`);
    if (Object.keys(req.query).length) console.log(`🔍 QUERY  :`, JSON.stringify(req.query, null, 2));
    if (Object.keys(req.body).length) console.log(`📦 BODY   :`, JSON.stringify(req.body, null, 2));
    console.log(`──────────────────────────────────────────────────────`);
    next();
});

// ==========================================
// 🗄️ 2. IN-MEMORY MASTER PLAYER DATABASE
// ==========================================
const NEXUS_DB = {
    app_config: { app_id: 100067, app_name: "Sigma Private Server", version: "1.0.0", status: 1 },
    player_profile: {
        uid: "100000001",
        open_id: "op_100000001",
        nickname: "Master_Sigma",
        level: 99,
        exp: 999999,
        gold: 9999999,
        diamond: 999999,
        score: 99999,
        rank_score: 5500,
        avatar: "avatar_id_001",
        avatar_frame: "frame_gold_nexus",
        title: "Nexus Creator",
        region: "IND"
    },
    inventory: [
        { item_id: 5001, name: "Nexus Premium Elite Bundle", quantity: 1, type: "skin", permanent: true },
        { item_id: 6002, name: "Neon Evolution Weapon Skin", quantity: 1, type: "weapon_skin", permanent: true }
    ],
    mailbox: [
        { mail_id: "m_101", title: "Welcome Master!", content: "All systems active & fully synced.", read: false, rewards: { gold: 50000, diamond: 5000 } }
    ]
};

const MASTER_TOKEN = "NEXUS_OFFICIAL_SECURE_TOKEN_VALID_2026_PRODUCTION_MATRIX";

const getDynamicTime = () => {
    const current = Math.floor(Date.now() / 1000);
    const expiry = current + (365 * 24 * 60 * 60);
    return { current, expiry };
};

const getHostDomain = (req) => req.get('host');
const getHostUrl = (req) => `${req.protocol}://${req.get('host')}`;

// ==========================================
// 🤝 3. HANDSHAKE & INITIALIZATION
// ==========================================

app.all(['/app/info/get', '/api/app/info/get', '/v1/app/info'], (req, res) => {
    const hostUrl = getHostUrl(req);
    return res.status(200).json({
        "ret": 0, "result": 0, "msg": "success",
        "data": { "app_id": NEXUS_DB.app_config.app_id, "app_name": NEXUS_DB.app_config.app_name, "status": NEXUS_DB.app_config.status, "version": NEXUS_DB.app_config.version },
        "overlay_config_url": `${hostUrl}/rct/ver.php`
    });
});

app.all(['/rct/ver.php', '/ver.php', '/api/ver.php'], (req, res) => {
    const hostUrl = getHostUrl(req);
    return res.status(200).json({
        "code": 0, "is_server_open": true, "is_firewall_open": true, "remote_version": NEXUS_DB.app_config.version,
        "cdn_url": `${hostUrl}/`, "server_url": `${hostUrl}/`, "country_code": "IN", "sigma_login": true, "sigma_switch": true
    });
});

// ==========================================
// 🔑 4. AUTHENTICATION & TOKEN SYSTEMS
// ==========================================

app.all(['/oauth/guest/register', '/guest/register', '/api/v1/guest/register', '/oauth/guest/token/grant', '/guest/token/grant'], (req, res) => {
    const times = getDynamicTime();
    return res.status(200).json({
        "ret": 0, "result": true, "msg": "success", "is_valid": 1,
        "open_id": NEXUS_DB.player_profile.open_id, "uid": NEXUS_DB.player_profile.uid, "user_id": NEXUS_DB.player_profile.uid,
        "access_token": MASTER_TOKEN, "refresh_token": MASTER_TOKEN,
        "create_time": times.current, "expiry_time": times.expiry, "expires_in": 31536000, "platform": 4,
        "data": { "uid": NEXUS_DB.player_profile.uid, "nickname": NEXUS_DB.player_profile.nickname, "lobby_server": "connected" }
    });
});

app.all(['/oauth/token/inspect', '/token/inspect', '/api/token/inspect'], (req, res) => {
    const times = getDynamicTime();
    const inboundToken = req.query.access_token || req.body.access_token || MASTER_TOKEN;
    return res.status(200).json({
        "ret": 0, "result": true, "error_code": 0, "msg": "success",
        "open_id": NEXUS_DB.player_profile.open_id, "uid": NEXUS_DB.player_profile.uid, "user_id": NEXUS_DB.player_profile.uid,
        "access_token": inboundToken, "refresh_token": inboundToken,
        "create_time": times.current, "expiry_time": times.expiry, "expires_in": 31536000,
        "platform": 1, "is_valid": 1
    });
});

// ==========================================
// 🚪 5. TAP TO BEGIN & MAJOR INFO (CRITICAL FIX)
// ==========================================

app.all(['/major_info', '/api/major_info', '/major/info/get', '/major', '/major_info/get'], (req, res) => {
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
            "is_ban": 0,
            "level": NEXUS_DB.player_profile.level,
            "gold": NEXUS_DB.player_profile.gold,
            "diamond": NEXUS_DB.player_profile.diamond
        }
    });
});

app.all(['/server/list', '/api/server/list', '/game/server/list'], (req, res) => {
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
// 👤 6. LOBBY PROFILE & USER SYSTEMS
// ==========================================

app.all(['/oauth/user/info/get', '/user/info', '/api/user/profile', '/user/profile/get'], (req, res) => {
    return res.status(200).json({
        "ret": 0, "result": true, "msg": "success",
        "data": {
            "uid": NEXUS_DB.player_profile.uid, "user_id": NEXUS_DB.player_profile.uid, "open_id": NEXUS_DB.player_profile.open_id,
            "nickname": NEXUS_DB.player_profile.nickname, "level": NEXUS_DB.player_profile.level,
            "gold": NEXUS_DB.player_profile.gold, "diamond": NEXUS_DB.player_profile.diamond,
            "score": NEXUS_DB.player_profile.score, "rank_score": NEXUS_DB.player_profile.rank_score,
            "avatar": NEXUS_DB.player_profile.avatar, "avatar_frame": NEXUS_DB.player_profile.avatar_frame,
            "title": NEXUS_DB.player_profile.title, "exp": NEXUS_DB.player_profile.exp
        },
        "info": { "user_id": NEXUS_DB.player_profile.uid, "nickname": NEXUS_DB.player_profile.nickname, "region": "IN" }
    });
});

// Inventory / Backpack
app.all(['/inventory/items', '/api/inventory/get', '/user/bag', '/item/list'], (req, res) => {
    return res.status(200).json({
        "ret": 0, "result": true, "msg": "success",
        "data": { "backpack_slots": NEXUS_DB.inventory.length, "items": NEXUS_DB.inventory }
    });
});

// Mailbox System
app.all(['/mailbox/list', '/api/mail/get', '/mail/all', '/mail/list'], (req, res) => {
    return res.status(200).json({
        "ret": 0, "result": true, "msg": "success",
        "data": { "total_count": NEXUS_DB.mailbox.length, "mails": NEXUS_DB.mailbox }
    });
});

// Notices & Announcements
app.all(['/api/v1/login/notice', '/notice/get', '/info/notice', '/notice'], (req, res) => {
    return res.status(200).json({
        "ret": 0, "result": true, "msg": "success",
        "notices": [{ "id": 777, "title": "Welcome Master", "content": "Nexus Private Core Synced.", "type": "popup" }]
    });
});

// Character Config & Loadout
app.all(['/character/get', '/api/character/info', '/loadout/get'], (req, res) => {
    return res.status(200).json({
        "ret": 0, "result": true, "msg": "success",
        "data": { "active_character_id": 1, "unlocked_characters": [1, 2, 3], "skills": [] }
    });
});

// Matchmaking / Room Ping Endpoint
app.all(['/match/ping', '/game/ping', '/v1/heartbeat', '/heartbeat'], (req, res) => {
    const times = getDynamicTime();
    return res.status(200).json({
        "ret": 0, "result": true, "msg": "success", "server_time": times.current
    });
});

// ==========================================
// 🛡️ 7. UNIVERSAL SMART CATCH-ALL (FALLBACK)
// ==========================================
app.all('*', (req, res) => {
    const times = getDynamicTime();
    const hostDomain = getHostDomain(req);
    return res.status(200).json({
        "ret": 0,
        "result": true,
        "msg": "success",
        "is_valid": 1,
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

// ==========================================
// 🚀 8. SERVER START
// ==========================================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`\n🔥 NEXUS SYSTEM RE-ARMED ON PORT: ${PORT}`);
    console.log(`🧠 ALL GAME ROUTES & FALLBACKS READY.\n`);
});
