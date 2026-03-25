import React, { useEffect, useMemo, useState } from "react";

const presets = [
  {
    id: "editorial-luxo",
    name: "Editorial de luxo",
    tag: "Campanha premium",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
    description:
      "Visual sofisticado com foco em textura, expressão e presença da armação.",
    values: {
      estiloFoto: "editorial de moda premium",
      ambiente: "estúdio minimalista com fundo sofisticado em tons neutros",
      iluminacao: "soft light cinematográfica com reflexos controlados",
      enquadramento:
        "close-up e meio corpo alternando foco no rosto e na armação",
      realismo:
        "pele natural, textura real, poros visíveis, sem aparência artificial",
    },
  },
  {
    id: "lifestyle-urbano",
    name: "Lifestyle urbano",
    tag: "Uso diário",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
    description:
      "Foto espontânea com cara de campanha moderna de rua ou cafeteria.",
    values: {
      estiloFoto: "fotografia lifestyle espontânea",
      ambiente: "rua elegante, cafeteria moderna ou fachada urbana",
      iluminacao: "luz natural de fim de tarde",
      enquadramento: "retrato vertical casual, câmera na altura dos olhos",
      realismo:
        "expressão natural, microimperfeições na pele, cabelo levemente desalinhado",
    },
  },
  {
    id: "otica-produto",
    name: "Ótica / catálogo",
    tag: "Produto em foco",
    image:
      "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1200&q=80",
    description:
      "Leitura comercial mais limpa para destacar encaixe e design da armação.",
    values: {
      estiloFoto: "fotografia comercial de ótica",
      ambiente: "fundo limpo com estética premium",
      iluminacao:
        "iluminação uniforme com brilho refinado nas lentes e armação",
      enquadramento: "frontal e 3/4, destacando encaixe no rosto",
      realismo:
        "rosto realista, sem exagero de retoque, aparência humana convincente",
    },
  },
  {
    id: "beauty-close",
    name: "Beauty close",
    tag: "Pele + lentes",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1200&q=80",
    description:
      "Close de campanha para valorizar rosto, pele, lentes e acabamento premium.",
    values: {
      estiloFoto: "beauty shot realista de campanha",
      ambiente: "fundo clean premium com profundidade suave",
      iluminacao: "luz de beauty campaign com brilho sutil e sombras suaves",
      enquadramento: "extreme close-up com foco nos olhos, pele e armação",
      realismo:
        "textura real de pele, cílios detalhados, lábios naturais e sem acabamento plástico",
    },
  },
];

const options = {
  tipoOculos: [
    "óculos de grau",
    "óculos solar",
    "armação redonda",
    "armação quadrada",
    "armação gatinho",
    "armação aviador",
    "armação acetato premium",
  ],
  material: [
    "acetato italiano",
    "metal escovado",
    "madeira nobre",
    "titânio leve",
    "acabamento fosco",
    "acabamento brilhante",
  ],
  publico: [
    "mulher negra",
    "homem negro",
    "mulher branca",
    "homem branco",
    "mulher madura",
    "homem maduro",
    "jovem fashionista",
    "executivo elegante",
  ],
  expressao: [
    "confiante",
    "leve sorriso",
    "olhar sofisticado",
    "expressão neutra",
    "expressão espontânea",
  ],
  ambienteExtra: [
    "cafeteria premium",
    "galeria de arte",
    "rua arborizada",
    "estúdio clean",
    "escritório moderno",
    "varanda ensolarada",
  ],
  roupa: [
    "look casual chic",
    "alfaiataria moderna",
    "roupa minimalista neutra",
    "jaqueta premium",
    "camisa social elegante",
  ],
  camera: ["85mm", "50mm", "35mm", "close-up beauty", "meio corpo editorial"],
};

const realismCommands = {
  "Rosto e pele": [
    "pele com textura real",
    "poros visíveis e naturais",
    "leve oleosidade em pontos de luz",
    "microassimetrias faciais realistas",
  ],
  Óculos: [
    "ponte nasal realista",
    "hastes alinhadas nas orelhas",
    "lentes com reflexo sutil",
    "armação sem deformação",
  ],
  Ambiente: [
    "fundo levemente imperfeito",
    "profundidade de campo natural",
    "sombras suaves coerentes",
    "luz ambiente crível",
  ],
  Enquadramento: [
    "ângulo de rosto compatível com a armação",
    "close-up publicitário realista",
    "retrato vertical com foco nos olhos",
    "meio corpo editorial elegante",
  ],
  Iluminação: [
    "luz de janela difusa",
    "golden hour suave",
    "soft light de estúdio",
    "reflexos controlados nas lentes",
  ],
};

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function safeRevoke(url) {
  if (url && typeof url === "string" && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

function buildPrompt({ form, glassFile, modelFile, selectedCommands, mode }) {
  const glassesReference = glassFile
    ? `Use the uploaded glasses image as the exact product reference. Preserve the frame design, shape, temples, front structure, bridge, proportions, material appearance, and color fidelity from the uploaded glasses image (${glassFile.name}).`
    : "Create a premium eyewear design based on the selected product attributes.";

  const modelReference = modelFile
    ? `Use the uploaded model image as the facial and body reference. Preserve identity, skin tone, facial structure, hairstyle, proportions, and overall realism from the uploaded model image (${modelFile.name}).`
    : "Create a believable human model according to the selected audience.";

  const extraCommands = selectedCommands.length
    ? `Additional realism commands: ${selectedCommands.join(", ")}.`
    : "";

  return `${mode === "video" ? "Ultra realistic cinematic fashion frame" : "Ultra realistic"} ${form.estiloFoto} of ${form.publico} wearing ${form.tipoOculos} from the ${form.nomeColecao}, with ${form.material}, ${form.expressao}, in ${form.ambiente} inspired by ${form.ambienteExtra}. Outfit: ${form.roupa}. Lighting: ${form.iluminacao}. Framing: ${form.enquadramento}. Camera lens: ${form.camera}. Realism requirements: ${form.realismo}. ${modelReference} ${glassesReference} The glasses must be naturally inserted onto the character's face with anatomically correct fit on the nose and ears, realistic scale, correct perspective, believable shadow contact, subtle lens reflections, and no facial distortion. Ensure the frame sits naturally on the character instead of floating or looking pasted on. Match the glasses orientation to the face angle and eye line. Product fidelity: premium textures, luxury optical campaign quality, accurate proportions, realistic temple alignment, realistic nose bridge support. ${extraCommands} Extra details: ${form.detalhes}. 8K, highly detailed, luxury eyewear campaign, natural skin texture, believable human features, premium optical brand aesthetic.`;
}

function runSelfTests() {
  const sampleForm = {
    nomeColecao: "Coleção Signature",
    estiloFoto: "editorial de moda premium",
    tipoOculos: "armação acetato premium",
    material: "acetato italiano",
    publico: "mulher negra",
    expressao: "confiante",
    ambiente: "estúdio clean",
    ambienteExtra: "galeria de arte",
    roupa: "alfaiataria moderna",
    iluminacao: "soft light cinematográfica",
    enquadramento: "close-up",
    camera: "85mm",
    realismo: "pele natural",
    detalhes: "sem distorções faciais",
  };

  const imagePrompt = buildPrompt({
    form: sampleForm,
    glassFile: null,
    modelFile: null,
    selectedCommands: [],
    mode: "imagem",
  });

  const videoPrompt = buildPrompt({
    form: sampleForm,
    glassFile: null,
    modelFile: null,
    selectedCommands: [],
    mode: "video",
  });

  return [
    {
      name: "modo imagem usa prefixo padrão",
      pass: imagePrompt.startsWith("Ultra realistic editorial de moda premium"),
    },
    {
      name: "modo vídeo usa prefixo cinematográfico",
      pass: videoPrompt.startsWith("Ultra realistic cinematic fashion frame"),
    },
    {
      name: "comandos extras entram no prompt",
      pass: buildPrompt({
        form: sampleForm,
        glassFile: null,
        modelFile: null,
        selectedCommands: ["pele com textura real"],
        mode: "imagem",
      }).includes("Additional realism commands: pele com textura real."),
    },
    {
      name: "referência do óculos entra quando há upload",
      pass: buildPrompt({
        form: sampleForm,
        glassFile: { name: "oculos.png" },
        modelFile: null,
        selectedCommands: [],
        mode: "imagem",
      }).includes("oculos.png"),
    },
    {
      name: "referência da modelo entra quando há upload",
      pass: buildPrompt({
        form: sampleForm,
        glassFile: null,
        modelFile: { name: "modelo.jpg" },
        selectedCommands: [],
        mode: "imagem",
      }).includes("modelo.jpg"),
    },
    {
      name: "sem upload usa fallback de óculos",
      pass: imagePrompt.includes(
        "Create a premium eyewear design based on the selected product attributes."
      ),
    },
    {
      name: "sem upload usa fallback de modelo",
      pass: imagePrompt.includes(
        "Create a believable human model according to the selected audience."
      ),
    },
    {
      name: "modo vídeo não quebra com comandos vazios",
      pass: typeof videoPrompt === "string" && videoPrompt.length > 50,
    },
  ];
}

function IconBase(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    />
  );
}

function CopyIcon(props) {
  return (
    <IconBase {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </IconBase>
  );
}

function GlassesIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M2 13l2-6h16l2 6" />
      <path d="M6 13a3 3 0 1 0 6 0" />
      <path d="M12 13a3 3 0 1 0 6 0" />
      <path d="M9 13h6" />
    </IconBase>
  );
}

function SparklesIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 3l1.5 3.5L17 8l-3.5 1.5L12 13l-1.5-3.5L7 8l3.5-1.5L12 3z" />
      <path d="M5 14l.8 1.7L7.5 16l-1.7.8L5 18.5l-.8-1.7L2.5 16l1.7-.3L5 14z" />
      <path d="M19 14l.8 1.7 1.7.3-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.3.8-1.7z" />
    </IconBase>
  );
}

function UserIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </IconBase>
  );
}

function CameraIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M4 7h3l2-2h6l2 2h3v12H4z" />
      <circle cx="12" cy="13" r="4" />
    </IconBase>
  );
}

function PaletteIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 22a10 10 0 1 1 10-10c0 2-1.5 3-3 3h-2a2 2 0 0 0-2 2c0 1.7-1.3 3-3 3z" />
      <circle cx="7.5" cy="10.5" r=".5" />
      <circle cx="12" cy="7.5" r=".5" />
      <circle cx="16.5" cy="10.5" r=".5" />
    </IconBase>
  );
}

function ShirtIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M8 4l4 2 4-2 3 3-2 3v10H7V10L5 7l3-3z" />
    </IconBase>
  );
}

function UploadIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 16V4" />
      <path d="M8 8l4-4 4 4" />
      <path d="M4 20h16" />
    </IconBase>
  );
}

function ImageIconSvg(props) {
  return (
    <IconBase {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="10.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </IconBase>
  );
}

function WandIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M15 4V2" />
      <path d="M15 16v-2" />
      <path d="M8 9H6" />
      <path d="M20 9h-2" />
      <path d="M17.8 6.2L19 5" />
      <path d="M17.8 11.8 19 13" />
      <path d="M12.2 6.2 11 5" />
      <path d="M12.2 11.8 11 13" />
      <path d="M4 20l8.5-8.5" />
    </IconBase>
  );
}

function CheckIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l2.5 2.5L16 9" />
    </IconBase>
  );
}

function SunIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m4.9 4.9 1.4 1.4" />
      <path d="m17.7 17.7 1.4 1.4" />
      <path d="m19.1 4.9-1.4 1.4" />
      <path d="m6.3 17.7-1.4 1.4" />
    </IconBase>
  );
}

function ScanFaceIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M4 8V6a2 2 0 0 1 2-2h2" />
      <path d="M20 8V6a2 2 0 0 0-2-2h-2" />
      <path d="M4 16v2a2 2 0 0 0 2 2h2" />
      <path d="M20 16v2a2 2 0 0 1-2 2h-2" />
      <path d="M9 10a3 3 0 0 1 6 0" />
      <path d="M8 17a5 5 0 0 1 8 0" />
    </IconBase>
  );
}

function LayersIcon(props) {
  return (
    <IconBase {...props}>
      <path d="m12 3 9 5-9 5-9-5 9-5z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 16 9 5 9-5" />
    </IconBase>
  );
}

function Panel({ children, className }) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/60 bg-white/80 backdrop-blur shadow-[0_10px_40px_rgba(0,0,0,0.05)]",
        className
      )}
    >
      {children}
    </div>
  );
}

function SectionTitle({ icon, title, subtitle }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-zinc-950 font-semibold">
        {icon}
        <span>{title}</span>
      </div>
      {subtitle ? <p className="text-sm text-zinc-600">{subtitle}</p> : null}
    </div>
  );
}

function PillButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-2 rounded-2xl border text-sm transition",
        active
          ? "bg-zinc-900 text-white border-zinc-900 shadow"
          : "bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-800"
      )}
    >
      {children}
    </button>
  );
}

function PrimaryButton({ onClick, disabled, className, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-5 py-3 bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition disabled:opacity-50",
        className
      )}
    >
      {children}
    </button>
  );
}

function TextInput({ className, ...props }) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-2xl mt-1 border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-300",
        className
      )}
    />
  );
}

function TextArea({ className, ...props }) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-2xl mt-1 border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-300",
        className
      )}
    />
  );
}

function Badge({ className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        className || "bg-zinc-100 text-zinc-700"
      )}
    >
      {children}
    </span>
  );
}

function ChipGroup({ title, icon, items, value, onChange }) {
  return (
    <Panel>
      <div className="p-6 pb-3">
        <SectionTitle icon={icon} title={title} />
      </div>
      <div className="px-6 pb-6 flex flex-wrap gap-2">
        {items.map((item) => (
          <PillButton key={item} active={value === item} onClick={() => onChange(item)}>
            {item}
          </PillButton>
        ))}
      </div>
    </Panel>
  );
}

function UploadCard({ title, description, file, preview, onChange, onClear }) {
  return (
    <Panel className="overflow-hidden">
      <div className="p-6 space-y-4">
        <SectionTitle
          icon={<UploadIcon className="w-4 h-4" />}
          title={title}
          subtitle={description}
        />

        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-zinc-200 rounded-[24px] p-6 cursor-pointer hover:bg-zinc-50 transition">
          <ImageIconSvg className="w-5 h-5" />
          <span className="text-sm font-medium">Selecionar imagem</span>
          <input type="file" accept="image/*" className="hidden" onChange={onChange} />
        </label>

        {file ? (
          <div className="flex items-center justify-between gap-3 text-sm text-zinc-700">
            <span className="truncate">
              <span className="font-medium">Arquivo:</span> {file.name}
            </span>
            <button
              type="button"
              onClick={onClear}
              className="text-zinc-500 hover:text-zinc-900"
            >
              Remover
            </button>
          </div>
        ) : null}

        <div className="rounded-[24px] overflow-hidden border border-zinc-200 bg-zinc-100">
          {preview ? (
            <img
              src={preview}
              alt={title}
              className="w-full h-64 object-contain bg-white"
            />
          ) : (
            <div className="h-64 bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center text-zinc-500 text-sm">
              Prévia da imagem
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}

function ExamplePresetCard({ preset, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(preset)}
      className="text-left rounded-[28px] overflow-hidden border border-white/60 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-transform"
    >
      <div className="relative h-52 overflow-hidden">
        <img src={preset.image} alt={preset.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
        <Badge className="absolute top-4 left-4 bg-white/90 text-zinc-900">
          {preset.tag}
        </Badge>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="font-semibold text-lg">{preset.name}</div>
          <div className="text-sm text-white/85 mt-1">{preset.description}</div>
        </div>
      </div>
    </button>
  );
}

function CommandTabs({ selectedCommands, setSelectedCommands }) {
  const groups = Object.keys(realismCommands);
  const [activeTab, setActiveTab] = useState(groups[0]);

  function toggleCommand(command) {
    setSelectedCommands((prev) =>
      prev.includes(command)
        ? prev.filter((item) => item !== command)
        : [...prev, command]
    );
  }

  return (
    <Panel className="overflow-hidden">
      <div className="p-6 pb-4">
        <SectionTitle
          icon={<WandIcon className="w-5 h-5" />}
          title="Comandos para realismo"
          subtitle="Clique nos ajustes para adicionar ao prompt final."
        />
      </div>

      <div className="px-6 pb-4 flex flex-wrap gap-2">
        {groups.map((group) => (
          <PillButton
            key={group}
            active={group === activeTab}
            onClick={() => setActiveTab(group)}
          >
            {group}
          </PillButton>
        ))}
      </div>

      <div className="px-6 pb-6 grid gap-3">
        {realismCommands[activeTab].map((command) => {
          const active = selectedCommands.includes(command);
          return (
            <button
              type="button"
              key={command}
              onClick={() => toggleCommand(command)}
              className={cn(
                "w-full text-left rounded-2xl border p-4 transition",
                active
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white hover:bg-zinc-50"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{command}</div>
                  <div className={cn("text-sm mt-1", active ? "text-white/80" : "text-zinc-500")}>Clique para adicionar este ajuste ao prompt.</div>
                </div>
                <CheckIcon className={cn("w-5 h-5 shrink-0", active ? "text-white" : "text-zinc-300")} />
              </div>
            </button>
          );
        })}
      </div>
    </Panel>
  );
}

function FeaturePill({ icon, label }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 flex items-center gap-2">
      {icon}
      {label}
    </div>
  );
}

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const success = document.execCommand("copy");
  document.body.removeChild(textarea);
  return success;
}

export default function App() {
  const [mode, setMode] = useState("imagem");
  const [form, setForm] = useState({
    nomeColecao: "Coleção Signature",
    estiloFoto: "editorial de moda premium",
    tipoOculos: "armação acetato premium",
    material: "acetato italiano",
    publico: "mulher negra",
    expressao: "confiante",
    ambiente: "estúdio minimalista com fundo sofisticado em tons neutros",
    ambienteExtra: "galeria de arte",
    roupa: "alfaiataria moderna",
    iluminacao: "soft light cinematográfica com reflexos controlados",
    enquadramento: "close-up e meio corpo alternando foco no rosto e na armação",
    camera: "85mm",
    realismo: "pele natural, textura real, poros visíveis, sem aparência artificial",
    detalhes:
      "mãos naturais, lentes com reflexo sutil, encaixe realista no nariz e nas orelhas, sem distorções faciais, composição elegante para campanha de ótica",
  });
  const [glassFile, setGlassFile] = useState(null);
  const [glassPreview, setGlassPreview] = useState("");
  const [modelFile, setModelFile] = useState(null);
  const [modelPreview, setModelPreview] = useState("");
  const [selectedCommands, setSelectedCommands] = useState([]);
  const [copyStatus, setCopyStatus] = useState("idle");
  const [tests] = useState(runSelfTests());

  useEffect(() => {
    return () => {
      safeRevoke(glassPreview);
      safeRevoke(modelPreview);
    };
  }, [glassPreview, modelPreview]);

  function applyPreset(preset) {
    setForm((prev) => ({ ...prev, ...preset.values }));
  }

  function handleImageUpload(event, type) {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    if (type === "glasses") {
      safeRevoke(glassPreview);
      setGlassFile(file);
      setGlassPreview(previewUrl);
    }

    if (type === "model") {
      safeRevoke(modelPreview);
      setModelFile(file);
      setModelPreview(previewUrl);
    }

    event.target.value = "";
  }

  function clearUpload(type) {
    if (type === "glasses") {
      safeRevoke(glassPreview);
      setGlassFile(null);
      setGlassPreview("");
    }
    if (type === "model") {
      safeRevoke(modelPreview);
      setModelFile(null);
      setModelPreview("");
    }
  }

  const prompt = useMemo(
    () => buildPrompt({ form, glassFile, modelFile, selectedCommands, mode }),
    [form, glassFile, modelFile, selectedCommands, mode]
  );

  async function copyPrompt() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(prompt);
      } else {
        const copied = fallbackCopy(prompt);
        if (!copied) throw new Error("fallback copy failed");
      }
      setCopyStatus("success");
      window.setTimeout(() => setCopyStatus("idle"), 1800);
    } catch {
      setCopyStatus("error");
      window.setTimeout(() => setCopyStatus("idle"), 2200);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fdf2f8,_#fafaf9_35%,_#f4f4f5_100%)] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="rounded-[36px] border border-white/70 bg-white/70 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="p-8 md:p-10 space-y-6">
              <Badge className="bg-zinc-900 text-white">Gerador realista para ótica</Badge>
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-950">
                  Crie modelos reais para seus óculos com visual premium
                </h1>
                <p className="text-zinc-600 text-base md:text-lg max-w-xl">
                  Correção aplicada: React foi importado explicitamente no arquivo. Ao mesmo tempo, o código continua sem aliases internos e sem bibliotecas de UI externas para evitar novas falhas de bundle.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <PrimaryButton onClick={copyPrompt}>
                  <CopyIcon className="w-4 h-4 mr-2" />
                  {copyStatus === "success"
                    ? "Prompt copiado"
                    : copyStatus === "error"
                      ? "Falha ao copiar"
                      : "Copiar prompt"}
                </PrimaryButton>
                <div className="inline-flex rounded-2xl bg-zinc-100 p-1 border border-zinc-200">
                  <button
                    type="button"
                    onClick={() => setMode("imagem")}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm transition",
                      mode === "imagem" ? "bg-white shadow text-zinc-900" : "text-zinc-500"
                    )}
                  >
                    Imagem
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("video")}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm transition",
                      mode === "video" ? "bg-white shadow text-zinc-900" : "text-zinc-500"
                    )}
                  >
                    Vídeo
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <FeaturePill icon={<GlassesIcon className="w-4 h-4" />} label="Armação fiel" />
                <FeaturePill icon={<ScanFaceIcon className="w-4 h-4" />} label="Rosto preservado" />
                <FeaturePill icon={<SunIcon className="w-4 h-4" />} label="Luz realista" />
                <FeaturePill icon={<LayersIcon className="w-4 h-4" />} label="Prompt otimizado" />
              </div>
            </div>

            <div className="relative min-h-[360px] bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 p-6 md:p-8">
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="rounded-[28px] overflow-hidden bg-white/10 border border-white/10 backdrop-blur-sm">
                  {modelPreview ? (
                    <img src={modelPreview} alt="Modelo" className="w-full h-full object-cover" />
                  ) : (
                    <img
                      src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80"
                      alt="Exemplo de modelo"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="rounded-[28px] overflow-hidden bg-white/10 border border-white/10 backdrop-blur-sm flex items-center justify-center p-4">
                  {glassPreview ? (
                    <img
                      src={glassPreview}
                      alt="Óculos"
                      className="w-full h-full object-contain bg-white rounded-[24px]"
                    />
                  ) : (
                    <img
                      src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80"
                      alt="Exemplo de óculos"
                      className="w-full h-full object-cover rounded-[24px]"
                    />
                  )}
                </div>
                <div className="col-span-2 rounded-[28px] border border-white/10 bg-white/10 backdrop-blur-sm p-5 text-white">
                  <div className="text-sm uppercase tracking-[0.2em] text-white/60">Seu prompt otimizado</div>
                  <p className="text-sm leading-6 text-white/90 mt-3 overflow-hidden max-h-[8.5rem]">
                    {prompt}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-zinc-950">Presets com imagens de exemplo</h2>
            <p className="text-zinc-600 mt-1">Clique em um card para aplicar o estilo visual rapidamente.</p>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
            {presets.map((preset) => (
              <ExamplePresetCard key={preset.id} preset={preset} onClick={applyPreset} />
            ))}
          </div>
        </section>

        <section className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <UploadCard
                title="Imagem do óculos"
                description="Envie a armação para usar como referência exata do produto. De preferência, fundo neutro e boa resolução."
                file={glassFile}
                preview={glassPreview}
                onChange={(e) => handleImageUpload(e, "glasses")}
                onClear={() => clearUpload("glasses")}
              />
              <UploadCard
                title="Imagem da personagem / modelo"
                description="Envie o rosto ou a personagem que será mantida na composição final do prompt."
                file={modelFile}
                preview={modelPreview}
                onChange={(e) => handleImageUpload(e, "model")}
                onClear={() => clearUpload("model")}
              />
            </div>

            <Panel>
              <div className="p-6 pb-4">
                <SectionTitle title="Dados da coleção" />
              </div>
              <div className="px-6 pb-6 grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nome da coleção</label>
                  <TextInput value={form.nomeColecao} onChange={(e) => setForm({ ...form, nomeColecao: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium">Iluminação</label>
                  <TextInput value={form.iluminacao} onChange={(e) => setForm({ ...form, iluminacao: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Ambiente base</label>
                  <TextInput value={form.ambiente} onChange={(e) => setForm({ ...form, ambiente: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Detalhes extras</label>
                  <TextArea rows={4} value={form.detalhes} onChange={(e) => setForm({ ...form, detalhes: e.target.value })} />
                </div>
              </div>
            </Panel>

            <ChipGroup title="Tipo de óculos" icon={<GlassesIcon className="w-4 h-4" />} items={options.tipoOculos} value={form.tipoOculos} onChange={(v) => setForm({ ...form, tipoOculos: v })} />
            <ChipGroup title="Material" icon={<SparklesIcon className="w-4 h-4" />} items={options.material} value={form.material} onChange={(v) => setForm({ ...form, material: v })} />
            <ChipGroup title="Modelo / público" icon={<UserIcon className="w-4 h-4" />} items={options.publico} value={form.publico} onChange={(v) => setForm({ ...form, publico: v })} />
            <ChipGroup title="Expressão" icon={<UserIcon className="w-4 h-4" />} items={options.expressao} value={form.expressao} onChange={(v) => setForm({ ...form, expressao: v })} />
            <ChipGroup title="Ambiente complementar" icon={<PaletteIcon className="w-4 h-4" />} items={options.ambienteExtra} value={form.ambienteExtra} onChange={(v) => setForm({ ...form, ambienteExtra: v })} />
            <ChipGroup title="Roupa" icon={<ShirtIcon className="w-4 h-4" />} items={options.roupa} value={form.roupa} onChange={(v) => setForm({ ...form, roupa: v })} />
            <ChipGroup title="Câmera / enquadramento" icon={<CameraIcon className="w-4 h-4" />} items={options.camera} value={form.camera} onChange={(v) => setForm({ ...form, camera: v })} />
          </div>

          <div className="space-y-6">
            <Panel className="sticky top-6">
              <div className="p-6 pb-4">
                <SectionTitle title="Prompt final" />
              </div>
              <div className="px-6 pb-6 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge>Imagem do óculos</Badge>
                  <Badge>Imagem da modelo</Badge>
                  <Badge>Realismo</Badge>
                  <Badge>Ótica</Badge>
                  <Badge>Campanha</Badge>
                </div>
                <TextArea value={prompt} readOnly rows={20} className="resize-none" />
                <PrimaryButton onClick={copyPrompt} className="w-full">
                  <CopyIcon className="w-4 h-4 mr-2" /> Copiar prompt
                </PrimaryButton>
                <div className="rounded-2xl bg-zinc-50 border border-zinc-200 p-4 text-xs text-zinc-600 leading-relaxed">
                  O arquivo agora importa apenas React. Nenhum alias interno, nenhum pacote de UI e nenhum ícone externo são usados, reduzindo ao mínimo a chance de falha no bundling.
                </div>
              </div>
            </Panel>

            <CommandTabs selectedCommands={selectedCommands} setSelectedCommands={setSelectedCommands} />

            <Panel>
              <div className="p-6 space-y-3">
                <SectionTitle title="Casos de teste embutidos" />
                <div className="grid gap-2 text-sm text-zinc-700">
                  {tests.map((test) => (
                    <div key={test.name} className="flex items-center gap-2">
                      <CheckIcon className={cn("w-4 h-4", test.pass ? "text-green-600" : "text-red-600")} />
                      <span>{test.name}: {test.pass ? "passou" : "falhou"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>
          </div>
        </section>
      </div>
    </div>
  );
}
