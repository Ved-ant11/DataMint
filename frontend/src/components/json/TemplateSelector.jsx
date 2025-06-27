import { TEMPLATES } from "@/utils/constants";

export default function TemplateSelector({
  selectedTemplate,
  setSelectedTemplate,
}) {
  return (
    <div>
      <label className="block text-gray-300 mb-2">Or choose a template</label>
      <div className="grid grid-cols-3 gap-2">
        {TEMPLATES.map((template) => (
          <button
            key={template.id}
            className={`p-3 rounded-lg border transition-all ${
              selectedTemplate === template.id
                ? "bg-primary-500/20 border-primary-500"
                : "bg-gray-800/30 border-gray-700 hover:border-gray-500"
            }`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <div className="text-lg">{template.icon}</div>
            <div className="text-sm mt-1 text-gray-200">{template.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
