# Culina – Cooking Recipe Portal

A complete full-stack web application built for managing and sharing cooking recipes. 
Built with React, Vite, Tailwind CSS, Node.js, Express, and PostgreSQL.

## Features

- **Authentication System**: JWT-based auth. Unique email enforcement. Minimum 6 character passwords. Protected routes.
- **User System**: Profile dashboard ("My Kitchen") with stats on saved, liked, and cooked recipes.
- **Recipe System**: Create, edit, view, and delete recipes. Dynamic ingredients and steps.
- **Smart Image System**: Automatically suggests 6 relevant food images based on the recipe title using LoremFlickr simulation (relevance by keyword matching). Auto-selects the best match.
- **Search & Filter**: Search by name. Filter by cuisine and difficulty.
- **Recipe Detail Page**: View ingredients with an interactive checklist, instructions tracker, and like/save functionality.
- **Reviews & Ratings**: Add reviews and ratings to recipes.
- **Cooking Experience System**: Community page where chefs share their stories, tips, and difficulty ratings of their cooks.
- **Database**: Fully normalized PostgreSQL schema.

## Database Schema (SQL)

The complete SQL schema can be found in `backend/database/schema.sql`. It includes the following tables:
- `Users`
- `User_Preferences`
- `Recipes`
- `Ingredients`
- `Recipe_Ingredients`
- `Steps`
- `Reviews`
- `Likes`
- `Saved_Recipes`
- `Cooking_Experiences`

## API Explanation

The backend provides several RESTful endpoints:

### Auth
- `POST /api/auth/signup`: Create a new user account (hashes password, returns JWT).
- `POST /api/auth/login`: Authenticate existing user (returns user info and JWT).

### Users
- `GET /api/users/profile`: Protected. Returns user profile, stats (saved/liked/cooked counts), and arrays of user's own recipes and saved recipes.
- `PUT /api/users/profile`: Protected. Update bio, preferences, etc.
- `POST /api/users/save/:recipeId`: Protected. Toggle saving/unsaving a recipe.
- `POST /api/users/like/:recipeId`: Protected. Toggle liking/unliking a recipe.

### Recipes
- `GET /api/recipes`: Public. Get all recipes with optional query params `search`, `cuisine`, `difficulty`.
- `POST /api/recipes`: Protected. Create a new recipe including dynamic ingredients and steps.
- `GET /api/recipes/:id`: Public. Get a detailed recipe by ID with all its steps and ingredients.
- `PUT /api/recipes/:id`: Protected. Edit own recipe.
- `DELETE /api/recipes/:id`: Protected. Delete own recipe.
- `GET /api/recipes/images?q=keyword`: Public. Returns an array of 6 relevant image URLs based on the query keyword.
- `GET /api/recipes/:recipeId/reviews`: Public. Get all reviews for a recipe.
- `POST /api/recipes/:recipeId/reviews`: Protected. Add a review to a recipe.

### Experiences
- `GET /api/experiences`: Public. Get the global feed of cooking experiences.
- `POST /api/experiences`: Protected. Post a new cooking experience.

## How to Run Project Step-by-Step

### 1. Database Setup (PostgreSQL)

1. Make sure you have PostgreSQL installed and running on your machine.
2. Open your terminal or pgAdmin and create a new database:
   ```sql
   CREATE DATABASE culina;
   ```
3. Run the schema file located at `backend/database/schema.sql` against the `culina` database to create all tables.
   - Example using `psql`: `psql -U postgres -d culina -a -f backend/database/schema.sql`

### 2. Backend Setup

1. Open a terminal and navigate to the `backend` directory.
   ```bash
   cd backend
   ```
2. Install dependencies (if not already installed).
   ```bash
   npm install
   ```
3. Set up environment variables.
   - You can copy the contents of `backend/.env` or configure it to match your PostgreSQL setup:
   ```env
   PORT=5000
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=culina
   DB_PASSWORD=your_postgres_password
   DB_PORT=5432
   JWT_SECRET=supersecretjwtkey_for_culina_app
   ```
4. Start the backend server.
   ```bash
   node server.js
   ```
   *The server should run on http://localhost:5000*

### 3. Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory.
   ```bash
   cd frontend
   ```
2. Install dependencies (if not already installed).
   ```bash
   npm install
   ```
3. Start the Vite development server.
   ```bash
   npm run dev
   ```
4. Open the displayed URL (usually `http://localhost:5173`) in your browser.

**Note:** The app requires you to sign up/login before accessing any core features, strictly enforcing the authentication rules.
