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
    console.log(`📦 Body   :`, req.body);
    console.log(`========================================`);
    next();
});

// 👤 1. गेस्ट रजिस्ट्रेशन
app.all('/oauth/guest/register', (req, res) => {
    return res.status(200).json({
        "open_id": "100000001",
        "access_token": "GUEST_TOKEN_1782793628",
        "refresh_token": "GUEST_TOKEN_1782793628",
        "expiry_time": 1814329628,
        "platform": 4,
        "uid": "100000001",
        "ret": 0,
        "msg": "success"
    });
});

// 🔑 2. गेस्ट टोकन ग्रांट
app.post('/oauth/guest/token/grant', (req, res) => {
    return res.status(200).json({
        "access_token": "MASTER_GRANTED_TOKEN_555666",
        "refresh_token": "MASTER_REFRESH_TOKEN_555666",
        "expiry_time": 1814329628,
        "uid": "100000001",
        "open_id": "100000001",
        "ret": 0,
        "msg": "success"
    });
});

// 🔍 3. टोकन इंस्पेक्शन
app.get('/oauth/token/inspect', (req, res) => {
    return res.status(200).json({
        "ret": 0,
        "msg": "success",
        "error_code": 0,
        "data": {
            "uid": "100000001",
            "open_id": "100000001",
            "access_token": "MASTER_GRANTED_TOKEN_555666",
            "expires_in": 86400,
            "application_id": "100138",
            "is_valid": true
        }
    });
});

// 🌐 4. लॉगिन रीडायरेक्ट
app.get('/oauth/login', (req, res) => {
    const redirectUri = req.query.redirect_uri || 'gop100138://auth/';
    const targetUrl = `${redirectUri}?code=master_auth_code_999888&state=${req.query.state || ''}`;
    return res.redirect(targetUrl);
});

// 🖥️ 5. नया रूट: सर्वर लिस्ट और मेंटेनेंस बायपास (Fixes "Server will be ready soon")
app.all(['/server/list', '/api/server/list', '/v1/server/list'], (req, res) => {
    console.log(`[🖥️ SERVER LIST] Sending active game server coordinates.`);
    return res.status(200).json({
        "ret": 0,
        "msg": "success",
        "maintenance": false, // यह गेम को बताएगा कि मेंटेनेंस नहीं चल रहा है
        "data": {
            "servers": [
                {
                    "server_id": 1,
                    "server_name": "Master Production Server",
                    "ip": "198.1.195.198",
                    "port": 8080,
                    "status": "smooth", // या "online"
                    "is_recommend": true
                }
            ],
            "recommend_server_id": 1
        }
    });
});

// 👤 6. यूज़र इन्फो (प्रोफाइल डेटा)
app.all('/oauth/user/info/get', (req, res) => {
    return res.status(200).json({
        "ret": 0,
        "msg": "success",
        "data": {
            "uid": "100000001",
            "nickname": "Master_Player",
            "level": 50,
            "gold": 999999,
            "diamond": 99999
        }
    });
});

// 🎯 7. कैच-ऑल राऊटर
app.all('*', (req, res) => {
    console.log(`[🎯 CATCH-ALL] Handled unknown path: ${req.path}`);
    res.status(200).json({
        "ret": 0,
        "msg": "success",
        "error_code": 0,
        "data": {
            "maintenance": false,
            "status": "online"
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Master Server Fixed for Lobby Entry running on port ${PORT}`);
});

