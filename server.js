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
    // वर्तमान समय से 1 वर्ष आगे का टाइमस्टैम्प (Seconds में) ताकि टोकन कभी एक्सपायर न हो
    const dynamicExpiry = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60);
    
    return res.status(200).json({
        "open_id": "100000001",
        "access_token": "GUEST_TOKEN_1782793628",
        "refresh_token": "GUEST_TOKEN_1782793628",
        "expiry_time": dynamicExpiry,
        "platform": 4,
        "uid": "100000001",
        "ret": 0,
        "msg": "success"
    });
});

// 🔑 2. गेस्ट टोकन ग्रांट
app.post('/oauth/guest/token/grant', (req, res) => {
    const dynamicExpiry = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60);
    
    return res.status(200).json({
        "access_token": "MASTER_GRANTED_TOKEN_555666",
        "refresh_token": "MASTER_GRANTED_TOKEN_555666",
        "expiry_time": dynamicExpiry,
        "uid": "100000001",
        "open_id": "100000001",
        "ret": 0,
        "msg": "success"
    });
});

// 🔍 3. टोकन इंस्पेक्शन (डायनामिक टाइमस्टैम्प के साथ अपडेटेड)
app.get('/oauth/token/inspect', (req, res) => {
    console.log(`[🔍 TOKEN INSPECT] Generating fresh dynamic expiry time to fix re-login loop.`);
    
    // हमेशा भविष्य का समय भेजेगा ताकि गेम कभी "Token Expire" न कह सके
    const dynamicExpiry = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60);
    
    return res.status(200).json({
        "open_id": "100000001",
        "access_token": "MASTER_GRANTED_TOKEN_555666",
        "refresh_token": "MASTER_GRANTED_TOKEN_555666",
        "expiry_time": dynamicExpiry,
        "platform": 1,
        "is_valid": 1,
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

// 🎯 5. कैच-ऑल राऊटर
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
    console.log(`🚀 Master Server V6 (Dynamic Token Fix) running on port ${PORT}`);
});

