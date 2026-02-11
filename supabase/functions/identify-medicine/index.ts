import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Server configuration error: API key missing" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare the image data (remove header if present)
    const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    console.log(`Analyzing medicine image with Gemini Flash... Payload size: ${base64Data.length} chars`);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an expert pharmaceutical AI assistant. Analyze the provided medicine/pill image and return a JSON object with the following fields:
- medicineName: Name of the medicine (if identified) or "Unknown"
- genericName: Generic/chemical name or "Unknown"
- dosage: Strength/dosage capability (e.g., 500mg) or "N/A"
- manufacturer: Manufacturer name or "N/A"
- uses: Primary medical uses (brief summary)
- sideEffects: Common side effects (brief summary)
- precautions: Important precautions (brief summary)
- confidence: "high", "medium", or "low" based on how clear the identification is.

If you cannot identify the medicine clearly, set confidence to "low" and fill fields with "Unknown". Do NOT return markdown code blocks, just the raw JSON.`
                },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: base64Data
                  }
                }
              ]
            }
          ]
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      throw new Error(`Gemini API Error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Gemini Response:", JSON.stringify(data));

    const candidates = data.candidates;
    if (!candidates || candidates.length === 0 || !candidates[0].content || !candidates[0].content.parts) {
      throw new Error("No candidates returned from Gemini");
    }

    const textResponse = candidates[0].content.parts[0].text;

    // Extract JSON from the text response
    let result;
    try {
      // Clean potential markdown blocks
      const cleanedText = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();
      result = JSON.parse(cleanedText);
    } catch (e) {
      console.error("Failed to parse JSON:", e, textResponse);
      result = {
        medicineName: "Parsing Error",
        confidence: "low",
        uses: "Could not parse AI response. " + textResponse
      };
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in identify-medicine function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        details: "Check Supabase project logs for more info."
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
