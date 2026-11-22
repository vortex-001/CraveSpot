
/* ==========================================
   DISH DETAILS DATA
========================================== */

const dishData = {

    "chicken-biryani": {
        name: "Chicken Biryani",
        category: "Biryani",
        cuisine: "North Indian",
        price: 220,
        rating: 4.7,
        reviews: "120+ reviews",

        restaurant: "Urban Tadka",
        restaurantSlug: "urban-tadka",
        location: "Sector 17, Chandigarh",

        image:
        "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=900&q=85",
        description:
            "Aromatic basmati rice cooked with tender chicken and traditional Indian spices.",

        longDescription:
            "Chicken Biryani is a flavorful rice dish prepared with aromatic basmati rice, tender chicken and a blend of traditional Indian spices. It is slow-cooked to bring together the rich flavors and aroma."
    },


    "classic-cheese-pizza": {
        name: "Classic Cheese Pizza",
        category: "Pizza",
        cuisine: "Italian",
        price: 280,
        rating: 4.5,
        reviews: "95+ reviews",

        restaurant: "Pizza Street",
        restaurantSlug: "pizza-street",
        location: "Sector 34, Chandigarh",

       image:
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=85",
        description:
            "Classic pizza topped with rich tomato sauce, mozzarella cheese and Italian herbs.",

        longDescription:
            "Our Classic Cheese Pizza combines a crispy base with rich tomato sauce, melted mozzarella and aromatic Italian herbs. A simple but delicious choice for pizza lovers."
    },


    "classic-chicken-burger": {
        name: "Classic Chicken Burger",
        category: "Burger",
        cuisine: "Fast Food",
        price: 160,
        rating: 4.4,
        reviews: "80+ reviews",

        restaurant: "The Food Factory",
        restaurantSlug: "the-food-factory",
        location: "Phase 7, Mohali",

        image:
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",
        description:
            "Juicy chicken patty served inside a soft bun with fresh vegetables and signature sauce.",

        longDescription:
            "The Classic Chicken Burger features a juicy chicken patty, fresh vegetables and signature sauce served in a soft toasted bun. Perfect for a quick and satisfying meal."
    },


    "steamed-veg-momos": {
        name: "Steamed Veg Momos",
        category: "Chinese",
        cuisine: "Chinese / Tibetan",
        price: 120,
        rating: 4.6,
        reviews: "110+ reviews",

        restaurant: "Wok & Roll",
        restaurantSlug: "wok-and-roll",
        location: "Sector 35, Chandigarh",

        image:
    "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=85",
        description:
            "Soft steamed dumplings filled with seasoned vegetables and served with spicy chutney.",

        longDescription:
            "Steamed Veg Momos are soft dumplings filled with seasoned vegetables. They are steamed until perfectly cooked and served with a flavorful spicy chutney."
    },


    "butter-chicken": {
        name: "Butter Chicken",
        category: "North Indian",
        cuisine: "North Indian",
        price: 320,
        rating: 4.8,
        reviews: "150+ reviews",

        restaurant: "Urban Tadka",
        restaurantSlug: "urban-tadka",
        location: "Sector 17, Chandigarh",

        image:
    "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=85",
        description:
            "Tender chicken cooked in a rich, creamy tomato-based gravy with aromatic Indian spices.",

        longDescription:
            "Butter Chicken is a classic North Indian dish made with tender chicken pieces cooked in a creamy tomato-based gravy. The dish is finished with butter and aromatic spices."
    },


    "loaded-fries": {
        name: "Loaded Fries",
        category: "Burger",
        cuisine: "Fast Food",
        price: 180,
        rating: 4.3,
        reviews: "70+ reviews",

        restaurant: "The Food Factory",
        restaurantSlug: "the-food-factory",
        location: "Phase 7, Mohali",

        image:
    "https://images.unsplash.com/photo-1573080496219-bb080dd4f4c2?auto=format&fit=crop&w=900&q=85",
        description:
            "Crispy fries loaded with delicious toppings and creamy sauces.",

        longDescription:
            "Loaded Fries are crispy golden fries topped with flavorful sauces and delicious toppings. They make a great snack or side dish."
    },


    "chilli-garlic-noodles": {
        name: "Chilli Garlic Noodles",
        category: "Chinese",
        cuisine: "Chinese",
        price: 190,
        rating: 4.5,
        reviews: "90+ reviews",

        restaurant: "Wok & Roll",
        restaurantSlug: "wok-and-roll",
        location: "Sector 35, Chandigarh",

        image:
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=85",
        description:
            "Stir-fried noodles tossed with garlic, chilli and flavorful Chinese sauces.",

        longDescription:
            "Chilli Garlic Noodles are stir-fried with fresh garlic, chilli and flavorful sauces. The combination gives the noodles a delicious spicy and savory taste."
    },


    "chocolate-brownie": {
        name: "Chocolate Brownie",
        category: "Dessert",
        cuisine: "Dessert",
        price: 150,
        rating: 4.7,
        reviews: "100+ reviews",

        restaurant: "Sweet Treats",
        restaurantSlug: "sweet-treats",
        location: "Chandigarh",

       image:
    "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=85",
        description:
            "Rich and fudgy chocolate brownie with a soft centre and deep chocolate flavor.",

        longDescription:
            "This rich chocolate brownie has a soft, fudgy centre and an intense chocolate flavor. It is a perfect sweet treat after a delicious meal."
    },

    "amritsari-kulcha-with-chole": {
        name: "Amritsari Kulcha & Chole",
        category: "North Indian",
        cuisine: "Punjabi",
        price: 140,
        rating: 4.8,
        reviews: "140+ reviews",
        restaurant: "Kulcha Junction",
        restaurantSlug: "kulcha-junction",
        location: "Sector 22, Chandigarh",
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=85",
        description: "Flaky layered tandoor-baked kulcha with spiced Amritsari chole and butter.",
        longDescription: "Authentic Amritsari stuffed kulcha made with spiced potato and paneer stuffing, roasted in a clay tandoor until golden and crispy, served with slow-cooked dark chole and spicy tamarind onion relish."
    },

    "delhi-golgappe-pani-puri": {
        name: "Crispy Golgappe (Pani Puri)",
        category: "Street Food",
        cuisine: "Street Food",
        price: 80,
        rating: 4.9,
        reviews: "210+ reviews",
        restaurant: "Chaat Chaska",
        restaurantSlug: "chaat-chaska",
        location: "Sector 34, Chandigarh",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85",
        description: "Crunchy semolina puris with spicy mint water, potato-chickpea mash and sweet tamarind.",
        longDescription: "Crispy hollow puri balls filled with mashed potatoes, black chickpeas, sweet date-tamarind chutney, and dipped into ice-cold spicy mint-coriander water for an explosion of flavors."
    },

    "paneer-tikka-kathi-roll": {
        name: "Paneer Tikka Kathi Roll",
        category: "Rolls",
        cuisine: "Street Food",
        price: 130,
        rating: 4.6,
        reviews: "115+ reviews",
        restaurant: "Rolls Mania",
        restaurantSlug: "rolls-mania",
        location: "Phase 7, Mohali",
        image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=900&q=85",
        description: "Char-grilled paneer cubes wrapped in layered flaky paratha with mint chutney and onions.",
        longDescription: "Smoky tandoori paneer cubes wrapped in a freshly roasted, flaky laccha paratha with crunchy julienned red onions, tangy chaat masala, and house special mint mayo."
    },

    "dal-makhani-handi": {
        name: "Dal Makhani Handi",
        category: "North Indian",
        cuisine: "North Indian",
        price: 210,
        rating: 4.7,
        reviews: "165+ reviews",
        restaurant: "Katani Dhaba",
        restaurantSlug: "katani-dhaba",
        restaurantId: 6,
        location: "Phase 3B2, Mohali",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=85",
        description: "Slow-cooked black lentils simmered overnight with fresh white butter and rich cream.",
        longDescription: "Traditional Punjabi black urad dal simmered with tomatoes, ginger, and garlic over gentle tandoor coals for over 12 hours, finished with generous dollops of churned white butter and fresh cream."
    },

    "special-paneer-kathi-roll": {
        name: "Special Paneer Kathi Roll",
        category: "Street Food",
        cuisine: "North Indian / Street Food",
        price: 150,
        rating: 4.7,
        reviews: "140+ reviews",
        restaurant: "Rolls Mania & Fast Bites",
        restaurantSlug: "rolls-mania",
        restaurantId: 12,
        location: "Khanpur Chowk, Kharar",
        image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=900&q=85",
        description: "Flaky paratha loaded with spiced paneer, fresh onions and mint chutney.",
        longDescription: "Signature flaky, golden laccha paratha freshly rolled on tawa, stuffed with charred spicy paneer cubes, crunchy sliced red onions, fresh coriander, and zesty green mint chutney."
    },

    "amritsari-stuffed-kulcha-thali": {
        name: "Amritsari Stuffed Kulcha Thali",
        category: "North Indian",
        cuisine: "Punjabi",
        price: 140,
        rating: 4.8,
        reviews: "195+ reviews",
        restaurant: "Amritsari Kulcha Junction",
        restaurantSlug: "amritsari-kulcha-junction",
        restaurantId: 13,
        location: "Landran Road, Kharar",
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=85",
        description: "Crispy tandoori kulcha with spicy chhole, butter and tangy chutney.",
        longDescription: "Crispy multi-layered tandoori kulcha stuffed with spiced potato and onion, crushed by hand and slathered with melted country butter. Served with spicy Amritsari chhole and imli-pyaz chutney."
    },

    "fiery-paneer-pizza": {
        name: "Fiery Paneer Pizza",
        category: "Pizza",
        cuisine: "Italian / Fusion",
        price: 320,
        rating: 4.6,
        reviews: "115+ reviews",
        restaurant: "Pizza Corner",
        restaurantSlug: "pizza-corner",
        restaurantId: 2,
        location: "Sector 22, Chandigarh",
        image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=900&q=85",
        description: "Spicy marinated paneer with capsicum and mozzarella.",
        longDescription: "Hand-stretched sourdough crust layered with spicy arrabbiata sauce, chunks of peri-peri marinated cottage cheese, crunchy green capsicum, and premium stringy mozzarella."
    },

    "classic-margherita-pizza": {
        name: "Classic Margherita Pizza",
        category: "Pizza",
        cuisine: "Italian",
        price: 280,
        rating: 4.7,
        reviews: "135+ reviews",
        restaurant: "Pizza Corner",
        restaurantSlug: "pizza-corner",
        restaurantId: 2,
        location: "Sector 22, Chandigarh",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=85",
        description: "Fresh tomato basil sauce with premium mozzarella.",
        longDescription: "The Italian classic crafted with San Marzano style tomato puree, fresh torn sweet basil leaves, virgin olive oil drizzle, and golden melted whole-milk mozzarella cheese."
    },

    "dal-makhani": {
        name: "Dal Makhani",
        category: "North Indian",
        cuisine: "Punjabi",
        price: 260,
        rating: 4.7,
        reviews: "185+ reviews",
        restaurant: "Katani Dhaba",
        restaurantSlug: "katani-dhaba",
        restaurantId: 6,
        location: "Phase 3B2, Mohali",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=85",
        description: "Slow-cooked black lentils with cream and butter.",
        longDescription: "Black urad dal slow-cooked on slow coals for over 16 hours, enriched with ginger, garlic, rich farm butter, and silky fresh cream for unbeatable comfort and richness."
    },

    "kadak-masala-chai-and-bun-maska": {
        name: "Kadak Masala Chai & Bun Maska",
        category: "Street Food",
        cuisine: "Indian Cafe & Street Food",
        price: 80,
        rating: 4.8,
        reviews: "220+ reviews",
        restaurant: "Giani Tea Stall & Bun Maska",
        restaurantSlug: "giani-tea-stall",
        restaurantId: 15,
        location: "Landran Road, Kharar",
        image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=85",
        description: "Ginger and cardamom infused milk tea served with toasted butter bun.",
        longDescription: "Freshly brewed clay-pot tapri style masala chai infused with crushed green cardamom, ginger, and cloves, paired with warm fluffy toasted pav filled with Amul butter."
    },

    "crispy-golgappe-6-pcs-with-3-waters": {
        name: "Crispy Golgappe (6 pcs) with 3 Waters",
        category: "Street Food",
        cuisine: "Street Food & Chaat",
        price: 60,
        rating: 4.7,
        reviews: "175+ reviews",
        restaurant: "Chaat Chaska & Golgappa Corner",
        restaurantSlug: "chaat-chaska",
        restaurantId: 14,
        location: "Main Market, Kharar",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85",
        description: "Crispy puris filled with potato mash, served with spicy mint, tangy hing, and sweet tamarind pani.",
        longDescription: "Golden crisp suji puris filled with spicy potato-chana masala, served alongside 3 chilled flavors of flavored water: Teekha Pudina, Khatta Meetha Sonth, and Hing Jeera."
    },

    "paneer-butter-masala": {
        name: "Paneer Butter Masala",
        category: "North Indian",
        cuisine: "North Indian",
        price: 220,
        rating: 4.8,
        reviews: "150+ reviews",
        restaurant: "Spice Garden",
        restaurantSlug: "spice-garden",
        restaurantId: 1,
        location: "Sector 17, Chandigarh",
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=900&q=85",
        description: "Creamy tomato gravy with soft paneer.",
        longDescription: "Fresh malai cottage cheese cubes gently tossed in a velvety, buttery tomato and cashew gravy, aromatized with dried fenugreek leaves and garam masala."
    },

    "garden-veg-pizza": {
        name: "Garden Veg Pizza",
        category: "Pizza",
        cuisine: "Italian",
        price: 250,
        rating: 4.6,
        reviews: "110+ reviews",
        restaurant: "Pizza Corner",
        restaurantSlug: "pizza-corner",
        restaurantId: 2,
        location: "Sector 22, Chandigarh",
        image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=900&q=85",
        description: "Pizza topped with vegetables and cheese.",
        longDescription: "Crispy crust layered with herb-infused Italian tomato sauce, layered with mozzarella cheese, capsicum, sweet corn, black olives, red onions and diced mushrooms."
    },

    "vegetable-biryani": {
        name: "Vegetable Biryani",
        category: "Biryani",
        cuisine: "North Indian",
        price: 180,
        rating: 4.7,
        reviews: "135+ reviews",
        restaurant: "Spice Garden",
        restaurantSlug: "spice-garden",
        restaurantId: 1,
        location: "Sector 17, Chandigarh",
        image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=900&q=85",
        description: "Rice cooked with vegetables and aromatic spices.",
        longDescription: "Fragrant long-grain basmati rice layered with garden-fresh beans, carrots, peas and paneer, slow-cooked in handi with saffron and whole spices."
    },

    "chicken-curry": {
        name: "Chicken Curry",
        category: "North Indian",
        cuisine: "Punjabi",
        price: 280,
        rating: 4.7,
        reviews: "160+ reviews",
        restaurant: "Katani Dhaba",
        restaurantSlug: "katani-dhaba",
        restaurantId: 6,
        location: "Phase 3B2, Mohali",
        image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=85",
        description: "Classic chicken curry with Indian spices.",
        longDescription: "Tender bone-in chicken pieces simmered in an aromatic onion, ginger, garlic and tomato masala curry, garnished with fresh cilantro and ginger juliennes."
    },

    "tandoori-chicken": {
        name: "Tandoori Chicken",
        category: "North Indian",
        cuisine: "Mughlai",
        price: 320,
        rating: 4.8,
        reviews: "190+ reviews",
        restaurant: "Spice Garden",
        restaurantSlug: "spice-garden",
        restaurantId: 1,
        location: "Sector 17, Chandigarh",
        image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=85",
        description: "Chicken marinated with traditional spices.",
        longDescription: "Juicy chicken roasted to perfection in clay tandoor after overnight marination in spiced curd, mustard oil, Kashmiri red chilli and kasuri methi."
    },

    "crispy-chicken": {
        name: "Crispy Chicken",
        category: "Fast Food",
        cuisine: "American Fast Food",
        price: 240,
        rating: 4.5,
        reviews: "95+ reviews",
        restaurant: "Burger House",
        restaurantSlug: "burger-house",
        restaurantId: 4,
        location: "Sector 8, Chandigarh",
        image: "https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=900&q=85",
        description: "Crispy, seasoned chicken bites.",
        longDescription: "Deep-fried golden crunch chicken tenders dusted with special peri-peri herb rub, served alongside homemade garlic aioli and sweet chilli dip."
    },

    "fresh-buddha-bowl": {
        name: "Fresh Buddha Bowl",
        category: "Healthy & Salads",
        cuisine: "Continental & Vegan",
        price: 190,
        rating: 4.6,
        reviews: "80+ reviews",
        restaurant: "Urban Cafe & Bistro",
        restaurantSlug: "urban-cafe",
        restaurantId: 9,
        location: "Sector 70, Mohali",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85",
        description: "Fresh vegetables, greens and grains.",
        longDescription: "Nutritious power bowl featuring organic quinoa, chickpeas, roasted sweet potatoes, fresh avocado slices, cherry tomatoes, and tahini lemon dressing."
    },

    "fresh-veggie-salad": {
        name: "Fresh Veggie Salad",
        category: "Healthy & Salads",
        cuisine: "Continental & Vegan",
        price: 160,
        rating: 4.5,
        reviews: "70+ reviews",
        restaurant: "Urban Cafe & Bistro",
        restaurantSlug: "urban-cafe",
        restaurantId: 9,
        location: "Sector 70, Mohali",
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",
        description: "A fresh mix of vegetables and greens.",
        longDescription: "Crisp romaine lettuce, cucumber, bell peppers, purple cabbage, and pomegranate pearls tossed in light extra virgin olive oil vinaigrette."
    },

    "healthy-grain-bowl": {
        name: "Healthy Grain Bowl",
        category: "Healthy & Salads",
        cuisine: "Continental & Vegan",
        price: 200,
        rating: 4.7,
        reviews: "85+ reviews",
        restaurant: "Urban Cafe & Bistro",
        restaurantSlug: "urban-cafe",
        restaurantId: 9,
        location: "Sector 70, Mohali",
        image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=900&q=85",
        description: "A plant-based bowl with grains and vegetables.",
        longDescription: "Wholesome blend of brown rice, edamame, steamed broccoli, grilled tofu, and toasted pumpkin seeds with a ginger soy glaze."
    }

};

/* ==========================================
   AUTHENTIC FOOD IMAGE RESOLVER
   Ensures every dish has its true matching photo
   and prevents generic placeholder fallback
========================================== */

function resolveDishImage(dishName = "", category = "", existingUrl = "") {
    if (existingUrl && typeof existingUrl === "string" && existingUrl.startsWith("http") && !existingUrl.includes("photo-1504674900247-0877df9cc836")) {
        return existingUrl;
    }

    const text = (dishName + " " + category).toLowerCase();

    // 1. Rolls & Wraps
    if (text.includes("roll") || text.includes("kathi") || text.includes("wrap") || text.includes("shawarma")) {
        return "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=900&q=85";
    }

    // 2. Kulchas & Chole Thalis
    if (text.includes("kulcha") || text.includes("chhole") || text.includes("chole") || text.includes("bhatur")) {
        return "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=85";
    }

    // 3. Butter Chicken
    if (text.includes("butter chicken") || text.includes("makhani chicken") || text.includes("murgh makhani")) {
        return "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=85";
    }

    // 4. Dal Makhani & Lentils
    if (text.includes("dal makhani") || text.includes("makhani dal") || text.includes("bukhara") || text.includes("black lentil") || text.includes("daal")) {
        return "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=85";
    }

    // 5. Paneer Dishes & Curries
    if (text.includes("paneer")) {
        if (text.includes("pizza")) {
            return "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=900&q=85";
        }
        return "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=85";
    }

    // 6. Pizzas
    if (text.includes("pizza") || text.includes("margherita") || text.includes("mozzarella")) {
        return "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=85";
    }

    // 7. Biryani
    if (text.includes("biryani") || text.includes("pulao")) {
        return "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=900&q=85";
    }

    // 8. Burgers
    if (text.includes("burger") || text.includes("cheeseburger") || text.includes("zinger")) {
        return "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85";
    }

    // 9. Momos & Dim Sum
    if (text.includes("momo") || text.includes("dimsum") || text.includes("dumpling")) {
        return "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=900&q=85";
    }

    // 10. Noodles & Chinese
    if (text.includes("noodle") || text.includes("hakka") || text.includes("chowmein") || text.includes("manchurian") || text.includes("chinese")) {
        return "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=900&q=85";
    }

    // 11. Chaat & Golgappe
    if (text.includes("chaat") || text.includes("golgapp") || text.includes("pani puri") || text.includes("tikki") || text.includes("papdi")) {
        return "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85";
    }

    // 12. Chai & Tea & Bun Maska
    if (text.includes("chai") || text.includes("tea") || text.includes("bun maska")) {
        return "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=85";
    }

    // 13. Desserts & Sweets & Brownies
    if (text.includes("brownie") || text.includes("dessert") || text.includes("cake") || text.includes("ice cream") || text.includes("sweet") || text.includes("jamun") || text.includes("halwa")) {
        return "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=85";
    }

    // 14. Thalis & Platters
    if (text.includes("thali") || text.includes("platter")) {
        return "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=900&q=85";
    }

    // Default vibrant food image
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=85";
}


/* ==========================================
   GET DISH FROM URL
========================================== */

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const dishSlug =
    urlParams.get("dish");

let currentDish = null;

/* ==========================================
   LOAD DISH
========================================== */

function loadDish() {
    const normalizeDishSlug = value => (value || "")
        .toLowerCase()
        .trim()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const dishKey = Object.keys(dishData).find(key =>
        normalizeDishSlug(key) === normalizeDishSlug(dishSlug) ||
        normalizeDishSlug(dishData[key].name) === normalizeDishSlug(dishSlug)
    );

    const queryDishName = urlParams.get("name");

    let dish = dishKey ? { ...dishData[dishKey] } : (queryDishName ? {
        name: queryDishName,
        category: urlParams.get("category") || "Menu Item",
        cuisine: urlParams.get("category") || "Multi-Cuisine",
        description: urlParams.get("description") || "Delicious authentic recipe prepared with fresh ingredients.",
        longDescription: urlParams.get("description") || "Explore this signature delicacy on CraveSpot.",
        price: Number(urlParams.get("price") || 160),
        rating: 4.7,
        reviews: "120+ reviews",
        image: urlParams.get("image") || "",
        restaurant: urlParams.get("restaurant") || "Popular Eatery",
        restaurantSlug: "",
        restaurantId: urlParams.get("restaurantId") || "",
        location: urlParams.get("restaurantLocation") || "Chandigarh Tricity"
    } : null);

    if (!dish && dishSlug) {
        // Fallback for slugs not pre-registered in dishData
        const humanName = dishSlug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        dish = {
            name: humanName,
            category: "Specialty",
            cuisine: "North Indian & Fast Food",
            description: "Signature freshly prepared local delicacy on CraveSpot.",
            longDescription: "Enjoy this chef special prepared with authentic herbs and traditional recipe.",
            price: 150,
            rating: 4.6,
            reviews: "85+ reviews",
            image: "",
            restaurant: "Popular Local Kitchen",
            restaurantSlug: "",
            restaurantId: "",
            location: "Chandigarh Tricity"
        };
    }

    if (!dish) {
        document.getElementById("dishName").textContent = "Dish Not Found";
        document.getElementById("dishDescription").textContent = "Sorry, this dish could not be found.";
        return;
    }

    // Dynamic enhancements from URL query parameters
    if (urlParams.get("restaurant") && urlParams.get("restaurant") !== "Restaurant") {
        dish.restaurant = urlParams.get("restaurant");
    }
    if (urlParams.get("restaurantId")) {
        dish.restaurantId = urlParams.get("restaurantId");
    }
    if (urlParams.get("restaurantLocation")) {
        dish.location = urlParams.get("restaurantLocation");
    }
    if (urlParams.get("rating") && Number(urlParams.get("rating")) > 0) {
        dish.rating = Number(urlParams.get("rating"));
    }
    if (urlParams.get("price") && Number(urlParams.get("price")) > 0) {
        dish.price = Number(urlParams.get("price"));
    }
    if (urlParams.get("category")) {
        dish.category = urlParams.get("category");
    }

    // Ensure authentic, delicious food photography (prevents steak/generic fallback)
    dish.image = resolveDishImage(dish.name, dish.category, urlParams.get("image") || dish.image);

    // Save active dish reference
    currentDish = dish;

    /* Image */
    const dishImgEl = document.getElementById("dishImage");
    if (dishImgEl) {
        dishImgEl.src = dish.image;
        dishImgEl.alt = dish.name;
    }

    /* Name */
    const dishNameEl = document.getElementById("dishName");
    if (dishNameEl) dishNameEl.textContent = dish.name;

    const breadcrumbEl = document.getElementById("breadcrumbDish");
    if (breadcrumbEl) breadcrumbEl.textContent = dish.name;

    /* Category */
    const categoryEl = document.getElementById("dishCategory");
    if (categoryEl) categoryEl.textContent = dish.category;

    /* Rating */
    const ratingVal = Number(dish.rating) || 4.7;
    const dishRatingEl = document.getElementById("dishRating");
    if (dishRatingEl) {
        dishRatingEl.textContent = "\u2605 " + ratingVal.toFixed(1);
    }

    const dishReviewsEl = document.getElementById("dishReviews");
    if (dishReviewsEl) {
        dishReviewsEl.textContent = dish.reviews || "120+ reviews";
    }

    /* Price */
    const formattedPrice = "\u20B9" + Number(dish.price || 0);
    const dishPriceEl = document.getElementById("dishPrice");
    if (dishPriceEl) dishPriceEl.textContent = formattedPrice;

    const dishPriceInfoEl = document.getElementById("dishPriceInfo");
    if (dishPriceInfoEl) dishPriceInfoEl.textContent = formattedPrice;

    /* Description */
    const descEl = document.getElementById("dishDescription");
    if (descEl) descEl.textContent = dish.description;

    const longDescEl = document.getElementById("longDescription");
    if (longDescEl) longDescEl.textContent = dish.longDescription;

    /* Cuisine */
    const cuisineEl = document.getElementById("dishCuisine");
    if (cuisineEl) cuisineEl.textContent = dish.cuisine || dish.category;

    const ratingInfoEl = document.getElementById("dishRatingInfo");
    if (ratingInfoEl) {
        ratingInfoEl.textContent = ratingVal.toFixed(1) + " / 5";
    }

    /* Restaurant */
    const restNameEl = document.getElementById("restaurantName");
    if (restNameEl) {
        restNameEl.textContent = (dish.restaurant && dish.restaurant !== "Restaurant") ? dish.restaurant : "Popular Eatery";
    }

    const restLocEl = document.getElementById("restaurantLocation");
    if (restLocEl) {
        restLocEl.textContent = dish.location || "Chandigarh Tricity";
    }
}


/* ==========================================
   FAVORITE
========================================== */

function toggleDishFavorite() {

    const button =
        document.getElementById(
            "dishFavoriteBtn"
        );


    const favorites =
        JSON.parse(
            localStorage.getItem(
                "CraveSpot_favorite_dishes"
            )
        ) || [];


    const index =
        favorites.indexOf(dishSlug);


    if (index === -1) {

        favorites.push(dishSlug);

        button.textContent = "\u2665 Added to Favorites";

        button.classList.add(
            "favorite-active"
        );

    } else {

        favorites.splice(index, 1);

        button.textContent = "\u2661 Add to Favorites";

        button.classList.remove(
            "favorite-active"
        );

    }


    localStorage.setItem(
        "CraveSpot_favorite_dishes",
        JSON.stringify(favorites)
    );

}


/* ==========================================
   LOAD FAVORITE STATE
========================================== */

function loadFavoriteState() {

    const favorites =
        JSON.parse(
            localStorage.getItem(
                "CraveSpot_favorite_dishes"
            )
        ) || [];


    const button =
        document.getElementById(
            "dishFavoriteBtn"
        );


    if (
        button &&
        favorites.includes(dishSlug)
    ) {

        button.textContent = "\u2665 Added to Favorites";

        button.classList.add(
            "favorite-active"
        );

    }

}


/* ==========================================
   VIEW RESTAURANT
========================================== */

function viewRestaurant() {
    const restId = urlParams.get("restaurantId") || (currentDish && currentDish.restaurantId);
    if (restId) {
        window.location.href = `restaurant-details.html?id=${encodeURIComponent(restId)}`;
        return;
    }

    const restName = urlParams.get("restaurant") || (currentDish && currentDish.restaurant) || "";
    if (restName && restName !== "Restaurant" && restName !== "Popular Eatery") {
        window.location.href = `restaurant-details.html?vendor=${encodeURIComponent(restName)}`;
        return;
    }

    const dish = dishData[dishSlug] || currentDish;
    if (dish && dish.restaurantSlug) {
        window.location.href = `restaurant-details.html?vendor=${encodeURIComponent(dish.restaurantSlug)}`;
        return;
    }

    window.location.href = "restaurants.html";
}


/* ==========================================
   SEARCH
========================================== */

function searchDish() {

    const input =
        document.getElementById(
            "dishSearch"
        );


    const query =
        input.value.trim();


    if (query === "") {

        alert(
            "Please enter a dish name."
        );

        return;
    }


    window.location.href =
        "dishes.html?search=" +
        encodeURIComponent(query);

}


/* ==========================================
   ENTER KEY SEARCH
========================================== */

const dishSearch =
    document.getElementById(
        "dishSearch"
    );


if (dishSearch) {

    dishSearch.addEventListener(
        "keypress",
        function(event) {

            if (event.key === "Enter") {
                searchDish();
            }

        }
    );

}


/* ==========================================
   PAGE INITIALIZATION
========================================== */

loadDish();

loadFavoriteState();

