/**
 * 🚀 NEXUS-SIGMA OFFICIAL PRIVATE SERVER - PRODUCTION CORE V12
 * Developed for Master | Year: 2026
 * Full Fixed Bundle: Bypasses Session Expired, Connection Timeout & Lobby Errors
 */

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const app = express();

// ==========================================
// 📦 1. CORE SERVER CONFIGURATIONS
// ==========================================
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cors());

// Live Traffic Console Monitor
app.use((req, res, next) => {
    console.log(`\n📡 [NEXUS HIT] ➔ ${new Date().toISOString()}`);
    console.log(`🔌 METHOD : ${req.method} | PATH : ${req.path}`);
    if (Object.keys(req.query).length) console.log(`🔍 QUERY  :`, JSON.stringify(req.query, null, 2));
    if (Object.keys(req.body).length) console.log(`📦 BODY   :`, JSON.stringify(req.body, null, 2));
    console.log(`──────────────────────────────────────────────────────`);
    next();
});

// Dynamic Expiry Calculation Utility (Unix format: Seconds, not Milliseconds)
const getDynamicTime = () => {
    const current = Math.floor(Date.now() / 1000);
    const expiry = current + (365 * 24 * 60 * 60); // 1 Year Lifetime Extension
    return { current, expiry };
};

// ==========================================
// 🗄️ 2. IN-MEMORY MASTER DATABASE
// ==========================================
const NEXUS_DB = {
    app_config: { app_id: 100067, app_name: "Sigma Nexus Private", version: "1.0.0", status: 1 },
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
        title: "Nexus Creator"
    },
    cluster_nodes: [
        { server_id: 1, server_name: "Nexus Production Core A", ip: "127.0.0.1", port: 8080, status: "smooth", is_recommend: true }
    ],
    inventory: [
        { item_id: 5001, name: "Nexus Premium Elite Bundle", quantity: 1, type: "skin", permanent: true },
        { item_id: 6002, name: "Neon Evolution Weapon Skin", quantity: 1, type: "weapon_skin", permanent: true }
    ],
    mailbox: [
        { mail_id: "nexus_m1", title: "Master Access Granted", content: "Session Expiry Patch V12 Applied.", read: false, rewards: { gold: 10000, diamond: 1000 } }
    ]
};

const MASTER_TOKEN = "NEXUS_OFFICIAL_SECURE_TOKEN_VALID_2026_PRODUCTION_MATRIX";

// ==========================================
// 📱 3. HANDSHAKE & INITIALIZATION PATHS
// ==========================================

app.all(['/app/info/get', '/api/app/info/get', '/v1/app/info'], (req, res) => {
    const hostUrl = `${req.protocol}://${req.get('host')}/`;
    return res.status(200).json({
        "ret": 0, "result": 0, "msg": "success",
        "data": { "app_id": NEXUS_DB.app_config.app_id, "app_name": NEXUS_DB.app_config.app_name, "status": NEXUS_DB.app_config.status, "version": NEXUS_DB.app_config.version },
        "overlay_config_url": `${hostUrl}rct/ver.php`
    });
});

app.all(['/rct/ver.php', '/ver.php', '/api/ver.php'], (req, res) => {
    const hostUrl = `${req.protocol}://${req.get('host')}/`;
    return res.status(200).json({
        "code": 0, "is_server_open": true, "is_firewall_open": true, "remote_version": NEXUS_DB.app_config.version,
        "cdn_url": hostUrl, "server_url": hostUrl, "country_code": "IN", "sigma_login": true, "sigma_switch": true
    });
});

// ==========================================
// 🔑 4. FIXED AUTHENTICATION (ANTI-EXPIRY)
// ==========================================

app.all(['/oauth/guest/register', '/guest/register', '/api/v1/guest/register'], (req, res) => {
    const times = getDynamicTime();
    return res.status(200).json({
        "ret": 0, "result": true, "msg": "success",
        "open_id": NEXUS_DB.player_profile.open_id, "uid": NEXUS_DB.player_profile.uid, "user_id": NEXUS_DB.player_profile.uid,
        "access_token": MASTER_TOKEN, "refresh_token": MASTER_TOKEN,
        "create_time": times.current, "expiry_time": times.expiry, "expires_in": 31536000, "platform": 4
    });
});

app.all(['/oauth/guest/token/grant', '/guest/token/grant', '/oauth/token/facebook/exchange'], (req, res) => {
    const times = getDynamicTime();
    return res.status(200).json({
        "ret": 0, "result": true, "msg": "success",
        "access_token": MASTER_TOKEN, "refresh_token": MASTER_TOKEN,
        "create_time": times.current, "expiry_time": times.expiry, "expires_in": 31536000,
        "uid": NEXUS_DB.player_profile.uid, "user_id": NEXUS_DB.player_profile.uid, "open_id": NEXUS_DB.player_profile.open_id
    });
});

// The Critical Token Inspect Patch - Fixes "Session Expired" Loop Completely
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
// 🖥️ 5. CLUSTER & SERVER ROSTER PATHS
// ==========================================

app.all(['/server/list', '/api/server/list', '/game/server/list'], (req, res) => {
    return res.status(200).json({
        "ret": 0, "msg": "success", "maintenance": false, "status": "online",
        "data": { "servers": NEXUS_DB.cluster_nodes, "recommend_server_id": 1 }
    });
});

// ==========================================
// 👤 6. STABLE LOBBY PROFILE & USER DATA
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

// ==========================================
// ⚙️ 7. GAME HEARTBEAT & KEEP-ALIVE SYSTEM
// ==========================================

app.all(['/game/init', '/api/config', '/info/config', '/v1/game/heartbeat', '/heartbeat'], (req, res) => {
    const times = getDynamicTime();
    return res.status(200).json({
        "ret": 0, "result": true, "msg": "success",
        "server_time": times.current,
        "data": { "status": "active", "lobby_server": "connected", "session_status": "authenticated" },
        "client_config": { "heartbeat_interval": 30, "log_level": "debug" }
    });
});

// Auxiliary Features (Inventory, Mail, Notices)
app.all(['/inventory/items', '/api/inventory/get', '/user/bag'], (req, res) => {
    return res.status(200).json({ "ret": 0, "msg": "success", "data": { "backpack_slots": NEXUS_DB.inventory.length, "items": NEXUS_DB.inventory } });
});

app.all(['/mailbox/list', '/api/mail/get', '/mail/all'], (req, res) => {
    return res.status(200).json({ "ret": 0, "msg": "success", "data": { "total_count": NEXUS_DB.mailbox.length, "mails": NEXUS_DB.mailbox } });
});

app.all(['/api/v1/login/notice', '/notice/get', '/info/notice'], (req, res) => {
    return res.status(200).json({
        "ret": 0, "result": true, "msg": "success",
        "notices": [{ "id": 777, "title": "Nexus Notice", "content": "Session Stabilized Successfully.", "type": "popup" }]
    });
});

// ==========================================
// 🎯 8. UNIVERSAL FALLBACK INTRUSION GUARD
// ==========================================
app.all('*', (req, res) => {
    const times = getDynamicTime();
    return res.status(200).json({
        "ret": 0, "result": true, "msg": "success", "is_valid": 1,
        "open_id": NEXUS_DB.player_profile.open_id, "uid": NEXUS_DB.player_profile.uid, "user_id": NEXUS_DB.player_profile.uid,
        "access_token": MASTER_TOKEN, "refresh_token": MASTER_TOKEN,
        "create_time": times.current, "expiry_time": times.expiry, "expires_in": 31536000,
        "data": { "uid": NEXUS_DB.player_profile.uid, "nickname": NEXUS_DB.player_profile.nickname, "lobby_server": "connected" }
    });
});

// ==========================================
// 🚀 9. SERVER ACTIVATION
// ==========================================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`\n🔥 NEXUS SYSTEM PRODUCTION CODE RE-ARMED ON PORT: ${PORT}`);
    console.log(`🧠 LIVE TIMESTAMPS SYNCED FOR THE YEAR 2026. SESSION TIMEOUT BYPASS ACTIVE.\n`);
});

