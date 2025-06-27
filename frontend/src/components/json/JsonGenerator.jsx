import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import TemplateSelector from "./TemplateSelector";
import api from "@/services/api";

export default function JsonGenerator({ setJsonData, setLoading, setError }) {
  const [prompt, setPrompt] = useState("");
  const [count, setCount] = useState(5);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      let response;

      if (selectedTemplate) {
        // Template-based generation
        response = await api.post("/json/generate", {
          template: selectedTemplate,
          count,
        });
      } else {
        // AI-based generation
        response = await api.post("/json/generate-ai", {
          prompt,
          count,
        });
      }

      setJsonData(response.data.data);
    } catch (error) {
      setError(error.response?.data?.error || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-gray-300 mb-2">Describe your data</label>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., healthcare data with patient, disease, age"
          className="input-field bg-gray-800/50 text-white"
          rows={3}
        />
      </div>

      <TemplateSelector
        selectedTemplate={selectedTemplate}
        setSelectedTemplate={setSelectedTemplate}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 mb-2">Record Count</label>
          <input
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="input-field bg-gray-800/50 text-white w-full"
          />
        </div>
        <div className="flex items-end">
          <Button
            onClick={handleGenerate}
            className="btn-primary w-full"
            disabled={!prompt && !selectedTemplate}
          >
            Generate JSON
          </Button>
        </div>
      </div>
    </div>
  );
}
