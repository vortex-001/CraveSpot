
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
    "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=900&q=85",
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
        category: "Fast Food",
        cuisine: "Fast Food",
        price: 180,
        rating: 4.3,
        reviews: "70+ reviews",

        restaurant: "The Food Factory",
        restaurantSlug: "the-food-factory",
        location: "Phase 7, Mohali",

        image: "../assets/images/dishes/loaded-fries.jpg",
        description:
            "Crispy golden fries loaded with delicious melted cheese, tangy herbs and creamy sauces.",

        longDescription:
            "Loaded Fries are crispy golden hand-cut fries piled high with spiced melted cheese, tangy jalapeno relish, and savory secret house sauces. The ultimate crispy snack!"
    },

    "amritsari-naan": {
        name: "Amritsari Stuffed Naan Thali",
        category: "North Indian",
        cuisine: "Punjabi Tandoor",
        price: 150,
        rating: 4.8,
        reviews: "180+ reviews",
        restaurant: "Amritsari Kulcha Junction",
        restaurantSlug: "kulcha-junction",
        restaurantId: 13,
        location: "Sector 22, Chandigarh",
        image: "../assets/images/dishes/amritsari-naan.jpg",
        description: "Crispy tandoori stuffed naan brushed with desi ghee, served with spicy Amritsari chhole and raita.",
        longDescription: "Authentic clay-oven tandoori Amritsari naan stuffed with seasoned spiced potatoes, onions and paneer, served hot with slow-simmered dark pindi chhole, pickled onions and tangy mint chutney."
    },

    "desi-ghee-moong-dal-halwa": {
        name: "Desi Ghee Moong Dal Halwa",
        category: "Dessert",
        cuisine: "Traditional Sweets",
        price: 130,
        rating: 4.9,
        reviews: "210+ reviews",
        restaurant: "Sweet Treats & Cravings",
        restaurantSlug: "sweet-treats",
        restaurantId: 5,
        location: "Sector 35, Chandigarh",
        image: "../assets/images/dishes/moong-dal-halwa.jpg",
        description: "Rich golden moong dal halwa slow-roasted in pure desi ghee, garnished with almonds and pistachios.",
        longDescription: "Slow-cooked golden yellow moong dal halwa roasted patiently in pure desi ghee, simmered with whole milk, saffron, green cardamom, and generously topped with slivered cashews, almonds and pistachios."
    },

    "belgian-waffle": {
        name: "Belgian Waffle with Maple & Chocolate",
        category: "Dessert",
        cuisine: "Bakery & Desserts",
        price: 160,
        rating: 4.7,
        reviews: "145+ reviews",
        restaurant: "Sweet Treats & Cravings",
        restaurantSlug: "sweet-treats",
        restaurantId: 5,
        location: "Sector 35, Chandigarh",
        image: "../assets/images/dishes/waffle.jpg",
        description: "Freshly baked crisp golden grid waffle served warm with rich chocolate drizzle and fresh berries.",
        longDescription: "Deep pocketed crisp Belgian waffle baked to golden perfection, finished with warm chocolate drizzle, pure maple syrup, whipped cream, and fresh orchard berries."
    },

    "royal-shahi-tukda": {
        name: "Royal Shahi Tukda",
        category: "Dessert",
        cuisine: "Mughlai Sweets",
        price: 140,
        rating: 4.8,
        reviews: "165+ reviews",
        restaurant: "Urban Tadka",
        restaurantSlug: "urban-tadka",
        restaurantId: 7,
        location: "Sector 26, Chandigarh",
        image: "../assets/images/dishes/shahi-tukda.jpg",
        description: "Ghee-crisped bread triangles steeped in saffron cardamom syrup and smothered in thick rabri.",
        longDescription: "The royal Awadhi dessert made of golden fried bread steeped in rose and cardamom infused sugar syrup, topped with thick condensed kesar rabri, silver vark and toasted dry fruit flakes."
    },

    "matka-kesar-phirni": {
        name: "Matka Kesar Phirni",
        category: "Dessert",
        cuisine: "Traditional Sweets",
        price: 110,
        rating: 4.9,
        reviews: "190+ reviews",
        restaurant: "Urban Tadka",
        restaurantSlug: "urban-tadka",
        restaurantId: 7,
        location: "Sector 26, Chandigarh",
        image: "../assets/images/dishes/matka-kesar-phirni.jpg",
        description: "Chilled slow-cooked ground rice pudding flavored with Kashmiri saffron, served in an authentic earthen shikora.",
        longDescription: "Creamy rice pudding slow-simmered with reduced milk, fragrant Kashmiri saffron, crushed green cardamom, chilled to perfection in natural clay shikoras (matkas) for an earthy aroma."
    },

    "dark-truffle-chocolate-cake": {
        name: "Dark Truffle Chocolate Cake Slice",
        category: "Dessert",
        cuisine: "Bakery & Cakes",
        price: 170,
        rating: 4.8,
        reviews: "230+ reviews",
        restaurant: "Sweet Treats & Cravings",
        restaurantSlug: "sweet-treats",
        restaurantId: 5,
        location: "Sector 35, Chandigarh",
        image: "../assets/images/dishes/chocolate-cake.jpg",
        description: "Layers of moist Dutch chocolate sponge infused with rich silky dark chocolate ganache truffle.",
        longDescription: "Decadent layered dark chocolate cake layered with Belgian cocoa sponge, infused with velvety 60% dark chocolate ganache, and dusted with cocoa shavings."
    },

    "red-velvet-cake": {
        name: "Red Velvet Cheesecake Slice",
        category: "Dessert",
        cuisine: "Bakery & Cakes",
        price: 190,
        rating: 4.8,
        reviews: "175+ reviews",
        restaurant: "Sweet Treats & Cravings",
        restaurantSlug: "sweet-treats",
        restaurantId: 5,
        location: "Sector 35, Chandigarh",
        image: "../assets/images/dishes/red-velvet-cake.jpg",
        description: "Crimson red velvet sponge layered with smooth baked Philadelphia cream cheese frosting.",
        longDescription: "Rich and vibrant red velvet cake layered with silky whipped cream cheese frosting, hint of vanilla bean and light cocoa undertones."
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
    "../assets/images/dishes/chocolate-brownie.jpg",
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
        image: "../assets/images/dishes/amritsari-naan.jpg",
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
        image: "../assets/images/dishes/golgappe.jpg",
        description: "Crunchy semolina puris with spicy mint water, potato-chickpea mash and sweet tamarind.",
        longDescription: "Crispy hollow puri balls filled with mashed potatoes, black chickpeas, sweet date-tamarind chutney, and dipped into ice-cold spicy mint-coriander water for an explosion of flavors."
    },

    "amritsari-kulcha-and-chole": {
        name: "Amritsari Kulcha & Chole",
        category: "North Indian",
        cuisine: "Punjabi",
        price: 140,
        rating: 4.8,
        reviews: "140+ reviews",
        restaurant: "Kulcha Junction",
        restaurantSlug: "kulcha-junction",
        location: "Sector 22, Chandigarh",
        image: "../assets/images/dishes/amritsari-naan.jpg",
        description: "Flaky layered tandoor-baked kulcha with spiced Amritsari chole and butter.",
        longDescription: "Authentic Amritsari stuffed kulcha made with spiced potato and paneer stuffing, roasted in a clay tandoor until golden and crispy, served with slow-cooked dark chole and spicy tamarind onion relish."
    },

    "crispy-golgappe-pani-puri": {
        name: "Crispy Golgappe (Pani Puri)",
        category: "Street Food",
        cuisine: "Street Food",
        price: 80,
        rating: 4.9,
        reviews: "210+ reviews",
        restaurant: "Chaat Chaska",
        restaurantSlug: "chaat-chaska",
        location: "Sector 34, Chandigarh",
        image: "../assets/images/dishes/golgappe.jpg",
        description: "Crunchy semolina puris with spicy mint water, potato-chickpea mash and sweet tamarind.",
        longDescription: "Crispy hollow puri balls filled with mashed potatoes, black chickpeas, sweet date-tamarind chutney, and dipped into ice-cold spicy mint-coriander water for an explosion of flavors."
    },

    "vegetable-dum-biryani": {
        name: "Vegetable Dum Biryani",
        category: "Biryani",
        cuisine: "North Indian & Mughlai",
        price: 180,
        rating: 4.6,
        reviews: "115+ reviews",
        restaurant: "Spice Garden",
        restaurantSlug: "spice-garden",
        restaurantId: 1,
        location: "Sector 17, Chandigarh",
        image: "../assets/images/dishes/veg-biryani.jpg",
        description: "Fragrant basmati rice layered with garden vegetables, saffron and whole spices in a sealed handi.",
        longDescription: "Authentic dum-cooked biryani made with aged basmati rice, farm fresh carrots, beans, green peas, and spiced paneer cubes, infused with saffron milk, ghee and rose water."
    },

    "tandoori-roasted-chicken": {
        name: "Tandoori Roasted Chicken",
        category: "North Indian",
        cuisine: "Tandoori & Mughlai",
        price: 260,
        rating: 4.8,
        reviews: "170+ reviews",
        restaurant: "Urban Tadka",
        restaurantSlug: "urban-tadka",
        restaurantId: 1,
        location: "Sector 17, Chandigarh",
        image: "../assets/images/dishes/tandoori-chicken.jpg",
        description: "Tender chicken marinated in spiced hung curd and roasted in clay tandoor.",
        longDescription: "Tender whole cuts of chicken marinated overnight in Kashmiri red chili, mustard oil, hung curd, ginger garlic and dry fenugreek, roasted over smoking tandoor coals."
    },

    "crispy-masala-dosa": {
        name: "Crispy Masala Dosa",
        category: "South Indian",
        cuisine: "South Indian",
        price: 110,
        rating: 4.7,
        reviews: "145+ reviews",
        restaurant: "Amritsari Junction",
        restaurantSlug: "amritsari-junction",
        restaurantId: 4,
        location: "Sector 22, Chandigarh",
        image: "../assets/images/dishes/masala-dosa.jpg",
        description: "Crispy fermented rice and lentil crepe stuffed with spiced mustard potato filling.",
        longDescription: "Golden, razor-crisp crepe made from traditionally fermented batter, filled with flavorful mashed potato masala tempered with mustard seeds and curry leaves. Served with coconut chutney and hot sambar."
    },

    "hot-gulab-jamun-2-pcs": {
        name: "Hot Gulab Jamun (2 pcs)",
        category: "Dessert",
        cuisine: "Traditional Sweets",
        price: 70,
        rating: 4.9,
        reviews: "230+ reviews",
        restaurant: "Sweet Treats & Cravings",
        restaurantSlug: "sweet-treats",
        restaurantId: 5,
        location: "Sector 35, Chandigarh",
        image: "../assets/images/dishes/gulab-jamun.jpg",
        description: "Soft mawa dumplings fried golden and soaked in green cardamom rose sugar syrup.",
        longDescription: "Authentic Khoya Gulab Jamuns handcrafted and fried in pure desi ghee, soaked in slow-simmered green cardamom and rosewater syrup, served piping hot."
    },

    "belgian-chocolate-thickshake": {
        name: "Belgian Chocolate Thickshake",
        category: "Dessert",
        cuisine: "Beverages & Shakes",
        price: 160,
        rating: 4.8,
        reviews: "185+ reviews",
        restaurant: "Sweet Treats & Cravings",
        restaurantSlug: "sweet-treats",
        restaurantId: 5,
        location: "Sector 35, Chandigarh",
        image: "../assets/images/dishes/chocolate-shake.jpg",
        description: "Rich blended shake crafted with Belgian dark chocolate, dairy cream and chocolate curls.",
        longDescription: "Extra thick and creamy milkshake blended with authentic Belgian cocoa, premium vanilla cream, chocolate ganache drizzle, and topped with shaved dark chocolate curls."
    },

    "belgian-waffle-with-chocolate": {
        name: "Belgian Waffle with Chocolate",
        category: "Dessert",
        cuisine: "Dessert & Bakery",
        price: 150,
        rating: 4.7,
        reviews: "155+ reviews",
        restaurant: "Sweet Treats & Cravings",
        restaurantSlug: "sweet-treats",
        restaurantId: 5,
        location: "Sector 35, Chandigarh",
        image: "../assets/images/dishes/waffle.jpg",
        description: "Crisp golden Belgian grid waffle smothered in melted chocolate sauce.",
        longDescription: "Freshly pressed crispy Belgian waffle with light fluffy interior, drenched with rich melted milk and dark chocolate sauce, dusted with powdered sugar."
    },

    "smoky-chicken-tikka-roll": {
        name: "Smoky Chicken Tikka Roll",
        category: "Street Food",
        cuisine: "North Indian / Rolls",
        price: 170,
        rating: 4.8,
        reviews: "160+ reviews",
        restaurant: "Rolls Mania & Fast Bites",
        restaurantSlug: "rolls-mania",
        restaurantId: 12,
        location: "Khanpur Chowk, Kharar",
        image: "../assets/images/dishes/kathi-roll.jpg",
        description: "Succulent tandoori chicken cubes with sliced red onions and zesty green chutney in flaky paratha.",
        longDescription: "Juicy charred chicken tikka pieces wrapped in hot crispy layered paratha with slivered red onions, lemon juice, chaat masala, and fresh mint coriander chutney."
    },

    "double-egg-double-chicken-roll": {
        name: "Double Egg Double Chicken Roll",
        category: "Street Food",
        cuisine: "North Indian / Rolls",
        price: 190,
        rating: 4.8,
        reviews: "175+ reviews",
        restaurant: "Rolls Mania & Fast Bites",
        restaurantSlug: "rolls-mania",
        restaurantId: 12,
        location: "Khanpur Chowk, Kharar",
        image: "../assets/images/dishes/kathi-roll.jpg",
        description: "Golden fried egg coated paratha packed with roasted juicy chicken tikka.",
        longDescription: "Flaky paratha coated with two beaten eggs on the tawa, rolled around a generous double portion of smoky chicken tikka, crunchy onions, and tangy sauce."
    },

    "cheesy-corn-and-jalapeno-roll": {
        name: "Cheesy Corn & Jalapeno Roll",
        category: "Street Food",
        cuisine: "Fusion / Rolls",
        price: 140,
        rating: 4.6,
        reviews: "125+ reviews",
        restaurant: "Rolls Mania & Fast Bites",
        restaurantSlug: "rolls-mania",
        restaurantId: 12,
        location: "Khanpur Chowk, Kharar",
        image: "../assets/images/dishes/kathi-roll.jpg",
        description: "Melted cheese, sweet corn, and spicy jalapeno relish rolled in crisp paratha.",
        longDescription: "Crisp flaky wrap loaded with melted mozzarella and cheddar cheese, sweet golden corn kernels, sliced pickled jalapenos, and a dash of oregano seasoning."
    },

    "peri-peri-masala-fries": {
        name: "Peri-Peri Masala Fries",
        category: "Fast Food",
        cuisine: "Fast Food",
        price: 90,
        rating: 4.5,
        reviews: "110+ reviews",
        restaurant: "Rolls Mania & Fast Bites",
        restaurantSlug: "rolls-mania",
        restaurantId: 12,
        location: "Khanpur Chowk, Kharar",
        image: "../assets/images/dishes/loaded-fries.jpg",
        description: "Crispy golden potato fries tossed in tangy peri-peri spice blend.",
        longDescription: "Thin-cut golden potato fries double fried for maximum crunch, tossed generously in spicy African bird's eye chili peri-peri spice rub, served with garlic dip."
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
        image: "../assets/images/dishes/kathi-roll.jpg",
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
        image: "../assets/images/dishes/dal-makhani.jpg",
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
        image: "../assets/images/dishes/kathi-roll.jpg",
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
        image: "../assets/images/dishes/amritsari-naan.jpg",
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
        image: "../assets/images/dishes/dal-makhani.jpg",
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
        image: "../assets/images/dishes/golgappe.jpg",
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
        image: "../assets/images/dishes/paneer-butter-masala.jpg",
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
        image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=900&q=85",
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
        image: "../assets/images/dishes/veg-biryani.jpg",
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
        image: "../assets/images/dishes/tandoori-chicken.jpg",
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
    },

    "amul-butter-pav-bhaji": {
        name: "Amul Butter Pav Bhaji",
        category: "Street Food",
        cuisine: "Mumbai Street Food",
        price: 120,
        rating: 4.8,
        reviews: "320+ reviews",
        restaurant: "Chaat Chaska",
        restaurantSlug: "chaat-chaska",
        restaurantId: 14,
        location: "Sector 34, Chandigarh",
        image: "../assets/images/dishes/pav-bhaji.jpg",
        description: "Slow-mashed spiced vegetable gravy loaded with Amul butter, served with 2 toasted pavs.",
        longDescription: "Authentic Mumbai style bhaji simmered with ripe tomatoes, potatoes, green peas and special pav bhaji spices, finished with a generous slab of golden Amul butter and served with soft, toasted butter pavs and diced onions."
    },

    "cheese-amul-pav-bhaji": {
        name: "Cheese Amul Pav Bhaji",
        category: "Street Food",
        cuisine: "Mumbai Street Food",
        price: 150,
        rating: 4.8,
        reviews: "210+ reviews",
        restaurant: "Chaat Chaska",
        restaurantSlug: "chaat-chaska",
        restaurantId: 14,
        location: "Sector 34, Chandigarh",
        image: "../assets/images/dishes/pav-bhaji.jpg",
        description: "Classic buttery bhaji blanketed with grated cheddar cheese and 2 butter toasted pavs.",
        longDescription: "Our signature rich vegetable bhaji topped with a thick blanket of freshly grated cheddar cheese and melted Amul butter, accompanied by toasted golden pavs."
    },

    "virgin-mint-mojito-cooler": {
        name: "Virgin Mint Mojito Cooler",
        category: "Beverages",
        cuisine: "Beverages & Coolers",
        price: 110,
        rating: 4.7,
        reviews: "185+ reviews",
        restaurant: "Urban Tadka",
        restaurantSlug: "urban-tadka",
        restaurantId: 1,
        location: "Sector 17, Chandigarh",
        image: "../assets/images/dishes/mojito.jpg",
        description: "Chilled sparkling cooler with muddled mint leaves, fresh lime juice and cane sweetness.",
        longDescription: "Refreshing handcrafted mocktail made with freshly crushed garden mint, tangy lime wedges, chilled sparkling soda, and pure cane sugar over cracked ice."
    },

    "adrak-elaichi-kulhad-chai": {
        name: "Adrak Elaichi Kulhad Chai",
        category: "Street Food",
        cuisine: "Chai & Street Bites",
        price: 40,
        rating: 4.9,
        reviews: "450+ reviews",
        restaurant: "Chai & Snacks Hub",
        restaurantSlug: "chai-and-snacks-hub",
        restaurantId: 15,
        location: "Sector 15, Chandigarh",
        image: "../assets/images/dishes/masala-chai.jpg",
        description: "Slow-brewed strong Assam tea infused with fresh ginger and fragrant green cardamom in kulhad.",
        longDescription: "Piping hot traditional Indian tea simmered patiently with hand-crushed fiery ginger and aromatic green cardamom pods, served in an earthy clay kulhad."
    },

    "warm-bun-maska-with-amul-butter": {
        name: "Warm Bun Maska with Amul Butter",
        category: "Street Food",
        cuisine: "Bakery & Cafe",
        price: 50,
        rating: 4.7,
        reviews: "290+ reviews",
        restaurant: "Chai & Snacks Hub",
        restaurantSlug: "chai-and-snacks-hub",
        restaurantId: 15,
        location: "Sector 15, Chandigarh",
        image: "../assets/images/dishes/bun-maska.jpg",
        description: "Soft fresh bakery bun generously slathered with salted Amul butter, toasted warm.",
        longDescription: "Pillowy soft Irani-style bakery bun sliced and packed with generous layers of salted Amul butter, served warm for dipping in hot kadak masala chai."
    },

    "paneer-stuffed-bread-pakora": {
        name: "Paneer Stuffed Bread Pakora",
        category: "Street Food",
        cuisine: "North Indian Street Food",
        price: 60,
        rating: 4.7,
        reviews: "230+ reviews",
        restaurant: "Chai & Snacks Hub",
        restaurantSlug: "chai-and-snacks-hub",
        restaurantId: 15,
        location: "Sector 15, Chandigarh",
        image: "../assets/images/dishes/bread-pakoda.jpg",
        description: "Besan-battered golden fried bread sandwich with spiced cottage cheese slab inside.",
        longDescription: "Crispy golden fried bread fritter coated in seasoned gram flour batter, encasing a thick slab of fresh malai paneer and zesty mint coriander chutney."
    },

    "thick-malai-lassi-in-clay-cup": {
        name: "Thick Malai Lassi in Clay Cup",
        category: "Beverages",
        cuisine: "Punjabi Traditional",
        price: 70,
        rating: 4.9,
        reviews: "380+ reviews",
        restaurant: "Chai & Snacks Hub",
        restaurantSlug: "chai-and-snacks-hub",
        restaurantId: 15,
        location: "Sector 15, Chandigarh",
        image: "../assets/images/dishes/punjabi-lassi.jpg",
        description: "Creamy churned sweet yogurt topped with thick malai and crushed pistachios.",
        longDescription: "Rich and creamy sweet yogurt traditionally churned with wooden madhani, served ice-cold in a clay cup crowned with a thick layer of fresh malai, saffron, and pistachios."
    },

    "bakery-suji-rusk-and-cookies": {
        name: "Bakery Suji Rusk & Cookies",
        category: "Street Food",
        cuisine: "Bakery & Bakes",
        price: 40,
        rating: 4.6,
        reviews: "150+ reviews",
        restaurant: "Chai & Snacks Hub",
        restaurantSlug: "chai-and-snacks-hub",
        restaurantId: 15,
        location: "Sector 15, Chandigarh",
        image: "../assets/images/dishes/rusk-cookies.jpg",
        description: "Crunchy oven-toasted cardamom suji rusks and butter cookies perfect for chai dipping.",
        longDescription: "Authentic double-baked crispy semolina rusks and delicate sweet butter cookies, made with fresh cream and cardamom, tailored for dipping into hot chai."
    },

    "tangy-mumbai-bhel-puri": {
        name: "Tangy Mumbai Bhel Puri",
        category: "Street Food",
        cuisine: "Mumbai Chaat",
        price: 80,
        rating: 4.7,
        reviews: "275+ reviews",
        restaurant: "Chaat Chaska",
        restaurantSlug: "chaat-chaska",
        restaurantId: 14,
        location: "Sector 34, Chandigarh",
        image: "../assets/images/dishes/bhel-puri.jpg",
        description: "Puffed rice tossed with peanuts, sev, diced onions, tomatoes and spicy tamarind chutney.",
        longDescription: "Crisp puffed rice, roasted peanuts, crunchy papdi, and golden gram flour sev mixed fresh with finely diced onions, tomatoes, fresh coriander, green chillies, and tangy tamarind saunth."
    },

    "dahi-bhalla-papdi-gujiya": {
        name: "Dahi Bhalla Papdi Gujiya",
        category: "Street Food",
        cuisine: "Delhi Chaat",
        price: 95,
        rating: 4.8,
        reviews: "340+ reviews",
        restaurant: "Chaat Chaska",
        restaurantSlug: "chaat-chaska",
        restaurantId: 14,
        location: "Sector 34, Chandigarh",
        image: "../assets/images/dishes/dahi-bhalla.jpg",
        description: "Melt-in-mouth lentil dumplings soaked in creamy sweet yogurt with roasted cumin and saunth.",
        longDescription: "Soft melt-in-mouth urad dal dumplings soaked in chilled whipped sweetened curd, crowned with crispy papdi, sweet tamarind chutney, spicy mint glaze, and roasted cumin powder."
    },

    "desi-shikanji-masala-soda": {
        name: "Desi Shikanji Masala Soda",
        category: "Beverages",
        cuisine: "Traditional Coolers",
        price: 60,
        rating: 4.7,
        reviews: "195+ reviews",
        restaurant: "Chaat Chaska",
        restaurantSlug: "chaat-chaska",
        restaurantId: 14,
        location: "Sector 34, Chandigarh",
        image: "../assets/images/dishes/shikanji.jpg",
        description: "Chilled fizzing lemon soda with roasted jeera, rock salt, mint and lemon juice.",
        longDescription: "Sparkling street-style refreshing cooler made with freshly squeezed lemon juice, crushed roasted cumin, black rock salt, mint, and soda water."
    },

    "special-double-cheese-maggi": {
        name: "Special Double Cheese Maggi",
        category: "Street Food",
        cuisine: "Street Bites",
        price: 90,
        rating: 4.7,
        reviews: "260+ reviews",
        restaurant: "Chai & Snacks Hub",
        restaurantSlug: "chai-and-snacks-hub",
        restaurantId: 15,
        location: "Sector 15, Chandigarh",
        image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=900&q=85",
        description: "2-minute noodles cooked with buttery veggies, oregano herbs and shredded mozzarella.",
        longDescription: "Classic spicy instant noodles prepared with butter, sautéed green peas, sweet corn, bell peppers, oregano seasoning, and melted double mozzarella cheese."
    },

    "kadhai-paneer-special": {
        name: "Kadhai Paneer Special",
        category: "North Indian",
        cuisine: "Punjabi Dhaba",
        price: 280,
        rating: 4.7,
        reviews: "190+ reviews",
        restaurant: "Katani Dhaba",
        restaurantSlug: "katani-dhaba",
        restaurantId: 6,
        location: "Phase 3B2, Mohali",
        image: "../assets/images/dishes/paneer-butter-masala.jpg",
        description: "Fresh cottage cheese cooked with freshly ground kadhai masala, bell peppers and onion.",
        longDescription: "Succulent paneer cubes tossed with chunky capsicum, onions, and slow-simmered in rich tomato gravy flavored with freshly pounded coriander seeds and Kashmiri red chillies."
    },

    "desi-ghee-jalebi-with-rabri": {
        name: "Desi Ghee Jalebi with Rabri",
        category: "Dessert",
        cuisine: "Traditional Sweets",
        price: 120,
        rating: 4.9,
        reviews: "310+ reviews",
        restaurant: "Sweet Treats & Cravings",
        restaurantSlug: "sweet-treats",
        restaurantId: 5,
        location: "Sector 35, Chandigarh",
        image: "../assets/images/dishes/jalebi.jpg",
        description: "Spiral golden crisp jalebis fried in pure desi ghee, served with thick chilled malai rabri.",
        longDescription: "Hot and crunchy fermented spiral jalebis fried in pure desi ghee, dunked in saffron syrup, served alongside rich, creamy slow-simmered malai rabri."
    },

    "kesar-pista-rasmalai": {
        name: "Kesar Pista Rasmalai",
        category: "Dessert",
        cuisine: "Bengali Sweets",
        price: 110,
        rating: 4.9,
        reviews: "280+ reviews",
        restaurant: "Sweet Treats & Cravings",
        restaurantSlug: "sweet-treats",
        restaurantId: 5,
        location: "Sector 35, Chandigarh",
        image: "../assets/images/dishes/rasmalai.jpg",
        description: "Spongy cottage cheese patties steeped in chilled saffron cardamom milk with chopped pistachios.",
        longDescription: "Delicate and airy poached chenna patties soaked in chilled, rich condensed milk infused with Kashmiri saffron, green cardamom, and garnished with roasted pistachios."
    },

    "kolkata-sweet-spongy-rasgulla": {
        name: "Kolkata Sweet Spongy Rasgulla",
        category: "Dessert",
        cuisine: "Bengali Sweets",
        price: 90,
        rating: 4.8,
        reviews: "220+ reviews",
        restaurant: "Sweet Treats & Cravings",
        restaurantSlug: "sweet-treats",
        restaurantId: 5,
        location: "Sector 35, Chandigarh",
        image: "../assets/images/dishes/rasgulla.jpg",
        description: "Pillowy soft spongy chenna dumplings soaked in light rose and cardamom flavored sugar syrup.",
        longDescription: "Traditional soft and melt-in-mouth cottage cheese balls cooked in light sugar syrup delicately infused with rose water and cardamom."
    },

    "fresh-strawberry-shake": {
        name: "Fresh Strawberry Shake",
        category: "Dessert",
        cuisine: "Shakes & Beverages",
        price: 130,
        rating: 4.7,
        reviews: "165+ reviews",
        restaurant: "Sweet Treats & Cravings",
        restaurantSlug: "sweet-treats",
        restaurantId: 5,
        location: "Sector 35, Chandigarh",
        image: "../assets/images/dishes/strawberry-shake.jpg",
        description: "Thick creamy shake blended with real strawberries, sweet cream and vanilla ice cream.",
        longDescription: "Velvety pink thickshake blended with succulent fresh strawberries, chilled whole milk, rich cream, and premium French vanilla bean gelato."
    },

    "kurkure-fried-chicken-momos": {
        name: "Kurkure Fried Chicken Momos",
        category: "Chinese",
        cuisine: "Tibetan & Fusion",
        price: 160,
        rating: 4.8,
        reviews: "245+ reviews",
        restaurant: "Wok Express",
        restaurantSlug: "wok-express",
        restaurantId: 3,
        location: "Sector 35, Chandigarh",
        image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=900&q=85",
        description: "Extra crunchy crumb-coated fried momos served piping hot with fiery garlic mayonnaise.",
        longDescription: "Crispy coated seasoned fried momos with a crunchy exterior and juicy minced chicken interior, served with fiery chili-garlic dipping sauce and creamy mayo."
    },

    "four-cheese-garlic-bread": {
        name: "Four-Cheese Garlic Bread",
        category: "Pizza",
        cuisine: "Italian",
        price: 160,
        rating: 4.8,
        reviews: "215+ reviews",
        restaurant: "Pizza Corner",
        restaurantSlug: "pizza-corner",
        restaurantId: 2,
        location: "Sector 34, Chandigarh",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85",
        description: "Artisan toasted baguette smothered in roasted garlic butter, topped with 4 melted cheeses.",
        longDescription: "Freshly baked artisan baguette loaded with herb-infused roasted garlic butter and topped with a bubbly blend of mozzarella, cheddar, gouda, and parmesan."
    },

    "creamy-penne-alfredo-pasta": {
        name: "Creamy Penne Alfredo Pasta",
        category: "Pizza",
        cuisine: "Italian",
        price: 240,
        rating: 4.6,
        reviews: "175+ reviews",
        restaurant: "Pizza Corner",
        restaurantSlug: "pizza-corner",
        restaurantId: 2,
        location: "Sector 34, Chandigarh",
        image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=900&q=85",
        description: "Al dente penne pasta tossed in rich parmesan garlic white cream sauce with herbs.",
        longDescription: "Classic Italian comfort food featuring tender penne pasta simmered in rich creamy butter, heavy cream, garlic, fresh basil, and grated aged parmesan."
    },

    "smoky-grilled-chicken-wings": {
        name: "Smoky Grilled Chicken Wings",
        category: "Burger",
        cuisine: "American Barbecue",
        price: 290,
        rating: 4.7,
        reviews: "210+ reviews",
        restaurant: "Burger House",
        restaurantSlug: "burger-house",
        restaurantId: 4,
        location: "Phase 7, Mohali",
        image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=85",
        description: "Juicy charcoal grilled chicken wings coated in sticky smoky barbecue glaze.",
        longDescription: "Tender chicken wings slow-smoked over hickory embers, tossed in rich sweet and tangy barbecue glaze, served with creamy blue cheese dip."
    }


};

/* ==========================================
   AUTHENTIC FOOD IMAGE RESOLVER
   Ensures every dish has its true matching photo
   and prevents generic placeholder fallback
========================================== */

function resolveDishImage(dishName = "", category = "", existingUrl = "") {
    const text = (dishName + " " + category).toLowerCase();

    // 1. Rolls & Wraps - ALWAYS match authentic roll photo
    if (text.includes("roll") || text.includes("kathi") || text.includes("wrap") || text.includes("shawarma")) {
        return "../assets/images/dishes/kathi-roll.jpg";
    }

    // 2. Fries & Loaded Fries - ALWAYS before burger so fries never display as burger!
    if (text.includes("fries") || text.includes("french fries") || text.includes("peri-peri") || text.includes("loaded fries")) {
        return "../assets/images/dishes/loaded-fries.jpg";
    }

    // 3. Shakes, Thickshakes, Smoothies & Cold Coffee - ALWAYS match authentic tall glass shake photo
    if (text.includes("shake") || text.includes("thickshake") || text.includes("smoothie") || text.includes("cold coffee") || text.includes("frappe")) {
        if (text.includes("strawberry") || text.includes("berry") || text.includes("fruit")) {
            return "../assets/images/dishes/strawberry-shake.jpg";
        }
        return "../assets/images/dishes/chocolate-shake.jpg";
    }

    // 4. Waffles & Crepes
    if (text.includes("waffle") || text.includes("waffles") || text.includes("crepe")) {
        return "../assets/images/dishes/waffle.jpg";
    }

    // 5. Traditional Halwa
    if (text.includes("halwa") || text.includes("moong dal") || text.includes("kesari")) {
        return "../assets/images/dishes/moong-dal-halwa.jpg";
    }

    // 6. Shahi Tukda / Tukra
    if (text.includes("shahi tukda") || text.includes("shahi tukra") || text.includes("tukda") || text.includes("tukra")) {
        return "../assets/images/dishes/shahi-tukda.jpg";
    }

    // 7. Matka Phirni & Kheer
    if (text.includes("phirni") || text.includes("firni") || text.includes("kheer")) {
        return "../assets/images/dishes/matka-kesar-phirni.jpg";
    }

    // 8. Other Indian Sweets: Gulab Jamun, Jalebi, Rasgulla, Rasmalai
    if (text.includes("gulab jamun") || text.includes("jamun")) {
        return "../assets/images/dishes/gulab-jamun.jpg";
    }
    if (text.includes("jalebi") || text.includes("rabri")) {
        return "../assets/images/dishes/jalebi.jpg";
    }
    if (text.includes("rasgulla")) {
        return "../assets/images/dishes/rasgulla.jpg";
    }
    if (text.includes("rasmalai")) {
        return "../assets/images/dishes/rasmalai.jpg";
    }

    // 9. Cakes & Pastries - Match specific requested cake flavours!
    if (text.includes("red velvet")) {
        return "../assets/images/dishes/red-velvet-cake.jpg";
    }
    if (text.includes("cheesecake")) {
        return "../assets/images/dishes/cheesecake.jpg";
    }
    if (text.includes("truffle") || (text.includes("chocolate") && text.includes("cake")) || text.includes("fudge cake") || text.includes("choco lava")) {
        return "../assets/images/dishes/chocolate-cake.jpg";
    }
    if (text.includes("brownie") || text.includes("fudge")) {
        return "../assets/images/dishes/chocolate-brownie.jpg";
    }
    if (text.includes("cake") || text.includes("pastry")) {
        return "../assets/images/dishes/pastry-cake.jpg";
    }

    // 10. Amritsari Naan & Kulcha Thalis
    if (text.includes("naan") || text.includes("kulcha") || text.includes("chhole") || text.includes("chole") || text.includes("bhatur")) {
        return "../assets/images/dishes/amritsari-naan.jpg";
    }

    // 11. Paneer Curries
    if (text.includes("paneer butter") || text.includes("shahi paneer") || text.includes("kadai paneer") || text.includes("kadhai paneer") || text.includes("matar paneer")) {
        return "../assets/images/dishes/paneer-butter-masala.jpg";
    }

    // 12. Biryani & Pulao
    if (text.includes("biryani") || text.includes("pulao")) {
        if (text.includes("chicken") || text.includes("mutton") || text.includes("gosht")) {
            return "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=900&q=85";
        }
        return "../assets/images/dishes/veg-biryani.jpg";
    }

    // 13. Tandoori Chicken
    if (text.includes("tandoori chicken") || text.includes("tandoori murgh") || (text.includes("tandoori") && text.includes("chicken"))) {
        return "../assets/images/dishes/tandoori-chicken.jpg";
    }

    // 14. Dosa & South Indian
    if (text.includes("dosa") || text.includes("uttapam") || text.includes("idli")) {
        return "../assets/images/dishes/masala-dosa.jpg";
    }

    // 15. Butter Chicken
    if (text.includes("butter chicken") || text.includes("makhani chicken") || text.includes("murgh makhani")) {
        return "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=85";
    }

    // 16. Dal Makhani & Lentils
    if (text.includes("dal makhani") || text.includes("makhani dal") || text.includes("bukhara") || text.includes("black lentil") || text.includes("daal") || text.includes("dal handi")) {
        return "../assets/images/dishes/dal-makhani.jpg";
    }

    // 17. Pizzas
    if (text.includes("pizza") || text.includes("margherita") || text.includes("mozzarella")) {
        if (text.includes("peri") || text.includes("paneer") || text.includes("spic")) {
            return "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=900&q=85";
        }
        return "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=85";
    }

    // 18. Burgers (strictly checked after fries!)
    if (text.includes("burger") || text.includes("cheeseburger") || text.includes("zinger") || text.includes("smash")) {
        if (text.includes("smash")) {
            return "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=85";
        }
        return "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85";
    }

    // 19. Momos & Dim Sum
    if (text.includes("momo") || text.includes("dimsum") || text.includes("dumpling")) {
        return "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=900&q=85";
    }

    // 20. Noodles & Chinese
    if (text.includes("noodle") || text.includes("hakka") || text.includes("chowmein") || text.includes("schezwan") || text.includes("manchurian") || text.includes("chinese")) {
        return "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=85";
    }

    // 21. Pav Bhaji
    if (text.includes("pav bhaji") || text.includes("pav bhaaji") || text.includes("bhaji pav")) {
        return "../assets/images/dishes/pav-bhaji.jpg";
    }

    // 22. Chaat, Golgappe, Bhel Puri & Dahi Bhalla
    if (text.includes("bhel puri") || text.includes("bhelpuri") || text.includes("sev puri")) {
        return "../assets/images/dishes/bhel-puri.jpg";
    }
    if (text.includes("dahi bhalla") || text.includes("dahi papdi") || text.includes("dahi vada") || text.includes("dahi puri") || text.includes("raj kachori") || text.includes("gujiya")) {
        return "../assets/images/dishes/dahi-bhalla.jpg";
    }
    if (text.includes("golgapp") || text.includes("pani puri") || text.includes("puchka")) {
        return "../assets/images/dishes/golgappe.jpg";
    }
    if (text.includes("chaat") || text.includes("tikki") || text.includes("papdi")) {
        return "../assets/images/dishes/dahi-bhalla.jpg";
    }

    // 23. Chai, Bun Maska, Pakoda & Bakery
    if (text.includes("bun maska") && text.includes("chai")) {
        return "../assets/images/dishes/chai-bun-maska.jpg";
    }
    if (text.includes("bun maska") || (text.includes("bun") && text.includes("butter"))) {
        return "../assets/images/dishes/bun-maska.jpg";
    }
    if (text.includes("bread pakoda") || text.includes("bread pakora") || text.includes("pakoda") || text.includes("pakora")) {
        return "../assets/images/dishes/bread-pakoda.jpg";
    }
    if (text.includes("chai") || text.includes("tea") || text.includes("kulhad")) {
        return "../assets/images/dishes/masala-chai.jpg";
    }
    if (text.includes("rusk") || text.includes("cookie") || text.includes("cookies") || text.includes("biscuit")) {
        return "../assets/images/dishes/rusk-cookies.jpg";
    }

    // 24. Lassi, Shikanji & Mojito Coolers
    if (text.includes("lassi") || text.includes("chaas") || text.includes("buttermilk")) {
        return "../assets/images/dishes/punjabi-lassi.jpg";
    }
    if (text.includes("shikanji") || text.includes("nimbu paani") || text.includes("masala soda") || text.includes("lemon soda")) {
        return "../assets/images/dishes/shikanji.jpg";
    }
    if (text.includes("mojito") || text.includes("mint cooler") || text.includes("virgin mojito")) {
        return "../assets/images/dishes/mojito.jpg";
    }

    // 25. Maggi
    if (text.includes("maggi")) {
        return "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=900&q=85";
    }

    // 26. Pasta
    if (text.includes("pasta") || text.includes("arrabbiata") || text.includes("alfredo") || text.includes("penne")) {
        return "https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=900&q=85";
    }

    // Check if existingUrl is valid and not bad
    if (existingUrl && typeof existingUrl === "string" && !existingUrl.includes("photo-1504674900247-0877df9cc836") && !existingUrl.includes("photo-1555396273-367ea4eb4db5") && !existingUrl.includes("photo-1529006557810-274b9b2fc783") && !existingUrl.includes("photo-1544145945-f90425340c7e") && !existingUrl.includes("photo-1551183053-bf91a1d81141")) {
        if (existingUrl.startsWith("/assets/images/dishes/")) {
            return "../assets/images/dishes/" + existingUrl.split("/").pop();
        }
        return existingUrl;
    }

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

