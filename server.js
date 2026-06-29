const express = require('express');
const app = express();

// आने वाले JSON और URL-encoded डेटा को पढ़ने के लिए मिडिलवेयर
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// किसी भी रिक्वेस्ट के आने पर उसे लॉग करने के लिए सामान्य मिडिलवेयर
app.use((req, res, next) => {
    console.log(`\n========================================`);
    console.log(`[⏰ ${new Date().toISOString()}] Incoming Request`);
    console.log(`🔗 Method : ${req.method}`);
    console.log(`🛣️  Path   : ${req.path}`);
    console.log(`🔍 Query  :`, req.query);
    console.log(`📦 Body   :`, req.body);
    console.log(`Headers  :`, {
        'content-type': req.headers['content-type'],
        'user-agent': req.headers['user-agent']
    });
    console.log(`========================================`);
    next();
});

// विशिष्ट एंडपॉइंट: गेस्ट रजिस्ट्रेशन के लिए रिस्पॉन्स
app.post('/oauth/guest/register', (req, res) => {
    console.log(`[👤 GUEST] Handling specific guest registration route.`);
    return res.status(200).json({
        status: "success",
        access_token: "master_dummy_token_12345",
        user_id: "user_Test"
    });
});

// 🎯 कैच-ऑल राऊटर (Catch-All Route): 
// ऊपर दिए गए राउट्स के अलावा बाकी सभी अनजान राउट्स को यह हैंडल करेगा
app.all('*', (req, res) => {
    console.log(`[🎯 CATCH-ALL] Handled unknown path: ${req.path}`);
    
    // एक सामान्य सक्सेस रिस्पॉन्स ताकि क्लाइंट/गेम एरर न दे
    res.status(200).json({
        status: "success",
        message: "Request processed by catch-all handler",
        path: req.path,
        data: {}
    });
});

// सर्वर पोर्ट कॉन्फ़िगरेशन (रेंडर या लोकल एनवायरनमेंट के लिए)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Master Catch-All Server is running on port ${PORT}`);
});

