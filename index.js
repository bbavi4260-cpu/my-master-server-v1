const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📝 ट्रैफिक लॉगर - गेम जो भी रिक्वेस्ट भेजेगा, वह रेंडर के लॉग्स में प्रिंट होगी
app.use((req, res, next) => {
    console.log(`[🎯 GAME REQUEST]: ${req.method} ${req.path}`);
    if (Object.keys(req.body).length > 0) {
        console.log(`[📦 DATA]:`, JSON.stringify(req.body));
    }
    next();
});

// 🌐 1. स्पेसिफिक लॉगिन एंडपॉइंट (अगर गेम ऑथेंटिकेशन खोजे)
app.post('/api/v1/auth/login', (req, res) => {
    res.status(200).json({
        success: true,
        status: "AUTHENTICATED",
        player: { id: 99999, username: "Master_Player", role: "Admin" },
        session: { access_token: "master_secure_session_token_xyz", expires_in: "24h" }
    });
});

// 🚏 2. वाइल्डकार्ड फॉलबैक (The "Catch-All" Nexus Logic)
// गेम कोई भी अज्ञात यूआरएल (GET/POST/PUT) सर्च करे, यह सबको संभाल लेगा और फेल नहीं होने देगा
app.use((req, res) => {
    console.log(`[🔄 Wildcard Triggered] Responding with Success to: ${req.path}`);
    
    // एक यूनिवर्सल रिस्पॉन्स जो अधिकांश यूनिटी इंजनों को संतुष्ट रखता है
    res.status(200).json({
        success: true,
        status: "SUCCESS",
        code: 200,
        message: "Request processed successfully by Master Private Server",
        data: {}
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`=============================================`);
    console.log(`🚀 Adavnced Private Server Gateway Live on Port ${PORT}`);
    console.log(`=============================================`);
});

