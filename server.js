/**
 * 🚀 NEXUS-SIGMA OFFICIAL PRIVATE SERVER - PRODUCTION CORE V11
 * Developed for Master | Total Lines: ~500+ 
 * Universal Framework for Guest, Facebook, Lobby, and In-Game Shop Bypasses
 */

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const app = express();

// ==========================================
// 📦 1. कोर सर्वर सेटिंग्स और मिडलवेयर्स
// ==========================================
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cors());

// रीयल-टाइम ट्रैफिक डीप कंसोल मॉनिटर (टर्मक्स/रेंडर पर लाइव देखने के लिए)
app.use((req, res, next) => {
    console.log(`\n📡 [NEXUS TRAFFIC] ➔ ${new Date().toISOString()}`);
    console.log(`🔌 METHOD : ${req.method} | TARGET PATH : ${req.path}`);
    if (Object.keys(req.query).length) console.log(`🔍 QUERY  :`, JSON.stringify(req.query, null, 2));
    if (Object.keys(req.body).length) console.log(`📦 BODY   :`, JSON.stringify(req.body, null, 2));
    console.log(`──────────────────────────────────────────────────────`);
    next();
});

// ==========================================
// 🗄️ 2. इन-मेमोरी नेक्सस मास्टर डेटाबेस
// ==========================================
const NEXUS_DB = {
    app_config: {
        app_id: 100067,
        app_name: "Sigma Nexus Private",
        version: "1.0.0",
        status: 1, // 1 = Active, 0 = Maintenance
        maintenance: false
    },
    player_profile: {
        uid: "100000001",
        open_id: "op_100000001",
        nickname: "Master_Sigma",
        level: 99,
        exp: 999999,
        gold: 9999999,
        diamond: 999999,
        score: 99999,        // 👈 आपका बिग स्कोर यहाँ है, मास्टर!
        rank_score: 5500,    // ग्रैंडमास्टर टियर रैंक
        avatar: "avatar_id_001",
        avatar_frame: "frame_gold_nexus",
        title: "Nexus Creator",
        vip_level: 10,
        energy: 100,
        max_energy: 100
    },
    cluster_nodes: [
        { server_id: 1, server_name: "Nexus Production Core A", ip: "127.0.0.1", port: 8080, status: "smooth", is_recommend: true },
        { server_id: 2, server_name: "Nexus High-Speed Core B", ip: "127.0.0.1", port: 8081, status: "smooth", is_recommend: false }
    ],
    inventory: [
        { item_id: 5001, name: "Nexus Premium Elite Bundle", quantity: 1, type: "skin", permanent: true },
        { item_id: 6002, name: "Neon Evolution Weapon Skin", quantity: 1, type: "weapon_skin", permanent: true },
        { item_id: 2005, name: "Infinite Custom Room Card", quantity: 999, type: "ticket", permanent: false }
    ],
    mailbox: [
        { mail_id: "nexus_m1", title: "Master Access Granted", content: "Welcome to your Nexus Official Private Server Infrastructure.", read: false, rewards: { gold: 10000, diamond: 1000 } }
    ],
    shop_pricing: [
        { product_id: "diamonds_100", price: "0.00", quantity: 100 },
        { product_id: "diamonds_500", price: "0.00", quantity: 500 },
        { product_id: "diamonds_1000", price: "0.00", quantity: 1000 },
        { product_id: "elite_pass", price: "0.00", quantity: 1 }
    ]
};

const TOKENS = {
    guest: "NEXUS_OFFICIAL_GUEST_SECURE_TOKEN_VALID_2026",
    facebook: "NEXUS_OFFICIAL_FACEBOOK_PREMIUM_TOKEN_VALID_2026"
};

// डायनामिक 1-साल फ्यूचर एक्सपायरी टाइमस्टैम्प जनरेटर (Fixes Session Expired)
const getDynamicExpiry = () => Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60);

// ==========================================
// 📱 3. ऐप इनिशियलाइजेशन (info/get) रूट्स
// ==========================================

// /app/info/get पैच 
app.all(['/app/info/get', '/api/app/info/get', '/v1/app/info', '/app/info'], (req, res) => {
    console.log(`[📱 ENGINE HANDSHAKE] Dispatching Application Integrity Configurations.`);
    const hostUrl = `${req.protocol}://${req.get('host')}/`;
    
    return res.status(200).json({
        "ret": 0,
        "result": 0,
        "msg": "success",
        "data": {
            "app_id": NEXUS_DB.app_config.app_id,
            "app_name": NEXUS_DB.app_config.app_name,
            "status": NEXUS_DB.app_config.status,
            "update_url": "",
            "version": NEXUS_DB.app_config.version
        },
        "client_log": false,
        "overlay_config_url": `${hostUrl}rct/ver.php`
    });
});

// rct/ver.php पैच (हूबहू ओरिजinal गंतव्य के समान स्ट्रक्चर)
app.all(['/rct/ver.php', '/ver.php', '/api/ver.php'], (req, res) => {
    console.log(`[📄 CONFIG FLOW] Supplying dynamic overlay patch metadata engine matrix.`);
    const hostUrl = `${req.protocol}://${req.get('host')}/`;

    return res.status(200).json({
        "code": 0,
        "is_server_open": true,
        "is_firewall_open": true,
        "need_track_hotupdate": false,
        "min_hint_size": 0,
        "billboard_cdn_url": "",
        "billboard_msg": "Welcome to Nexus Sigma Private Shard Network, Master!",
        "patchnote_url": "",
        "web_url": "",
        "billboard_bg_url": "",
        "max_store": "",
        "max_web": "",
        "max_video": "",
        "remote_version": NEXUS_DB.app_config.version,
        "remote_option_version": NEXUS_DB.app_config.version,
        "cdn_url": hostUrl,
        "backup_cdn_url": hostUrl,
        "server_url": hostUrl,
        "is_review_server": false,
        "appstore_url": hostUrl,
        "force_to_restart_app": false,
        "country_code": "IN",
        "gdpr_version": 0,
        "client_ip": req.ip || "127.0.0.1",
        "maintenance_announcement": "",
        "maintenance_region": "",
        "need_check_ip_list": [],
        "network_log_server": hostUrl,
        "web_log_server": hostUrl,
        "login_failed_count": 0,
        "test_url": hostUrl,
        "img_cdn_url": hostUrl,
        "core_url": hostUrl,
        "core_ip_list": [],
        "is_update_btn_show": false,
        "is_use_multi_download": false,
        "use_login_optional_download": false,
        "use_background_download": false,
        "use_background_download_lobby": false,
        "use_backgound_download_mem_thredshold": 0,
        "sigma_login": true,
        "sigma_switch": true,
        "enable_clear_mem_when_autopause": false,
        "space_required_in_GB": 0,
        "sigma_backup_url": hostUrl,
        "login_download_optionalpack": ""
    });
});

// ==========================================
// 🌐 4. गेस्ट और फेसबुक ऑथेंटिकेशन रूट्स
// ==========================================

// मुख्य लॉगिन पाथ (रीडायरेक्टर गेटवे)
app.get(['/oauth/login', '/oauth/garena'], (req, res) => {
    console.log(`[🔵 AUTH INTERCEPT] Allocating session tokens.`);
    const redirectUri = req.query.redirect_uri || 'gop100138://auth/';
    const state = req.query.state || '';
    
    const targetUrl = `${redirectUri}?code=nexus_official_master_pass_prod&state=${state}&access_token=${TOKENS.facebook}&expiry_time=${getDynamicExpiry()}`;
    console.log(`[🔵 AUTH SUCCESS] Client redirected via: ${targetUrl}`);
    return res.redirect(targetUrl);
});

// गेस्ट रजिस्ट्रेशन पाथ
app.all(['/oauth/guest/register', '/guest/register', '/api/v1/guest/register'], (req, res) => {
    console.log(`[👤 GUEST GATE] Deploying clean ephemeral profile data.`);
    return res.status(200).json({
        "ret": 0,
        "result": true,
        "error_code": 0,
        "msg": "success",
        "open_id": NEXUS_DB.player_profile.open_id,
        "uid": NEXUS_DB.player_profile.uid,
        "user_id": NEXUS_DB.player_profile.uid,
        "access_token": TOKENS.guest,
        "refresh_token": TOKENS.guest,
        "expiry_time": getDynamicExpiry(),
        "expires_in": 2592000,
        "platform": 4,
        "is_new_player": false
    });
});

// गेस्ट टोकन ग्रांट/रिफ्रेश पाथ
app.all(['/oauth/guest/token/grant', '/guest/token/grant', '/oauth/token/refresh'], (req, res) => {
    console.log(`[👤 GUEST LEASE] Re-validating guest token parameters.`);
    return res.status(200).json({
        "ret": 0,
        "result": true,
        "error_code": 0,
        "msg": "success",
        "access_token": TOKENS.guest,
        "refresh_token": TOKENS.guest,
        "expiry_time": getDynamicExpiry(),
        "expires_in": 2592000,
        "uid": NEXUS_DB.player_profile.uid,
        "user_id": NEXUS_DB.player_profile.uid,
        "open_id": NEXUS_DB.player_profile.open_id
    });
});

// फेसबुक टोकन एक्सचेंज पाथ 
app.all(['/oauth/token/facebook/exchange', '/api/facebook/auth'], (req, res) => {
    console.log(`[🔵 FB EXCHANGE] Translating Facebook handshake vectors.`);
    return res.status(200).json({
        "ret": 0,
        "msg": "success",
        "access_token": TOKENS.facebook,
        "refresh_token": TOKENS.facebook,
        "uid": NEXUS_DB.player_profile.uid,
        "open_id": NEXUS_DB.player_profile.open_id,
        "expiry_time": getDynamicExpiry()
    });
});

// टोकन इंस्पेक्टर पाथ (Fixes "Session Expired" loop completely)
app.all(['/oauth/token/inspect', '/token/inspect', '/api/token/inspect'], (req, res) => {
    console.log(`[🔍 SESSION INSPECTOR] Checking inbound token validity against DB matrix.`);
    const inboundToken = req.query.access_token || req.body.access_token || TOKENS.facebook;
    
    return res.status(200).json({
        "ret": 0,
        "result": true,
        "error_code": 0,
        "msg": "success",
        "open_id": NEXUS_DB.player_profile.open_id,
        "uid": NEXUS_DB.player_profile.uid,
        "user_id": NEXUS_DB.player_profile.uid,
        "access_token": inboundToken,
        "refresh_token": inboundToken,
        "expiry_time": getDynamicExpiry(),
        "expires_in": 2592000,
        "platform": 1,
        "is_valid": 1
    });
});

// ==========================================
// 🖥️ 5. क्लस्टर और सर्वर लिस्ट पाथ्स
// ==========================================

// सर्वर लिस्ट पाथ (Bypasses "The server will be ready soon")
app.all(['/server/list', '/api/server/list', '/v1/server/list', '/game/server/list'], (req, res) => {
    console.log(`[🖥️  CLUSTER LIST] Sending active shard network matrix.`);
    return res.status(200).json({
        "ret": 0,
        "msg": "success",
        "maintenance": NEXUS_DB.app_config.maintenance,
        "status": "online",
        "data": {
            "servers": NEXUS_DB.cluster_nodes,
            "recommend_server_id": 1
        }
    });
});

// ==========================================
// 👤 6. लॉबी प्रोफाइल और यूजर डेटा सिंक पाथ्स
// ==========================================

// मुख्य प्रोफाइल पाथ (लॉबी स्क्रीन लोड करने का मुख्य आधार)
app.all(['/oauth/user/info/get', '/user/info', '/api/user/profile', '/user/profile/get'], (req, res) => {
    console.log(`[👤 PROFILE LOAD] Syncing assets, diamonds and levels into lobby.`);
    return res.status(200).json({
        "ret": 0,
        "result": true,
        "error_code": 0,
        "msg": "success",
        "data": {
            "uid": NEXUS_DB.player_profile.uid,
            "user_id": NEXUS_DB.player_profile.uid,
            "open_id": NEXUS_DB.player_profile.open_id,
            "nickname": NEXUS_DB.player_profile.nickname,
            "level": NEXUS_DB.player_profile.level,
            "gold": NEXUS_DB.player_profile.gold,
            "diamond": NEXUS_DB.player_profile.diamond,
            "score": NEXUS_DB.player_profile.score, 
            "rank_score": NEXUS_DB.player_profile.rank_score,
            "avatar": NEXUS_DB.player_profile.avatar,
            "avatar_frame": NEXUS_DB.player_profile.avatar_frame,
            "title": NEXUS_DB.player_profile.title,
            "vip": NEXUS_DB.player_profile.vip_level,
            "exp": NEXUS_DB.player_profile.exp,
            "energy": NEXUS_DB.player_profile.energy,
            "max_energy": NEXUS_DB.player_profile.max_energy
        },
        "info": {
            "user_id": NEXUS_DB.player_profile.uid,
            "nickname": NEXUS_DB.player_profile.nickname,
            "region": "IN"
        }
    });
});

// निकनेम मॉडिफिकेशन पाथ 
app.post(['/user/nickname/update', '/api/user/nickname'], (req, res) => {
    const customName = req.body.nickname || "Nexus_Master";
    NEXUS_DB.player_profile.nickname = customName;
    console.log(`[👤 PROFILE] Master name changed to: ${customName}`);
    return res.status(200).json({ "ret": 0, "result": true, "msg": "success", "data": { "nickname": customName } });
});

// ==========================================
// 🎒 7. इन्वेंटरी, इन-गेम शॉप और पेमेंट्स
// ==========================================

// इन्वेंटरी / लॉबी कलेक्शन लिस्ट
app.all(['/inventory/items', '/api/inventory/get', '/user/bag'], (req, res) => {
    console.log(`[🎒 INVENTORY] Pushing skin catalogs to engine client.`);
    return res.status(200).json({
        "ret": 0,
        "msg": "success",
        "data": { "backpack_slots": NEXUS_DB.inventory.length, "items": NEXUS_DB.inventory }
    });
});

// शॉप प्राइसिंग सूची पाथ
app.get(['/info/pricing', '/shop/list', '/api/shop/get'], (req, res) => {
    console.log(`[🛒 PRICING] Syncing premium pricing nodes.`);
    return res.status(200).json({
        "ret": 0,
        "result": true,
        "currency": "INR",
        "products": NEXUS_DB.shop_pricing,
        "data": { "products": NEXUS_DB.shop_pricing }
    });
});

// फ्री इन-ऐप परचेस बायपास पाथ (Google Commit Hack)
app.post(['/pay/google/commit', '/api/shop/purchase'], (req, res) => {
    console.log(`[🛒 GOOGLE PAY] Bypassing checkout gateway successfully.`);
    return res.status(200).json({
        "ret": 0,
        "result": true,
        "error_code": 0,
        "status": "COMPLETED",
        "transaction_id": "MOCK_NEXUS_" + crypto.randomBytes(8).toString('hex').toUpperCase(),
        "product_id": req.body.product_id || "diamonds_100",
        "garena_order_id": "ORD_" + Date.now(),
        "purchase_time: ": Math.floor(Date.now() / 1000)
    });
});

// मेलबॉक्स लिस्ट पाथ
app.all(['/mailbox/list', '/api/mail/get', '/mail/all'], (req, res) => {
    console.log(`[✉️  MAILBOX] Fetching system logs letters.`);
    return res.status(200).json({
        "ret": 0,
        "msg": "success",
        "data": { "total_count": NEXUS_DB.mailbox.length, "mails": NEXUS_DB.mailbox }
    });
});

// ==========================================
// ⚙️ 8. नोटिस बोर्ड और गेम इनिट पाथ्स
// ==========================================

// नोटिस बुलेटिन पाथ
app.all(['/api/v1/login/notice', '/notice/get', '/info/notice'], (req, res) => {
    console.log(`[⚙️ NOTICE] Transmitting notice parameters.`);
    return res.status(200).json({
        "ret": 0,
        "result": true,
        "msg": "success",
        "notices": [
            { "id": 777, "title": "Nexus System Announcement", "content": "Welcome back Master! Everything Operational.", "type": "popup" }
        ],
        "data": { "title": "Nexus Server", "content": "Core Stable.", "show_on_login": true }
    });
});

// सिस्टम इनिशियलाइजेशन/कॉन्फ़िगरेशन पाथ
app.all(['/game/init', '/api/config', '/info/config'], (req, res) => {
    console.log(`[⚙️ ENGINE CORE] Synchronizing initialization protocol hooks.`);
    return res.status(200).json({
        "ret": 0,
        "result": true,
        "msg": "success",
        "server_time": Math.floor(Date.now() / 1000),
        "data": { "status": "active", "lobby_server": "connected" },
        "client_config": { "heartbeat_interval": 30, "log_level": "debug" }
    });
});

// ==========================================
// 🎯 9. सुरक्षा कवच: यूनिवर्सल सुपर कैच-ऑल पैच
// ==========================================
app.all('*', (req, res) => {
    console.log(`\n🚨 [🎯 UNMAPPED FALLBACK TRIGGERED] ➔ Path: ${req.path}`);
    console.log(`──────────────────────────────────────────────────────`);
    const hostUrl = `${req.protocol}://${req.get('host')}/`;
    
    // यह कैच-ऑल रिस्पॉन्स एक मास्टर-कुंजी है, जो गेम के किसी भी अनाम पाथ पर 200 OK भेजकर लॉगिन और लॉबी को थामे रखता है।
    return res.status(200).json({
        "ret": 0,
        "result": true,
        "error_code": 0,
        "status": 1,
        "is_valid": 1,
        "maintenance": false,
        "msg": "success",
        "overlay_config_url": `${hostUrl}rct/ver.php`,
        "open_id": NEXUS_DB.player_profile.open_id,
        "uid": NEXUS_DB.player_profile.uid,
        "user_id": NEXUS_DB.player_profile.uid,
        "access_token": TOKENS.facebook,
        "refresh_token": TOKENS.facebook,
        "expiry_time": getDynamicExpiry(),
        "expires_in": 2592000,
        "platform": 1,
        "data": {
            "uid": NEXUS_DB.player_profile.uid,
            "open_id": NEXUS_DB.player_profile.open_id,
            "nickname": NEXUS_DB.player_profile.nickname,
            "level": NEXUS_DB.player_profile.level,
            "gold": NEXUS_DB.player_profile.gold,
            "diamond": NEXUS_DB.player_profile.diamond,
            "score": NEXUS_DB.player_profile.score,
            "rank_score": NEXUS_DB.player_profile.rank_score,
            "lobby_server": "connected"
        }
    });
});

// ==========================================
// 🚀 10. सर्वर लिसनर स्टार्ट
// ==========================================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`\n🔥 ════════════════════════════════════════════════════`);
    console.log(`🚀 NEXUS OFFICIAL SIGMA PRIVATE SERVER STRUCTURE: LIVE`);
    console.log(`📡 EXECUTING CORE ENGINE INTERCEPTIONS ON PORT ➔ ${PORT}`);
    console.log(`🧠 GARENA/BEETALK SDK MATRIX LOADED SUCCESSFULLY.`);
    console.log(`══════════════════════════════════════════════════════\n`);
});

