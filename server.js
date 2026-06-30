const express = require('express');
const app = express();

// आने वाले JSON और URL-encoded डेटा को पढ़ने के लिए मिडिलवेयर
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// किसी भी रिक्वेस्ट के आने पर उसे टर्मिनल में प्रिंट करने के लिए मिडिलवेयर
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

// 👤 गेस्ट रजिस्ट्रेशन एंडपॉइंट (ठीक आपके फॉर्मेट के अनुसार)
app.all('/oauth/guest/register', (req, res) => {
    console.log(`[👤 GUEST] Handling guest registration with exact required format.`);
    
    // जो डेटा आपने वर्सेल लिंक से निकाला, वही यहाँ रिस्पॉन्स में जाएगा
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

// 🎯 कैच-ऑल राऊटर (Catch-All Route): 
// ऊपर दिए गए रास्ते के अलावा बाकी कोई भी अनजान पाथ आए, तो उसे यह हैंडल करेगा
app.all('*', (req, res) => {
    console.log(`[🎯 CATCH-ALL] Handled unknown path: ${req.path}`);
    
    // सामान्य रिस्पॉन्स ताकि गेम का दूसरा कोई पाथ एरर न दे
    res.status(200).json({
        "ret": 0,
        "msg": "success",
        "path": req.path,
        "data": {}
    });
});

// सर्वर पोर्ट कॉन्फ़िगरेशन
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Master Server with Exact Guest Layout running on port ${PORT}`);
});

