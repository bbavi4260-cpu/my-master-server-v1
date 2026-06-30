const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// प्रत्येक इनकमिंग रिक्वेस्ट को ट्रैक करने के लिए मिडिलवेयर
app.use((req, res, next) => {
    console.log(`\n========================================`);
    console.log(`[⏰ ${new Date().toISOString()}] Incoming Request`);
    console.log(`🔗 Method : ${req.method}`);
    console.log(`🛣️  Path   : ${req.path}`);
    console.log(`📦 Body   :`, req.body);
    console.log(`========================================`);
    next();
});

// 👤 1. गेस्ट रजिस्ट्रेशन एंडपॉइंट
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

// 🔍 3. टोकन इंस्पेक्शन (ठीक आपके असली गेम फ़ॉर्मेट के अनुसार)
app.get('/oauth/token/inspect', (req, res) => {
    console.log(`[🔍 TOKEN INSPECT] Matching exact production layout from Vercel.`);
    
    // वर्सेल लिंक से मिला बिल्कुल सटीक और असली रिस्पॉन्स ढांचा
    return res.status(200).json({
        "open_id": "100000001",
        "access_token": "MASTER_GRANTED_TOKEN_555666",
        "refresh_token": "MASTER_GRANTED_TOKEN_555666",
        "expiry_time": 1814333424,
        "platform": 1,
        "is_valid": 1, // नंबर फ़ॉर्मेट में वैलिडेशन स्टेटस
        "ret": 0,
        "msg": "success"
    });
});

// 🌐 4. लॉगिन रीडायरेक्ट
app.get('/oauth/login', (req, res) => {
    const redirectUri = req.query.redirect_uri || 'gop100138://auth/';
    const targetUrl = `${redirectUri}?code=master_auth_code_999888&state=${req.query.state || ''}`;
    return res.redirect(targetUrl);
});

// 🎯 5. कैच-ऑल राऊटर (बाकी सभी आगामी रिक्वेस्ट्स को सीधे 'success' देने के लिए)
app.all('*', (req, res) => {
    console.log(`[🎯 CATCH-ALL] Handled unknown path: ${req.path}`);
    res.status(200).json({
        "ret": 0,
        "msg": "success",
        "open_id": "100000001",
        "uid": "100000001",
        "is_valid": 1
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Master Server V5 (Exact Vercel Layout) running on port ${PORT}`);
});

