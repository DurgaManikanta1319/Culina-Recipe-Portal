CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS User_Preferences (
    user_id INTEGER PRIMARY KEY REFERENCES Users(id) ON DELETE CASCADE,
    dietary_preferences TEXT,
    cuisines TEXT
);

CREATE TABLE IF NOT EXISTS Recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cuisine VARCHAR(100),
    difficulty VARCHAR(50),
    prep_time INTEGER,
    cook_time INTEGER,
    servings INTEGER,
    image_url TEXT,
    tags TEXT,
    dietary_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS Recipe_Ingredients (
    recipe_id INTEGER REFERENCES Recipes(id) ON DELETE CASCADE,
    ingredient_id INTEGER REFERENCES Ingredients(id) ON DELETE CASCADE,
    quantity VARCHAR(100),
    PRIMARY KEY (recipe_id, ingredient_id)
);

CREATE TABLE IF NOT EXISTS Steps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id INTEGER REFERENCES Recipes(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    instruction TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id INTEGER REFERENCES Recipes(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Likes (
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    recipe_id INTEGER REFERENCES Recipes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, recipe_id)
);

CREATE TABLE IF NOT EXISTS Saved_Recipes (
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    recipe_id INTEGER REFERENCES Recipes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, recipe_id)
);

CREATE TABLE IF NOT EXISTS Cooking_Experiences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    recipe_id INTEGER REFERENCES Recipes(id) ON DELETE SET NULL,
    story TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    difficulty VARCHAR(50),
    tips TEXT,
    would_cook_again BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
