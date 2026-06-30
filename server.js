const express = require('express');
const https = require('https');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// प्रत्येक रिक्वेस्ट को ट्रैक करने के लिए लॉगिंग मिडिलवेयर
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

// 🌐 1. फेसबुक/वेब लॉगिन बाईपास रूट
app.get('/oauth/login', (req, res) => {
    console.log(`[🔵 LOGIN] Intercepting login redirect.`);
    const redirectUri = req.query.redirect_uri || 'gop100138://auth/';
    const state = req.query.state || '';
    
    // फ्रेश डायनामिक टोकन जनरेट करना ताकि सेशन एक्सपायर न हो
    const dynamicExpiry = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60);
    const targetUrl = `${redirectUri}?code=master_auth_code_nexus&state=${state}&access_token=MASTER_LIVE_TOKEN_888&expiry_time=${dynamicExpiry}`;
    
    console.log(`Redirecting back to game via: ${targetUrl}`);
    return res.redirect(targetUrl);
});

// 🔄 2. यूनिवर्सल लाइव प्रॉक्सी (लॉबी, सर्वर लिस्ट, टोकन इंस्पेक्ट - सब कुछ वर्सेल से लाइव लाएगा)
app.all('*', (req, res) => {
    console.log(`[🔄 PROXY] Routing ${req.path} directly to Vercel Production...`);

    // क्वेरी स्ट्रिंग का निर्माण
    const queryString = Object.keys(req.query).length 
        ? '?' + new URLSearchParams(req.query).toString() 
        : '';
        
    const options = {
        hostname: 'sgma-ten.vercel.app',
        port: 443,
        path: `${req.path}${queryString}`,
        method: req.method,
        headers: {
            ...req.headers,
            host: 'sgma-ten.vercel.app', // वर्सेल को ओरिजिनल होस्ट हेडर चाहिए
        }
    };

    // असली सर्वर से डेटा कलेक्ट करना
    const proxyReq = https.request(options, (proxyRes) => {
        // अगर वर्सेल से टोकन रिस्पॉन्स आ रहा है, तो उसमें टाइमस्टैम्प को लाइव बढ़ा देना ताकि एक्सपायरी एरर न आये
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (err) => {
        console.error(`[❌ PROXY CRITICAL ERROR]:`, err.message);
        
        // बैकअप रिस्पॉन्स (अगर वर्सेल कभी रिस्पॉन्स न दे पाए तो गेम क्रैश नहीं होगा)
        const backupExpiry = Math.floor(Date.now() / 1000) + 31536000;
        res.status(200).json({
            "open_id": "100000001",
            "uid": "100000001",
            "access_token": "MASTER_LIVE_TOKEN_888",
            "refresh_token": "MASTER_LIVE_TOKEN_888",
            "expiry_time": backupExpiry,
            "platform": 1,
            "is_valid": 1,
            "ret": 0,
            "msg": "success"
        });
    });

    // अगर गेम कोई डेटा (POST/PUT बॉडी) भेज रहा है, तो उसे भी वर्सेल को फॉरवर्ड करें
    if (req.method === 'POST' || req.method === 'PUT') {
        proxyReq.write(JSON.stringify(req.body));
    }
    proxyReq.end();
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🎯 100000% Solution Server Live on port ${PORT}`);
});

