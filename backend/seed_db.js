const fs = require('fs');
const path = require('path');
const db = require('./config/db').getDbInstance();

const seedData = async () => {
    console.log("Seeding database with new recipes and fixing images...");

    try {
        // Create a dummy user
        await new Promise((resolve, reject) => {
            db.run(
                `INSERT OR IGNORE INTO Users (id, name, email, password, bio) VALUES (?, ?, ?, ?, ?)`,
                [1, 'Mom Kitchen', 'chef@momskitchen.com', '$2a$10$abcdefghijklmnopqrstuv', 'Master chef'],
                (err) => err ? reject(err) : resolve()
            );
        });

        // Clear existing recipes to avoid duplicates
        await new Promise((resolve, reject) => {
            db.run(`DELETE FROM Recipes`, (err) => err ? reject(err) : resolve());
        });

        const recipes = [
            {
                title: 'Truffle Mushroom Risotto',
                description: 'A luxurious Italian risotto with earthy truffle oil, wild mushrooms, and aged Parmesan.',
                cuisine: 'Italian', difficulty: 'Medium', prep_time: 15, cook_time: 30, servings: 2,
                image_url: 'https://loremflickr.com/800/600/risotto,italian/all'
            },
            {
                title: 'Omakase Sushi Platter',
                description: 'An exquisite selection of nigiri and maki rolls.',
                cuisine: 'Japanese', difficulty: 'Hard', prep_time: 45, cook_time: 0, servings: 4,
                image_url: 'https://loremflickr.com/800/600/sushi,japanese/all'
            },
            {
                title: 'Butter Chicken with Naan',
                description: 'Tender chicken in a velvety tomato-butter sauce.',
                cuisine: 'Indian', difficulty: 'Medium', prep_time: 30, cook_time: 45, servings: 4,
                image_url: 'https://loremflickr.com/800/600/curry,indian/all'
            },
            {
                title: 'Street-Style Fish Tacos',
                description: 'Crispy beer-battered fish with tangy slaw.',
                cuisine: 'Mexican', difficulty: 'Easy', prep_time: 20, cook_time: 15, servings: 3,
                image_url: 'https://loremflickr.com/800/600/tacos,mexican/all'
            },
            {
                title: 'Molten Chocolate Lava Cake',
                description: 'Decadent dessert with a gooey chocolate center.',
                cuisine: 'French', difficulty: 'Medium', prep_time: 15, cook_time: 12, servings: 2,
                image_url: 'https://loremflickr.com/800/600/cake,dessert/all'
            },
            {
                title: 'Mediterranean Quinoa Bowl',
                description: 'Vibrant bowl with quinoa, roasted vegetables, and tahini.',
                cuisine: 'Mediterranean', difficulty: 'Easy', prep_time: 15, cook_time: 20, servings: 2,
                image_url: 'https://loremflickr.com/800/600/salad,healthy/all'
            },
            {
                title: 'Classic Smash Burger',
                description: 'Double beef patty smashed to perfection with American cheese and secret sauce.',
                cuisine: 'American', difficulty: 'Easy', prep_time: 10, cook_time: 10, servings: 2,
                image_url: 'https://loremflickr.com/800/600/burger,american/all'
            },
            {
                title: 'Spicy Pad Thai',
                description: 'Stir-fried rice noodles with eggs, peanuts, bean sprouts, and spicy tamarind sauce.',
                cuisine: 'Asian', difficulty: 'Medium', prep_time: 20, cook_time: 15, servings: 2,
                image_url: 'https://loremflickr.com/800/600/noodles,asian/all'
            },
            {
                title: 'BBQ Ribs with Mac & Cheese',
                description: 'Slow-cooked ribs glazed with hickory BBQ sauce served alongside creamy mac and cheese.',
                cuisine: 'American', difficulty: 'Hard', prep_time: 30, cook_time: 240, servings: 4,
                image_url: 'https://loremflickr.com/800/600/bbq,ribs/all'
            },
            {
                title: 'Korean Fried Chicken',
                description: 'Ultra-crispy double-fried chicken coated in a sweet and spicy Gochujang glaze.',
                cuisine: 'Asian', difficulty: 'Medium', prep_time: 25, cook_time: 30, servings: 3,
                image_url: 'https://loremflickr.com/800/600/chicken,korean/all'
            }
        ];

        for (let i = 0; i < recipes.length; i++) {
            const r = recipes[i];
            await new Promise((resolve, reject) => {
                db.run(
                    `INSERT INTO Recipes (user_id, title, description, cuisine, difficulty, prep_time, cook_time, servings, image_url)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [1, r.title, r.description, r.cuisine, r.difficulty, r.prep_time, r.cook_time, r.servings, r.image_url],
                    (err) => err ? reject(err) : resolve()
                );
            });
        }

        console.log("Fake recipes inserted successfully with working images!");
    } catch (error) {
        console.error("Error seeding:", error);
    } finally {
        db.close();
    }
};

seedData();
