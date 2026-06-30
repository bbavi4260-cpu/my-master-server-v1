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
        "uid": req.body.uid || "100000001",
        "open_id": req.body.uid || "100000001",
        "ret": 0,
        "msg": "success"
    });
});

// 🌐 3. लॉगिन रीडायरेक्ट
app.get('/oauth/login', (req, res) => {
    const redirectUri = req.query.redirect_uri || 'gop100138://auth/';
    const targetUrl = `${redirectUri}?code=master_auth_code_999888&state=${req.query.state || ''}`;
    return res.redirect(targetUrl);
});

// 👤 4. नया रूट: यूज़र इन्फो (लॉबी में जाने के लिए गेम यह प्रोफाइल डेटा मांगेगा)
app.all('/oauth/user/info/get', (req, res) => {
    console.log(`[👤 USER INFO] Sending lobby profile data.`);
    return res.status(200).json({
        "ret": 0,
        "msg": "success",
        "data": {
            "uid": "100000001",
            "nickname": "Master_Player", // लॉबी में दिखने वाला आपका नाम
            "level": 50,
            "exp": 12500,
            "gold": 999999, // अनलिमिटेड कॉइन्स सिमुलेशन
            "diamond": 99999,
            "avatar": "1",
            "gender": 1
        }
    });
});

// 🎮 5. नया रूट: गेम सर्वर कॉन्फ़िगरेशन (लॉबी एंट्री)
app.all('/game/user/request/send', (req, res) => {
    console.log(`[🎮 LOBBY REQUEST] Handled lobby entry request.`);
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

// 🎯 6. कैच-ऑल राऊटर (बाकी सभी नए राउट्स को पकड़ने के लिए)
app.all('*', (req, res) => {
    console.log(`[🎯 CATCH-ALL] Handled unknown path: ${req.path}`);
    
    // जब गेम लॉबी की तरफ बढ़ेगा, तो वह कुछ नए एंडपॉइंट्स पर हिट कर सकता है।
    // यह कैच-ऑल उन्हें 'success' देगा ताकि गेम आगे बढ़ता रहे।
    res.status(200).json({
        "ret": 0,
        "msg": "success",
        "error_code": 0,
        "data": {}
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Lobby Ready Master Server running on port ${PORT}`);
});

