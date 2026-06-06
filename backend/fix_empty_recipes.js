const db = require('./config/db');

async function fixRecipes() {
    try {
        // Find recipes that have 0 ingredients
        const { rows: recipes } = await db.query(`
            SELECT r.id, r.title 
            FROM Recipes r
            LEFT JOIN Recipe_Ingredients ri ON r.id = ri.recipe_id
            WHERE ri.recipe_id IS NULL
        `);

        if (recipes.length === 0) {
            console.log("No recipes found missing ingredients.");
            process.exit();
        }

        for (const recipe of recipes) {
            console.log(`Fixing missing data for: ${recipe.title}`);
            
            const ingredients = [
                { name: 'Quinoa', quantity: '1 cup' },
                { name: 'Olive Oil', quantity: '2 tbsp' },
                { name: 'Sea Salt', quantity: '1 tsp' },
                { name: 'Fresh Lemon', quantity: '1/2' },
                { name: 'Mixed Greens', quantity: '2 cups' }
            ];

            for (const ing of ingredients) {
                let ingRes = await db.query('SELECT id FROM Ingredients WHERE name = $1', [ing.name]);
                let ingId;
                if (ingRes.rows.length > 0) {
                    ingId = ingRes.rows[0].id;
                } else {
                    let newIng = await db.query('INSERT INTO Ingredients (name) VALUES ($1) RETURNING id', [ing.name]);
                    ingId = newIng.rows[0].id;
                }
                await db.query('INSERT INTO Recipe_Ingredients (recipe_id, ingredient_id, quantity) VALUES ($1, $2, $3)', [recipe.id, ingId, ing.quantity]);
            }

            const steps = [
                "Rinse the quinoa thoroughly under cold water and cook according to package directions.",
                "In a small bowl, whisk together the olive oil, sea salt, and squeezed lemon juice to create a simple dressing.",
                "Toss the cooked quinoa with the mixed greens in a large serving bowl.",
                "Drizzle the lemon dressing over the bowl and mix well until everything is coated.",
                "Serve immediately or refrigerate for a refreshing cool salad."
            ];

            for (let i = 0; i < steps.length; i++) {
                await db.query('INSERT INTO Steps (recipe_id, step_number, instruction) VALUES ($1, $2, $3)', [recipe.id, i + 1, steps[i]]);
            }
        }
        console.log("Successfully added 5 ingredients and instructions!");
        process.exit();
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}

fixRecipes();
