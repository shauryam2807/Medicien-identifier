import { useState, useEffect } from "react";
import { Upload, Pill, Loader2, AlertCircle, History, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface MedicineInfo {
  medicineName: string;
  genericName: string;
  dosage: string;
  manufacturer: string;
  uses: string;
  sideEffects: string;
  precautions: string;
  confidence: "high" | "medium" | "low";
  timestamp?: number; // Added for history
}

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<MedicineInfo | null>(null);
  const [recentScans, setRecentScans] = useState<MedicineInfo[]>([]);
  const { toast } = useToast();

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem("medicineHistory");
    if (saved) {
      try {
        setRecentScans(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveToHistory = (newScan: MedicineInfo) => {
    const scanWithTime = { ...newScan, timestamp: Date.now() };
    const updated = [scanWithTime, ...recentScans].slice(0, 5); // Keep last 5
    setRecentScans(updated);
    localStorage.setItem("medicineHistory", JSON.stringify(updated));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const processWidth = 800; // Resize to max 800px width/height

        if (width > height) {
          if (width > processWidth) {
            height *= processWidth / width;
            width = processWidth;
          }
        } else {
          if (height > processWidth) {
            width *= processWidth / height;
            height = processWidth;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress to JPEG with 0.7 quality
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        setSelectedImage(compressedBase64);
        setResult(null);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const analyzeMedicine = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("identify-medicine", {
        body: { imageBase64: selectedImage },
      });

      if (error) {
        console.error("Function error:", error);
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
      saveToHistory(data);
      toast({
        title: "Analysis Complete",
        description: "Medicine identified successfully",
      });
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadFromHistory = (scan: MedicineInfo) => {
    setResult(scan);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "high":
        return "text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-200";
      case "low":
        return "text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/50 to-white dark:from-slate-950 dark:to-slate-900">

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-primary text-primary-foreground pb-24 pt-16 md:pt-24 mb-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="container relative mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20 shadow-lg animate-in fade-in zoom-in duration-700">
            <Pill className="h-8 w-8 text-white mr-2" />
            <span className="font-semibold tracking-wide">AI MEDICINE IDENTIFIER</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Identify Your Medicine <br className="hidden md:block" /> in Seconds
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Upload a photo of any pill or package to get instant, accurate information about dosage, uses, and side effects.
          </p>
        </div>

        {/* Decorative curve */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-background dark:to-background"></div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Main Content Area (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upload Section */}
            <Card className="shadow-xl border-t-4 border-t-primary animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <CardHeader>
                <CardTitle className="text-2xl">Upload Image</CardTitle>
                <CardDescription>
                  Take a clear photo of the pill or medicine packaging
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-primary/20 bg-primary/5 rounded-xl p-10 text-center hover:border-primary hover:bg-primary/10 transition-all cursor-pointer group relative overflow-hidden">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    id="image-upload"
                  />
                  <div className="relative z-0 group-hover:scale-105 transition-transform duration-300">
                    <div className="bg-white p-4 rounded-full inline-block shadow-md mb-4">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-primary mb-2">Click to upload or drag and drop</h3>
                    <p className="text-sm text-muted-foreground">
                      Supports JPG, PNG, WEBP
                    </p>
                  </div>
                </div>

                {selectedImage && (
                  <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                    <div className="relative rounded-lg overflow-hidden border shadow-sm aspect-video bg-black/5">
                      <img
                        src={selectedImage}
                        alt="Selected medicine"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <Button
                      onClick={analyzeMedicine}
                      disabled={isAnalyzing}
                      className="w-full text-lg h-12 shadow-lg hover:shadow-xl transition-all"
                      size="lg"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Analyzing with Gemini AI...
                        </>
                      ) : (
                        "Identify Medicine"
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Section */}
            {(result || isAnalyzing) && (
              <Card className="shadow-xl border-none ring-1 ring-black/5 animate-in fade-in slide-in-from-bottom-8 duration-500">
                <CardHeader className="bg-muted/30 border-b">
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="h-5 w-5 text-primary" />
                    Identification Results
                  </CardTitle>
                  <CardDescription>
                    AI-powered analysis based on visual data
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {isAnalyzing ? (
                    <div className="text-center py-16">
                      <div className="relative inline-block">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
                        <Loader2 className="relative h-16 w-16 animate-spin text-primary mb-4" />
                      </div>
                      <p className="text-lg font-medium text-foreground">Analyzing your medicine...</p>
                      <p className="text-sm text-muted-foreground mt-2">Connecting to medical database</p>
                    </div>
                  ) : result ? (
                    <div className="p-6 space-y-6">
                      <Alert variant={result.confidence === 'low' ? 'destructive' : 'default'} className="bg-blue-50/50 border-blue-100 text-blue-900 shadow-sm">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="ml-2 font-medium">
                          Always consult a healthcare professional before taking any medication.
                        </AlertDescription>
                      </Alert>

                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-xs">Medicine Name</p>
                          <p className="text-2xl font-bold text-primary">{result.medicineName}</p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-xs">Generic Name</p>
                          <p className="text-lg font-medium">{result.genericName}</p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-xs">Dosage</p>
                          <p className="text-base">{result.dosage}</p>
                        </div>

                        {result.manufacturer && result.manufacturer !== "N/A" && (
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-xs">Manufacturer</p>
                            <p className="text-base">{result.manufacturer}</p>
                          </div>
                        )}
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                            Uses
                          </h4>
                          <p className="text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-lg">{result.uses}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-orange-400 rounded-full"></span>
                            Side Effects
                          </h4>
                          <p className="text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-lg">{result.sideEffects}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-red-400 rounded-full"></span>
                            Precautions
                          </h4>
                          <p className="text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-lg">{result.precautions}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t bg-muted/10 -mx-6 -mb-6 p-6 mt-4">
                        <span className="text-sm font-medium text-muted-foreground">Confidence Level</span>
                        <span className={`text-sm font-bold uppercase shadow-sm ${getConfidenceColor(result.confidence)}`}>
                          {result.confidence} Confidence
                        </span>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar Area (1 col) - Recent Scans */}
          <div className="space-y-6">
            <Card className="shadow-lg h-fit sticky top-6 animate-in fade-in slide-in-from-right-8 duration-700 delay-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-muted-foreground" />
                  Recent Scans
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  {recentScans.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <History className="h-10 w-10 mx-auto mb-3 opacity-20" />
                      <p>No recent scans yet</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {recentScans.map((scan, idx) => (
                        <button
                          key={idx}
                          onClick={() => loadFromHistory(scan)}
                          className="w-full text-left p-4 hover:bg-muted/50 transition-colors flex items-center justify-between group"
                        >
                          <div className="overflow-hidden">
                            <p className="font-medium truncate text-primary group-hover:text-primary/80 transition-colors">
                              {scan.medicineName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {new Date(scan.timestamp || Date.now()).toLocaleDateString()}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
              <CardFooter className="bg-muted/20 border-t p-4">
                <p className="text-xs text-center text-muted-foreground w-full">
                  History is saved locally on your device
                </p>
              </CardFooter>
            </Card>
          </div>

        </div>

        <div className="mt-20 text-center text-sm text-muted-foreground max-w-2xl mx-auto pb-8">
          <p>
            This AI-powered tool is designed for educational purposes. Always verify medicine
            information with a qualified healthcare provider or pharmacist. Never rely solely on
            AI identification for medical decisions.
          </p>
          <div className="mt-4 flex justify-center gap-4 text-xs opacity-60">
            <span>Powered by Gemini AI</span>
            <span>•</span>
            <span>Secure & Private</span>
            <span>•</span>
            <span>React & Supabase</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
