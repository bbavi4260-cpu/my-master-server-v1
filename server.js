const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// लॉगिंग मिडिलवेयर
app.use((req, res, next) => {
    console.log(`\n========================================`);
    console.log(`[⏰ ${new Date().toISOString()}] Incoming Request`);
    console.log(`🔗 Method : ${req.method}`);
    console.log(`🛣️  Path   : ${req.path}`);
    console.log(`🔍 Query  :`, req.query);
    console.log(`📦 Body   :`, req.body);
    console.log(`========================================`);
    next();
});

// 🌐 1. फेसबुक और गेस्ट लॉगिन रूट (फ्रेश टोकन जनरेट करने के लिए)
app.get('/oauth/login', (req, res) => {
    console.log(`[🔵 LOGIN] Processing Login Redirect.`);
    const redirectUri = req.query.redirect_uri || 'gop100138://auth/';
    const state = req.query.state || '';
    
    // हमेशा फ्रेश और लंबा एक्सपायरी टाइम ताकि सेशन एक्सपायर कभी न हो
    const dynamicExpiry = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60);
    const token = "NEXUS_MASTER_SECURE_TOKEN_9999";
    
    const targetUrl = `${redirectUri}?code=nexus_auth_code&state=${state}&access_token=${token}&expiry_time=${dynamicExpiry}`;
    return res.redirect(targetUrl);
});

// 🔍 2. टोकन इंस्पेक्शन रूट (रूट लेवल रिस्पॉन्स - नो लूप)
app.all(['/oauth/token/inspect', '/token/inspect'], (req, res) => {
    console.log(`[🔍 TOKEN INSPECT] Confirming valid token status.`);
    const dynamicExpiry = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60);
    
    // वही टोकन रिफ्लेक्ट करना जो गेम एक्सपेक्ट कर रहा है
    return res.status(200).json({
        "open_id": "100000001",
        "uid": "100000001",
        "access_token": "NEXUS_MASTER_SECURE_TOKEN_9999",
        "refresh_token": "NEXUS_MASTER_SECURE_TOKEN_9999",
        "expiry_time": dynamicExpiry,
        "platform": 1,
        "is_valid": 1,
        "ret": 0,
        "msg": "success"
    });
});

// 🖥️ 3. सर्वर लिस्ट रूट (Fixes "Server will be ready soon")
app.all(['/server/list', '/api/server/list', '/v1/server/list', '/game/server/list'], (req, res) => {
    console.log(`[🖥️ SERVER LIST] Injecting active server configurations.`);
    return res.status(200).json({
        "ret": 0,
        "msg": "success",
        "maintenance": false, // मेंटेनेंस फॉल्स रखने से रेडी सून का एरर हट जाता है
        "status": "online",
        "data": {
            "servers": [
                {
                    "server_id": 1,
                    "server_name": "Nexus Master Official",
                    "ip": "198.1.195.198",
                    "port": 8080,
                    "status": "smooth",
                    "is_recommend": true
                }
            ],
            "recommend_server_id": 1
        }
    });
});

// 👤 4. यूजर प्रोफाइल डेटा रूट (लॉबी स्क्रीन लोड करने के लिए)
app.all(['/oauth/user/info/get', '/user/info', '/api/user/profile'], (req, res) => {
    console.log(`[👤 USER INFO] Initializing player assets for lobby.`);
    return res.status(200).json({
        "ret": 0,
        "msg": "success",
        "data": {
            "uid": "100000001",
            "open_id": "100000001",
            "nickname": "Master_Nexus",
            "level": 99,
            "gold": 9999999,
            "diamond": 999999,
            "avatar": "1"
        }
    });
});

// 🎮 5. गेम रिक्वेस्ट/सिस्टम इनिट रूट
app.all(['/game/user/request/send', '/game/init', '/api/config'], (req, res) => {
    console.log(`[🎮 GAME INIT] Responding to engine handshakes.`);
    return res.status(200).json({
        "ret": 0,
        "msg": "success",
        "data": {
            "status": "active",
            "lobby_server": "connected",
            "matchmaking": "ready"
        }
    });
});

// 🎯 6. कैच-ऑल राऊटर (अगर गेम कोई और नया गुप्त पाथ भी खोजे, तो उसे भी सीधा सक्सेस दें)
app.all('*', (req, res) => {
    console.log(`[🎯 CATCH-ALL] Auto-approving path: ${req.path}`);
    const dynamicExpiry = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60);
    res.status(200).json({
        "ret": 0,
        "msg": "success",
        "error_code": 0,
        "maintenance": false,
        "status": "online",
        "open_id": "100000001",
        "uid": "100000001",
        "access_token": "NEXUS_MASTER_SECURE_TOKEN_9999",
        "expiry_time": dynamicExpiry,
        "is_valid": 1,
        "data": {}
    });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Independent Nexus Solution Live on port ${PORT}`);
});

