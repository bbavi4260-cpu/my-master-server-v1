const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// प्रत्येक इनकमिंग रिक्वेस्ट को ट्रैक करने के लिए लॉगिंग मिडिलवेयर
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

// 📱 1. ओरिजिनल ऐप इन्फो गेट (Fixes Game Initial Check)
app.all(['/app/info/get', '/api/app/info/get'], (req, res) => {
    console.log(`[📱 APP INFO] Sending realistic Nexus-Sigma app structure.`);
    return res.status(200).json({
        "ret": 0,
        "result": 0,
        "msg": "success",
        "data": {
            "app_id": 100067,
            "app_name": "Sigma",
            "status": 1, // 1 = Active Server
            "update_url": "",
            "version": "1.0.0"
        },
        "client_log": false,
        "overlay_config_url": "https://sgma-ten.vercel.app/rct/ver.php"
    });
});

// 🌐 2. रियलिस्टिक लॉगिन और ऑथेंटिकेशन रीडायरेक्ट
app.get('/oauth/login', (req, res) => {
    console.log(`[🔵 LOGIN] Processing authentication code and token issuance.`);
    const redirectUri = req.query.redirect_uri || 'gop100138://auth/';
    const state = req.query.state || '';
    
    // हमेशा भविष्य का फ्रेश टाइमस्टैम्प ताकि टोकन कभी एक्सपायर न हो
    const dynamicExpiry = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60);
    const secureToken = "NEXUS_MASTER_REALISTIC_TOKEN_2026";
    
    const targetUrl = `${redirectUri}?code=master_nexus_code&state=${state}&access_token=${secureToken}&expiry_time=${dynamicExpiry}`;
    console.log(`Redirecting back to app client: ${targetUrl}`);
    return res.redirect(targetUrl);
});

// 🔍 3. टोकन इंस्पेक्शन (Fixes "Session has expired" Error)
app.all(['/oauth/token/inspect', '/token/inspect'], (req, res) => {
    console.log(`[🔍 TOKEN INSPECT] Matching strict client-token layout.`);
    const dynamicExpiry = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60);
    
    return res.status(200).json({
        "open_id": "100000001",
        "uid": "100000001",
        "access_token": "NEXUS_MASTER_REALISTIC_TOKEN_2026",
        "refresh_token": "NEXUS_MASTER_REALISTIC_TOKEN_2026",
        "expiry_time": dynamicExpiry,
        "platform": 1,
        "is_valid": 1,
        "ret": 0,
        "msg": "success"
    });
});

// 🖥️ 4. एक्टिव सर्वर लिस्ट (Fixes "The server will be ready soon" Loop)
app.all(['/server/list', '/api/server/list', '/v1/server/list', '/game/server/list'], (req, res) => {
    console.log(`[🖥️ SERVER LIST] Bypassing maintenance status for active lobby access.`);
    return res.status(200).json({
        "ret": 0,
        "msg": "success",
        "maintenance": false, // False रखने से गेम सर्वर को ऑनलाइन मानता है
        "status": "online",
        "data": {
            "servers": [
                {
                    "server_id": 1,
                    "server_name": "Nexus Private Production",
                    "ip": "127.0.0.1",
                    "port": 8080,
                    "status": "smooth",
                    "is_recommend": true
                }
            ],
            "recommend_server_id": 1
        }
    });
});

// 👤 5. रियल प्लेयर असेट्स और लाइव स्कोर डेटा (अपडेटेड वैल्यूज)
app.all(['/oauth/user/info/get', '/user/info', '/api/user/profile'], (req, res) => {
    console.log(`[👤 USER INFO] Injecting custom score and currency assets into lobby.`);
    return res.status(200).json({
        "ret": 0,
        "msg": "success",
        "data": {
            "uid": "100000001",
            "open_id": "100000001",
            "nickname": "Master_Sigma",
            "level": 99,              // आपका फुल लेवल
            "gold": 9999999,          // मैक्सिमम गोल्ड
            "diamond": 999999,        // अनलिमिटेड डायमंड्स
            "score": 75000,           // 👈 आपका नया अपडेटेड स्कोर!
            "rank_score": 4800,       // ग्रैंडमास्टर रैंक स्कोर
            "avatar": "1",
            "exp": 999999
        }
    });
});

// 🎮 6. गेम इंजन हैंडशेक और कॉन्फ़िगरेशन
app.all(['/game/init', '/api/config', '/api/v1/login/notice'], (req, res) => {
    console.log(`[🎮 GAME INIT] Responding to realistic engine notice/configs.`);
    return res.status(200).json({
        "ret": 0,
        "msg": "success",
        "data": {
            "status": "active",
            "notice": "Welcome to Nexus Private Server, Master!",
            "lobby_server": "connected"
        }
    });
});

// 🎯 7. यूनिवर्सल कैच-ऑल राऊटर (प्राइवेट सर्वर को कभी क्रैश न होने देने के लिए)
app.all('*', (req, res) => {
    console.log(`[🎯 CATCH-ALL] Handled missing endpoint safely: ${req.path}`);
    res.status(200).json({
        "ret": 0,
        "msg": "success",
        "maintenance": false,
        "status": "online",
        "data": {}
    });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`\n🔥 ==================================================`);
    console.log(`🚀 REALISTIC NEXUS PRIVATE SERVER LIVE ON PORT ${PORT}`);
    console.log(`=====================================================\n`);
});

