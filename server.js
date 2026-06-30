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

// 👤 1. गेस्ट रजिस्ट्रेशन एंडपॉइंट
app.all('/oauth/guest/register', (req, res) => {
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
    const clientToken = req.body.access_token || "GUEST_TOKEN_1782793628";
    return res.status(200).json({
        "access_token": clientToken,
        "refresh_token": clientToken,
        "expiry_time": dynamicExpiry,
        "uid": "100000001",
        "open_id": "100000001",
        "ret": 0,
        "msg": "success"
    });
});

// 🔍 3. टोकन इंस्पेक्शन (Fixes "Session has expired" loop)
app.get('/oauth/token/inspect', (req, res) => {
    console.log(`[🔍 TOKEN INSPECT] Dynamically validating client's session token.`);
    
    // गेम द्वारा भेजा गया असली टोकन क्वेरी या हेडर से निकालना
    const incomingToken = req.query.access_token || req.headers.authorization || "GUEST_TOKEN_1782793628";
    const dynamicExpiry = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60);
    
    // गेम को वही टोकन वापस भेजना जो उसने माँगा है, ताकि सेशन मैच हो सके
    return res.status(200).json({
        "open_id": "100000001",
        "access_token": incomingToken,
        "refresh_token": incomingToken,
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


// एक्सप्रेस को बताएं कि public फोल्डर में हमारी HTML फाइल है
app.use(express.static('public'));

// डिफ़ॉल्ट रूट पर index.html सर्व करें
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Master Server V7 (Session Fix) running on port ${PORT}`);
});

