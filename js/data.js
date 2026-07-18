// Product catalog — mirrors the CMS structure (Prismic `product` type).
// Copy is original placeholder text written in the brand's comedic voice;
// swap with licensed/owned copy before any public use.
const PRODUCTS = {
  pineapple: {
    id: "pineapple",
    name: "Crushed\nPineapple\nSriracha",
    flatName: "Crushed Pineapple Sriracha",
    color: "gold",
    price: 12,
    tagline: "Pineapple up front. Heat right behind.\nBalanced like a tightrope walker.",
    taste: [
      "Sweet pineapple opens the show",
      "Sriracha warmth builds mid-bite",
      "Clean finish that asks for seconds",
    ],
    pairs: ["Grilled chicken", "Pork ribs", "Shrimp skewers", "Fried rice", "Burgers"],
    mascot: "assets/lottie-cool-pineapple.png",
    lottie: "assets/lotties/cool.json",
    front: "assets/bottle-pineapple.png",
    back: "assets/pineapple-front.png",
  },
  habanero: {
    id: "habanero",
    name: "Crushed\nHabanero\nGarlic",
    flatName: "Crushed Habanero Garlic",
    color: "orange",
    price: 12,
    tagline: "Habanero heat. Garlic muscle.\nZero apologies issued.",
    taste: [
      "Heat says hello immediately",
      "Settles into a steady, honest burn",
      "Garlic depth carries the finish",
    ],
    pairs: ["Wings", "Brisket", "Tacos", "Eggs", "Pizza crust (trust us)"],
    mascot: "assets/lottie-fire-habanero.png",
    lottie: "assets/lotties/fire_breathing.json",
    front: "assets/bottle-habanero.png",
    back: "assets/habanero-front.png",
  },
  cherry: {
    id: "cherry",
    name: "Crushed\nCherry\nGarlic",
    flatName: "Crushed Cherry Garlic",
    color: "red",
    price: 12,
    tagline: "Sweet depth. Savory backbone.\nCherry with calluses.",
    taste: [
      "Real cherry sweetness up front",
      "Savory garlic rounds the middle",
      "Long, smoky, grown-up finish",
    ],
    pairs: ["Pulled pork", "Meatballs", "Duck", "Grilled cheese", "Ice cream (dare you)"],
    mascot: "assets/lottie-sassy-cherry.png",
    lottie: "assets/lotties/sassy.json",
    front: "assets/bottle-cherry.png",
    back: "assets/cherry-front.png",
  },
};

const BUNDLES = {
  three: { id: "three", name: "3 Pack", price: 32, img: "assets/3-pack.png" },
  six: { id: "six", name: "6 Pack", price: 60, img: "assets/6-pack.png" },
};

const REVIEWS = [
  { who: "Kyle S.", quote: "It lives on my counter now.", body: "The bottle never made it to the pantry. That says everything." },
  { who: "The Heat Bros", quote: "Genuinely great BBQ sauce.", body: "We review heat for a living. This one earned the shelf." },
  { who: "Captain Cooks", quote: "Best sauce in a long, long time.", body: "This is how BBQ sauce is supposed to taste." },
  { who: "Trey M.", quote: "Rescued a bad sandwich.", body: "Put it on a sad takeout sandwich. Sandwich is now framed." },
  { who: "Jeffrey R.", quote: "The old sauce is retired.", body: "Still in the fridge. Untouched. It knows." },
  { who: "Jason M.", quote: "Replaced everything I had.", body: "First sauce I've tried that actually tastes like real ingredients." },
];

const FREE_SHIP_MIN = 50;
