import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import {
  initCustomerDatabase,
  upsertCustomer,
  registerCustomerDirect,
  authenticateCustomerDirect,
  getCustomer,
  updateCustomer,
  saveOrderToDatabase,
  getOrdersForCustomer,
  saveDistributorInquiryToDatabase,
  getCustomerDatabaseStats,
  exportCustomerDatabase,
} from './server/customerDatabase';

dotenv.config();

// Initialize persistent customer database
initCustomerDatabase();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));

// Lazy-initialized Gemini client
let genAI: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!genAI) {
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

const ROLE_SYSTEM_INSTRUCTIONS: Record<string, string> = {
  sommelier: `You are the "Araj Royal AI Spicer & Sommelier", the chief culinary master and master blender for ARAJ DRY FRUITS & SPICES (est. 1985 in historic Agra, India).
Website: https://www.arajpure.com/
Helpline / WhatsApp: +91 99171 04448 | Email: ankurkaushal0016@gmail.com
Address: 11/48-E, Near Apsara Talkies, Hathras Road, Naraich, Agra-282006 (U.P.), India.

CRITICAL INSTRUCTION ON PRODUCTS:
ONLY recommend and discuss authentic ARAJ products from our catalog. Do NOT invent, redesign, or recreate products.
Our exact products:
- Spices: Black Pepper Powder (SPC-1, ₹110), Dhaniya Powder (SPC-2, ₹80), Chana Masala (SPC-3, ₹80), Haldi Turmeric Powder (SPC-4, ₹130), Chatpata Chat Masala (SPC-5, ₹80), Chatpata Salad Masala (SPC-6, ₹65), Peri Peri Masala (SPC-7, ₹65), Jeera Powder (SPC-8, ₹80), Shahi Garam Masala (SPC-9, ₹95), Red Chilli Powder / Kashmiri Mirch (SPC-10, ₹120), Kitchen King Masala (SPC-11, ₹85), Pav Bhaji Masala (SPC-12, ₹75), Shahi Paneer Masala (SPC-13, ₹85), Compounded Hing (SPC-14, ₹95), Cumin Whole / Jeera Sabut (SPC-15, ₹140), Rai / Mustard Seeds (SPC-16, ₹60), Kasuri Methi (SPC-17, ₹45), Sabji Masala (SPC-18, ₹70), Dal Makhani Masala (SPC-19, ₹85).
- Dry Fruits: Selected California Almonds (Badam Migi) (DF-1, ₹249), Kaju W240 Jumbo Cashews (DF-2, ₹299), Akhrot Giri (Walnut Kernels) (DF-3, ₹340), Afghan Green Pistachios (Pista) (DF-4, ₹380), Munakka & Kishmish (DF-5, ₹180), Premium Dried Figs (Anjeer) (DF-6, ₹320), Phool Makhana (DF-7, ₹160).
- Luxury Hampers: Royal Shahi Treat Keepsake Box (GFT-1, ₹825), Imperial Agra Silk & Lacquer Coffret (GFT-2, ₹1450).

Your focus: Culinary flavor pairing, traditional cooking secrets, royal Mughlai & Punjabi techniques, aroma preservation via cold stone grinding below 32°C.
Format responses with clean Markdown, bold highlights, and bullet points.`,

  ayurveda: `You are the "Araj Ayurvedic Wellness & Nutrition Advisor" for ARAJ DRY FRUITS & SPICES (est. 1985 in Agra).
Website: https://www.arajpure.com/
Provide ancient Ayurvedic wisdom and modern nutritional science for:
- California Almonds (Badam): Soaking overnight, peeling, brain vitality, Vitamin E.
- Kashmiri Walnuts (Akhrot): Rich plant ALA Omega-3 fatty acids for cognitive and cardiovascular support.
- Pure Turmeric (Haldi): High curcumin (>4.5%), synergistic bioavailability pairing with Black Pepper (piperine) in Golden Milk (Haldi Doodh).
- Golden Munakka & Kishmish: Digestive health, natural iron, and cooling Pitta dosha.
- Kaju W240 & Afghan Pistachios: Natural zinc, protein, and heart-healthy monounsaturated fats.
- Dried Figs (Anjeer): Dietary fiber, bone health, and stamina.
- Phool Makhana: Low glycemic index, calcium, magnesium, light digestion.
ONLY recommend genuine ARAJ products. Speak with warmth, wisdom, and scientific clarity.`,

  heritage: `You are the "Araj Heritage Mill Chronicler & Quality Assayer" for ARAJ DRY FRUITS & SPICES.
Heritage: Founded in 1985 in Agra, Uttar Pradesh by the Kaushal family. Over 39 years of uncompromising artisanal purity.
Address: 11/48-E, Near Apsara Talkies, Hathras Road, Naraich, Agra-282006 (U.P.), India.
WhatsApp / Helpline: +91 99171 04448
Focus: Explain the traditional cold stone-milling process where spices are pulverized strictly below 32°C to prevent volatilization of essential aromatic oils (pinene, cineole, curcuminoids). Highlight 0% starch adulteration, 0% artificial colorings, and multi-barrier nitrogen flushing.
ONLY refer to ARAJ's authentic product line.`,

  concierge: `You are the "Araj Royal Concierge & Order Specialist".
Support customers with:
- Orders & Logistics: Dispatched within 24 hours from Agra; Pan-India express delivery in 3-5 business days.
- Free Shipping: Complimentary on all orders over ₹999.
- Payment Options: Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards, Net Banking.
- Custom & Corporate Gifting: Royal Shahi Treat Box (₹825) and bespoke corporate bulk orders (call/WhatsApp +91 99171 04448).
- Return Policy: 100% replacement guarantee if freshness seal is compromised.
Be courteous, concise, and helpful.`
};

// Default system instruction
const BRAND_SYSTEM_INSTRUCTION = ROLE_SYSTEM_INSTRUCTIONS.sommelier;

// Helper fallback responses if Gemini key is not configured or in case of transient API error
function generateFallbackResponse(userPrompt: string): string {
  const q = userPrompt.toLowerCase();

  if (q.includes('history') || q.includes('brand') || q.includes('about') || q.includes('agra') || q.includes('since') || q.includes('founded') || q.includes('who')) {
    return `### 🏛️ The Royal Heritage of ARAJ (Est. 1985, Agra)

**ARAJ Dry Fruits & Spices** was established in **1985** in the historic city of **Agra, Uttar Pradesh**, by the Kaushal family. What began as a traditional stone-milling heritage workshop near Rawatpara and Hathras Road has flourished into one of Northern India's most respected names in unadulterated food craftsmanship.

**Why Araj is Unique:**
* **Cold Stone-Ground Milling:** We pulverize whole spices at temperatures strictly below **32°C**, preserving 100% of volatile aromatic oils and natural terpenes that industrial high-speed mills burn away.
* **Zero Adulteration:** 0.00% synthetic starches, sawdust, artificial colorings, or preservatives.
* **Estate Sourcing:** Single-origin California almonds, jumbo W240 Mangalore cashews, high-curcumin turmeric, and hand-plucked spices.
* **Nitrogen Freshness Seal:** Packed with multi-barrier nitrogen flushing to guarantee fresh-from-the-mill crunch and aroma.

Our headquarters are located at:
📍 **11/48-E, Near Apsara Talkies, Hathras Road, Naraich, Agra-282006 (U.P.), India**
📞 **Helpline & WhatsApp:** +91 99171 04448`;
  }

  if (q.includes('almond') || q.includes('badam') || q.includes('cashew') || q.includes('kaju') || q.includes('walnut') || q.includes('akhrot') || q.includes('pista') || q.includes('dry fruit') || q.includes('benefit')) {
    return `### 🌰 Araj Imperial Dry Fruits & Nutritional Benefits

All Araj dry fruits are harvested at peak maturity and hand-graded for uniform size and natural oil density:

1. **Selected California Almonds (Badam Migi) — ₹249 / 250g**
   * *Nutrient Profile:* Exceptionally rich in Vitamin E, magnesium, and dietary fiber.
   * *Ayurvedic Tip:* Soak 5-7 almonds overnight in water and consume in the morning for enhanced cognitive vitality and glowing skin.

2. **Jumbo Cashews (Kaju W240) — ₹299 / 250g**
   * *Nutrient Profile:* Naturally sweet, buttery texture packed with plant-based zinc, iron, and heart-healthy monounsaturated fats.

3. **Royal Kashmiri Walnut Kernels (Akhrot Giri) — ₹340 / 250g**
   * *Nutrient Profile:* King of plant-based Omega-3 ALA fatty acids, supporting brain function and cardiovascular health.

4. **Afghan Green Pistachios (Pista) — ₹380 / 250g**
   * *Nutrient Profile:* Rich in lutein and zeaxanthin for eye health, low calorie-to-protein ratio.

*Would you like me to guide you to our Dry Fruits section or add any of these to your bag?*`;
  }

  if (q.includes('turmeric') || q.includes('haldi') || q.includes('chana') || q.includes('garam') || q.includes('masala') || q.includes('spice') || q.includes('recipe')) {
    return `### 🌿 Araj Master Spices & Culinary Secrets

Araj spices are celebrated for their pure aroma and high active alkaloid counts:

* **Pure Haldi (Turmeric Powder) — ₹130 / 500g**
  * *High-Curcumin Harvest:* Sourced from premium golden rhizomes, with lab-verified curcumin content over 4.5%.
  * *Pro Tip:* Combine with a pinch of Araj Black Pepper (Piperine) to increase curcumin bioavailability in your golden milk or curries by up to 2000%.

* **Royal Chana Masala — ₹80 / 100g**
  * *Authentic Punjabi Recipe:* Roasted pomegranate seeds (anardana), dry mango, mace, and stone-ground coriander give Pindi Chole and curried chickpeas an authentic dark, tangy restaurant finish.

* **Imperial Garam Masala — ₹95 / 100g**
  * *The Finishing Touch:* Ground with whole green cardamom, black cardamom, cinnamon, cloves, and nutmeg. Add in the final 2 minutes of simmering to preserve its fragrant essential oils.

* **Chatpata Chat Masala — ₹75 / 100g**
  * *Street Food Royalty:* Sprinkle over seasonal fruits, roasted almonds, or raitas for an instantaneous burst of tang and zest.`;
  }

  if (q.includes('gift') || q.includes('hamper') || q.includes('box') || q.includes('wedding') || q.includes('diwali')) {
    return `### 🎁 Royal Festive Hampers & Bespoke Gifting

We offer handcrafted keepsakes ideal for weddings, Diwali, Eid, corporate milestones, and family celebrations:

* **Shahi Treat Keepsake Box (₹825 / 1kg):**
  Featuring 4 velvet-lined compartments of hand-sorted California Almonds, Jumbo Cashews, Afghan Pistachios, and Golden Raisins encased in a gold-embossed royal box.
* **Bespoke Hamper Atelier:**
  Use our live interactive Hamper Architect (accessible via the **Bespoke Coffret** button in the top menu) to pick your presentation box finish (Imperial Obsidian Velvet or Pietra Dura Lacquer), choose your 4 delicacies, and engrave a personalized royal calligraphy letter!

*For corporate orders of 25+ boxes, WhatsApp our concierge directly at **+91 99171 04448** for bespoke customization and corporate pricing.*`;
  }

  if (q.includes('order') || q.includes('shipping') || q.includes('delivery') || q.includes('track') || q.includes('payment') || q.includes('cod')) {
    return `### 📦 Orders, Delivery & Payments

* **Shipping Time:** Orders are securely packed in nitrogen-flushed jars and dispatched within 24 hours from Agra. Delivery takes **3 to 5 business days** anywhere in India.
* **Free Delivery:** Complimentary shipping on all orders above **₹999**.
* **Payment Methods:**
  * Cash on Delivery (COD)
  * Instant UPI (Google Pay, PhonePe, Paytm, BHIM)
  * Credit / Debit Cards (Visa, Mastercard, RuPay)
  * Net Banking across all Indian banks
* **Need Assistance?**
  Reach out to our customer care team at **+91 99171 04448** or email **ankurkaushal0016@gmail.com**.`;
  }

  return `Welcome to **ARAJ DRY FRUITS & SPICES** (Est. 1985, Agra). I am your Royal AI Spicer & Sommelier!

I am delighted to assist you with:
1. **Brand Heritage & Mill Story:** Stone-ground authenticity since 1985 in Agra.
2. **Product Catalog & Pricing:** California Almonds, Jumbo Cashews, Turmeric, Chana Masala, and gift packs.
3. **Culinary Tips & Recipes:** How to achieve royal aromatic flavors in your dishes.
4. **Health & Ayurvedic Benefits:** Brain health, heart wellness, and immune support.
5. **Custom Gift Hampers:** Curating a personalized royal gift box for family or corporate clients.

Please feel free to ask any question about our pure dry fruits and heritage spices!`;
}

// API Route for AI Chatbot
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, userPrompt, model: requestedModel, role: requestedRole } = req.body;
    const promptText = userPrompt || (messages && messages.length > 0 ? messages[messages.length - 1].content : '');

    if (!promptText || typeof promptText !== 'string' || !promptText.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Allowed models: gemini-3.8-flash (default), gemini-3.5-flash, gemini-3.1-flash-lite, gemini-3.1-pro-preview
    const allowedModels = [
      'gemini-3.8-flash',
      'gemini-3.5-flash',
      'gemini-3.1-flash-lite',
      'gemini-3.1-pro-preview',
    ];
    const targetModel = allowedModels.includes(requestedModel) ? requestedModel : 'gemini-3.8-flash';

    // Pick system instruction based on role
    const activeSystemInstruction =
      (requestedRole && ROLE_SYSTEM_INSTRUCTIONS[requestedRole]) || BRAND_SYSTEM_INSTRUCTION;

    const ai = getGeminiClient();

    // If Gemini client is initialized and key is present, invoke selected Gemini model
    if (ai) {
      try {
        const contents: any[] = [];
        
        if (Array.isArray(messages) && messages.length > 0) {
          // Format multi-turn conversation history for Gemini (keep up to 16 turns)
          const validHistory = messages.slice(-16).filter(
            (m) => m && typeof m.content === 'string' && m.content.trim()
          );

          for (const msg of validHistory) {
            contents.push({
              role: msg.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: msg.content.trim() }],
            });
          }
        } else {
          contents.push({
            role: 'user',
            parts: [{ text: promptText.trim() }],
          });
        }

        const geminiPromise = ai.models.generateContent({
          model: targetModel,
          contents,
          config: {
            systemInstruction: activeSystemInstruction,
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        });

        // 25-second timeout race to handle deep reasoning and network latency safely
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), 25000)
        );

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);

        const replyText = response.text || generateFallbackResponse(promptText);
        return res.json({ reply: replyText, source: 'gemini', model: targetModel });
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, using high-fidelity brand knowledge fallback:', geminiError?.message);
        const replyText = generateFallbackResponse(promptText);
        return res.json({ reply: replyText, source: 'fallback', note: 'Served from Araj culinary knowledge engine' });
      }
    }

    // If no GEMINI_API_KEY provided yet, serve from our curated Araj knowledge engine
    const replyText = generateFallbackResponse(promptText);
    return res.json({ reply: replyText, source: 'knowledge_engine' });
  } catch (error: any) {
    console.error('Error in /api/chat route:', error);
    return res.status(500).json({ error: 'Internal server error', details: error?.message });
  }
});

// ==========================================
// ARAJ SOVEREIGN CUSTOMER DATABASE API
// ==========================================

// 1. Sync or Upsert Customer Profile (called on Google auth, login, or profile changes)
app.post('/api/customer/sync', (req, res) => {
  try {
    const { id, email, name, phone, address, city, state, pincode, provider, avatar } = req.body;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Customer email is required' });
    }

    const customer = upsertCustomer({
      id,
      email,
      name,
      phone,
      address,
      city,
      state,
      pincode,
      provider,
      avatar,
    });

    return res.json({ success: true, customer });
  } catch (err: any) {
    console.error('Error in /api/customer/sync:', err);
    return res.status(500).json({ error: 'Failed to sync customer details', details: err?.message });
  }
});

// 2. Direct Customer Registration (Independent of Firebase)
app.post('/api/customer/register', (req, res) => {
  try {
    const { email, password, name, phone, address } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const result = registerCustomerDirect(email, password, name || '', phone, address);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    return res.json({ success: true, customer: result.customer });
  } catch (err: any) {
    console.error('Error in /api/customer/register:', err);
    return res.status(500).json({ error: 'Failed to register customer', details: err?.message });
  }
});

// 3. Direct Customer Login (Independent of Firebase)
app.post('/api/customer/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = authenticateCustomerDirect(email, password);
    if (!result.success) {
      return res.status(401).json({ error: result.error });
    }

    return res.json({ success: true, customer: result.customer });
  } catch (err: any) {
    console.error('Error in /api/customer/login:', err);
    return res.status(500).json({ error: 'Failed to authenticate customer', details: err?.message });
  }
});

// 4. Inspect Customer Database Status & Architecture Metrics
app.get('/api/customer/database-status', (req, res) => {
  try {
    const stats = getCustomerDatabaseStats();
    return res.json(stats);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to inspect customer database' });
  }
});

// 5. Export Full Customer Data (for customer backup)
app.get('/api/customer/export', (req, res) => {
  try {
    const data = exportCustomerDatabase();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="araj_customer_database.json"');
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to export customer database' });
  }
});

// 6. Fetch Customer Details by Email or ID
app.get('/api/customer/:identifier', (req, res) => {
  try {
    const customer = getCustomer(req.params.identifier);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found in database' });
    }
    return res.json({ customer });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve customer', details: err?.message });
  }
});

// 7. Update Customer Profile Details
app.put('/api/customer/profile', (req, res) => {
  try {
    const { identifier, name, phone, address, city, state, pincode, notes } = req.body;
    if (!identifier) {
      return res.status(400).json({ error: 'Customer identifier is required' });
    }

    const updated = updateCustomer(identifier, {
      name,
      phone,
      address,
      city,
      state,
      pincode,
      notes,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Customer not found to update' });
    }

    return res.json({ success: true, customer: updated });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update customer profile', details: err?.message });
  }
});

// 8. Save and Record Order in Customer Database
app.post('/api/orders', (req, res) => {
  try {
    const orderData = req.body;
    if (!orderData || !orderData.items || !orderData.customer) {
      return res.status(400).json({ error: 'Valid order data and customer details are required' });
    }

    const savedOrder = saveOrderToDatabase(orderData);
    return res.json({ success: true, order: savedOrder });
  } catch (err: any) {
    console.error('Error in /api/orders:', err);
    return res.status(500).json({ error: 'Failed to save order in database', details: err?.message });
  }
});

// 9. Get Orders for Customer
app.get('/api/customer/orders/:identifier', (req, res) => {
  try {
    const orders = getOrdersForCustomer(req.params.identifier);
    return res.json({ orders });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch customer orders', details: err?.message });
  }
});

// 10. Submit B2B Distributor Inquiry to Database
app.post('/api/distributor-inquiries', (req, res) => {
  try {
    const inquiryData = req.body;
    if (!inquiryData || !inquiryData.fullName || !inquiryData.phone) {
      return res.status(400).json({ error: 'Name and phone number are required' });
    }

    const savedInquiry = saveDistributorInquiryToDatabase(inquiryData);
    return res.json({ success: true, inquiry: savedInquiry });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to save inquiry', details: err?.message });
  }
});

// 11. Update Product Image (e.g. For uploading exact Peri Peri Masala box packaging image)
app.post('/api/admin/update-product-image', (req, res) => {
  try {
    const { productId, imageBase64, filename } = req.body;
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'Image base64 data is required' });
    }

    // Clean base64 header if present
    const base64Clean = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Clean, 'base64');

    const targetFileName = filename || 'peri-peri-masala.png';
    const targetDir = path.join(process.cwd(), 'public', 'images', 'products-spices');
    const distTargetDir = path.join(process.cwd(), 'dist', 'images', 'products-spices');

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    if (!fs.existsSync(distTargetDir)) {
      fs.mkdirSync(distTargetDir, { recursive: true });
    }

    const publicFilePath = path.join(targetDir, targetFileName);
    const distFilePath = path.join(distTargetDir, targetFileName);

    fs.writeFileSync(publicFilePath, buffer);
    try {
      fs.writeFileSync(distFilePath, buffer);
    } catch {
      // dist may not exist yet in pure dev mode
    }

    console.log(`Successfully updated product image for ${productId || targetFileName}: ${publicFilePath} (${buffer.length} bytes)`);

    return res.json({
      success: true,
      imagePath: `/images/products-spices/${targetFileName}?t=${Date.now()}`,
      bytes: buffer.length,
      filename: targetFileName,
    });
  } catch (err: any) {
    console.error('Error updating product image:', err);
    return res.status(500).json({ error: 'Failed to save product image', details: err?.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    brand: 'ARAJ DRY FRUITS & SPICES',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Serve manifest.webmanifest with correct MIME type
app.get('/manifest.webmanifest', (req, res) => {
  res.setHeader('Content-Type', 'application/manifest+json');
  res.sendFile(path.join(process.cwd(), 'public', 'manifest.webmanifest'));
});

// Serve Digital Asset Links for Google Play Store Trusted Web Activity verification
app.get('/.well-known/assetlinks.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(path.join(process.cwd(), 'public', '.well-known', 'assetlinks.json'));
});

// Serve public assets directly
const publicPath = path.join(process.cwd(), 'public');
app.use(express.static(publicPath));

// Vite middleware configuration for dev and production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Araj Dry Fruits & Spices server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
