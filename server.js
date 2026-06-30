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

// 🔍 3. नया रूट: टोकन इंस्पेक्शन (लॉग्स के अनुसार इसी पर गेम रुका हुआ है)
app.get('/oauth/token/inspect', (req, res) => {
    console.log(`[🔍 TOKEN INSPECT] Verifying token for the game client.`);
    
    // गेम इंजन को टोकन एक्टिव दिखाने के लिए आवश्यक स्ट्रक्चर
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
            "is_valid": true // यह गेम को बताएगा कि टोकन सही है
        }
    });
});

// 🌐 4. लॉगिन रीडायरेक्ट
app.get('/oauth/login', (req, res) => {
    const redirectUri = req.query.redirect_uri || 'gop100138://auth/';
    const targetUrl = `${redirectUri}?code=master_auth_code_999888&state=${req.query.state || ''}`;
    return res.redirect(targetUrl);
});

// 👤 5. यूज़र इन्फो (प्रोफाइल डेटा)
app.all('/oauth/user/info/get', (req, res) => {
    console.log(`[👤 USER INFO] Sending lobby profile data.`);
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

// 🎯 6. कैच-ऑल राऊटर
app.all('*', (req, res) => {
    console.log(`[🎯 CATCH-ALL] Handled unknown path: ${req.path}`);
    res.status(200).json({
        "ret": 0,
        "msg": "success",
        "error_code": 0,
        "data": {}
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Master Server V3 (Token Inspect Fix) running on port ${PORT}`);
});

