export interface TimelineMilestone {
  year: string;
  title: string;
  description: string;
  badge: string;
}

export interface Achievement {
  value: string;
  label: string;
  sublabel: string;
}

export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  productName: string;
  comment: string;
  verified: boolean;
}

export const BRAND_INFO = {
  name: "ARAJ DRY FRUITS & SPICES",
  tagline: "Premium Quality Since 1985",
  motto: "Pure • Premium • Authentic • Timeless",
  founded: 1985,
  phone: "+91 99171 04448",
  email: "ankurkaushal0016@gmail.com",
  address: "11/48-E, Near Apsara Talkies, Hathras Road, Naraich, Agra-282006 (U.P.), India",
  description: "Since 1985, Araj has been a trusted symbol of unmatched purity and heritage in Indian dry fruits and spices. What began as a humble family enterprise in Agra has evolved into a celebrated luxury brand cherished by thousands of families seeking uncompromised aroma, richness, and culinary tradition.",
  vision: "To bring royal Indian culinary authenticity and nutrient-rich natural delicacies to modern discerning homes worldwide with futuristic precision and timeless purity."
};

export const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    year: "1985",
    title: "The Heritage Foundation",
    description: "Founded in historic Agra with a single stone-grinding spice mill and an uncompromising commitment to sourcing only first-grade whole spices and royal dry fruits.",
    badge: "Origin"
  },
  {
    year: "1998",
    title: "Mastering Spice Formulations",
    description: "Perfected proprietary traditional recipes for Chana Masala, Chatpata Chat Masala, and pure golden Lakadong-grade Turmeric powder, favored by master chefs across Northern India.",
    badge: "Aroma Craft"
  },
  {
    year: "2010",
    title: "Royal Gifting & Nut Selections",
    description: "Introduced the iconic Shahi Treat and Festive collections, hand-sorting California almonds, premium Mangalore cashews, and Afghan green pistachios for luxury celebrations.",
    badge: "Luxury Gifting"
  },
  {
    year: "2024+",
    title: "Futuristic Purity & Nationwide Reach",
    description: "Expanded to state-of-the-art nitrogen-flushed barrier packaging, retaining 100% of essential aromatic oils and delivering direct to culinary enthusiasts across India.",
    badge: "Modern Era"
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    value: "39+",
    label: "Years of Trust",
    sublabel: "Honoring royal Indian traditions since 1985"
  },
  {
    value: "100%",
    label: "Pure & Vegetarian",
    sublabel: "Zero adulteration, zero artificial colors"
  },
  {
    value: "50+",
    label: "Handcrafted Blends",
    sublabel: "Whole spices, ground masalas & royal dry fruits"
  },
  {
    value: "50,000+",
    label: "Happy Households",
    sublabel: "Consistent 4.8+ star customer satisfaction"
  }
];

export const REVIEWS: Review[] = [
  {
    id: "rev-1",
    name: "Vikram Malhotra",
    location: "New Delhi",
    rating: 5,
    date: "August 2026",
    productName: "Chana Masala (100g)",
    comment: "The aroma when you open the pack is intoxicating! You can immediately tell these are roasted whole spices ground to perfection. My family's Sunday chole has never tasted this authentic.",
    verified: true
  },
  {
    id: "rev-2",
    name: "Sunita Agarwal",
    location: "Agra, U.P.",
    rating: 5,
    date: "July 2026",
    productName: "Haldi (Turmeric Powder 500g)",
    comment: "We have been buying Araj since the 1990s in Agra. The color and medicinal warmth of this haldi is unmatched. It leaves no harsh residue, only golden perfection.",
    verified: true
  },
  {
    id: "rev-3",
    name: "Rohan & Devika Singhal",
    location: "Mumbai",
    rating: 5,
    date: "June 2026",
    productName: "Shahi Treats Dryfruits Gift Box",
    comment: "Ordered 25 boxes for our corporate Diwali gifting. The glass-finish packaging and the crunch of the jumbo cashews and pistachios left our clients genuinely impressed.",
    verified: true
  },
  {
    id: "rev-4",
    name: "Meera Krishnan",
    location: "Bengaluru",
    rating: 5,
    date: "May 2026",
    productName: "Premium Cashews (250g)",
    comment: "Crisp, sweet, and uniform in size. No broken pieces or bitter aftertaste. The zip pouch keeps them fresh for weeks. Worth every rupee.",
    verified: true
  },
  {
    id: "rev-5",
    name: "Rajeshwar Verma",
    location: "Jaipur",
    rating: 5,
    date: "May 2026",
    productName: "Chatpata Chat Masala (100g)",
    comment: "Tangy, zesty, with the right touch of hing and black salt. Sprinkled on fresh fruit or evening snacks, it elevates everything instantly.",
    verified: true
  }
];
