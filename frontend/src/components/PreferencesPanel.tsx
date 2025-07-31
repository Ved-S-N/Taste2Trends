import React, { useState } from "react";
import {
  Heart,
  Music,
  Film,
  Coffee,
  Palette,
  MapPin,
  Star,
  Plus,
  X,
} from "lucide-react";

interface PreferenceCategory {
  id: string;
  name: string;
  icon: any;
  items: string[];
  selectedItems: string[];
}

export const PreferencesPanel: React.FC = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const [customPreferences, setCustomPreferences] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedInsight, setGeneratedInsight] = useState<{
    domains: string[];
    companies: string[];
    insight: string;
  } | null>(null);

  const [categories, setCategories] = useState<PreferenceCategory[]>([
    {
      id: "entertainment",
      name: "Entertainment",
      icon: Film,
      items: [
        "Streaming Shows",
        "Independent Films",
        "Documentaries",
        "Comedy Specials",
        "Anime",
        "Reality TV",
      ],
      selectedItems: ["Streaming Shows", "Independent Films"],
    },
    {
      id: "music",
      name: "Music",
      icon: Music,
      items: [
        "Pop",
        "Rock",
        "Hip-Hop",
        "Electronic",
        "Jazz",
        "Classical",
        "Indie",
        "Folk",
      ],
      selectedItems: ["Electronic", "Indie"],
    },
    {
      id: "food",
      name: "Food & Dining",
      icon: Coffee,
      items: [
        "Fine Dining",
        "Street Food",
        "Vegan",
        "Asian Cuisine",
        "Mediterranean",
        "Craft Cocktails",
      ],
      selectedItems: ["Asian Cuisine", "Craft Cocktails"],
    },
    {
      id: "lifestyle",
      name: "Lifestyle",
      icon: Heart,
      items: [
        "Wellness",
        "Fitness",
        "Travel",
        "Photography",
        "Reading",
        "Gaming",
        "Fashion",
      ],
      selectedItems: ["Wellness", "Travel", "Photography"],
    },
  ]);

  const togglePreference = (categoryId: string, item: string) => {
    setCategories((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          const isSelected = category.selectedItems.includes(item);
          return {
            ...category,
            selectedItems: isSelected
              ? category.selectedItems.filter((selected) => selected !== item)
              : [...category.selectedItems, item],
          };
        }
        return category;
      })
    );
  };

  const generateInsight = async () => {
    if (!userPrompt.trim()) return;

    setIsGenerating(true);

    try {
      // Make HTTP request to generate insights based on user preferences
      const response = await fetch("http://127.0.0.1:8000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userPrompt: userPrompt.trim(),
          selectedPreferences: categories.reduce((acc, cat) => {
            return [...acc, ...cat.selectedItems];
          }, [] as string[]),
          customPreferences: customPreferences,
        }),
      });

      if (response.ok) {
        const raw = await response.json();
        const insight = raw.insight ? raw : raw.data;

        // Apply safe defaults to prevent crash
        const extractCompanies = (text: string) => {
          const match = text.match(/Suggested Companies:\s*(.+)/i);
          if (match) {
            return match[1].split(",").map((c) => c.trim());
          }
          return [];
        };

        const extractDomains = (text: string) => {
          const match = text.match(/Domains:\s*(.+)/i);
          if (match) {
            return match[1].split(",").map((d) => d.trim());
          }
          return [];
        };

        setGeneratedInsight({
          insight: insight.insight || "No insight available.",
          domains:
            insight.domains?.length > 0
              ? insight.domains
              : extractDomains(insight.insight),
          companies:
            insight.companies?.length > 0
              ? insight.companies
              : extractCompanies(insight.insight),
        });

        if (!customPreferences.includes(userPrompt.trim())) {
          setCustomPreferences((prev) => [...prev, userPrompt.trim()]);
        }

        setUserPrompt("");
        console.log("Generated insight:", insight);
      } else {
        console.error("Failed to generate insight");
      }
    } catch (error) {
      console.error("Error generating insight:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const removeCustomPreference = (preference: string) => {
    setCustomPreferences((prev) => prev.filter((p) => p !== preference));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      generateInsight();
    }
  };

  const getPreferenceScore = () => {
    const totalSelected =
      categories.reduce((sum, cat) => sum + cat.selectedItems.length, 0) +
      customPreferences.length;
    const totalItems =
      categories.reduce((sum, cat) => sum + cat.items.length, 0) + 10; // Adding weight for custom preferences
    return Math.round((totalSelected / totalItems) * 100);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your Preferences
            </h2>
            <p className="text-gray-600">
              Fine-tune your taste profile for better trend predictions
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
              <span className="text-2xl font-bold text-blue-600">
                {getPreferenceScore()}%
              </span>
            </div>
            <p className="text-sm text-gray-600">Profile Complete</p>
          </div>
        </div>
      </div>

      {/* Custom Preferences Input */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Plus className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Add Custom Preferences
              </h3>
              <p className="text-sm text-gray-500">
                Type your specific interests, brands, or activities
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex space-x-3 mb-4">
            <input
              type="text"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Sustainable fashion, K-pop, Artisanal coffee..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
            <button
              onClick={generateInsight}
              disabled={!userPrompt.trim() || isGenerating}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl transition-colors duration-200 flex items-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Generate Insight</span>
                </>
              )}
            </button>
          </div>

          {customPreferences.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">
                Your Custom Preferences:
              </h4>
              <div className="flex flex-wrap gap-2">
                {customPreferences.map((preference, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-purple-50 border border-purple-200 text-purple-700 px-3 py-2 rounded-lg text-sm"
                  >
                    <span>{preference}</span>
                    <button
                      onClick={() => removeCustomPreference(preference)}
                      className="text-purple-500 hover:text-purple-700 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Display Generated Insight */}
      {generatedInsight && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="text-xl font-bold text-gray-900">
            🔍 Personalized Market Insight
          </h3>

          <div className="space-y-2 text-gray-800">
            <p className="text-gray-700 whitespace-pre-line">
              {generatedInsight.insight}
            </p>

            {generatedInsight.domains?.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800">
                  Suggested Domains
                </h4>
                <ul className="list-disc list-inside text-gray-700">
                  {generatedInsight.domains.map((domain, idx) => (
                    <li key={idx}>{domain}</li>
                  ))}
                </ul>
              </div>
            )}

            {generatedInsight.companies?.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800">
                  Leading Companies
                </h4>
                <ul className="list-disc list-inside text-gray-700">
                  {generatedInsight.companies.map((company, idx) => (
                    <li key={idx}>{company}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <category.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {category.selectedItems.length} of {category.items.length}{" "}
                    selected
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-3">
                {category.items.map((item) => {
                  const isSelected = category.selectedItems.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => togglePreference(category.id, item)}
                      className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                        isSelected
                          ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{item}</span>
                        {isSelected && (
                          <Star className="w-4 h-4 fill-current" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Qloo Integration Status */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-6 border border-teal-100">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
            <Palette className="w-6 h-6 text-teal-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              Qloo Integration
            </h3>
            <p className="text-gray-600 text-sm">
              Your preferences are being analyzed using Qloo's cultural taste
              intelligence to provide more accurate trend predictions.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-600">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
