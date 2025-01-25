const productCategory = [
  {
    id: 1,
    label: "Cooking Essential",
    value: "cooking essential",
    subcategories: [
      { id: 101, label: "Atta, Flour & Sooji", value: "atta, flour, sooji" },
      { id: 102, label: "Dals & Pulses", value: "dals, pulses" },
      { id: 103, label: "Rice", value: "rice" },
      { id: 104, label: "Sabudana, Poha & Murmura", value: "sabudana, poha, murmura" },
      { id: 105, label: "Edible Oil", value: "edible oil" },
      { id: 106, label: "Masala, Spices & Mukhwas", value: "masala, spices, mukhwas" },
      { id: 107, label: "Salt, Sugar & Jaggery", value: "salt, sugar, jaggery" },
      { id: 108, label: "Wheat & Soya", value: "wheat, soya" },
      { id: 109, label: "Ghee", value: "ghee" },
      { id: 110, label: "Dry Fruits & Nuts", value: "dry fruits, nuts" },
      { id: 111, label: "Millets & Organic Rice", value: "millets, organic rice" },
      { id: 112, label: "Combo Offers", value: "combo offers" },
    ],
  },
  {
    id: 2,
    label: "Personal Care",
    value: "personal care",
    subcategories: [
      { id: 201, label: "Hair Care", value: "hair care" },
      { id: 202, label: "Bath & Hand Wash", value: "bath, hand wash" },
      { id: 203, label: "Oral Care", value: "oral care" },
      { id: 204, label: "Skin Care", value: "skin care" },
      { id: 205, label: "Feminine Hygiene", value: "feminine hygiene" },
      { id: 206, label: "Men's Grooming", value: "men's grooming" },
      { id: 207, label: "Deo & Fragrances", value: "deo, fragrances" },
      { id: 208, label: "Health & Wellness", value: "health, wellness" },
    ],
  },
  {
    id: 3,
    label: "Fruits & Vegetables",
    value: "fruits & vegetables",
    subcategories: [
      { id: 301, label: "Fresh Fruits", value: "fresh fruits" },
      { id: 302, label: "Basic Vegetables", value: "basic vegetables" },
      { id: 303, label: "Roots, Herbs & Others", value: "roots, herbs, others" },
      { id: 304, label: "Premium Fruits & Vegetables", value: "premium fruits, vegetables" },
    ],
  },
  {
    id: 4,
    label: "Biscuits, Drinks & Packaged Foods",
    value: "biscuits, drinks, packaged foods",
    subcategories: [
      { id: 401, label: "Chips & Namkeens", value: "chips, namkeens" },
      { id: 402, label: "Biscuits & Cookies", value: "biscuits, cookies" },
      { id: 403, label: "Chocolates & Candies", value: "chocolates, candies" },
      { id: 404, label: "Indian Sweets", value: "indian sweets" },
      { id: 405, label: "Drinks & Juices", value: "drinks, juices" },
      { id: 406, label: "Breakfast Cereals", value: "breakfast cereals" },
      { id: 407, label: "Noodles, Pasta & Vermicelli", value: "noodles, pasta, vermicelli" },
      { id: 408, label: "Ready To Cook & Eat", value: "ready to cook, eat" },
      { id: 409, label: "Spread, Sauces & Ketchup", value: "spread, sauces, ketchup" },
      { id: 410, label: "Pickles, Chutney & Flavoring", value: "pickles, chutney, flavoring" },
      { id: 411, label: "Tea", value: "tea" },
      { id: 412, label: "Coffee", value: "coffee" },
    ],
  },
  {
    id: 5,
    label: "Dairy & Bakery",
    value: "dairy,bakery",
    subcategories: [
      { id: 501, label: "Milk & Milk Product", value: "milk, milk product" },
      { id: 502, label: "Cheese, Paneer & Tofu", value: "cheese, paneer, tofu" },
      { id: 503, label: "Batter & Chutney", value: "batter, chutney" },
      { id: 504, label: "Toast & Khari", value: "toast, khari" },
      { id: 505, label: "Breads & Buns", value: "breads, buns" },
      { id: 506, label: "Baked Cookies", value: "baked cookies" },
      { id: 507, label: "Bakery Snacks", value: "bakery snacks" },
      { id: 508, label: "Cakes & Muffins", value: "cakes, muffins" },
    ],
  },
  {
    id: 6,
    label: "Beauty",
    value: "beauty",
    subcategories: [
      { id: 601, label: "Faces", value: "faces" },
      { id: 602, label: "Nails & Lips", value: "nailsb lips" },
      { id: 603, label: "Eyes", value: "eyes" },
      { id: 604, label: "Beauty Accessories", value: "beauty accessories" },
    ],
  },
  {
    id: 7,
    label: "Mom & Baby Care",
    value: "mom, baby care",
    subcategories: [
      { id: 701, label: "Diapers & Wipes", value: "diapers, wipes" },
      { id: 702, label: "Bath, Hygiene & Grooming", value: "bath, hygiene, grooming" },
      { id: 703, label: "Food & Feeding", value: "food, feeding" },
      { id: 704, label: "Bedding, Toys & Accessories", value: "bedding, toys, accessories" },
    ],
  },
  {
    id: 8,
    label: "Home Care",
    value: "home care",
    subcategories: [
      { id: 801, label: "Detergent & Cleaners", value: "detergent, cleaners" },
      { id: 802, label: "Dishwash", value: "dishwash" },
      { id: 803, label: "Fresheners & Repellents", value: "fresheners, repellents" },
      { id: 804, label: "Bathrooms & Laundry Accessories", value: "bathrooms, laundry accessories" },
      { id: 805, label: "Pooja Needs", value: "pooja needs" },
      { id: 806, label: "Basic Electricals", value: "basic electricals" },
      { id: 807, label: "Shoe Care", value: "shoe care" },
      { id: 808, label: "Cleaning Tools", value: "cleaning tools" },
    ],
  },
  {
    id: 9,
    label: "School, Office & Stationary",
    value: "school, office, stationary",
    subcategories: [
      { id: 901, label: "Notebook & Paper Products", value: "notebook, paper products" },
      { id: 902, label: "Writing Instruments & Accessories", value: "writing instruments, accessories" },
      { id: 903, label: "School Supplies", value: "school supplies" },
      { id: 904, label: "Party Accessories", value: "party accessories" },
      { id: 905, label: "Office Supplies", value: "office supplies" },
      { id: 906, label: "Art, Craft & Hobby", value: "art, craft, hobby" },
      { id: 907, label: "Children's Books", value: "children books" },
      { id: 908, label: "School Textbooks", value: "school textbooks" },
    ],
  },
  {
    id: 10,
    label: "Disposables",
    value: "disposables",
    subcategories: [
      { id: 1001, label: "Food Wrapping Essentials", value: "food wrapping essentials" },
      { id: 1002, label: "Home Hygiene", value: "home hygiene" },
      { id: 1003, label: "Plates & Cutlery", value: "plates, cutlery" },
      { id: 1004, label: "Tissues & Napkins", value: "tissues, napkins" },
    ],
  },
  {
    id: 11,
    label: "Gifts & Hampers",
    value: "gifts, hampers",
    subcategories: [
      { id: 1101, label: "Tea Gifts", value: "tea gifts" },
      { id: 1102, label: "Chocolates Gifts", value: "chocolates gifts" },
      { id: 1103, label: "Gourmet Gifts", value: "gourmet gifts" },
    ],
  },
];

export default productCategory;
