# Setup Guide

## Prerequisites

1.  **Node.js**: [Download & Install](https://nodejs.org/)
2.  **Supabase CLI**:
    ```bash
    npm install -g supabase
    ```
3.  **Google Gemini API Key**: [Get it here]
4.  **Supabase Account**: [Sign up]

---

## Option 1: Run Locally (Requires Docker) 🐳

If you have Docker Desktop installed and running:

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Start Supabase locally**:
    ```bash
    supabase start
    ```
    *Note the `API URL` and `anon key` output by this command.*

3.  **Configure Environment**:
    *   Open `.env` file.
    *   Update `VITE_SUPABASE_URL` with the local API URL (e.g., `http://127.0.0.1:54321`).
    *   Update `VITE_SUPABASE_PUBLISHABLE_KEY` with the local `anon key`.
    *   Add `GEMINI_API_KEY=your_google_api_key_here`.

4.  **Serve the Function**:
    ```bash
    supabase functions serve identify-medicine --env-file .env --no-verify-jwt
    ```

5.  **Run the App**:
    Open a new terminal and run:
    ```bash
    npm run dev
    ```
    Open the local URL (usually `http://localhost:8080`).

---

## Option 2: Deploy to Your Own Supabase Project 🚀

If you don't have Docker or prefer to run it in the cloud:

1.  **Create a Project**:
    *   Go to [database.new](https://database.new) and create a new project.

2.  **Get Credentials**:
    *   Go to **Project Settings** -> **API**.
    *   Copy the `Project URL` and `anon public` key.

3.  **Link & Deploy**:
    Open your terminal and make sure you are in the project folder:
    ```bash
    cd c:\Users\hp\gsoc\shaurya.github.io\zero-to-ai-spark
    ```

    Then run these commands:

    ```bash
    # 1. Login to Supabase
    npx supabase login

    # 2. Link to your project (ntbgqromuyrbgliojyux)
     npx supabase link --project-ref
    # You will be asked for your database password.

    # 3. Set your Gemini API Key secret
    npx supabase secrets set GEMINI_API_KEY=AIzaSyDadYpC-EyOwDygxXpcnzeqLUEDjO8dxaY

    # 4. Deploy the function
    npx supabase functions deploy identify-medicine
    ```

    **Success!** 🎉 Your backend is identified.

4.  **Connect Frontend**:
    *   Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/ntbgqromuyrbgliojyux/settings/api).
    *   Click **Project Settings** (gear icon) -> **API**.
    *   Copy **Project URL** and **anon public** key.
    *   Open your `.env` file in this project.
    *   Replace the values:
        ```env
        VITE_SUPABASE_URL="your_project_url"
        VITE_SUPABASE_PUBLISHABLE_KEY="your_anon_key"
        ```

    npm run dev
    ```
    Open the local URL (usually `thia`).

---

## Option 3: Deploy Frontend to GitHub Pages 🌐

Since we have already configured the project for GitHub Pages, you can deploy the frontend whenever you are ready:

1.  **Run the deploy command**:
    ```bash
    npm run deploy
    ```
    *This will build the project and push it to the `gh-pages` branch.*

2.  **Access your site**:
    After a few minutes, your site will be live at:
    `https://shauryam934-jpg.github.io/zero-to-ai-spark/`

    *Note: Ensure your Supabase backend is deployed (Option 2) or use a local backend (Option 1) for the app to work correctly.*
