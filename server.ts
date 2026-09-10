import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

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

const BRAND_SYSTEM_INSTRUCTION = `
You are the "Araj Royal AI Spicer & Sommelier", the digital culinary master and brand ambassador for ARAJ DRY FRUITS & SPICES (established in 1985 in historic Agra, India).
Website: https://www.arajpure.com/

ABOUT ARAJ BRAND & HERITAGE:
- Founded: 1985 in Agra, Uttar Pradesh, India by the Kaushal family.
- Address: 11/48-E, Near Apsara Talkies, Hathras Road, Naraich, Agra-282006 (U.P.), India.
- Helpline / WhatsApp: +91 99171 04448
- Official Email: ankurkaushal0016@gmail.com
- Core Promise: "Pure • Premium • Authentic • Timeless"
- 39+ years of royal craftsmanship. Known for cold stone-ground spices that preserve fragile volatile terpenes and essential aromatic oils below 32°C.
- Zero synthetic fillers, zero artificial colorants, zero starch dilution. Every batch is certified 99.8% pure and nitrogen-vacuum sealed.

PRODUCT CATALOG & EXPERTISE:
1. Spices & Masalas:
   - Chana Masala (Royal Amritsari & Punjabi blend, stone ground) - ₹80 (100g)
   - Haldi / Turmeric Powder (High Curcumin Golden Harvest) - ₹130 (500g)
   - Chatpata Chat Masala (Zesty amchur & black salt balance) - ₹75 (100g)
   - Royal Garam Masala (Whole roasted cardamom, mace, cinnamon, cloves) - ₹95 (100g)
   - Dal Makhani Masala, Kitchen King, Pav Bhaji, Shahi Paneer, Kashmiri Mirch, Sabji Masala, Hing (Compounded Asafoetida), Coriander (Dhaniya), Cumin (Jeera), Black Pepper (Kali Mirch).
2. Dry Fruits & Nuts:
   - Badam Migi / California Almonds (Hand-selected, high vitamin E) - ₹249 (250g)
   - Premium Cashews / Kaju W240 Jumbo (Creamy & buttery crunch) - ₹299 (250g)
   - Akhrot Giri / Kashmiri Walnut Kernels (Rich in Omega-3 DHA) - ₹340 (250g)
   - Afghan Green Pistachios / Pista - ₹380 (250g)
   - Golden Munakka & Kishmish (Sun-cured Afghan grapes) - ₹180 (250g)
   - Premium Dried Figs / Anjeer & Foxnuts / Phool Makhana.
3. Luxury Gift Packs & Hampers:
   - Royal Shahi Treat Box (Curated 4-compartment keepsake with gold foil) - ₹825
   - Bespoke Hamper Atelier: Custom selection with personalized gold calligraphy card and obsidian/marble lacquer boxes.

SERVICES & LOGISTICS:
- Delivery: Pan-India express delivery within 3-5 business days.
- Free Shipping on orders over ₹999.
- Payment Options: Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking.
- Quality Guarantee: 100% return or replacement if seal is broken or unsatisfactory.

TONE & BEHAVIOR:
- Royal, warm, refined, hospitable, and knowledgeable.
- Answer user queries about brand history, ingredients, recipes, culinary pairings, health and Ayurvedic benefits (e.g., soaking almonds overnight, curcumin absorption with black pepper, walnut brain health), storage tips (airtight glass jars away from direct sunlight), and gifting ideas.
- Use markdown formatting with clear headings, bullet points, and bold text for readability.
- When recommending items, mention their authentic Araj names and pack sizes.
- Keep answers concise, helpful, and inviting.
`;

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
    const { messages, userPrompt } = req.body;
    const promptText = userPrompt || (messages && messages.length > 0 ? messages[messages.length - 1].content : '');

    if (!promptText || typeof promptText !== 'string' || !promptText.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getGeminiClient();

    // If Gemini client is initialized and key is present, invoke Gemini 3.8 Flash
    if (ai) {
      try {
        const contents: any[] = [];
        
        if (Array.isArray(messages) && messages.length > 0) {
          // Format conversation history for Gemini
          for (const msg of messages.slice(-6)) {
            contents.push({
              role: msg.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: msg.content }],
            });
          }
        } else {
          contents.push({
            role: 'user',
            parts: [{ text: promptText }],
          });
        }

        const geminiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: BRAND_SYSTEM_INSTRUCTION,
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        });

        // 6-second timeout race to prevent hanging
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), 6000)
        );

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);

        const replyText = response.text || generateFallbackResponse(promptText);
        return res.json({ reply: replyText, source: 'gemini' });
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
