-- =====================================================================
-- CraveSpot Production Database Schema
-- Database Name: project (Default, configurable via .env)
-- Version: 2.0.0
-- Description: Fully normalized relational schema supporting:
--   - User accounts, profiles & dietary preferences
--   - Restaurants & geolocation coordinates
--   - Multi-cuisine mappings
--   - Food categories & detailed food items with taste/texture tags
--   - Craving-based discovery taxonomy
--   - User favorites, search history & ratings/reviews
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `project`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE `project`;

-- ---------------------------------------------------------------------
-- 1. Table: users
-- Core authentication table storing user credentials.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
    `user_id`         INT AUTO_INCREMENT PRIMARY KEY,
    `name`            VARCHAR(150) NOT NULL,
    `email`           VARCHAR(150) NOT NULL UNIQUE,
    `password`        VARCHAR(255) NOT NULL,
    `phone`           VARCHAR(20) DEFAULT NULL,
    `role`            ENUM('user', 'admin', 'vendor') NOT NULL DEFAULT 'user',
    `is_active`       TINYINT(1) NOT NULL DEFAULT 1,
    `last_login`      DATETIME DEFAULT NULL,
    `created_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. Table: user_profiles
-- Extended user profile information (bio, address, avatar).
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_profiles` (
    `profile_id`      INT AUTO_INCREMENT PRIMARY KEY,
    `user_id`         INT NOT NULL UNIQUE,
    `avatar_url`      VARCHAR(500) DEFAULT NULL,
    `bio`             VARCHAR(500) DEFAULT NULL,
    `city`            VARCHAR(100) DEFAULT 'Chandigarh',
    `address`         VARCHAR(255) DEFAULT NULL,
    `default_radius`  INT NOT NULL DEFAULT 10,
    `created_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_profile_user`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. Table: user_preferences
-- Saved dining preferences for personalized craving discovery.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_preferences` (
    `pref_id`         INT AUTO_INCREMENT PRIMARY KEY,
    `user_id`         INT NOT NULL UNIQUE,
    `dietary`         ENUM('all', 'veg', 'non_veg', 'vegan') NOT NULL DEFAULT 'all',
    `spice_level`     ENUM('any', 'mild', 'medium', 'spicy', 'extra_spicy') NOT NULL DEFAULT 'any',
    `budget_tier`     ENUM('any', 'budget', 'moderate', 'premium') NOT NULL DEFAULT 'any',
    `favorite_tags`   VARCHAR(500) DEFAULT 'pizza,biryani,momos,burgers',
    `created_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_pref_user`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. Table: food_categories
-- Primary food taxonomy categories.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `food_categories` (
    `category_id`     INT AUTO_INCREMENT PRIMARY KEY,
    `name`            VARCHAR(100) NOT NULL UNIQUE,
    `slug`            VARCHAR(100) NOT NULL UNIQUE,
    `description`     TEXT DEFAULT NULL,
    `icon`            VARCHAR(50) DEFAULT 'utensils',
    `image_url`       VARCHAR(500) DEFAULT NULL,
    `display_order`   INT DEFAULT 0,
    `created_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Backward compatibility alias
CREATE TABLE IF NOT EXISTS `categories` (
    `category_id`     INT AUTO_INCREMENT PRIMARY KEY,
    `name`            VARCHAR(100) NOT NULL UNIQUE,
    `description`     TEXT DEFAULT NULL,
    `image_url`       VARCHAR(500) DEFAULT NULL,
    `created_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. Table: cuisines
-- Regional and cultural cuisine classifications.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `cuisines` (
    `cuisine_id`      INT AUTO_INCREMENT PRIMARY KEY,
    `name`            VARCHAR(100) NOT NULL UNIQUE,
    `slug`            VARCHAR(100) NOT NULL UNIQUE,
    `description`     VARCHAR(255) DEFAULT NULL,
    `image_url`       VARCHAR(500) DEFAULT NULL,
    `created_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 6. Table: cravings
-- Taxonomy of cravings for smart natural language matching.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `cravings` (
    `craving_id`      INT AUTO_INCREMENT PRIMARY KEY,
    `title`           VARCHAR(100) NOT NULL UNIQUE,
    `slug`            VARCHAR(100) NOT NULL UNIQUE,
    `mood`            VARCHAR(100) NOT NULL,
    `taste_profile`   VARCHAR(100) NOT NULL,
    `texture`         VARCHAR(100) NOT NULL,
    `icon`            VARCHAR(50) DEFAULT 'sparkles',
    `description`     VARCHAR(255) NOT NULL,
    `keywords`        TEXT NOT NULL,
    `created_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 7. Table: restaurants
-- Master restaurant directory.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurants` (
    `restaurant_id`       INT AUTO_INCREMENT PRIMARY KEY,
    `name`                VARCHAR(150) NOT NULL,
    `slug`                VARCHAR(150) DEFAULT NULL,
    `cuisine`             VARCHAR(150) NOT NULL,
    `address`             VARCHAR(255) NOT NULL,
    `rating`              DECIMAL(2, 1) NOT NULL DEFAULT 0.0,
    `review_count`        INT NOT NULL DEFAULT 0,
    `price_for_two`       INT NOT NULL DEFAULT 400,
    `is_veg`              TINYINT(1) NOT NULL DEFAULT 0,
    `is_pure_veg`         TINYINT(1) NOT NULL DEFAULT 0,
    `is_open_now`         TINYINT(1) NOT NULL DEFAULT 1,
    `offer`               VARCHAR(100) DEFAULT NULL,
    `phone`               VARCHAR(50) DEFAULT NULL,
    `email`               VARCHAR(100) DEFAULT NULL,
    `website`             VARCHAR(255) DEFAULT NULL,
    `opening_hours`       VARCHAR(150) DEFAULT '11:00 AM - 11:00 PM',
    `cover_image`         VARCHAR(500) DEFAULT NULL,
    `image_url`           VARCHAR(500) DEFAULT NULL,
    `latitude`            DECIMAL(10, 8) DEFAULT NULL,
    `longitude`           DECIMAL(11, 8) DEFAULT NULL,
    `created_at`          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_restaurants_cuisine` (`cuisine`),
    INDEX `idx_restaurants_rating` (`rating`),
    INDEX `idx_restaurants_is_veg` (`is_veg`),
    INDEX `idx_restaurants_price` (`price_for_two`),
    INDEX `idx_restaurants_coords` (`latitude`, `longitude`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 8. Table: restaurant_locations
-- Detailed physical locations, area, city, and pincode.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurant_locations` (
    `location_id`     INT AUTO_INCREMENT PRIMARY KEY,
    `restaurant_id`   INT NOT NULL,
    `address_line1`   VARCHAR(255) NOT NULL,
    `locality`        VARCHAR(150) NOT NULL,
    `city`            VARCHAR(100) NOT NULL DEFAULT 'Chandigarh',
    `state`           VARCHAR(100) NOT NULL DEFAULT 'Punjab/Chandigarh',
    `pincode`         VARCHAR(20) DEFAULT NULL,
    `latitude`        DECIMAL(10, 8) NOT NULL,
    `longitude`       DECIMAL(11, 8) NOT NULL,
    `directions_note` VARCHAR(255) DEFAULT NULL,
    `created_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_loc_city` (`city`),
    INDEX `idx_loc_locality` (`locality`),
    INDEX `idx_loc_coords` (`latitude`, `longitude`),
    CONSTRAINT `fk_loc_restaurant`
        FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`restaurant_id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 9. Table: restaurant_cuisines
-- Many-to-many relationship between restaurants and cuisines.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurant_cuisines` (
    `restaurant_id`   INT NOT NULL,
    `cuisine_id`      INT NOT NULL,
    PRIMARY KEY (`restaurant_id`, `cuisine_id`),
    CONSTRAINT `fk_rc_restaurant`
        FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`restaurant_id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_rc_cuisine`
        FOREIGN KEY (`cuisine_id`) REFERENCES `cuisines` (`cuisine_id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 10. Table: food_items (and menu_items)
-- Detailed dish attributes for smart craving matching.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `food_items` (
    `item_id`         INT AUTO_INCREMENT PRIMARY KEY,
    `restaurant_id`   INT NOT NULL,
    `category_id`     INT DEFAULT NULL,
    `cuisine_id`      INT DEFAULT NULL,
    `name`            VARCHAR(150) NOT NULL,
    `category`        VARCHAR(100) DEFAULT NULL,
    `description`     TEXT DEFAULT NULL,
    `price`           DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `is_veg`          TINYINT(1) NOT NULL DEFAULT 0,
    `spice_level`     ENUM('mild', 'medium', 'spicy', 'extra_spicy') DEFAULT 'medium',
    `taste_profile`   VARCHAR(100) DEFAULT 'savory',
    `texture`         VARCHAR(100) DEFAULT 'tender',
    `tags`            TEXT DEFAULT NULL,
    `rating`          DECIMAL(2, 1) NOT NULL DEFAULT 0.0,
    `is_bestseller`   TINYINT(1) NOT NULL DEFAULT 0,
    `is_available`    TINYINT(1) NOT NULL DEFAULT 1,
    `image_url`       VARCHAR(500) DEFAULT NULL,
    `created_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_food_restaurant` (`restaurant_id`),
    INDEX `idx_food_category` (`category_id`),
    INDEX `idx_food_price` (`price`),
    INDEX `idx_food_is_veg` (`is_veg`),
    INDEX `idx_food_taste` (`taste_profile`),
    INDEX `idx_food_texture` (`texture`),
    CONSTRAINT `fk_food_restaurant`
        FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`restaurant_id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_food_category`
        FOREIGN KEY (`category_id`) REFERENCES `food_categories` (`category_id`)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_food_cuisine`
        FOREIGN KEY (`cuisine_id`) REFERENCES `cuisines` (`cuisine_id`)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Maintained menu_items table with identical structure for backward compatibility
CREATE TABLE IF NOT EXISTS `menu_items` (
    `item_id`         INT AUTO_INCREMENT PRIMARY KEY,
    `restaurant_id`   INT NOT NULL,
    `category_id`     INT DEFAULT NULL,
    `name`            VARCHAR(150) NOT NULL,
    `category`        VARCHAR(100) DEFAULT NULL,
    `description`     TEXT DEFAULT NULL,
    `price`           DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `image_url`       VARCHAR(500) DEFAULT NULL,
    `is_veg`          TINYINT(1) NOT NULL DEFAULT 0,
    `rating`          DECIMAL(2, 1) NOT NULL DEFAULT 0.0,
    `created_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_menu_restaurant` (`restaurant_id`),
    INDEX `idx_menu_category_id` (`category_id`),
    INDEX `idx_menu_category_name` (`category`),
    INDEX `idx_menu_price` (`price`),
    INDEX `idx_menu_is_veg` (`is_veg`),
    CONSTRAINT `fk_menu_restaurant`
        FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`restaurant_id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 11. Table: favorites
-- User wishlist and bookmarks for restaurants and specific dishes.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `favorites` (
    `favorite_id`     INT AUTO_INCREMENT PRIMARY KEY,
    `user_id`         INT NOT NULL,
    `restaurant_id`   INT DEFAULT NULL,
    `item_id`         INT DEFAULT NULL,
    `created_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uq_user_restaurant` (`user_id`, `restaurant_id`),
    INDEX `idx_fav_user` (`user_id`),
    INDEX `idx_fav_restaurant` (`restaurant_id`),
    CONSTRAINT `fk_fav_user`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_fav_restaurant`
        FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`restaurant_id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_fav_item`
        FOREIGN KEY (`item_id`) REFERENCES `food_items` (`item_id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 12. Table: search_history
-- Records user queries to generate recent searches and personalized insights.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `search_history` (
    `history_id`      INT AUTO_INCREMENT PRIMARY KEY,
    `user_id`         INT DEFAULT NULL,
    `session_id`      VARCHAR(100) DEFAULT NULL,
    `query`           VARCHAR(255) NOT NULL,
    `craving_tag`     VARCHAR(100) DEFAULT NULL,
    `latitude`        DECIMAL(10, 8) DEFAULT NULL,
    `longitude`       DECIMAL(11, 8) DEFAULT NULL,
    `results_count`   INT DEFAULT 0,
    `created_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_search_user` (`user_id`),
    INDEX `idx_search_created` (`created_at`),
    CONSTRAINT `fk_search_user`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 13. Table: reviews
-- Customer feedback, star rating, and testimonials.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `reviews` (
    `review_id`       INT AUTO_INCREMENT PRIMARY KEY,
    `restaurant_id`   INT NOT NULL,
    `user_id`         INT DEFAULT NULL,
    `user_name`       VARCHAR(150) NOT NULL,
    `rating`          INT NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
    `comment`         TEXT DEFAULT NULL,
    `created_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_reviews_restaurant` (`restaurant_id`),
    INDEX `idx_reviews_user` (`user_id`),
    CONSTRAINT `fk_reviews_restaurant`
        FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`restaurant_id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_reviews_user`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- SEED DATA
-- =====================================================================

-- Cuisines Seed
INSERT INTO `cuisines` (`cuisine_id`, `name`, `slug`, `description`, `image_url`)
SELECT * FROM (
    SELECT 1 AS `cuisine_id`, 'North Indian' AS `name`, 'north-indian' AS `slug`, 'Rich, aromatic curries, breads and tandoori grills' AS `description`, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80' AS `image_url` UNION ALL
    SELECT 2, 'Italian', 'italian', 'Wood-fired pizzas, handmade pastas and risottos', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80' UNION ALL
    SELECT 3, 'Chinese & Asian', 'chinese-asian', 'Wok-tossed noodles, dim sums, and spicy chilli garlic delights', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80' UNION ALL
    SELECT 4, 'Fast Food', 'fast-food', 'Crispy burgers, peri-peri fries, wraps, and quick snacks', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80' UNION ALL
    SELECT 5, 'Mughlai & Biryani', 'mughlai-biryani', 'Slow-cooked royal biryanis, aromatic saffron rice and rich gravies', 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=400&q=80' UNION ALL
    SELECT 6, 'Bakery & Desserts', 'bakery-desserts', 'Artisanal cakes, brownies, waffles, and traditional sweets', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=400&q=80'
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM `cuisines` LIMIT 1);

-- Categories Seed
INSERT INTO `food_categories` (`category_id`, `name`, `slug`, `description`, `icon`, `image_url`, `display_order`)
SELECT * FROM (
    SELECT 1 AS `category_id`, 'Biryani' AS `name`, 'biryani' AS `slug`, 'Aromatic dum-cooked basmati rice' AS `description`, 'bowl-rice' AS `icon`, 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=400&q=80' AS `image_url`, 1 AS `display_order` UNION ALL
    SELECT 2, 'Pizza', 'pizza', 'Cheesy handcrafted pizzas and flatbreads', 'pizza-slice', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80', 2 UNION ALL
    SELECT 3, 'Burger', 'burger', 'Juicy grilled and crispy burgers', 'burger', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80', 3 UNION ALL
    SELECT 4, 'Chinese & Momos', 'chinese-momos', 'Steamed momos, chilli noodles & wok items', 'chopsticks', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80', 4 UNION ALL
    SELECT 5, 'North Indian Curries', 'north-indian', 'Paneer butter masala, dal makhani, breads', 'utensils', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80', 5 UNION ALL
    SELECT 6, 'Desserts & Sweets', 'desserts', 'Chocolate brownies, gulab jamun, sundaes', 'cookie', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=400&q=80', 6 UNION ALL
    SELECT 7, 'Street Food & Snacks', 'street-food', 'Loaded fries, chaat, rolls and bites', 'fire', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=400&q=80', 7 UNION ALL
    SELECT 8, 'Beverages & Shakes', 'beverages', 'Thick shakes, iced coffees and coolers', 'glass-water', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=400&q=80', 8
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM `food_categories` LIMIT 1);

-- Populate backward compatibility categories table
INSERT INTO `categories` (`category_id`, `name`, `description`, `image_url`)
SELECT `category_id`, `name`, `description`, `image_url` FROM `food_categories`
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- Cravings Taxonomy Seed
INSERT INTO `cravings` (`craving_id`, `title`, `slug`, `mood`, `taste_profile`, `texture`, `icon`, `description`, `keywords`)
SELECT * FROM (
    SELECT 1 AS `craving_id`, 'Spicy & Fiery' AS `title`, 'spicy' AS `slug`, 'Adventure' AS `mood`, 'Spicy' AS `taste_profile`, 'Hot & Zesty' AS `texture`, 'flame' AS `icon`, 'Kick your tastebuds with bold spices and chilli heat.' AS `description`, 'spicy,fiery,hot,chilli,schezwan,peri peri,masala,tikka,peppers,pungent' AS `keywords` UNION ALL
    SELECT 2, 'Cheesy & Gooey', 'cheesy', 'Comfort', 'Rich & Savory', 'Melted & Gooey', 'cheese' AS `icon`, 'Pure comfort with melted mozzarella, cheddar, and creamy sauces.' AS `description`, 'cheese,cheesy,mozzarella,cheddar,loaded,gooey,pizza,fondue,lasagna' AS `keywords` UNION ALL
    SELECT 3, 'Sweet Tooth', 'sweet', 'Celebration', 'Sweet & Sugary', 'Soft & Fudgy', 'cookie' AS `icon`, 'Indulgent sweet treats to cure any sugar craving.' AS `description`, 'sweet,chocolate,brownie,cake,fudge,ice cream,gulab jamun,dessert,pastry,waffle' AS `keywords` UNION ALL
    SELECT 4, 'Crispy & Crunchy', 'crispy', 'Snack Mood', 'Savory & Salty', 'Crispy & Crunchy', 'sparkles' AS `icon`, 'Satisfying bite with golden-fried crunch and crispy textures.' AS `description`, 'crispy,crunchy,fries,fried,nuggets,toast,rolls,crust,kachori,samosa' AS `keywords` UNION ALL
    SELECT 5, 'Warm Comfort Food', 'comfort', 'Relaxing', 'Rich & Savory', 'Hearty & Warm', 'heart' AS `icon`, 'Soul-soothing homestyle meals, creamy gravies and slow-cooked dal.' AS `description`, 'comfort,hearty,dal makhani,curry,khichdi,rice,roti,warm,homestyle,soup' AS `keywords` UNION ALL
    SELECT 6, 'Cold & Refreshing', 'refreshing', 'Energizing', 'Sweet & Tangy', 'Chilled & Smooth', 'snowflake' AS `icon`, 'Cool off with thick shakes, smoothies, and ice cold mocktails.' AS `description`, 'cold,chilled,ice,shake,smoothie,cooler,beverage,drink,mint,lime' AS `keywords` UNION ALL
    SELECT 7, 'Late Night Cravings', 'late-night', 'Night Owl', 'Savory & Fast', 'Quick & Satisfying', 'moon' AS `icon`, 'Tasty, satisfying snacks and meals delivered during midnight hours.' AS `description`, 'midnight,late night,night,quick,burger,fries,momos,pizza,wrap' AS `keywords` UNION ALL
    SELECT 8, 'Budget Friendly', 'budget', 'Smart Saver', 'Value for Money', 'Filling', 'wallet' AS `icon`, 'Delicious, filling meals that do not hurt your pocket (under ₹200).' AS `description`, 'cheap,budget,affordable,pocket friendly,under 100,under 200,value,combo' AS `keywords` UNION ALL
    SELECT 9, 'Healthy & Guilt-Free', 'healthy', 'Wellness', 'Fresh & Light', 'Fresh & Crisp', 'leaf' AS `icon`, 'Nutrient-rich, fresh salads, protein bowls, and light meals.' AS `description`, 'healthy,salad,bowl,protein,diet,low carb,fresh,fruit,sprouts,steamed' AS `keywords`
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM `cravings` LIMIT 1);

-- Restaurants Seed Data
INSERT INTO `restaurants` (`restaurant_id`, `name`, `slug`, `cuisine`, `address`, `rating`, `review_count`, `price_for_two`, `is_veg`, `is_pure_veg`, `is_open_now`, `offer`, `phone`, `opening_hours`, `cover_image`, `image_url`, `latitude`, `longitude`)
SELECT * FROM (
    SELECT 1 AS `restaurant_id`, 'Spice Garden' AS `name`, 'spice-garden' AS `slug`, 'North Indian • Mughlai • Biryani' AS `cuisine`, 'Sector 17, Chandigarh' AS `address`, 4.5 AS `rating`, 340 AS `review_count`, 550 AS `price_for_two`, 1 AS `is_veg`, 1 AS `is_pure_veg`, 1 AS `is_open_now`, '20% OFF up to ₹100' AS `offer`, '+91 172 2701122' AS `phone`, '11:00 AM - 11:30 PM' AS `opening_hours`, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85' AS `cover_image`, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=85' AS `image_url`, 30.74148200 AS `latitude`, 76.76806600 AS `longitude` UNION ALL
    SELECT 2, 'Pizza Corner', 'pizza-corner', 'Italian • Pizza • Fast Food', 'Sector 22, Chandigarh', 4.4, 280, 450, 1, 0, 1, 'Flat 30% OFF', '+91 172 2704455', '11:00 AM - 12:00 AM', 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=85', 30.73331500, 76.77941900 UNION ALL
    SELECT 3, 'Wok Express', 'wok-express', 'Chinese • Asian • Noodles', 'Sector 35, Chandigarh', 4.2, 195, 400, 0, 0, 1, 'Free Dimsum on ₹399', '+91 172 2603388', '12:00 PM - 11:00 PM', 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=85', 30.72240000, 76.76880000 UNION ALL
    SELECT 4, 'Burger House', 'burger-house', 'Fast Food • Burgers • Beverages', 'Sector 8, Chandigarh', 4.3, 410, 350, 0, 0, 1, '10% OFF on Combos', '+91 172 2789900', '10:30 AM - 01:00 AM', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=85', 30.73800000, 76.80000000 UNION ALL
    SELECT 5, 'Sweet Cravings Bakery', 'sweet-cravings', 'Desserts • Bakery • Sweets', 'Sector 10, Chandigarh', 4.7, 520, 300, 1, 1, 1, 'Buy 1 Get 1 on Pastries', '+91 172 2742211', '10:00 AM - 11:00 PM', 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=85', 30.75000000, 76.79000000 UNION ALL
    SELECT 6, 'The Food Factory', 'the-food-factory', 'Fast Food • Burgers • American', 'Phase 7, Mohali', 4.4, 310, 380, 0, 0, 1, '15% OFF on Orders > ₹250', '+91 172 4601177', '11:00 AM - 02:00 AM', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=85', 30.70460000, 76.71790000 UNION ALL
    SELECT 7, 'Urban Tadka', 'urban-tadka', 'North Indian • Biryani • Mughlai', 'Sector 17, Chandigarh', 4.7, 650, 600, 0, 0, 1, 'Flat ₹50 OFF on ₹299', '+91 172 2718899', '11:30 AM - 11:30 PM', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=85', 30.74000000, 76.77000000 UNION ALL
    SELECT 8, 'Wok & Roll Momos', 'wok-and-roll', 'Chinese • Tibetan • Momos', 'Sector 35, Chandigarh', 4.6, 480, 320, 0, 0, 1, '25% OFF', '+91 172 2615544', '12:00 PM - 11:30 PM', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=85', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=85', 30.72400000, 76.76600000
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM `restaurants` LIMIT 1);

-- Restaurant Locations Seed
INSERT INTO `restaurant_locations` (`location_id`, `restaurant_id`, `address_line1`, `locality`, `city`, `pincode`, `latitude`, `longitude`, `directions_note`)
SELECT * FROM (
    SELECT 1 AS `location_id`, 1 AS `restaurant_id`, 'SCO 45-46, Inner Market' AS `address_line1`, 'Sector 17' AS `locality`, 'Chandigarh' AS `city`, '160017' AS `pincode`, 30.74148200 AS `latitude`, 76.76806600 AS `longitude`, 'Near Neelam Cinema' AS `directions_note` UNION ALL
    SELECT 2, 2, 'Booth 12, Main Market', 'Sector 22-B', 'Chandigarh', '160022', 30.73331500, 76.77941900, 'Opposite Kiran Cinema' UNION ALL
    SELECT 3, 3, 'SCO 104, Food Street', 'Sector 35-C', 'Chandigarh', '160035', 30.72240000, 76.76880000, 'Beside Aroma Hotel' UNION ALL
    SELECT 4, 4, 'Shop 18, Inner Circle', 'Sector 8-B', 'Chandigarh', '160008', 30.73800000, 76.80000000, 'Near Natural Ice Cream' UNION ALL
    SELECT 5, 5, 'SCF 23, Market Complex', 'Sector 10-D', 'Chandigarh', '160010', 30.75000000, 76.79000000, 'Next to Art Gallery' UNION ALL
    SELECT 6, 6, 'Bay Site 34, Phase 7 Market', 'Phase 7', 'Mohali', '160062', 30.70460000, 76.71790000, 'Near Fortis Hospital' UNION ALL
    SELECT 7, 7, 'SCO 88, Plaza Fountain Side', 'Sector 17-C', 'Chandigarh', '160017', 30.74000000, 76.77000000, 'Near Bridge Market' UNION ALL
    SELECT 8, 8, 'Booth 7, Momo Lane', 'Sector 35-D', 'Chandigarh', '160035', 30.72400000, 76.76600000, 'Behind Post Office'
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM `restaurant_locations` LIMIT 1);

-- Restaurant Cuisines Mapping Seed
INSERT INTO `restaurant_cuisines` (`restaurant_id`, `cuisine_id`)
SELECT * FROM (
    SELECT 1 AS `restaurant_id`, 1 AS `cuisine_id` UNION ALL
    SELECT 1, 5 UNION ALL
    SELECT 2, 2 UNION ALL
    SELECT 2, 4 UNION ALL
    SELECT 3, 3 UNION ALL
    SELECT 4, 4 UNION ALL
    SELECT 5, 6 UNION ALL
    SELECT 6, 4 UNION ALL
    SELECT 7, 1 UNION ALL
    SELECT 7, 5 UNION ALL
    SELECT 8, 3
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM `restaurant_cuisines` LIMIT 1);

-- Detailed Food Items Seed
INSERT INTO `food_items` (`item_id`, `restaurant_id`, `category_id`, `cuisine_id`, `name`, `category`, `description`, `price`, `is_veg`, `spice_level`, `taste_profile`, `texture`, `tags`, `rating`, `is_bestseller`, `image_url`)
SELECT * FROM (
    SELECT 1 AS `item_id`, 1 AS `restaurant_id`, 5 AS `category_id`, 1 AS `cuisine_id`, 'Paneer Butter Masala' AS `name`, 'North Indian Curries' AS `category`, 'Silky creamy tomato-cashew gravy with melt-in-mouth cottage cheese cubes.' AS `description`, 249.00 AS `price`, 1 AS `is_veg`, 'mild' AS `spice_level`, 'creamy' AS `taste_profile`, 'tender' AS `texture`, 'paneer,creamy,butter,gravy,north indian,curry,vegetarian,comfort' AS `tags`, 4.8 AS `rating`, 1 AS `is_bestseller`, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80' AS `image_url` UNION ALL
    SELECT 2, 1, 1, 5, 'Hyderabadi Veg Dum Biryani', 'Biryani', 'Fragrant aged basmati rice cooked on slow dum with aromatic spices and saffron.', 199.00, 1, 'medium', 'spicy', 'grainy', 'biryani,dum,rice,spicy,basmati,hyderabadi,flavorful,aromatic', 4.5, 1, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80' UNION ALL
    SELECT 3, 1, 5, 1, 'Dal Makhani Bukhara', 'North Indian Curries', 'Black lentils slow-simmered overnight over charcoal with fresh butter and cream.', 219.00, 1, 'mild', 'savory', 'creamy', 'dal,dal makhani,comfort,creamy,butter,classic,warm', 4.7, 1, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80' UNION ALL
    SELECT 4, 2, 2, 2, 'Classic Double Cheese Margherita', 'Pizza', 'Hand-stretched dough topped with San Marzano sauce, fresh mozzarella, and aromatic basil.', 280.00, 1, 'mild', 'cheesy', 'cheesy & crispy', 'pizza,cheese,cheesy,mozzarella,crust,italian,comfort,margherita', 4.6, 1, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80' UNION ALL
    SELECT 5, 2, 2, 2, 'Fiery Peri Peri Veg Pizza', 'Pizza', 'Spicy jalapeños, red paprika, bell peppers and peri-peri drizzle over melted mozzarella.', 299.00, 1, 'spicy', 'spicy & cheesy', 'crispy', 'spicy,peri peri,pizza,cheesy,fiery,peppers,hot', 4.4, 0, 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80' UNION ALL
    SELECT 6, 2, 2, 2, 'Four Cheese Garlic Breadsticks', 'Pizza', 'Crisp garlic bread topped with melted cheddar, mozzarella, gouda, and fresh herbs.', 160.00, 1, 'mild', 'cheesy', 'crispy & gooey', 'garlic bread,cheese,cheesy,bread,crispy,snack,budget', 4.7, 1, 'https://images.unsplash.com/photo-1619895092538-128341789043?auto=format&fit=crop&w=600&q=80' UNION ALL
    SELECT 7, 3, 4, 3, 'Spicy Schezwan Hakka Noodles', 'Chinese & Momos', 'Wok-tossed noodles in homemade fiery schezwan sauce with crisp Asian greens.', 170.00, 1, 'spicy', 'spicy & savory', 'springy', 'noodles,hakka,schezwan,spicy,chinese,wok,street food', 4.4, 1, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80' UNION ALL
    SELECT 8, 3, 4, 3, 'Chilli Garlic Chicken Dry', 'Chinese & Momos', 'Wok-seared crispy chicken bites tossed with scallions, crushed garlic, and fiery chillies.', 240.00, 0, 'extra_spicy', 'spicy & garlicky', 'crispy', 'chicken,chilli,garlic,spicy,fiery,starter,crunchy,non veg', 4.6, 1, 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80' UNION ALL
    SELECT 9, 4, 3, 4, 'Crispy Zinger Chicken Burger', 'Burger', 'Crunchy batter-fried chicken breast with lettuce, melted cheddar, and smoked chipotle mayo.', 180.00, 0, 'medium', 'savory & spicy', 'crunchy', 'burger,chicken,crispy,crunchy,zinger,fast food,cheddar,snack', 4.7, 1, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80' UNION ALL
    SELECT 10, 4, 7, 4, 'Loaded Cheesy Peri-Peri Fries', 'Street Food & Snacks', 'Crispy golden fries dusted with hot peri-peri spice and drenched in melted warm cheese sauce.', 150.00, 1, 'spicy', 'spicy & cheesy', 'crispy & gooey', 'fries,loaded,cheese,cheesy,peri peri,crispy,budget,fast food', 4.6, 1, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80' UNION ALL
    SELECT 11, 5, 6, 6, 'Hot Chocolate Fudge Brownie', 'Desserts & Sweets', 'Dense, warm dark chocolate fudge brownie served with rich molten chocolate ganache.', 140.00, 1, 'mild', 'sweet & rich', 'soft & fudgy', 'brownie,chocolate,sweet,fudge,dessert,warm,fudgy,budget', 4.9, 1, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80' UNION ALL
    SELECT 12, 5, 6, 6, 'Royal Kesar Gulab Jamun (2 pcs)', 'Desserts & Sweets', 'Soft melt-in-mouth milk dumplings steeped in hot cardamom-saffron sugar syrup.', 90.00, 1, 'mild', 'sweet', 'soft & juicy', 'gulab jamun,sweet,traditional,dessert,kesar,warm,budget', 4.8, 1, 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80' UNION ALL
    SELECT 13, 6, 3, 4, 'Ultimate Double Smash Cheeseburger', 'Burger', 'Twin seared crispy patties smashed on griddle, layered with double cheese and caramelized onions.', 210.00, 0, 'medium', 'savory & cheesy', 'juicy', 'burger,smash,cheeseburger,cheese,cheesy,juicy,american', 4.8, 1, 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80' UNION ALL
    SELECT 14, 7, 1, 5, 'Old Delhi Royal Chicken Biryani', 'Biryani', 'Aromatic long-grain basmati layered with tender chicken pieces, saffron, and browned onions.', 220.00, 0, 'medium', 'spicy & rich', 'tender & fragrant', 'biryani,chicken,rice,royal,mughlai,tender,delhi,aromatic', 4.8, 1, 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=600&q=80' UNION ALL
    SELECT 15, 7, 5, 1, 'Classic Butter Chicken Masala', 'North Indian Curries', 'Smoky tandoori chicken shredded and simmered in velvet butter tomato makhani gravy.', 320.00, 0, 'mild', 'rich & creamy', 'tender', 'butter chicken,chicken,makhani,creamy,rich,north indian,comfort', 4.9, 1, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80' UNION ALL
    SELECT 16, 8, 4, 3, 'Authentic Steamed Veg Momos', 'Chinese & Momos', 'Thin translucent dumplings packed with finely minced cabbage, carrots, paneer and served with red chilli dip.', 120.00, 1, 'medium', 'savory & spicy', 'soft & juicy', 'momos,dumplings,steamed,veg,tibetan,chilli dip,street food,budget', 4.7, 1, 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=600&q=80' UNION ALL
    SELECT 17, 8, 4, 3, 'Pan-Fried Kurkure Chicken Momos', 'Chinese & Momos', 'Crisp-coated crunchy fried momos served piping hot with fiery garlic mayonnaise.', 160.00, 0, 'spicy', 'spicy & crunchy', 'crispy & crunchy', 'momos,kurkure,crispy,crunchy,chicken,fried,spicy,street food', 4.6, 1, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80' UNION ALL
    SELECT 18, 5, 8, 6, 'Belgian Choco-Blast Thickshake', 'Beverages & Shakes', 'Thick blended Belgian chocolate ice cream shake topped with chocolate shavings and fudge.', 160.00, 1, 'mild', 'sweet & chocolaty', 'creamy & cold', 'shake,chocolate,thickshake,beverage,cold,refreshing,sweet', 4.8, 1, 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=80'
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM `food_items` LIMIT 1);

-- Populate backward compatibility menu_items table
INSERT INTO `menu_items` (`item_id`, `restaurant_id`, `category_id`, `name`, `category`, `description`, `price`, `image_url`, `is_veg`, `rating`)
SELECT `item_id`, `restaurant_id`, `category_id`, `name`, `category`, `description`, `price`, `image_url`, `is_veg`, `rating`
FROM `food_items`
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- Seed Users (Demo account: demo@cravespot.com / Password123)
INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `phone`, `role`)
SELECT * FROM (
    SELECT 1 AS `user_id`, 'Harsh Garg' AS `name`, 'demo@cravespot.com' AS `email`,
    'scrypt:32768:8:1$7t8VqHq4vO7N0VvA$bbcb9c77c688d0701da52c8bdf92eb71542f56b009e4dfc5d79633e215f79590e0c8bda32f14aa9030b7d729a0b9432e1ea720519ad5d1fa8fe2cce42eb784ff' AS `password`,
    '+91 9876543210' AS `phone`,
    'user' AS `role`
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM `users` WHERE `email` = 'demo@cravespot.com');

-- Seed User Profiles
INSERT INTO `user_profiles` (`profile_id`, `user_id`, `avatar_url`, `bio`, `city`, `address`, `default_radius`)
SELECT * FROM (
    SELECT 1 AS `profile_id`, 1 AS `user_id`,
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' AS `avatar_url`,
    'Food explorer & street food enthusiast in Chandigarh' AS `bio`,
    'Chandigarh' AS `city`,
    'Sector 17, Chandigarh' AS `address`,
    10 AS `default_radius`
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM `user_profiles` WHERE `user_id` = 1);

-- Seed User Preferences
INSERT INTO `user_preferences` (`pref_id`, `user_id`, `dietary`, `spice_level`, `budget_tier`, `favorite_tags`)
SELECT * FROM (
    SELECT 1 AS `pref_id`, 1 AS `user_id`, 'all' AS `dietary`, 'medium' AS `spice_level`, 'moderate' AS `budget_tier`,
    'pizza,biryani,momos,paneer,spicy' AS `favorite_tags`
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM `user_preferences` WHERE `user_id` = 1);

-- Seed Reviews
INSERT INTO `reviews` (`review_id`, `restaurant_id`, `user_id`, `user_name`, `rating`, `comment`)
SELECT * FROM (
    SELECT 1 AS `review_id`, 1 AS `restaurant_id`, 1 AS `user_id`, 'Harsh Garg' AS `user_name`, 5 AS `rating`, 'Best Paneer Butter Masala in Sector 17! Outstanding service and authentic ambiance.' AS `comment` UNION ALL
    SELECT 2, 7, 1, 'Simran Kaur', 5, 'The Chicken Biryani and Butter Chicken are top tier! Truly rich Punjabi flavors.' UNION ALL
    SELECT 3, 2, 1, 'Aman Sharma', 4, 'Great wood-fired crust and generous cheese toppings. Quick hot delivery.' UNION ALL
    SELECT 4, 8, 1, 'Priya Verma', 5, 'Their Steamed Momos and Kurkure Chicken Momos are simply the best in Chandigarh!'
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM `reviews` LIMIT 1);
