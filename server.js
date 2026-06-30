const express = require('express');
const app = express();

// आने वाले JSON और URL-encoded डेटा को पढ़ने के लिए मिडिलवेयर
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// प्रत्येक रिक्वेस्ट को टर्मिनल में ट्रैक करने के लिए मिडिलवेयर
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

// 👤 1. गेस्ट रजिस्ट्रेशन एंडपॉइंट (Fixing Infinite Loading)
app.all('/oauth/guest/register', (req, res) => {
    console.log(`[👤 GUEST] Handling guest registration request.`);
    
    // अनंत लोडिंग से बचने के लिए एक पूर्ण और सटीक रिस्पॉन्स स्ट्रक्चर
    return res.status(200).json({
        "open_id": "100000001",
        "access_token": "GUEST_TOKEN_1782793628",
        "refresh_token": "GUEST_TOKEN_1782793628",
        "expiry_time": 1814329628,
        "platform": 4,
        "uid": "100000001",
        "ret": 0,
        "msg": "success",
        "error_code": 0, // कुछ SDKs इसे शून्य देखना चाहते हैं ताकि लोडिंग रुक सके
        "data": {
            "is_new_user": true
        }
    });
});

// 🔑 2. नया लॉगिन एंडपॉइंट (फेसबुक या अन्य सोशल लॉगिन के लिए)
app.all('/oauth/login', (req, res) => {
    console.log(`[🔑 LOGIN] Handling main login route.`);
    
    // सोशल/फेसबुक लॉगिन को गेम के अंदर आगे बढ़ाने के लिए डमी टोकन रिस्पॉन्स
    return res.status(200).json({
        "open_id": "200000002",
        "access_token": "LOGIN_TOKEN_987654321",
        "refresh_token": "LOGIN_REFRESH_987654321",
        "expiry_time": 1814329628,
        "platform": 4,
        "uid": "200000002",
        "ret": 0,
        "msg": "success",
        "error_code": 0,
        "data": {}
    });
});

// 🎯 3. कैच-ऑल राऊटर (Catch-All Route)
// ऊपर दिए गए राउट्स के अलावा बाकी कोई भी अनजान पाथ आए, तो उसे यह हैंडल करेगा
app.all('*', (req, res) => {
    console.log(`[🎯 CATCH-ALL] Handled unknown path: ${req.path}`);
    
    res.status(200).json({
        "ret": 0,
        "msg": "success",
        "error_code": 0,
        "path": req.path,
        "data": {}
    });
});

// सर्वर पोर्ट कॉन्फ़िगरेशन
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Master Server Upgraded running on port ${PORT}`);
});

