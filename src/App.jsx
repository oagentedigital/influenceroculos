import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Copy, Glasses, Sparkles, User, Camera, Palette, Shirt, Upload, Image as ImageIcon, Wand2, CheckCircle2, SunMedium, ScanFace, Layers3 } from "lucide-react";

const presets = [
  {
    id: "editorial-luxo",
    name: "Editorial de luxo",
    tag: "Campanha premium",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
    description: "Visual sofisticado com foco em textura, expressão e presença da armação.",
    values: {
      estiloFoto: "editorial de moda premium",
      ambiente: "estúdio minimalista com fundo sofisticado em tons neutros",
      iluminacao: "soft light cinematográfica com reflexos controlados",
      enquadramento: "close-up e meio corpo alternando foco no rosto e na armação",
      realismo: "pele natural, textura real, poros visíveis, sem aparência artificial",
    },
  },
  {
    id: "lifestyle-urbano",
    name: "Lifestyle urbano",
    tag: "Uso diário",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
    description: "Foto espontânea com cara de campanha moderna de rua ou cafeteria.",
    values: {
      estiloFoto: "fotografia lifestyle espontânea",
      ambiente: "rua elegante, cafeteria moderna ou fachada urbana",
      iluminacao: "luz natural de fim de tarde",
      enquadramento: "retrato vertical casual, câmera na altura dos olhos",
      realismo: "expressão natural, microimperfeições na pele, cabelo levemente desalinhado",
    },
  },
  {
    id: "otica-produto",
    name: "Ótica / catálogo",
    tag: "Produto em foco",
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1200&q=80",
    description: "Leitura comercial mais limpa para destacar encaixe e design da armação.",
    values: {
      estiloFoto: "fotografia comercial de ótica",
      ambiente: "fundo limpo com estética premium",
      iluminacao: "iluminação uniforme com brilho refinado nas lentes e armação",
      enquadramento: "frontal e 3/4, destacando encaixe no rosto",
      realismo: "rosto realista, sem exagero de retoque, aparência humana convincente",
    },
  },
  {
    id: "beauty-close",
    name: "Beauty close",
    tag: "Pele + lentes",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1200&q=80",
    description: "Close de campanha para valorizar rosto, pele, lentes e acabamento premium.",
    values: {
      estiloFoto: "beauty shot realista de campanha",
      ambiente: "fundo clean premium com profundidade suave",
      iluminacao: "luz de beauty campaign com brilho sutil e sombras suaves",
      enquadramento: "extreme close-up com foco nos olhos, pele e armação",
      realismo: "textura real de pele, cílios detalhados, lábios naturais e sem acabamento plástico",
    },
  },
];

const options = {
  tipoOculos: ["óculos de grau", "óculos solar", "armação redonda", "armação quadrada", "armação gatinho", "armação aviador", "armação acetato premium"],
  material: ["acetato italiano", "metal escovado", "madeira nobre", "titânio leve", "acabamento fosco", "acabamento brilhante"],
  publico: ["mulher negra", "homem negro", "mulher branca", "homem branco", "mulher madura", "homem maduro", "jovem fashionista", "executivo elegante"],
  expressao: ["confiante", "leve sorriso", "olhar sofisticado", "expressão neutra", "expressão espontânea"],
  ambienteExtra: ["cafeteria premium", "galeria de arte", "rua arborizada", "estúdio clean", "escritório moderno", "varanda ensolarada"],
  roupa: ["look casual chic", "alfaiataria moderna", "roupa minimalista neutra", "jaqueta premium", "camisa social elegante"],
  camera: ["85mm", "50mm", "35mm", "close-up beauty", "meio corpo editorial"],
};

const realismCommands = {
  "Rosto e pele": [
    "pele com textura real",
    "poros visíveis e naturais",
    "leve oleosidade em pontos de luz",
    "microassimetrias faciais realistas",
  ],
  "Óculos": [
    "ponte nasal realista",
    "hastes alinhadas nas orelhas",
    "lentes com reflexo sutil",
    "armação sem deformação",
  ],
  "Ambiente": [
    "fundo levemente imperfeito",
    "profundidade de campo natural",
    "sombras suaves coerentes",
    "luz ambiente crível",
  ],
  "Enquadramento": [
    "ângulo de rosto compatível com a armação",
    "close-up publicitário realista",
    "retrato vertical com foco nos olhos",
    "meio corpo editorial elegante",
  ],
  "Iluminação": [
    "luz de janela difusa",
    "golden hour suave",
    "soft light de estúdio",
    "reflexos controlados nas lentes",
  ],
};

function ChipGroup({ title, icon, items, value, onChange }) {
  return (
    <Card className="rounded-[28px] border-white/60 bg-white/80 backdrop-blur shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2 text-zinc-900">{icon}{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => onChange(item)}
            className={`px-3 py-2 rounded-2xl border text-sm transition ${value === item ? "bg-zinc-900 text-white border-zinc-900 shadow" : "bg-white hover:bg-zinc-50 border-zinc-200"}`}
          >
            {item}
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

function UploadCard({ title, description, file, preview, onChange }) {
  return (
    <Card className="rounded-[28px] border-white/60 bg-white/80 backdrop-blur shadow-[0_10px_40px_rgba(0,0,0,0.05)] overflow-hidden">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2"><Upload className="w-4 h-4" /> {title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-zinc-600">{description}</p>
        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-zinc-200 rounded-[24px] p-6 cursor-pointer hover:bg-zinc-50 transition">
          <ImageIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Selecionar imagem</span>
          <input type="file" accept="image/*" className="hidden" onChange={onChange} />
        </label>
        {file && (
          <div className="text-sm text-zinc-700">
            <span className="font-medium">Arquivo:</span> {file.name}
          </div>
        )}
        <div className="rounded-[24px] overflow-hidden border border-zinc-200 bg-zinc-100">
          {preview ? (
            <img src={preview} alt={title} className="w-full h-64 object-contain bg-white" />
          ) : (
            <div className="h-64 bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center text-zinc-500 text-sm">
              Prévia da imagem
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ExamplePresetCard({ preset, onClick }) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      onClick={() => onClick(preset)}
      className="text-left rounded-[28px] overflow-hidden border border-white/60 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)]"
    >
      <div className="relative h-52 overflow-hidden">
        <img src={preset.image} alt={preset.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
        <Badge className="absolute top-4 left-4 rounded-full bg-white/90 text-zinc-900 hover:bg-white">{preset.tag}</Badge>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="font-semibold text-lg">{preset.name}</div>
          <div className="text-sm text-white/85 mt-1">{preset.description}</div>
        </div>
      </div>
    </motion.button>
  );
}

export default function GeradorPromptsOculosMVP() {
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
    detalhes: "mãos naturais, lentes com reflexo sutil, encaixe realista no nariz e nas orelhas, sem distorções faciais, composição elegante para campanha de ótica",
  });

  const [glassFile, setGlassFile] = useState(null);
  const [glassPreview, setGlassPreview] = useState("");
  const [modelFile, setModelFile] = useState(null);
  const [modelPreview, setModelPreview] = useState("");
  const [selectedCommands, setSelectedCommands] = useState([]);

  const applyPreset = (preset) => {
    setForm((prev) => ({ ...prev, ...preset.values }));
  };

  const handleImageUpload = (event, type) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);

    if (type === "glasses") {
      setGlassFile(file);
      setGlassPreview(previewUrl);
    }

    if (type === "model") {
      setModelFile(file);
      setModelPreview(previewUrl);
    }
  };

  const toggleCommand = (command) => {
    setSelectedCommands((prev) =>
      prev.includes(command) ? prev.filter((item) => item !== command) : [...prev, command]
    );
  };

  const prompt = useMemo(() => {
    const glassesReference = glassFile
      ? `Use the uploaded glasses image as the exact product reference. Preserve the frame design, shape, temples, front structure, bridge, proportions, material appearance, and color fidelity from the uploaded glasses image (${glassFile.name}).`
      : `Create a premium eyewear design based on the selected product attributes.`;

    const modelReference = modelFile
      ? `Use the uploaded model image as the facial and body reference. Preserve identity, skin tone, facial structure, hairstyle, proportions, and overall realism from the uploaded model image (${modelFile.name}).`
      : `Create a believable human model according to the selected audience.`;

    const extraCommands = selectedCommands.length
      ? `Additional realism commands: ${selectedCommands.join(", ")}.`
      : "";

    return `${mode === "video" ? "Ultra realistic cinematic fashion frame" : "Ultra realistic"} ${form.estiloFoto} of ${form.publico} wearing ${form.tipoOculos} from the ${form.nomeColecao}, with ${form.material}, ${form.expressao}, in ${form.ambiente} inspired by ${form.ambienteExtra}. Outfit: ${form.roupa}. Lighting: ${form.iluminacao}. Framing: ${form.enquadramento}. Camera lens: ${form.camera}. Realism requirements: ${form.realismo}. ${modelReference} ${glassesReference} The glasses must be naturally inserted onto the character's face with anatomically correct fit on the nose and ears, realistic scale, correct perspective, believable shadow contact, subtle lens reflections, and no facial distortion. Ensure the frame sits naturally on the character instead of floating or looking pasted on. Match the glasses orientation to the face angle and eye line. Product fidelity: premium textures, luxury optical campaign quality, accurate proportions, realistic temple alignment, realistic nose bridge support. ${extraCommands} Extra details: ${form.detalhes}. 8K, highly detailed, luxury eyewear campaign, natural skin texture, believable human features, premium optical brand aesthetic.`;
  }, [form, glassFile, modelFile, selectedCommands, mode]);

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(prompt);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fdf2f8,_#fafaf9_35%,_#f4f4f5_100%)] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="rounded-[36px] border border-white/70 bg-white/70 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="p-8 md:p-10 space-y-6">
              <Badge className="rounded-full bg-zinc-900 text-white hover:bg-zinc-900 w-fit">Gerador realista para ótica</Badge>
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-950">
                  Crie modelos reais para seus óculos com visual premium
                </h1>
                <p className="text-zinc-600 text-base md:text-lg max-w-xl">
                  Interface inspirada no estilo do site de referência, agora com presets visuais, cards com imagens de exemplo e biblioteca de comandos para gerar prompts mais realistas para campanhas de armações.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button className="rounded-2xl px-5" onClick={copyPrompt}>
                  <Copy className="w-4 h-4 mr-2" /> Copiar prompt
                </Button>
                <div className="inline-flex rounded-2xl bg-zinc-100 p-1 border border-zinc-200">
                  <button onClick={() => setMode("imagem")} className={`px-4 py-2 rounded-xl text-sm ${mode === "imagem" ? "bg-white shadow text-zinc-900" : "text-zinc-500"}`}>Imagem</button>
                  <button onClick={() => setMode("video")} className={`px-4 py-2 rounded-xl text-sm ${mode === "video" ? "bg-white shadow text-zinc-900" : "text-zinc-500"}`}>Vídeo</button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                {[
                  { icon: <Glasses className="w-4 h-4" />, label: "Armação fiel" },
                  { icon: <ScanFace className="w-4 h-4" />, label: "Rosto preservado" },
                  { icon: <SunMedium className="w-4 h-4" />, label: "Luz realista" },
                  { icon: <Layers3 className="w-4 h-4" />, label: "Prompt otimizado" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 flex items-center gap-2">
                    {item.icon}
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[360px] bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 p-6 md:p-8">
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="rounded-[28px] overflow-hidden bg-white/10 border border-white/10 backdrop-blur-sm">
                  {modelPreview ? (
                    <img src={modelPreview} alt="Modelo" className="w-full h-full object-cover" />
                  ) : (
                    <img src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80" alt="Exemplo de modelo" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="rounded-[28px] overflow-hidden bg-white/10 border border-white/10 backdrop-blur-sm flex items-center justify-center p-4">
                  {glassPreview ? (
                    <img src={glassPreview} alt="Óculos" className="w-full h-full object-contain bg-white rounded-[24px]" />
                  ) : (
                    <img src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80" alt="Exemplo de óculos" className="w-full h-full object-cover rounded-[24px]" />
                  )}
                </div>
                <div className="col-span-2 rounded-[28px] border border-white/10 bg-white/10 backdrop-blur-sm p-5 text-white">
                  <div className="text-sm uppercase tracking-[0.2em] text-white/60">Seu prompt otimizado</div>
                  <p className="text-sm leading-6 text-white/90 mt-3 line-clamp-5">
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
              />

              <UploadCard
                title="Imagem da personagem / modelo"
                description="Envie o rosto ou a personagem que será mantida na composição final do prompt."
                file={modelFile}
                preview={modelPreview}
                onChange={(e) => handleImageUpload(e, "model")}
              />
            </div>

            <Card className="rounded-[28px] border-white/60 bg-white/80 backdrop-blur shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
              <CardHeader>
                <CardTitle className="text-lg">Dados da coleção</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nome da coleção</label>
                  <Input value={form.nomeColecao} onChange={(e) => setForm({ ...form, nomeColecao: e.target.value })} className="rounded-2xl mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Iluminação</label>
                  <Input value={form.iluminacao} onChange={(e) => setForm({ ...form, iluminacao: e.target.value })} className="rounded-2xl mt-1" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Ambiente base</label>
                  <Input value={form.ambiente} onChange={(e) => setForm({ ...form, ambiente: e.target.value })} className="rounded-2xl mt-1" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Detalhes extras</label>
                  <Textarea rows={4} value={form.detalhes} onChange={(e) => setForm({ ...form, detalhes: e.target.value })} className="rounded-2xl mt-1" />
                </div>
              </CardContent>
            </Card>

            <ChipGroup title="Tipo de óculos" icon={<Glasses className="w-4 h-4" />} items={options.tipoOculos} value={form.tipoOculos} onChange={(v) => setForm({ ...form, tipoOculos: v })} />
            <ChipGroup title="Material" icon={<Sparkles className="w-4 h-4" />} items={options.material} value={form.material} onChange={(v) => setForm({ ...form, material: v })} />
            <ChipGroup title="Modelo / público" icon={<User className="w-4 h-4" />} items={options.publico} value={form.publico} onChange={(v) => setForm({ ...form, publico: v })} />
            <ChipGroup title="Expressão" icon={<User className="w-4 h-4" />} items={options.expressao} value={form.expressao} onChange={(v) => setForm({ ...form, expressao: v })} />
            <ChipGroup title="Ambiente complementar" icon={<Palette className="w-4 h-4" />} items={options.ambienteExtra} value={form.ambienteExtra} onChange={(v) => setForm({ ...form, ambienteExtra: v })} />
            <ChipGroup title="Roupa" icon={<Shirt className="w-4 h-4" />} items={options.roupa} value={form.roupa} onChange={(v) => setForm({ ...form, roupa: v })} />
            <ChipGroup title="Câmera / enquadramento" icon={<Camera className="w-4 h-4" />} items={options.camera} value={form.camera} onChange={(v) => setForm({ ...form, camera: v })} />
          </div>

          <div className="space-y-6">
            <Card className="rounded-[28px] border-white/60 bg-white/80 backdrop-blur shadow-[0_10px_40px_rgba(0,0,0,0.05)] sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Prompt final</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Imagem do óculos</Badge>
                  <Badge variant="secondary">Imagem da modelo</Badge>
                  <Badge variant="secondary">Realismo</Badge>
                  <Badge variant="secondary">Ótica</Badge>
                  <Badge variant="secondary">Campanha</Badge>
                </div>
                <Textarea value={prompt} readOnly rows={20} className="text-sm rounded-2xl" />
                <Button onClick={copyPrompt} className="w-full rounded-2xl">
                  <Copy className="w-4 h-4 mr-2" /> Copiar prompt
                </Button>
                <div className="rounded-2xl bg-zinc-50 border border-zinc-200 p-4 text-xs text-zinc-600 leading-relaxed">
                  Esta interface foi redesenhada com cards visuais, presets com imagens de exemplo, alternância imagem/vídeo e uma seção de comandos organizados — inspirada na estrutura do site de referência, que apresenta alternância Imagem/Vídeo, área de “prompt otimizado”, presets visuais e categorias de comandos de realismo. ([medaumhumano.com](https://medaumhumano.com/))
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[28px] border-white/60 bg-white/80 backdrop-blur shadow-[0_10px_40px_rgba(0,0,0,0.05)] overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Wand2 className="w-5 h-5" /> Comandos para realismo</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="Rosto e pele" className="w-full">
                  <TabsList className="w-full h-auto flex flex-wrap justify-start gap-2 bg-transparent p-0 mb-4">
                    {Object.keys(realismCommands).map((group) => (
                      <TabsTrigger key={group} value={group} className="rounded-2xl border border-zinc-200 data-[state=active]:bg-zinc-900 data-[state=active]:text-white">
                        {group}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {Object.entries(realismCommands).map(([group, commands]) => (
                    <TabsContent key={group} value={group} className="mt-0">
                      <div className="grid gap-3">
                        {commands.map((command) => {
                          const active = selectedCommands.includes(command);
                          return (
                            <button
                              key={command}
                              onClick={() => toggleCommand(command)}
                              className={`w-full text-left rounded-2xl border p-4 transition ${active ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-white hover:bg-zinc-50"}`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="font-medium">{command}</div>
                                  <div className={`text-sm mt-1 ${active ? "text-white/80" : "text-zinc-500"}`}>
                                    Clique para adicionar este ajuste ao prompt.
                                  </div>
                                </div>
                                <CheckCircle2 className={`w-5 h-5 shrink-0 ${active ? "text-white" : "text-zinc-300"}`} />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
