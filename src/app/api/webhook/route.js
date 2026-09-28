import { NextResponse } from "next/server";
import axios from "axios";
import { getRestaurantSettings } from "@/lib/settings-store";
import { getWhatsAppCredentials } from "@/lib/whatsapp/client";
import { generateMultiProviderReply } from "@/lib/ai/multi-provider";
import { downloadWhatsAppMedia } from "@/lib/whatsapp/media";
import { analyzePaymentSlip } from "@/lib/ai/payment-analyzer";
import { prisma } from "@/lib/db";

// =============================================================================
//  DEALS HUB CATALOG (Bundles & Promotions)
// =============================================================================
export const DEALS_HUB = {
  deals_cat_summer: {
    title: { ROMAN_URDU: "☀️ Summer Deals (1-10)", URDU: "☀️ سمر ڈیلز", ENGLISH: "☀️ Summer Deals" },
    rows: [
      { id: "sum_1", title: "Summer Deal 1", price: 1100, desc: "Rs. 1100 | 2 Small Pastas, Brownie, Drink" },
      { id: "sum_2", title: "Summer Deal 2", price: 1900, desc: "Rs. 1900 | 4 Zinger Burgers, 2 Brownies, 1.5L" },
      { id: "sum_3", title: "Summer Deal 3", price: 770, desc: "Rs. 770 | 1 Small Pasta, Fries, 500ml Drink" },
      { id: "sum_4", title: "Summer Deal 4", price: 690, desc: "Rs. 690 | 2 Chicken Burgers, Fries, 350ml" },
      { id: "sum_5", title: "Summer Deal 5", price: 1200, desc: "Rs. 1200 | 1 Large Pasta, Custard, 500ml" },
      { id: "sum_6", title: "Summer Deal 6", price: 1450, desc: "Rs. 1450 | 2 Zingers, Large Pasta, 1.5L" },
      { id: "sum_7", title: "Summer Deal 7", price: 3050, desc: "Rs. 3050 | 2 Large Pizzas, Large Pasta, 1.5L" },
      { id: "sum_8", title: "Summer Deal 8", price: 1070, desc: "Rs. 1070 | 2 Small Pastas, 500ml Drink" },
      { id: "sum_9", title: "Summer Deal 9", price: 1950, desc: "Rs. 1950 | 1 Large Pizza, 4 Spin Roll, 1L" },
      { id: "sum_10", title: "Summer Deal 10", price: 890, desc: "Rs. 890 | 2 Zinger Parathas, Fries, 500ml" },
    ],
  },
  deals_cat_special_1: {
    title: { ROMAN_URDU: "🔥 Special Deals (1-9)", URDU: "🔥 سپیشل ڈیلز (1 تا 9)", ENGLISH: "🔥 Special Deals (1-9)" },
    rows: [
      { id: "deal_1", title: "Deal 1", price: 580, desc: "Rs. 580 | 1 Small Pizza + 350ml Drink" },
      { id: "deal_2", title: "Deal 2", price: 500, desc: "Rs. 500 | 1 Patty Burger + Fries + Drink" },
      { id: "deal_3", title: "Deal 3", price: 810, desc: "Rs. 810 | 2 Zinger Burgers + 2 Drinks" },
      { id: "deal_4", title: "Deal 4", price: 1150, desc: "Rs. 1150 | 2 Zingers + 2 Fries + 2 Drinks" },
      { id: "deal_5", title: "Deal 5", price: 750, desc: "Rs. 750 | 1 Zinger + 1 Patty + Fries + 2 Drinks" },
      { id: "deal_6", title: "Deal 6", price: 1700, desc: "Rs. 1700 | 1 Large + 1 Medium + 1.5L Drink" },
      { id: "deal_7", title: "Deal 7", price: 2650, desc: "Rs. 2650 | 2 Large Pizzas + 1.5L Drink" },
      { id: "deal_8", title: "Deal 8", price: 480, desc: "Rs. 480 | 1 Small Pizza + 1 Zinger + Drink" },
      { id: "deal_9", title: "Deal 9", price: 1300, desc: "Rs. 1300 | 1 Med Pizza + 5 Wings + Drink" },
    ],
  },
  deals_cat_special_2: {
    title: { ROMAN_URDU: "🔥 Special Deals (10-17)", URDU: "🔥 سپیشل ڈیلز (10 تا 17)", ENGLISH: "🔥 Special Deals (10-17)" },
    rows: [
      { id: "deal_10", title: "Deal 10", price: 1700, desc: "Rs. 1700 | 1 Large Pizza + Large Fries + 1.5L" },
      { id: "deal_11", title: "Deal 11", price: 1250, desc: "Rs. 1250 | 1 Med Pizza + 5 Wings + 500ml" },
      { id: "deal_12", title: "Deal 12", price: 1800, desc: "Rs. 1800 | 1 Zinger + Large Fries + 350ml" },
      { id: "deal_13", title: "Deal 13", price: 1950, desc: "Rs. 1950 | 1 Large Pizza + 4 Spin Roll + 1.5L" },
      { id: "deal_14", title: "Deal 14", price: 1150, desc: "Rs. 1150 | 2 Grill Burgers + Fries + 2 Drinks" },
      { id: "deal_15", title: "Deal 15", price: 1700, desc: "Rs. 1700 | 1 Large Pizza + Large Fries + 1.5L" },
      { id: "deal_16", title: "Deal 16", price: 860, desc: "Rs. 860 | 1 Small Pizza + 1 Zinger + 350ml" },
      { id: "deal_17", title: "Deal 17", price: 1650, desc: "Rs. 1650 | 2 Small Pizzas + 1 Wrap + 350ml" },
    ],
  },
  deals_cat_family_rice: {
    title: { ROMAN_URDU: "👨‍👩‍👧‍👦 Family & Rice Deals", URDU: "👨‍👩‍👧‍👦 فیملی اور رائس ڈیلز", ENGLISH: "👨‍👩‍👧‍👦 Family & Rice Deals" },
    rows: [
      { id: "fam_1", title: "Family Deal 1", price: 3180, desc: "Rs. 3180 | 2 Large Pizzas, Fries, Broast, 1.5L" },
      { id: "fam_2", title: "Family Deal 2", price: 3000, desc: "Rs. 3000 | 2 Large Pizzas + 1.5L Drink" },
      { id: "fam_3", title: "Family Deal 3", price: 2100, desc: "Rs. 2100 | 2 Broast, 1 Fries, 1.5L Drink" },
      { id: "fam_4", title: "Family Deal 4", price: 3350, desc: "Rs. 3350 | 2 Large Pizzas, Large Fries, 1.5L" },
      { id: "rd_1", title: "Rice Deal 1", price: 1050, desc: "Rs. 1050 | 2 Biryani/Pulao, Kheer, 500ml" },
      { id: "rd_2", title: "Rice Deal 2", price: 990, desc: "Rs. 990 | 2 Biryani/Pulao, Half Zarda, 500ml" },
      { id: "rd_3", title: "Rice Deal 3", price: 630, desc: "Rs. 630 | 1 Biryani/Pulao, Brownie, 350ml" },
    ],
  },
};

// =============================================================================
//  REGULAR FOOD MENU CATALOG (A La Carte)
// =============================================================================
export const FOOD_MENU = {
  food_cat_pizza_reg: {
    title: { ROMAN_URDU: "🍕 Regular Pizzas", URDU: "🍕 ریگولر پیزا", ENGLISH: "🍕 Regular Pizzas" },
    rows: [
      { id: "pz_reg_s", title: "Regular Pizza (Small)", price: 440, desc: "Rs. 440 | Tikka / Fajita / Supreme" },
      { id: "pz_reg_m", title: "Regular Pizza (Medium)", price: 900, desc: "Rs. 900 | Tikka / Fajita / Supreme" },
      { id: "pz_reg_l", title: "Regular Pizza (Large)", price: 1300, desc: "Rs. 1300 | Tikka / Fajita / Supreme" },
      { id: "pz_reg_xl", title: "Regular Pizza (XL)", price: 1900, desc: "Rs. 1900 | Tikka / Fajita / Supreme" },
    ],
  },
  food_cat_pizza_sp: {
    title: { ROMAN_URDU: "🍕 Special & Crust Pizzas", URDU: "🍕 سپیشل اور کرسٹ پیزا", ENGLISH: "🍕 Special & Crust Pizzas" },
    rows: [
      { id: "pz_sp_s", title: "Special A-One (Small)", price: 480, desc: "Rs. 480 | Malai Boti, Peri Peri, BBQ" },
      { id: "pz_sp_m", title: "Special A-One (Medium)", price: 1000, desc: "Rs. 1000 | Malai Boti, Peri Peri, BBQ" },
      { id: "pz_sp_l", title: "Special A-One (Large)", price: 1450, desc: "Rs. 1450 | Malai Boti, Peri Peri, BBQ" },
      { id: "pz_sp_xl", title: "Special A-One (XL)", price: 2100, desc: "Rs. 2100 | Malai Boti, Peri Peri, BBQ" },
      { id: "pz_bh_m", title: "Behari Kabab Pizza (M)", price: 1050, desc: "Rs. 1050" },
      { id: "pz_cr_l", title: "Special Crust (Large)", price: 1200, desc: "Rs. 1200 | Cheese / Stuffer" },
    ],
  },
  food_cat_burgers: {
    title: { ROMAN_URDU: "🍔 Broast & Burgers", URDU: "🍔 بروسٹ اور برگر", ENGLISH: "🍔 Broast & Burgers" },
    rows: [
      { id: "br_f", title: "Full Broast", price: 2000, desc: "Rs. 2000 | Crispy fried chicken" },
      { id: "br_h", title: "Half Broast", price: 1200, desc: "Rs. 1200 | Crispy fried chicken" },
      { id: "br_q", title: "Quarter Broast", price: 700, desc: "Rs. 700 | Crispy fried chicken" },
      { id: "bg_z", title: "Zinger Burger", price: 370, desc: "Rs. 370 | Crispy fillet" },
      { id: "bg_mz", title: "Mighty Zinger", price: 430, desc: "Rs. 430 | Double patty" },
      { id: "bg_gr", title: "Grill Burger", price: 450, desc: "Rs. 450 | Grilled patty" },
      { id: "wp_z", title: "Zinger Wrap", price: 420, desc: "Rs. 420 | Tortilla zinger" },
    ],
  },
  food_cat_shawarma: {
    title: { ROMAN_URDU: "🌯 Shawarma & Rolls", URDU: "🌯 شوارما اور رولز", ENGLISH: "🌯 Shawarma & Rolls" },
    rows: [
      { id: "sh_ck", title: "Chicken Shawarma", price: 200, desc: "Rs. 200 | Fresh wrapped pita" },
      { id: "sh_zg", title: "Zinger Shawarma", price: 280, desc: "Rs. 280 | Crispy zinger roll" },
      { id: "pl_sp", title: "Special Platter", price: 1070, desc: "Rs. 1070 | 4 Spin Rolls, Wings, Fries" },
      { id: "pr_kb", title: "Kabab Paratha", price: 320, desc: "Rs. 320 | Grilled kabab roll" },
      { id: "pr_mb", title: "Malai Boti Paratha", price: 360, desc: "Rs. 360 | Creamy chicken roll" },
    ],
  },
  food_cat_pasta: {
    title: { ROMAN_URDU: "🍝 Pasta & Loaded Fries", URDU: "🍝 پاستا اور فرائز", ENGLISH: "🍝 Pasta & Loaded Fries" },
    rows: [
      { id: "pa_sp_s", title: "Special Pasta (Small)", price: 430, desc: "Rs. 430 | Baked cheese" },
      { id: "pa_sp_l", title: "Special Pasta (Large)", price: 720, desc: "Rs. 720 | Creamy baked pasta" },
      { id: "fr_ld", title: "Loaded Fries", price: 620, desc: "Rs. 620 | Melted cheese bites" },
      { id: "fr_pz", title: "Pizza Fries", price: 600, desc: "Rs. 600 | Sauce & cheese loaded" },
    ],
  },
  food_cat_rice: {
    title: { ROMAN_URDU: "🍚 Traditional Rice", URDU: "🍚 بریانی اور پلاؤ", ENGLISH: "🍚 Traditional Rice" },
    rows: [
      { id: "tr_cb", title: "Chicken Biryani", price: 380, desc: "Rs. 380 | Fresh spiced biryani" },
      { id: "tr_sb", title: "Special Biryani", price: 440, desc: "Rs. 440 | Double chicken loaded" },
      { id: "tr_cp", title: "Chicken Pulao", price: 380, desc: "Rs. 380 | Traditional pulao" },
      { id: "tr_bp", title: "Beef Pulao", price: 430, desc: "Rs. 430 | Slow cooked tender beef" },
    ],
  },
  food_cat_beverages: {
    title: { ROMAN_URDU: "🥤 Shakes & Beverages", URDU: "🥤 شیکس اور مشروبات", ENGLISH: "🥤 Shakes & Beverages" },
    rows: [
      { id: "bv_df", title: "Dry Fruit Shake", price: 700, desc: "Rs. 700 | Kaju / Almond" },
      { id: "bv_ym", title: "Yum's Shake (Oreo)", price: 400, desc: "Rs. 400 | Thick chocolate" },
      { id: "bv_ms", title: "Fresh Milk Shake", price: 280, desc: "Rs. 280 | Mango / Strawberry" },
      { id: "bv_mg", title: "Mint Margarita", price: 150, desc: "Rs. 150 | Chilled mint soda" },
    ],
  },
};

// =============================================================================
//  HELPER: LOOKUP ITEM ACROSS ALL CATALOGS
// =============================================================================
export function findItemInCatalogs(itemId) {
  for (const cat of Object.values(DEALS_HUB)) {
    const found = cat.rows.find((r) => r.id === itemId);
    if (found) return found;
  }
  for (const cat of Object.values(FOOD_MENU)) {
    const found = cat.rows.find((r) => r.id === itemId);
    if (found) return found;
  }
  return null;
}

// Multi-User Session Map (Track each customer phone number separately)
export const userSessions = new Map();

export function getSession(phone) {
  if (!userSessions.has(phone)) {
    userSessions.set(phone, {
      language: "ROMAN_URDU",
      step: "IDLE",
      selectedItem: null,
      selectedItemDetails: null,
      unitPrice: 0,
      quantity: 1,
      subtotal: 0,
      deliveryFee: 150,
      grandTotal: 0,
      address: null,
      selectedProvider: null,
      cart: [],
    });
  }
  return userSessions.get(phone);
}

export function resetUserSession(phone) {
  const current = getSession(phone);
  userSessions.set(phone, {
    language: current.language || "ROMAN_URDU",
    step: "IDLE",
    selectedItem: null,
    selectedItemDetails: null,
    unitPrice: 0,
    quantity: 1,
    subtotal: 0,
    deliveryFee: 150,
    grandTotal: 0,
    address: null,
    selectedProvider: null,
    cart: [],
  });
}

async function sendWhatsApp(to, data) {
  try {
    const creds = await getWhatsAppCredentials();
    if (!creds.phoneId || !creds.token) {
      console.warn("[webhook route] WHATSAPP_TOKEN or PHONE_NUMBER_ID not configured.");
      return;
    }
    await axios.post(
      `https://graph.facebook.com/${creds.apiVersion || "v21.0"}/${creds.phoneId}/messages`,
      { messaging_product: "whatsapp", to, ...data },
      { headers: { Authorization: `Bearer ${creds.token}` } }
    );
  } catch (err) {
    console.error("WhatsApp Send Error:", err.response?.data || err.message);
  }
}

// Helper: Parse or fallback item price
function getItemPrice(item, details) {
  if (details && typeof details.price === "number" && !isNaN(details.price) && details.price > 0) return details.price;
  if (details && typeof details.desc === "string") {
    const m = details.desc.match(/Rs\.?\s*(\d+)/i);
    if (m && !isNaN(parseInt(m[1], 10)) && parseInt(m[1], 10) > 0) return parseInt(m[1], 10);
  }
  if (typeof item === "string") {
    const m = item.match(/Rs\.?\s*(\d+)/i);
    if (m && !isNaN(parseInt(m[1], 10)) && parseInt(m[1], 10) > 0) return parseInt(m[1], 10);
  }
  return 550;
}

// Helper: Push order to Prisma Database
async function createDatabaseOrder({
  phone,
  session,
  paymentMethod,
  paymentStatus,
  paymentReference = null,
  paymentScreenshot = null,
  paymentNotes = null,
}) {
  try {
    const cleanPhone = phone.replace(/\D/g, "");
    const formattedPhone = `+${cleanPhone}`;

    // 1. Customer
    let customer = await prisma.customer.findUnique({
      where: { phone: formattedPhone },
    });
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          phone: formattedPhone,
          name: `Customer ${cleanPhone.slice(-4)}`,
          address: session.address || "Address provided via WhatsApp",
        },
      });
    } else if (session.address && !customer.address) {
      await prisma.customer.update({
        where: { id: customer.id },
        data: { address: session.address },
      });
    }

    // 2. Conversation
    let conversation = await prisma.conversation.findFirst({
      where: { customerId: customer.id },
    });
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          customerId: customer.id,
          channel: "WHATSAPP",
          status: "OPEN",
          lastMessageAt: new Date(),
        },
      });
    }

    const orderNumber = `AO-${Date.now().toString().slice(-6)}`;
    const unitPrice = Number(session.unitPrice) || 0;
    const qty = Number(session.quantity) || 1;
    const subtotal = unitPrice * qty;
    const deliveryCharges = 150;
    const finalTotal = subtotal + deliveryCharges;

    session.unitPrice = unitPrice;
    session.quantity = qty;
    session.subtotal = subtotal;
    session.deliveryFee = deliveryCharges;
    session.grandTotal = finalTotal;

    // 3. Order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        conversationId: conversation.id,
        status: "NEW",
        orderType: "DELIVERY",
        paymentStatus,
        paymentMethod,
        paymentReference,
        paymentScreenshot,
        paymentNotes,
        subtotal,
        deliveryFee: deliveryCharges,
        discount: 0,
        total: finalTotal,
        customerName: customer.name || `Customer ${cleanPhone.slice(-4)}`,
        customerPhone: formattedPhone,
        deliveryAddress: session.address || customer.address || "Not specified",
        notes: `Placed via WhatsApp Interactive Chatbot (${paymentMethod})`,
        items: {
          create: [
            {
              itemName: session.selectedItem || "A-ONE Dish",
              unitPrice: unitPrice,
              quantity: qty,
              subtotal: subtotal,
            },
          ],
        },
      },
    });

    // 4. Dashboard Notification
    const notifTitle =
      paymentStatus === "PENDING_VERIFICATION"
        ? `🚨 Online Payment Approval Needed - #${orderNumber}`
        : `🔔 New COD Order Received - #${orderNumber}`;

    const notifMessage =
      paymentStatus === "PENDING_VERIFICATION"
        ? `Customer ${formattedPhone} uploaded slip for Rs. ${total.toLocaleString()}. Ref: ${paymentReference || "N/A"}`
        : `Customer ${formattedPhone} ordered ${session.selectedItem} (x${session.quantity}) for Rs. ${total.toLocaleString()} (COD)`;

    await prisma.notification.create({
      data: {
        title: notifTitle,
        message: notifMessage,
        type: paymentStatus === "PENDING_VERIFICATION" ? "WARNING" : "INFO",
        link: paymentStatus === "PENDING_VERIFICATION" ? "/admin/orders?status=PENDING_VERIFICATION" : "/admin/orders",
      },
    }).catch(() => {});

    return order;
  } catch (err) {
    console.error("[createDatabaseOrder] DB error:", err);
    return null;
  }
}

// =============================================================================
//  FLOW 1: GREETING & LANGUAGE SELECTION
// =============================================================================
async function sendLanguageSelection(to) {
  const bodyText =
    "Assalam-o-Alaikum! A-One Foods mein khushamdeed.\nApni zaban muntakhib karein / Select Language:";

  await sendWhatsApp(to, {
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: bodyText },
      action: {
        buttons: [
          { type: "reply", reply: { id: "set_lang_roman", title: "🇵🇰 Roman Urdu" } },
          { type: "reply", reply: { id: "set_lang_urdu", title: "🇵🇰 اردو" } },
          { type: "reply", reply: { id: "set_lang_en", title: "🇬🇧 English" } },
        ],
      },
    },
  });
}

// =============================================================================
//  FLOW 2: MAIN ENTRY BUTTONS ([📜 View Menu], [🔥 All Deals], [👨‍🍳 Staff Support])
// =============================================================================
async function sendMainActionButtons(to, language = "ROMAN_URDU") {
  let bodyText =
    "Aapki khidmat ke liye hazir hain. Khana dekhne ya deals ke liye neeche button par tap karein:";
  let btnDeals = "🔥 All Deals (NEW)";
  let btnMenu = "📜 View Menu (NEW)";
  let btnStaff = "👨‍🍳 Staff Support";

  if (language === "URDU") {
    bodyText = "اے ون فوڈز میں خوش آمدید! مینو یا ڈیلز کے لیے نیچے دیے گئے بٹن پر ٹیپ کریں:";
    btnDeals = "🔥 تمام ڈیلز (NEW)";
    btnMenu = "📜 مینو دیکھیں (NEW)";
    btnStaff = "👨‍🍳 عملے سے رابطہ";
  } else if (language === "ENGLISH") {
    bodyText = "Welcome to A-One Foods! Please tap a button below to view food menu or deals:";
    btnDeals = "🔥 All Deals (NEW)";
    btnMenu = "📜 View Menu (NEW)";
    btnStaff = "👨‍🍳 Staff Support";
  }

  await sendWhatsApp(to, {
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: bodyText },
      action: {
        buttons: [
          { type: "reply", reply: { id: "btn_open_deals_hub", title: btnDeals.slice(0, 20) } },
          { type: "reply", reply: { id: "btn_open_food_menu", title: btnMenu.slice(0, 20) } },
          { type: "reply", reply: { id: "btn_open_staff", title: btnStaff.slice(0, 20) } },
        ],
      },
    },
  });
}

// =============================================================================
//  FLOW 3: ALL DEALS HUB LIST (ONLY BUNDLE DEALS)
// =============================================================================
async function sendDealsHubList(to, language = "ROMAN_URDU") {
  const dealsCategories = [
    {
      id: "deals_cat_summer",
      title: "☀️ Summer Deals (1-10)",
      description: "Rs. 690 se Rs. 3050 tak",
    },
    {
      id: "deals_cat_special_1",
      title: "🔥 Special Deals (1-9)",
      description: "Rs. 480 se Rs. 2650 tak",
    },
    {
      id: "deals_cat_special_2",
      title: "🔥 Special Deals (10-17)",
      description: "Rs. 860 se Rs. 1950 tak",
    },
    {
      id: "deals_cat_family_rice",
      title: "👨‍👩‍👧‍👦 Family & Rice Deals",
      description: "Family combos & Rice deals",
    },
  ];

  let headerText = "🔥 A-One Deals Hub";
  let bodyText = "Apni pasandeeda Deal category select karein:";
  let buttonTitle = "Deals Categories";

  if (language === "URDU") {
    headerText = "🔥 اے ون ڈیلز ہب";
    bodyText = "اپنی پسندیدہ ڈیل کیٹیگری منتخب کریں:";
    buttonTitle = "ڈیلز کیٹیگریز";
  }

  await sendWhatsApp(to, {
    type: "interactive",
    interactive: {
      type: "list",
      header: { type: "text", text: headerText },
      body: { text: bodyText },
      footer: { text: "A-One Foods Deals" },
      action: {
        button: buttonTitle.slice(0, 20),
        sections: [
          {
            title: "Deals Categories",
            rows: dealsCategories,
          },
        ],
      },
    },
  });
}

// =============================================================================
//  FLOW 4: REGULAR FOOD MENU LIST (ONLY FOOD CATEGORIES)
// =============================================================================
async function sendFoodMenuList(to, language = "ROMAN_URDU") {
  const foodCategories = [
    { id: "food_cat_pizza_reg", title: "🍕 Regular Pizzas", description: "Tikka / Fajita / Supreme / Euro" },
    { id: "food_cat_pizza_sp", title: "🍕 Special & Crust Pizzas", description: "Malai Boti, Peri Peri, Crusts" },
    { id: "food_cat_burgers", title: "🍔 Broast & Burgers", description: "Broast, Zingers & Grill Burgers" },
    { id: "food_cat_shawarma", title: "🌯 Shawarma & Rolls", description: "Pita Shawarma, Paratha Rolls" },
    { id: "food_cat_pasta", title: "🍝 Pasta & Loaded Fries", description: "Baked Pasta, Cheesy Loaded Fries" },
    { id: "food_cat_rice", title: "🍚 Traditional Rice", description: "Chicken & Beef Biryani, Pulao" },
    { id: "food_cat_beverages", title: "🥤 Shakes & Beverages", description: "Fresh Shakes, Mojitos & Drinks" },
  ];

  let headerText = "📜 A-One Food Menu";
  let bodyText = "Khana select karne ke liye category choose karein:";
  let buttonTitle = "Food Categories";

  if (language === "URDU") {
    headerText = "📜 اے ون فوڈ مینو";
    bodyText = "کھانا منتخب کرنے کے لیے کیٹیگری منتخب کریں:";
    buttonTitle = "کھانے کی کیٹیگریز";
  }

  await sendWhatsApp(to, {
    type: "interactive",
    interactive: {
      type: "list",
      header: { type: "text", text: headerText },
      body: { text: bodyText },
      footer: { text: "A-One Foods Menu" },
      action: {
        button: buttonTitle.slice(0, 20),
        sections: [
          {
            title: "Food Categories",
            rows: foodCategories,
          },
        ],
      },
    },
  });
}

// =============================================================================
//  FLOW 5: SUB-CATEGORY ITEMS LIST DROPDOWN WITH EXACT PRICES
// =============================================================================
async function sendCategoryDropdownItems(to, categoryKey, language = "ROMAN_URDU") {
  const catData = DEALS_HUB[categoryKey] || FOOD_MENU[categoryKey];

  if (!catData) {
    await sendFoodMenuList(to, language);
    return;
  }

  const categoryTitle =
    typeof catData.title === "object"
      ? catData.title[language] || catData.title.ROMAN_URDU
      : catData.title;

  const rows = catData.rows.slice(0, 10).map((r) => ({
    id: r.id,
    title: r.title.slice(0, 24),
    description: (r.desc || `Rs. ${r.price}`).slice(0, 72),
  }));

  let bodyText = "Apna manpasand item select karein:";
  let buttonTitle = "Items List";

  if (language === "URDU") {
    bodyText = "اپنا پسندیدہ آئٹم منتخب کریں:";
    buttonTitle = "آئٹمز لسٹ";
  }

  await sendWhatsApp(to, {
    type: "interactive",
    interactive: {
      type: "list",
      header: { type: "text", text: categoryTitle.substring(0, 60) },
      body: { text: bodyText },
      action: {
        button: buttonTitle.slice(0, 20),
        sections: [
          {
            title: categoryTitle.substring(0, 24),
            rows,
          },
        ],
      },
    },
  });
}

// =============================================================================
//  FLOW 6: HYBRID QUANTITY SELECTION ([1], [2], [✍️ Custom Type])
// =============================================================================
async function sendHybridQuantitySelection(to, item, session, language = "ROMAN_URDU") {
  const price = Number(item.price) > 0 ? Number(item.price) : getItemPrice(item.title, item);
  session.selectedItem = item.title;
  session.selectedItemDetails = item;
  session.unitPrice = price;
  session.quantity = 1;
  session.subtotal = price * 1;
  session.deliveryFee = 150;
  session.grandTotal = session.subtotal + session.deliveryFee;
  session.step = "AWAITING_QUANTITY";

  const bodyText =
    `Aapne select kiya: *${item.title}*\n` +
    `${item.desc || ""}\n` +
    `Price: *Rs. ${session.unitPrice}*\n\n` +
    `Kitni quantity chahiye? Button tap karein ya number type karein:`;

  await sendWhatsApp(to, {
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: bodyText },
      action: {
        buttons: [
          { type: "reply", reply: { id: "qty_1", title: "1️⃣ 1 Piece / Deal" } },
          { type: "reply", reply: { id: "qty_2", title: "2️⃣ 2 Pieces / Deals" } },
          { type: "reply", reply: { id: "qty_custom", title: "✍️ Custom Type" } },
        ],
      },
    },
  });
}

// =============================================================================
//  FLOW 7: PAYMENT METHOD SELECTION (COD vs Online Payment)
// =============================================================================
async function sendPaymentMethodSelection(to, session) {
  const unitPrice = Number(session.unitPrice) || 0;
  const qty = Number(session.quantity) || 1;
  const subtotal = unitPrice * qty;
  const deliveryCharges = 150;
  const finalTotal = subtotal + deliveryCharges;

  session.unitPrice = unitPrice;
  session.quantity = qty;
  session.subtotal = subtotal;
  session.deliveryFee = deliveryCharges;
  session.grandTotal = finalTotal;
  session.step = "AWAITING_PAYMENT_METHOD";

  const bodyText =
    `Item: *${session.selectedItem || "Selected Item"}* (x${qty})\n` +
    `Price: Rs. ${unitPrice} each\n` +
    `Subtotal: Rs. ${subtotal}\n` +
    `Delivery: Rs. ${deliveryCharges}\n` +
    `Total Bill: *Rs. ${finalTotal}*\n\n` +
    `Aap payment kis tarah karna chahte hain?`;

  await sendWhatsApp(to, {
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: bodyText },
      action: {
        buttons: [
          { type: "reply", reply: { id: "pay_cod", title: "💵 Cash on Delivery" } },
          { type: "reply", reply: { id: "pay_online", title: "💳 Online Payment" } },
        ],
      },
    },
  });
}

// =============================================================================
//  FLOW 8: ONLINE PROVIDER SELECTION
// =============================================================================
async function sendOnlineProviderSelection(to, session) {
  session.step = "AWAITING_ONLINE_PROVIDER";

  const bodyText = "Online payment ke liye option select karein:";

  await sendWhatsApp(to, {
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: bodyText },
      action: {
        buttons: [
          { type: "reply", reply: { id: "prov_jazzcash", title: "📱 JazzCash" } },
          { type: "reply", reply: { id: "prov_easypaisa", title: "📱 Easypaisa" } },
          { type: "reply", reply: { id: "prov_bank", title: "🏦 Bank Transfer" } },
        ],
      },
    },
  });
}

// =============================================================================
//  FLOW 9: DISPLAY ACCOUNT DETAILS & AWAIT SCREENSHOT
// =============================================================================
async function sendAccountDetailsAndAwaitScreenshot(to, providerId, session) {
  let settings;
  try {
    const res = await getRestaurantSettings();
    settings = res.settings;
  } catch {}

  const paymentAccounts = settings?.paymentAccounts || {};
  let providerName = "JazzCash";
  let accountTitle = "A-One Foods / Owner";
  let accountNumber = "0300-1234567";

  if (providerId === "prov_easypaisa" || providerId?.toLowerCase().includes("easypaisa")) {
    providerName = "Easypaisa";
    accountTitle = paymentAccounts.easypaisa?.accountTitle || "A-One Foods";
    accountNumber = paymentAccounts.easypaisa?.accountNumber || "0321-9876543";
  } else if (providerId === "prov_bank" || providerId?.toLowerCase().includes("bank")) {
    providerName = "Bank Transfer (Meezan Bank)";
    accountTitle = paymentAccounts.bank?.accountTitle || "A-ONE Foods PVT LTD";
    accountNumber = paymentAccounts.bank?.iban || paymentAccounts.bank?.accountNumber || "PK00MEZN0000123456789012";
  } else {
    providerName = "JazzCash";
    accountTitle = paymentAccounts.jazzcash?.accountTitle || "A-One Foods";
    accountNumber = paymentAccounts.jazzcash?.accountNumber || "0300-1234567";
  }

  session.step = "AWAITING_PAYMENT_SCREENSHOT";
  session.selectedProvider = providerName;

  const msgText =
    `A-One Foods Official Payment Details:\n` +
    `Method: *${providerName}*\n` +
    `Account Title: *${accountTitle}*\n` +
    `Account Number: *${accountNumber}*\n` +
    `Amount: *Rs. ${session.grandTotal || 650}*\n\n` +
    `⚠️ Payment transfer karne ke baad yahan screenshot/slip upload karein.`;

  await sendWhatsApp(to, {
    type: "text",
    text: { body: msgText },
  });
}

// =============================================================================
//  META WEBHOOK VERIFICATION
// =============================================================================
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const creds = await getWhatsAppCredentials();
  const validToken = creds.verifyToken || process.env.VERIFY_TOKEN;

  if (mode === "subscribe" && token === validToken) {
    return new Response(challenge, { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

// =============================================================================
//  INCOMING MESSAGES DISPATCHER (POST)
// =============================================================================
export async function POST(request) {
  try {
    const body = await request.json();
    const entry = body?.entry?.[0]?.changes?.[0]?.value;
    const message = entry?.messages?.[0];

    console.log(">>> [LIVE WEBHOOK ACTIVE] Message received at:", new Date().toISOString(), message);

    if (!message) return NextResponse.json({ status: "ignored" });
    const from = message.from;
    const session = getSession(from);

    // =========================================================================
    //  1. INBOUND IMAGE MESSAGE (Screenshot Vision Analysis)
    // =========================================================================
    if (message.type === "image") {
      const mediaId = message.image?.id;
      if (!mediaId) {
        await sendWhatsApp(from, {
          type: "text",
          text: { body: "Maazrat, image load nahi ho saki. Baraye meharbani screenshot dobara upload karein." },
        });
        return NextResponse.json({ status: "success" });
      }

      // Download from WhatsApp API
      const downloaded = await downloadWhatsAppMedia(mediaId);

      // Vision AI extraction
      let extractedDetails = {
        transferredAmount: session.grandTotal || null,
        transactionId: `TID-${Date.now().toString().slice(-8)}`,
        status: "SUCCESS",
        receiverName: "A-One Foods",
        receiverNumber: null,
      };

      if (downloaded.ok && downloaded.buffer) {
        try {
          extractedDetails = await analyzePaymentSlip(
            downloaded.buffer,
            downloaded.mimeType || "image/jpeg",
            session.grandTotal || undefined
          );
        } catch (visionErr) {
          console.error("[webhook] Vision slip extraction error:", visionErr);
        }
      }

      // Create Order with PENDING_VERIFICATION
      await createDatabaseOrder({
        phone: from,
        session,
        paymentMethod: session.selectedProvider || "Online Transfer",
        paymentStatus: "PENDING_VERIFICATION",
        paymentReference: extractedDetails.transactionId || mediaId,
        paymentScreenshot: downloaded.localPath || downloaded.dataUri,
        paymentNotes: JSON.stringify({
          ...extractedDetails,
          imageMediaId: mediaId,
          status: "NEEDS_OWNER_VERIFICATION",
        }),
      });

      // Acknowledge Customer
      const ackMsg =
        "Aapki payment slip receive ho chuki hai. Owner verification ke baad aapka order confirm ho jayega. Baraye meharbani thori dair intezar farmaiye.";

      await sendWhatsApp(from, {
        type: "text",
        text: { body: ackMsg },
      });

      resetUserSession(from);
      return NextResponse.json({ status: "success" });
    }

    // =========================================================================
    //  2. INBOUND TEXT MESSAGES
    // =========================================================================
    if (message.type === "text") {
      const text = message.text.body.trim();
      const lower = text.toLowerCase();

      // Step: Awaiting Quantity via User Typing
      if (session.step === "AWAITING_QUANTITY") {
        const parsedDigits = parseInt(text.replace(/\D/g, ""), 10);
        const parsedQty = !isNaN(parsedDigits) && parsedDigits > 0 ? parsedDigits : 1;
        const unitPrice = Number(session.unitPrice) > 0 ? Number(session.unitPrice) : (Number(session.selectedItemDetails?.price) || 500);
        const qty = parsedQty;
        const subtotal = unitPrice * qty;
        const deliveryCharges = 150;
        const finalTotal = subtotal + deliveryCharges;

        session.unitPrice = unitPrice;
        session.quantity = qty;
        session.subtotal = subtotal;
        session.deliveryFee = deliveryCharges;
        session.grandTotal = finalTotal;
        session.step = "AWAITING_ADDRESS";

        await sendWhatsApp(from, {
          type: "text",
          text: {
            body: `Quantity: *${qty}* note ho gayi hai (Subtotal: Rs. ${subtotal}).\n\nAb baraye meherbani apna **Delivery Address** bhej dein:`,
          },
        });
        return NextResponse.json({ status: "success" });
      }

      // Step: Awaiting Address -> Go to Payment Selection
      if (session.step === "AWAITING_ADDRESS") {
        session.address = text;
        const unitPrice = Number(session.unitPrice) > 0 ? Number(session.unitPrice) : (Number(session.selectedItemDetails?.price) || 500);
        const qty = Number(session.quantity) > 0 ? Number(session.quantity) : 1;
        const subtotal = unitPrice * qty;
        const deliveryCharges = 150;
        const finalTotal = subtotal + deliveryCharges;

        session.unitPrice = unitPrice;
        session.quantity = qty;
        session.subtotal = subtotal;
        session.deliveryFee = deliveryCharges;
        session.grandTotal = finalTotal;

        await sendPaymentMethodSelection(from, session);
        return NextResponse.json({ status: "success" });
      }

      // Step: Awaiting Payment Method via Text
      if (session.step === "AWAITING_PAYMENT_METHOD") {
        if (lower.includes("cod") || lower.includes("cash")) {
          await createDatabaseOrder({
            phone: from,
            session,
            paymentMethod: "COD",
            paymentStatus: "CASH_ON_DELIVERY",
          });

          const codSummary =
            `✅ *Order Confirmed (Cash on Delivery)!*\n\n` +
            `🍽️ Item: *${session.selectedItem || "Selected Item"}* (x${session.quantity || 1})\n` +
            `💰 Bill: *Rs. ${session.grandTotal}* (Includes Rs. 150 Delivery)\n` +
            `📍 Address: *${session.address}*\n` +
            `💵 Payment: *Cash on Delivery*\n\n` +
            `A-One Kitchen aapka order prepare kar rahi hai. Shukriya! 🛵`;

          await sendWhatsApp(from, { type: "text", text: { body: codSummary } });
          await sendMainActionButtons(from, session.language);
          resetUserSession(from);
          return NextResponse.json({ status: "success" });
        }

        if (lower.includes("online") || lower.includes("bank") || lower.includes("jazz") || lower.includes("easy")) {
          await sendOnlineProviderSelection(from, session);
          return NextResponse.json({ status: "success" });
        }
      }

      // Step: Awaiting Online Provider via Text
      if (session.step === "AWAITING_ONLINE_PROVIDER") {
        if (lower.includes("jazz")) {
          await sendAccountDetailsAndAwaitScreenshot(from, "prov_jazzcash", session);
          return NextResponse.json({ status: "success" });
        }
        if (lower.includes("easy")) {
          await sendAccountDetailsAndAwaitScreenshot(from, "prov_easypaisa", session);
          return NextResponse.json({ status: "success" });
        }
        if (lower.includes("bank") || lower.includes("meezan")) {
          await sendAccountDetailsAndAwaitScreenshot(from, "prov_bank", session);
          return NextResponse.json({ status: "success" });
        }
      }

      // Greeting Triggers -> Directly Send Main Action Buttons with (NEW) Test Buttons!
      if (
        lower === "hi" ||
        lower === "hello" ||
        lower === "hey" ||
        lower === "start" ||
        lower.includes("salam") ||
        lower.includes("سلام")
      ) {
        resetUserSession(from);
        await sendMainActionButtons(from, session.language);
        return NextResponse.json({ status: "success" });
      }

      if (lower === "language" || lower === "zaban") {
        resetUserSession(from);
        await sendLanguageSelection(from);
        return NextResponse.json({ status: "success" });
      }

      // Deals Trigger -> Flow 3
      if (
        lower === "deals" ||
        lower === "deal" ||
        lower === "all deals" ||
        lower === "offers" ||
        lower === "special deals"
      ) {
        resetUserSession(from);
        await sendDealsHubList(from, session.language);
        return NextResponse.json({ status: "success" });
      }

      // Menu Trigger -> Flow 4
      if (
        lower === "menu" ||
        lower === "m" ||
        lower === "food" ||
        lower === "khana" ||
        lower === "view menu" ||
        lower === "food menu"
      ) {
        resetUserSession(from);
        await sendFoodMenuList(from, session.language);
        return NextResponse.json({ status: "success" });
      }

      // Price Bargaining Defense
      if (
        lower.includes("kam") ||
        lower.includes("discount") ||
        lower.includes("riayat") ||
        lower.includes("mehanga") ||
        lower.includes("sasta")
      ) {
        await sendWhatsApp(from, {
          type: "text",
          text: {
            body: "Janab hamari quality aur fresh ingredients par koi compromise nahi hota, is liye rates bilkul fixed aur munasib hain. ⭐",
          },
        });
        await sendMainActionButtons(from, session.language);
        return NextResponse.json({ status: "success" });
      }

      // Fallback AI
      try {
        const langName =
          session.language === "URDU"
            ? "Urdu"
            : session.language === "ENGLISH"
            ? "English"
            : "Roman Urdu";

        const strictInstruction = `You are the customer assistant for A-One Foods. You must respond in STRICTLY ${langName} (Roman Urdu by default). Maximum 1 short sentence. NEVER invent prices. Tell the user to click 'View Menu (NEW)' or 'All Deals (NEW)' below to order.`;

        const aiResult = await generateMultiProviderReply(text, strictInstruction);
        const reply = aiResult.text || "A-One Foods mein aapka khushamdeed! Menu ya deals dekhne ke liye neeche button par tap karein.";

        await sendWhatsApp(from, { type: "text", text: { body: reply } });
        await sendMainActionButtons(from, session.language);
      } catch (e) {
        await sendMainActionButtons(from, session.language);
      }
      return NextResponse.json({ status: "success" });
    }

    // =========================================================================
    //  3. INBOUND INTERACTIVE BUTTONS & LIST REPLIES
    // =========================================================================
    if (message.type === "interactive") {
      const actionId = message.interactive.button_reply?.id || message.interactive.list_reply?.id;
      const title = message.interactive.button_reply?.title || message.interactive.list_reply?.title;

      // 3a. Language Selection
      if (
        actionId === "set_lang_roman" ||
        actionId === "set_lang_urdu" ||
        actionId === "set_lang_en" ||
        actionId === "lang_roman" ||
        actionId === "lang_urdu" ||
        actionId === "lang_en"
      ) {
        session.language =
          actionId.includes("urdu") ? "URDU" : actionId.includes("en") ? "ENGLISH" : "ROMAN_URDU";
        await sendMainActionButtons(from, session.language);
        return NextResponse.json({ status: "success" });
      }

      // 3b. [📜 View Menu] Tapped -> Send Regular Food Categories
      if (actionId === "btn_open_food_menu" || actionId === "btn_show_menu") {
        resetUserSession(from);
        await sendFoodMenuList(from, session.language);
        return NextResponse.json({ status: "success" });
      }

      // 3c. [🔥 All Deals] Tapped -> Send Deals Hub Categories
      if (actionId === "btn_open_deals_hub" || actionId === "btn_show_deals") {
        resetUserSession(from);
        await sendDealsHubList(from, session.language);
        return NextResponse.json({ status: "success" });
      }

      // 3d. [👨‍🍳 Staff Support] Tapped
      if (actionId === "btn_open_staff" || actionId === "btn_staff_help") {
        let fallbackMsg =
          "Aapki request staff ko forward kar di gayi hai. Hamara representative jald hi aapse raabta karega.";
        try {
          const { settings } = await getRestaurantSettings();
          if (settings?.whatsappConfig?.fallbackMessage) {
            fallbackMsg = settings.whatsappConfig.fallbackMessage;
          }
        } catch {}

        await sendWhatsApp(from, {
          type: "text",
          text: { body: fallbackMsg },
        });
        return NextResponse.json({ status: "success" });
      }

      // 3e. Deal Category Tapped -> Send Deals dropdown items
      if (actionId && actionId.startsWith("deals_cat_")) {
        await sendCategoryDropdownItems(from, actionId, session.language);
        return NextResponse.json({ status: "success" });
      }

      // 3f. Food Category Tapped -> Send Food dropdown items
      if (actionId && actionId.startsWith("food_cat_")) {
        await sendCategoryDropdownItems(from, actionId, session.language);
        return NextResponse.json({ status: "success" });
      }

      // 3g. Quantity Buttons Tapped ([1], [2], [Custom Type])
      if (actionId === "qty_1") {
        const unitPrice = Number(session.unitPrice) > 0 ? Number(session.unitPrice) : (Number(session.selectedItemDetails?.price) || 500);
        const qty = 1;
        const subtotal = unitPrice * qty;
        const deliveryCharges = 150;
        const finalTotal = subtotal + deliveryCharges;

        session.unitPrice = unitPrice;
        session.quantity = qty;
        session.subtotal = subtotal;
        session.deliveryFee = deliveryCharges;
        session.grandTotal = finalTotal;
        session.step = "AWAITING_ADDRESS";

        await sendWhatsApp(from, {
          type: "text",
          text: {
            body: `Quantity: *1* select ho gayi hai (Subtotal: Rs. ${subtotal}).\n\nAb baraye meherbani apna **Delivery Address** bhej dein:`,
          },
        });
        return NextResponse.json({ status: "success" });
      }

      if (actionId === "qty_2") {
        const unitPrice = Number(session.unitPrice) > 0 ? Number(session.unitPrice) : (Number(session.selectedItemDetails?.price) || 500);
        const qty = 2;
        const subtotal = unitPrice * qty;
        const deliveryCharges = 150;
        const finalTotal = subtotal + deliveryCharges;

        session.unitPrice = unitPrice;
        session.quantity = qty;
        session.subtotal = subtotal;
        session.deliveryFee = deliveryCharges;
        session.grandTotal = finalTotal;
        session.step = "AWAITING_ADDRESS";

        await sendWhatsApp(from, {
          type: "text",
          text: {
            body: `Quantity: *2* select ho gayi hai (Subtotal: Rs. ${subtotal}).\n\nAb baraye meherbani apna **Delivery Address** bhej dein:`,
          },
        });
        return NextResponse.json({ status: "success" });
      }

      if (actionId === "qty_custom") {
        session.step = "AWAITING_QUANTITY";
        await sendWhatsApp(from, {
          type: "text",
          text: {
            body: `Baraye meharbani matlooba quantity number type karein (e.g. 3, 4, 5...):`,
          },
        });
        return NextResponse.json({ status: "success" });
      }

      // 3h. Food or Deal Item Selected -> Open Hybrid Quantity Selection
      const selectedItemObj = findItemInCatalogs(actionId);
      if (selectedItemObj) {
        await sendHybridQuantitySelection(from, selectedItemObj, session, session.language);
        return NextResponse.json({ status: "success" });
      }

      // 3i. Cash on Delivery (COD) Button
      if (actionId === "pay_cod") {
        session.paymentMethod = "COD";
        session.paymentStatus = "PENDING_DELIVERY";

        await createDatabaseOrder({
          phone: from,
          session,
          paymentMethod: "COD",
          paymentStatus: "CASH_ON_DELIVERY",
        });

        const codSummary =
          `✅ *Order Confirmed (Cash on Delivery)!*\n\n` +
          `🍽️ Item: *${session.selectedItem || "Selected Item"}* (x${session.quantity || 1})\n` +
          `💰 Bill: *Rs. ${session.grandTotal}* (Includes Rs. 150 Delivery)\n` +
          `📍 Address: *${session.address}*\n` +
          `💵 Payment: *Cash on Delivery*\n\n` +
          `A-One Kitchen aapka order prepare kar rahi hai. Shukriya! 🛵`;

        await sendWhatsApp(from, { type: "text", text: { body: codSummary } });
        await sendMainActionButtons(from, session.language);
        resetUserSession(from);
        return NextResponse.json({ status: "success" });
      }

      // 3j. Online Payment Button
      if (actionId === "pay_online") {
        await sendOnlineProviderSelection(from, session);
        return NextResponse.json({ status: "success" });
      }

      // 3k. Online Provider Selected
      if (
        actionId === "prov_jazzcash" ||
        actionId === "prov_easypaisa" ||
        actionId === "prov_bank"
      ) {
        await sendAccountDetailsAndAwaitScreenshot(from, actionId, session);
        return NextResponse.json({ status: "success" });
      }
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Webhook POST Error:", error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
