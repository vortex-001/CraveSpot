-- =====================================================================
-- CraveSpot Database Initialization Script
-- Target Database: CraveSpot
-- Description: Creates all required tables, constraints, indexes,
--              and seed data for the CraveSpot application.
-- Safe to execute repeatedly (idempotent structure creation).
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `CraveSpot`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE `CraveSpot`;

-- ---------------------------------------------------------------------
-- 1. Table: restaurants
-- Stores food vendors / restaurants listed on CraveSpot.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `restaurants` (
    `restaurant_id`   INT AUTO_INCREMENT PRIMARY KEY,
    `name`            VARCHAR(150) NOT NULL,
    `cuisine`         VARCHAR(150) NOT NULL,
    `address`         VARCHAR(255) NOT NULL,
    `rating`          DECIMAL(2, 1) NOT NULL DEFAULT 0.0,
    `is_veg`          TINYINT(1) NOT NULL DEFAULT 0,
    `offer`           VARCHAR(100) DEFAULT NULL,
    `image_url`       VARCHAR(500) DEFAULT NULL,
    `latitude`        DECIMAL(10, 8) DEFAULT NULL,
    `longitude`       DECIMAL(11, 8) DEFAULT NULL,
    `created_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_restaurants_cuisine` (`cuisine`),
    INDEX `idx_restaurants_rating` (`rating`),
    INDEX `idx_restaurants_is_veg` (`is_veg`),
    INDEX `idx_restaurants_coords` (`latitude`, `longitude`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. Table: categories
-- Stores food categories (Biryani, Pizza, Burger, Chinese, etc.).
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
    `category_id`     INT AUTO_INCREMENT PRIMARY KEY,
    `name`            VARCHAR(100) NOT NULL UNIQUE,
    `description`     TEXT DEFAULT NULL,
    `image_url`       VARCHAR(500) DEFAULT NULL,
    `created_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. Table: menu_items
-- Stores dishes / food items offered by restaurants.
-- ---------------------------------------------------------------------
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
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_menu_category`
        FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. Table: users
-- Stores registered user accounts with hashed credentials.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
    `user_id`         INT AUTO_INCREMENT PRIMARY KEY,
    `name`            VARCHAR(150) NOT NULL,
    `email`           VARCHAR(150) NOT NULL UNIQUE,
    `password`        VARCHAR(255) NOT NULL,
    `phone`           VARCHAR(20) DEFAULT NULL,
    `created_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. Table: reviews
-- Stores customer feedback and star ratings for restaurants.
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
-- SEED DATA (Only inserted if tables are empty)
-- =====================================================================

-- Categories Seed Data
INSERT INTO `categories` (`category_id`, `name`, `description`, `image_url`)
SELECT * FROM (
    SELECT 1 AS `category_id`, 'Biryani' AS `name`, 'Aromatic spiced rice dishes' AS `description`, 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=400&q=80' AS `image_url` UNION ALL
    SELECT 2, 'Pizza', 'Cheesy hand-tossed and thin crust pizzas', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80' UNION ALL
    SELECT 3, 'Burger', 'Juicy gourmet burgers and crunchy sides', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80' UNION ALL
    SELECT 4, 'Chinese', 'Wok-tossed noodles, fried rice, and dimsums', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80' UNION ALL
    SELECT 5, 'North Indian', 'Rich curries, dal makhani, and tandoori breads', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80' UNION ALL
    SELECT 6, 'Dessert', 'Cakes, brownies, ice cream and traditional sweets', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=400&q=80' UNION ALL
    SELECT 7, 'Fast Food', 'Fries, wraps, rolls and quick snacks', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=400&q=80' UNION ALL
    SELECT 8, 'Beverages', 'Refreshing shakes, mocktails, and coolers', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=400&q=80'
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM `categories` LIMIT 1);

-- Restaurants Seed Data
INSERT INTO `restaurants` (`restaurant_id`, `name`, `cuisine`, `address`, `rating`, `is_veg`, `offer`, `image_url`, `latitude`, `longitude`)
SELECT * FROM (
    SELECT 1 AS `restaurant_id`, 'Spice Garden' AS `name`, 'North Indian • Mughlai • Biryani' AS `cuisine`, 'Sector 17, Chandigarh' AS `address`, 4.5 AS `rating`, 1 AS `is_veg`, '20% OFF' AS `offer`, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=85' AS `image_url`, 30.74148200 AS `latitude`, 76.76806600 AS `longitude` UNION ALL
    SELECT 2, 'Pizza Corner', 'Italian • Pizza • Fast Food', 'Sector 22, Chandigarh', 4.3, 1, '30% OFF', 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=85', 30.73331500, 76.77941900 UNION ALL
    SELECT 3, 'Wok Express', 'Chinese • Asian • Noodles', 'Sector 35, Chandigarh', 4.2, 0, NULL, 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=85', 30.72240000, 76.76880000 UNION ALL
    SELECT 4, 'Burger House', 'Fast Food • Burgers • Beverages', 'Sector 8, Chandigarh', 4.1, 0, '10% OFF', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=85', 30.73800000, 76.80000000 UNION ALL
    SELECT 5, 'Sweet Cravings', 'Desserts • Bakery • Sweets', 'Sector 10, Chandigarh', 4.7, 1, NULL, 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=85', 30.75000000, 76.79000000 UNION ALL
    SELECT 6, 'The Food Factory', 'Fast Food • Burgers • American', 'Phase 7, Mohali', 4.4, 0, '15% OFF', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=85', 30.70460000, 76.71790000 UNION ALL
    SELECT 7, 'Urban Tadka', 'North Indian • Biryani • Mughlai', 'Sector 17, Chandigarh', 4.7, 0, 'Flat ₹50 OFF', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=85', 30.74000000, 76.77000000 UNION ALL
    SELECT 8, 'Wok & Roll', 'Chinese • Tibetan • Momos', 'Sector 35, Chandigarh', 4.6, 0, '25% OFF', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=85', 30.72400000, 76.76600000
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM `restaurants` LIMIT 1);

-- Menu Items Seed Data
INSERT INTO `menu_items` (`item_id`, `restaurant_id`, `category_id`, `name`, `category`, `description`, `price`, `image_url`, `is_veg`, `rating`)
SELECT * FROM (
    SELECT 1 AS `item_id`, 1 AS `restaurant_id`, 5 AS `category_id`, 'Paneer Butter Masala' AS `name`, 'North Indian' AS `category`, 'Creamy tomato gravy with soft paneer cubes and butter finish.' AS `description`, 249.00 AS `price`, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80' AS `image_url`, 1 AS `is_veg`, 4.6 AS `rating` UNION ALL
    SELECT 2, 1, 1, 'Veg Biryani', 'Biryani', 'Fragrant basmati rice slow-cooked with fresh garden vegetables and aromatic spices.', 199.00, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80', 1, 4.4 UNION ALL
    SELECT 3, 1, 5, 'Dal Makhani', 'North Indian', 'Slow-cooked black lentils simmered overnight with cream and butter.', 219.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', 1, 4.7 UNION ALL
    SELECT 4, 2, 2, 'Classic Cheese Pizza', 'Pizza', 'Crispy crust topped with rich tomato sauce, melted mozzarella and Italian herbs.', 280.00, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80', 1, 4.5 UNION ALL
    SELECT 5, 2, 2, 'Margherita Pizza', 'Pizza', 'Traditional pizza with tangy tomato sauce, fresh basil, and extra cheese.', 229.00, 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80', 1, 4.3 UNION ALL
    SELECT 6, 2, 2, 'Farmhouse Veggie Pizza', 'Pizza', 'Loaded with crisp bell peppers, onions, ripe tomatoes, and mushrooms.', 320.00, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80', 1, 4.4 UNION ALL
    SELECT 7, 3, 4, 'Veg Hakka Noodles', 'Chinese', 'Wok-tossed noodles with crunchy julienned veggies and light soy seasoning.', 160.00, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80', 1, 4.2 UNION ALL
    SELECT 8, 3, 4, 'Chilli Chicken Dry', 'Chinese', 'Crispy batter-fried chicken tossed in fiery chilli-garlic and green peppers.', 240.00, 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80', 0, 4.5 UNION ALL
    SELECT 9, 4, 3, 'Classic Chicken Burger', 'Burger', 'Crispy golden chicken patty served with lettuce, onion, and secret mayonnaise.', 160.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80', 0, 4.4 UNION ALL
    SELECT 10, 4, 7, 'Loaded Peri Peri Fries', 'Fast Food', 'Crispy French fries dusted with peri-peri spice and smothered in cheese sauce.', 180.00, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80', 1, 4.3 UNION ALL
    SELECT 11, 5, 6, 'Chocolate Brownie with Fudge', 'Dessert', 'Dense fudgy chocolate brownie drizzled with warm chocolate ganache.', 150.00, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80', 1, 4.7 UNION ALL
    SELECT 12, 5, 6, 'Gulab Jamun (2 pcs)', 'Dessert', 'Warm, soft dumplings dipped in aromatic rose and cardamom sugar syrup.', 90.00, 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80', 1, 4.8 UNION ALL
    SELECT 13, 6, 3, 'Crispy Veg Burger', 'Burger', 'Golden fried vegetable patty with creamy mayo and crisp lettuce.', 120.00, 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80', 1, 4.2 UNION ALL
    SELECT 14, 6, 7, 'Cheesy Garlic Bread', 'Fast Food', 'Toasted French baguette spread with roasted garlic butter and melted mozzarella.', 140.00, 'https://images.unsplash.com/photo-1619895092538-128341789043?auto=format&fit=crop&w=600&q=80', 1, 4.4 UNION ALL
    SELECT 15, 7, 1, 'Chicken Biryani', 'Biryani', 'Aromatic basmati rice cooked with tender chicken and traditional spices.', 220.00, 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=600&q=80', 0, 4.7 UNION ALL
    SELECT 16, 7, 5, 'Butter Chicken', 'North Indian', 'Tender chicken simmered in a luscious butter-tomato gravy with kasoori methi.', 320.00, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80', 0, 4.8 UNION ALL
    SELECT 17, 8, 4, 'Steamed Veg Momos', 'Chinese', 'Soft Tibetan steamed dumplings filled with seasoned vegetables and served with spicy red dip.', 120.00, 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=600&q=80', 1, 4.6 UNION ALL
    SELECT 18, 8, 4, 'Chilli Garlic Noodles', 'Chinese', 'Spicy wok-tossed noodles infused with sautéed garlic and fiery red chillies.', 190.00, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80', 1, 4.5
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM `menu_items` LIMIT 1);

-- Users Seed Data (Default test account: demo@cravespot.com / Password123)
-- Password hash generated using Werkzeug scrypt format
INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `phone`)
SELECT * FROM (
    SELECT 1 AS `user_id`, 'Harsh Garg' AS `name`, 'demo@cravespot.com' AS `email`,
    'scrypt:32768:8:1$7t8VqHq4vO7N0VvA$bbcb9c77c688d0701da52c8bdf92eb71542f56b009e4dfc5d79633e215f79590e0c8bda32f14aa9030b7d729a0b9432e1ea720519ad5d1fa8fe2cce42eb784ff' AS `password`,
    '9876543210' AS `phone`
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM `users` WHERE `email` = 'demo@cravespot.com');

-- Reviews Seed Data
INSERT INTO `reviews` (`review_id`, `restaurant_id`, `user_id`, `user_name`, `rating`, `comment`)
SELECT * FROM (
    SELECT 1 AS `review_id`, 1 AS `restaurant_id`, 1 AS `user_id`, 'Harsh Garg' AS `user_name`, 5 AS `rating`, 'Best Paneer Butter Masala in Sector 17! Outstanding service and ambiance.' AS `comment` UNION ALL
    SELECT 2, 7, 1, 'Simran Kaur', 5, 'The Chicken Biryani and Butter Chicken are top notch! Authentic Punjabi flavor.' UNION ALL
    SELECT 3, 2, 1, 'Aman Sharma', 4, 'Great wood-fired crust and generous cheese toppings. Quick delivery.' UNION ALL
    SELECT 4, 8, 1, 'Priya Verma', 5, 'Their Steamed Momos and Chilli Garlic Noodles are simply unbeatable in Chandigarh!'
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM `reviews` LIMIT 1);
