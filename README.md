# 💊 Medicine Identifier (Zero-to-AI Spark)

A powerful, AI-driven web application designed to help users identify potential medicines and pills using advanced image recognition. By uploading a simple photo, the application analyzes visual cues to provide medicine names, generic identifiers, dosages, and usage warnings.

> **⚠️ Disclaimer:** This tool is for educational purposes only. Always consult a qualified healthcare professional before taking any medication.

---

## ✨ Features

-   **📸 Instant Image Analysis**: Drag and drop or upload an image of any medicine packaging or pill.
-   **🤖 Advanced AI Recognition**: Powered by **Google Gemini Flash**, specifically tuned for vision tasks to identify pharmaceuticals.
-   **📝 Detailed Insights**: Returns comprehensive details including:
    -   Medicine Name & Generic Name
    -   Recommended Dosage
    -   Primary Medical Uses
    -   Side Effects & Precautions
-   **⚡ Real-time Feedback**: Fast processing with immediate results.
-   **📱 Responsive & Modern UI**: Built with a mobile-first approach using Shadcn/UI and Tailwind CSS.
-   **🔒 Privacy Focused**: Images are processed securely via Supabase Edge Functions.

---

## 🛠️ Tech Stack & Tools Used

This project was built using a modern, robust full-stack architecture:

### **Frontend**
-   **[React 18](https://react.dev/)**: The core library for building the user interface.
-   **[TypeScript](https://www.typescriptlang.org/)**: For type-safe code and better developer experience.
-   **[Vite](https://vitejs.dev/)**: Next-generation frontend tooling for ultra-fast builds.
-   **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework for rapid UI styling.
-   **[Shadcn/UI](https://ui.shadcn.com/)**: A collection of re-usable components built using Radix UI and Tailwind.
-   **[Lucide React](https://lucide.dev/)**: Beautiful, consistent icons.
-   **[TanStack Query](https://tanstack.com/query/latest)**: For efficient server state management.

### **Backend & AI**
-   **[Supabase](https://supabase.com/)**: Provides the backend infrastructure, including:
    -   **Edge Functions (Deno)**: Serverless functions to handle API requests securely.
    -   **Secret Management**: Securely storing API keys.
-   **[Google Gemini API](https://ai.google.dev/)**: The intelligence layer. We use the **Gemini Flash** model for its speed and multimodal (vision + text) capabilities.

### **Deployment**
-   **GitHub Pages**: Hosts the static frontend assets.
-   **Supabase Edge Network**: Hosts the serverless backend logic.

---

## 📸 Screenshots

### **1. Landing Page (Before Execution)**
*The clean, welcoming interface ready for user upload.*

Screenshot (341).png

### **2. Analysis Results (After Running)**
*The application identifying a medicine and displaying detailed safety information.*

Screenshot (344).png

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites
-   Node.js (v18 or higher)
-   Supabase CLI (`npm install -g supabase`)
-   A Google Gemini API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/shauryam934-jpg/zero-to-ai-spark.git
    cd zero-to-ai-spark
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    -   Rename `.env.example` to `.env` (if applicable) or create one.
    -   Add your Supabase credentials:
        ```env
        VITE_SUPABASE_PROJECT_ID="your_project_id"
        VITE_SUPABASE_URL="your_supabase_url"
        VITE_SUPABASE_PUBLISHABLE_KEY="your_anon_key"
        ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

---

## ☁️ Deployment

For full deployment instructions (Frontend + Backend), please refer to the [**SETUP.md**](./SETUP.md) guide.

### Quick Deploy Commands
-   **Frontend**: `npm run deploy` (deploys to GitHub Pages)
-   **Backend**: `npx supabase functions deploy identify-medicine`

---

## 📄 License

This project is licensed under the MIT License.
