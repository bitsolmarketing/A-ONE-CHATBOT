export interface MenuItemRow {
  id: string;
  title: string;
  description: string;
  price?: number;
}

export interface MenuCategoryData {
  title: string;
  rows: MenuItemRow[];
}

/**
 * Deal Categories for the [🔥 All Deals] Button.
 * 100% dynamic mapping derived from the canonical restaurant menu.
 */
export const DEALS_CATEGORIES_LIST: MenuItemRow[] = [
  {
    id: "cat_summer_deals",
    title: "☀️ Summer Deals (1-10)",
    description: "Combos with pasta, zingers, brownies & drinks (Rs. 690 - 3050)",
  },
  {
    id: "cat_special_deals_1",
    title: "🔥 Special Deals (1-9)",
    description: "Budget pizza, burger & wings deals with drinks (Rs. 480 - 2650)",
  },
  {
    id: "cat_special_deals_2",
    title: "🔥 Special Deals (10-17)",
    description: "Large pizzas, spin rolls, grill burgers (Rs. 860 - 1950)",
  },
  {
    id: "cat_family_deals",
    title: "👨‍👩‍👧‍👦 Family Deals",
    description: "Mega family pizza, broast & fries combos (Rs. 2100 - 3350)",
  },
  {
    id: "cat_rice_deals",
    title: "🍚 Rice Deals & Items",
    description: "Biryani, pulao combos with sweets & drinks (Rs. 500 - 1070)",
  },
];

/**
 * Regular Food Categories for the [📜 View Menu] Button.
 */
export const FOOD_CATEGORIES_LIST: MenuItemRow[] = [
  {
    id: "cat_pizza_regular",
    title: "🍕 Regular Pizzas",
    description: "Tikka / Fajita / Supreme / Euro (Small, Med, Large, XL)",
  },
  {
    id: "cat_pizza_special",
    title: "🍕 Special & Crust Pizzas",
    description: "Malai Boti, Peri Peri, Behari Kabab & Stuffed Crusts",
  },
  {
    id: "cat_broast_burgers",
    title: "🍔 Broast & Burgers",
    description: "Crispy Broast, Zingers, Grill, Steaker & Pizza Burgers",
  },
  {
    id: "cat_shawarma_paratha",
    title: "🌯 Shawarma & Rolls",
    description: "Chicken Shawarma, Platters, Spin Rolls & Paratha Rolls",
  },
  {
    id: "cat_pasta_sandwiches_fries",
    title: "🍝 Pasta, Sandwiches & Fries",
    description: "Special Baked Pastas, Club Sandwiches & Loaded Fries",
  },
  {
    id: "cat_snacks_desserts",
    title: "🍗 Snacks & Desserts",
    description: "Hot Wings, Nuggets, Chaat, Custard & Special Kheer",
  },
  {
    id: "cat_shakes_beverages",
    title: "🥤 Shakes & Beverages",
    description: "Dry Fruit Shakes, Milk Shakes, Juices & Ice Cream",
  },
];

/**
 * Complete Category Mapping with exact items, prices, included items, and drink info.
 */
export const MENU_DATA: Record<string, MenuCategoryData> = {
  // ☀️ Summer Deals (1-10)
  cat_summer_deals: {
    title: "☀️ Summer Deals (1-10)",
    rows: [
      { id: "sum_1", title: "Summer Deal 1 - Rs. 1100", description: "2 Small Pasta, 1 Brownie, 500ml Drink", price: 1100 },
      { id: "sum_2", title: "Summer Deal 2 - Rs. 1900", description: "4 Zinger Burgers, 2 Brownies, 1.5 Ltr Drink", price: 1900 },
      { id: "sum_3", title: "Summer Deal 3 - Rs. 770", description: "1 Small Pasta, 1 Small Fries, 500ml Drink", price: 770 },
      { id: "sum_4", title: "Summer Deal 4 - Rs. 690", description: "2 Chicken Burgers, 1 Small Fries, 350ml Drink", price: 690 },
      { id: "sum_5", title: "Summer Deal 5 - Rs. 1200", description: "1 Large Pasta, 1 Custard, 500ml Drink", price: 1200 },
      { id: "sum_6", title: "Summer Deal 6 - Rs. 1450", description: "2 Zinger Burgers, 1 Large Pasta, 1.5 Ltr Drink", price: 1450 },
      { id: "sum_7", title: "Summer Deal 7 - Rs. 3050", description: "2 Large Pizzas, 1 Large Pasta, 1.5 Ltr Drink", price: 3050 },
      { id: "sum_8", title: "Summer Deal 8 - Rs. 1070", description: "2 Small Pasta, 500ml Drink", price: 1070 },
      { id: "sum_9", title: "Summer Deal 9 - Rs. 1950", description: "1 Large Pizza, 4 Pcs Spin Roll, 1 Ltr Drink", price: 1950 },
      { id: "sum_10", title: "Summer Deal 10 - Rs. 890", description: "2 Zinger Parathas, 1 Small Fries, 500ml Drink", price: 890 },
    ],
  },

  // 🔥 Special Deals (1-9)
  cat_special_deals_1: {
    title: "🔥 Special Deals (1-9)",
    rows: [
      { id: "deal_1", title: "Deal 1 - Rs. 580", description: "1 Small Pizza, 350ml Drink", price: 580 },
      { id: "deal_2", title: "Deal 2 - Rs. 500", description: "1 Patty Burger, 1 Small Fries, 350ml Drink", price: 500 },
      { id: "deal_3", title: "Deal 3 - Rs. 810", description: "2 Zinger Burgers, 2 Drinks 350ml", price: 810 },
      { id: "deal_4", title: "Deal 4 - Rs. 1150", description: "2 Zinger Burgers, 2 Reg Fries, 2 Drinks 350ml", price: 1150 },
      { id: "deal_5", title: "Deal 5 - Rs. 750", description: "1 Zinger Burger, 1 Patty Burger, 1 Fries, 2 Drinks 350ml", price: 750 },
      { id: "deal_6", title: "Deal 6 - Rs. 1700", description: "1 Large Pizza, 1 Medium Pizza, 1.5 Ltr Drink", price: 1700 },
      { id: "deal_7", title: "Deal 7 - Rs. 2650", description: "2 Large Pizzas, 1.5 Ltr Drink", price: 2650 },
      { id: "deal_8", title: "Deal 8 - Rs. 480", description: "1 Small Pizza, 1 Zinger Burger, 1 Drink 350ml", price: 480 },
      { id: "deal_9", title: "Deal 9 - Rs. 1300", description: "1 Medium Pizza, 5 Pcs Hot Wings, 1 Drink 500ml", price: 1300 },
    ],
  },

  // 🔥 Special Deals (10-17)
  cat_special_deals_2: {
    title: "🔥 Special Deals (10-17)",
    rows: [
      { id: "deal_10", title: "Deal 10 - Rs. 1700", description: "1 Large Pizza, 1 Large Fries, 1.5 Ltr Drink", price: 1700 },
      { id: "deal_11", title: "Deal 11 - Rs. 1250", description: "1 Medium Pizza, 5 Hot Wings, 1 Drink 500ml", price: 1250 },
      { id: "deal_12", title: "Deal 12 - Rs. 1800", description: "1 Zinger Burger, 1 Large Fries, 1 Drink 350ml", price: 1800 },
      { id: "deal_13", title: "Deal 13 - Rs. 1950", description: "1 Large Pizza, 4 Spin Roll, 1.5 Ltr Drink", price: 1950 },
      { id: "deal_14", title: "Deal 14 - Rs. 1150", description: "2 Grill Burger, 1 Fries, 2 Drinks 350ml", price: 1150 },
      { id: "deal_15", title: "Deal 15 - Rs. 1700", description: "1 Large Pizza, 1 Large Fries, 1.5 Ltr Drink", price: 1700 },
      { id: "deal_16", title: "Deal 16 - Rs. 860", description: "1 Small Pizza, 1 Zinger Burger, 1 Drink 350ml", price: 860 },
      { id: "deal_17", title: "Deal 17 - Rs. 1650", description: "2 Small Pizzas, 1 Zinger Wrap, 1 Drink 350ml", price: 1650 },
    ],
  },

  // 👨‍👩‍👧‍👦 Family Deals
  cat_family_deals: {
    title: "👨‍👩‍👧‍👦 Family Deals",
    rows: [
      { id: "fam_1", title: "Family Deal 1 - Rs. 3180", description: "2 Large Pizza, 1 Large Fries, 1 Broast, 1.5L Drink", price: 3180 },
      { id: "fam_2", title: "Family Deal 2 - Rs. 3000", description: "2 Large Pizza, 1.5 Ltr Drink", price: 3000 },
      { id: "fam_3", title: "Family Deal 3 - Rs. 2100", description: "2 Broast, 1 Fries, 1.5 Ltr Drink", price: 2100 },
      { id: "fam_4", title: "Family Deal 4 - Rs. 3350", description: "2 Large Pizza, 1 Large Fries, 1.5 Ltr Drink", price: 3350 },
    ],
  },

  // 🍚 Rice Deals & Items
  cat_rice_deals: {
    title: "🍚 Rice Deals & Items",
    rows: [
      { id: "rd_1", title: "Rice Deal 1 - Rs. 1050", description: "2 Biryani/Pulao, 1 Kheer, 1 Drink 500ml", price: 1050 },
      { id: "rd_2", title: "Rice Deal 2 - Rs. 990", description: "2 Biryani/Pulao, 1 Half Zarda, 1 Drink 500ml", price: 990 },
      { id: "rd_3", title: "Rice Deal 3 - Rs. 630", description: "1 Biryani/Pulao, 1 Brownie, 1 Drink 350ml", price: 630 },
      { id: "rd_4", title: "Rice Deal 4 - Rs. 1070", description: "1 Biryani/Pulao, 1 Sm Russian Salad, 1 Drink 350ml", price: 1070 },
      { id: "rd_5", title: "Rice Deal 5 - Rs. 580", description: "1 Biryani/Pulao, 1 Half Zarda, 1 Drink 350ml", price: 580 },
      { id: "rd_6", title: "Rice Deal 6 - Rs. 500", description: "1 Biryani/Pulao, 1 Pastry, 1 Drink 350ml", price: 500 },
      { id: "tr_cb", title: "Chicken Biryani - Rs. 380", description: "Fresh spiced chicken biryani (Simple: Rs. 230)", price: 380 },
      { id: "tr_cp", title: "Chicken Pulao - Rs. 380", description: "Traditional spiced chicken pulao", price: 380 },
      { id: "tr_sb", title: "Special Biryani - Rs. 440", description: "Double chicken loaded special biryani", price: 440 },
      { id: "tr_bp", title: "Beef Pulao - Rs. 430", description: "Slow cooked tender beef pulao", price: 430 },
    ],
  },

  // 🍕 Regular Pizzas
  cat_pizza_regular: {
    title: "🍕 Regular Pizzas",
    rows: [
      { id: "pz_reg_s", title: "Regular Pizza (Small)", description: "Rs. 440 | Tikka / Fajita / Supreme / Euro", price: 440 },
      { id: "pz_reg_m", title: "Regular Pizza (Medium)", description: "Rs. 900 | Tikka / Fajita / Supreme / Euro", price: 900 },
      { id: "pz_reg_l", title: "Regular Pizza (Large)", description: "Rs. 1300 | Tikka / Fajita / Supreme / Euro", price: 1300 },
      { id: "pz_reg_xl", title: "Regular Pizza (XL)", description: "Rs. 1900 | Tikka / Fajita / Supreme / Euro", price: 1900 },
    ],
  },

  // 🍕 Special & Crust Pizzas
  cat_pizza_special: {
    title: "🍕 Special & Crust Pizzas",
    rows: [
      { id: "pz_sp_s", title: "Special A-One (Small)", description: "Rs. 480 | Malai Boti, Peri Peri, BBQ, Achari", price: 480 },
      { id: "pz_sp_m", title: "Special A-One (Medium)", description: "Rs. 1000 | Malai Boti, Peri Peri, BBQ, Achari", price: 1000 },
      { id: "pz_sp_l", title: "Special A-One (Large)", description: "Rs. 1450 | Malai Boti, Peri Peri, BBQ, Achari", price: 1450 },
      { id: "pz_sp_xl", title: "Special A-One (XL)", description: "Rs. 2100 | Malai Boti, Peri Peri, BBQ, Achari", price: 2100 },
      { id: "pz_bh_s", title: "Behari Kabab Pizza (S)", description: "Rs. 500 | Grilled spiced chicken", price: 500 },
      { id: "pz_bh_m", title: "Behari Kabab Pizza (M)", description: "Rs. 1050 | Grilled spiced chicken", price: 1050 },
      { id: "pz_bh_l", title: "Behari Kabab Pizza (L)", description: "Rs. 1500 | Grilled spiced chicken", price: 1500 },
      { id: "pz_cr_l", title: "Special Crust (Large)", description: "Rs. 1200 | Square/Extreme/Kabab/Cheese", price: 1200 },
      { id: "pz_cr_xl", title: "Special Crust (XL)", description: "Rs. 1750 | Square/Extreme/Kabab/Cheese", price: 1750 },
    ],
  },

  // 🍔 Broast & Burgers
  cat_broast_burgers: {
    title: "🍔 Broast & Burgers",
    rows: [
      { id: "br_f", title: "Chicken Broast (Full)", description: "Rs. 2000 | Half: Rs. 1200 | Quarter: Rs. 700", price: 2000 },
      { id: "bg_z", title: "Zinger Burger", description: "Rs. 370 | Crispy fried chicken fillet", price: 370 },
      { id: "bg_mz", title: "Mighty Zinger", description: "Rs. 430 | Double crispy zinger patty with cheese", price: 430 },
      { id: "bg_gr", title: "Grill Burger", description: "Rs. 450 | Grilled juicy chicken patty", price: 450 },
      { id: "bg_pz", title: "Pizza Burger", description: "Rs. 480 | Pizza stuffed cheese & crispy chicken", price: 480 },
      { id: "bg_mb", title: "Malai Boti Burger", description: "Rs. 500 | Creamy malai boti chicken", price: 500 },
      { id: "bg_stk", title: "Steaker Burger", description: "Rs. 530 | Chef special steak burger", price: 530 },
      { id: "bg_twr", title: "Tower Burger", description: "Rs. 530 | Double patty tower loaded burger", price: 530 },
      { id: "bg_pt", title: "Patty Burger", description: "Rs. 290 | Student: Rs. 250 | Chicken: Rs. 220", price: 290 },
      { id: "wp_z", title: "Zinger Wrap", description: "Rs. 420 | Tikka / Fajita Wrap: Rs. 420", price: 420 },
    ],
  },

  // 🌯 Shawarma & Rolls
  cat_shawarma_paratha: {
    title: "🌯 Shawarma & Rolls",
    rows: [
      { id: "sh_ck", title: "Chicken Shawarma", description: "Rs. 200 | Fresh pita rolled shawarma", price: 200 },
      { id: "sh_zg", title: "Zinger Shawarma", description: "Rs. 280 | Crispy fried zinger roll", price: 280 },
      { id: "sh_mb", title: "Malai Shawarma", description: "Rs. 300 | Arabic Shawarma: Rs. 320", price: 300 },
      { id: "pl_sp", title: "Special Platter", description: "Rs. 1070 | 4 Spin Rolls, 5 Wings, Fries, Drink", price: 1070 },
      { id: "pl_ck", title: "Shawarma Platter", description: "Rs. 420 | Arabic Platter: Rs. 550", price: 420 },
      { id: "pr_kb", title: "Kabab Paratha", description: "Rs. 320 | Grilled kabab in crispy paratha", price: 320 },
      { id: "pr_mb", title: "Malai Boti Paratha", description: "Rs. 360 | Creamy chicken malai boti", price: 360 },
      { id: "pr_cp", title: "Chicken Paratha", description: "Rs. 280 | Hot crispy flaky chicken paratha", price: 280 },
      { id: "sr_mb", title: "Spin Roll 4pcs", description: "Rs. 700 | Malai Boti / Special: Rs. 600", price: 700 },
    ],
  },

  // 🍝 Pasta, Sandwiches & Fries
  cat_pasta_sandwiches_fries: {
    title: "🍝 Pasta, Sandwiches & Fries",
    rows: [
      { id: "pa_sp", title: "Special Pasta (Small)", description: "Small: Rs. 430 | Large: Rs. 720", price: 430 },
      { id: "pa_cr", title: "Crunchy Pasta (Small)", description: "Small: Rs. 480 | Large: Rs. 800", price: 480 },
      { id: "pa_cm", title: "Creamy Pasta (Small)", description: "Small: Rs. 430 | Large: Rs. 700", price: 430 },
      { id: "sw_sp", title: "Special Sandwich", description: "Rs. 700 | Grilled / Smoked / BBQ: Rs. 650", price: 700 },
      { id: "sw_pz", title: "Pizza Sandwich", description: "Rs. 800 | Special Pizza Sandwich with Fries", price: 800 },
      { id: "fr_sm", title: "Simple Fries (Small)", description: "Small: Rs. 180 | Large: Rs. 380", price: 180 },
      { id: "fr_ld", title: "Loaded Fries", description: "Rs. 620 | Melted cheese & chicken loaded", price: 620 },
      { id: "fr_pz", title: "Pizza Fries", description: "Rs. 600 | Topped with melted cheese & toppings", price: 600 },
    ],
  },

  // 🍗 Snacks & Desserts
  cat_snacks_desserts: {
    title: "🍗 Snacks & Desserts",
    rows: [
      { id: "sn_hw", title: "Hot Wings (10pcs)", description: "Rs. 620 | Oven Baked Wings: Rs. 620", price: 620 },
      { id: "sn_hs", title: "Hot Shots (12pcs)", description: "Rs. 600 | Nuggets (10pcs): Rs. 560", price: 600 },
      { id: "sn_gp", title: "Golden Piece (2pcs)", description: "Rs. 580 | Drum Stick: Rs. 150", price: 580 },
      { id: "ds_db", title: "Dahi Bhaly", description: "Rs. 190 | Chana Chaat: Rs. 200", price: 190 },
      { id: "ds_fc", title: "Special Fruit Chaat", description: "Rs. 300 | Cream Chaat: Rs. 300", price: 300 },
      { id: "ds_cu", title: "Fruit Custard (S)", description: "Small: Rs. 250 | Medium: Rs. 450", price: 250 },
      { id: "ds_kh", title: "Special Kheer", description: "Rs. 230 | Ras Malai: Rs. 240 | Brownie: Rs. 200", price: 230 },
    ],
  },

  // 🥤 Shakes & Beverages
  cat_shakes_beverages: {
    title: "🥤 Shakes & Beverages",
    rows: [
      { id: "bv_df", title: "Dry Fruit Shake", description: "Rs. 700 | Kaju / Mix Dry Fruit", price: 700 },
      { id: "bv_ym", title: "Yum's Oreo Shake", description: "Rs. 400 | Nutella / KitKat: Rs. 400", price: 400 },
      { id: "bv_ms", title: "Fresh Milk Shake", description: "Rs. 280 | Mango / Strawberry / Chico", price: 280 },
      { id: "bv_fj", title: "Fresh Juice / Margarita", description: "Rs. 250 | Mint Margarita: Rs. 150", price: 250 },
      { id: "bv_ic", title: "Ice Cream Cup", description: "Small: Rs. 160 | Medium: Rs. 220", price: 160 },
    ],
  },
};

/**
 * Helper to find item across all categories.
 */
export function findItemById(itemId: string): MenuItemRow | null {
  if (!itemId) return null;
  const clean = itemId.replace(/^item_/, "");
  for (const cat of Object.values(MENU_DATA)) {
    const found = cat.rows.find(
      (r) =>
        r.id === itemId ||
        r.id === clean ||
        r.id === `item_${clean}` ||
        `item_${r.id}` === itemId
    );
    if (found) return found;
  }
  return null;
}
