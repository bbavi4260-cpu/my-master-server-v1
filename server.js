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
    console.log(`[👤 GUEST] Registering guest.`);
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

// 🔑 2. नया रूट: गेस्ट टोकन ग्रांट (लॉग्स के अनुसार इसी पर गेम अटक रहा था)
app.post('/oauth/guest/token/grant', (req, res) => {
    console.log(`[🔑 TOKEN GRANT] Processing guest token grant.`);
    
    // गेम के SDK को आगे भेजने के लिए आवश्यक ऑथेंटिकेशन टोकन रिस्पॉन्स
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

// 🌐 3. मुख्य लॉगिन रूट (GET Request के लिए रीडायरेक्ट हैंडलर)
app.get('/oauth/login', (req, res) => {
    console.log(`[🌐 LOGIN GET] Handling web/oauth login view.`);
    
    // लॉग्स में आए 'redirect_uri' को कैप्चर करना
    const redirectUri = req.query.redirect_uri || 'gop100138://auth/';
    
    // गेम अक्सर ऑथेंटिकेशन के बाद इस यूआरएल पर कोड या टोकन के साथ वापस मुड़ता है
    const targetUrl = `${redirectUri}?code=master_auth_code_999888&state=${req.query.state || ''}`;
    
    console.log(`Redirecting client back to: ${targetUrl}`);
    // गेम को ऐप प्रोटोकॉल पर वापस रीडायरेक्ट करें ताकि लॉगिन चक्र पूरा हो सके
    return res.redirect(targetUrl);
});

// 🎯 4. कैच-ऑल राऊटर (बाकी सभी अनजान चीजों के लिए)
app.all('*', (req, res) => {
    console.log(`[🎯 CATCH-ALL] Handled unknown path: ${req.path}`);
    res.status(200).json({
        "ret": 0,
        "msg": "success",
        "data": {}
    });
});

// सर्ver पोर्ट
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Master Server V2 with Token Grant Fix running on port ${PORT}`);
});

