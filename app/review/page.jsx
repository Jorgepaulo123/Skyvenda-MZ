"use client";
import React, { useState, useMemo, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/api";

// Esta é a versão Next.js da tela de verificação/revisão baseada no teu código React Native.
// Ajustado para web, com selects e upload de imagem usando input type="file".

export default function ReviewPage() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  type Step = 0 | 1 | 2 | 3;

  const [step, setStep] = useState<Step>(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const firstName = useMemo(() => (user?.name || user?.username || ""), [user]);

  // Step 1
  const [dataNascimento, setDataNascimento] = useState("");
  const [nacionalidade, setNacionalidade] = useState("Moçambicana");
  const [sexo, setSexo] = useState("");

  // Step 2
  const [provincia, setProvincia] = useState("");
  const [distrito, setDistrito] = useState("");
  const [bairro, setBairro] = useState("");
  const [contacto, setContacto] = useState("");

  // Step 3 - upload
  const [fotoRetrato, setFotoRetrato] = useState<File | null>(null);
  const [fotoFrente, setFotoFrente] = useState<File | null>(null);
  const [fotoVerso, setFotoVerso] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const sexoOptions = ["Masculino", "Feminino", "Outro"];
  const nacionalidades = ["Moçambicana", "Sul-Africana", "Zimbabuense", "Malauiana", "Outra"];
  const provincias = [
    "Maputo Cidade","Maputo","Gaza","Inhambane","Sofala","Manica","Tete","Zambézia","Nampula","Niassa","Cabo Delgado"
  ];
  const distritosPorProvincia: Record<string, string[]> = {
    "Maputo Cidade": ["KaMpfumo","Nlhamankulu","KaMaxaquene","KaMavota","KaTembe","KaNyaka"],
    "Maputo": ["Matola","Boane","Namaacha","Manhiça"],
    "Gaza": ["Xai-Xai","Chibuto","Bilene"],
    "Inhambane": ["Inhambane","Maxixe","Vilankulo"],
    "Sofala": ["Beira","Dondo","Nhamatanda"],
    "Manica": ["Chimoio","Gondola","Manica"],
    "Tete": ["Tete","Moatize","Angónia"],
    "Zambézia": ["Quelimane","Gurúè","Mocuba"],
    "Nampula": ["Nampula","Nacala","Monapo"],
    "Niassa": ["Lichinga","Cuamba"],
    "Cabo Delgado": ["Pemba","Montepuez"],
  };

  // Date
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => String(currentYear - 13 - i));
  const months = [
    "01","02","03","04","05","06","07","08","09","10","11","12"
  ];
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");

  const days = useMemo(() => {
    const y = parseInt(birthYear || "2000", 10);
    const m = parseInt(birthMonth || "1", 10);
    const last = new Date(y, m, 0).getDate();
    return Array.from({ length: last }, (_, i) => String(i + 1).padStart(2, "0"));
  }, [birthYear, birthMonth]);

  const applyBirthDate = () => {
    if (birthYear && birthMonth && birthDay) {
      setDataNascimento(`${birthYear}-${birthMonth}-${birthDay}`);
    }
  };

  useEffect(() => {
    console.log("[WEB Revisao] estado:", user?.revisao);
  }, [user?.revisao]);

  const validateStep = (s: Step) => {
    if (s === 0 && !acceptedTerms) return false;
    if (s === 1 && (!dataNascimento || !nacionalidade || !sexo)) return false;
    if (s === 2 && (!provincia || !distrito || !bairro || !contacto)) return false;
    return true;
  };

  const next = () => {
    if (validateStep(step)) setStep((s) => Math.min(3, s + 1) as Step);
  };

  const prev = () => setStep((s) => Math.max(0, s - 1) as Step);

  const handleSubmit = async () => {
    if (!fotoRetrato || !fotoFrente || !fotoVerso) {
      alert("Faltam documentos");
      return;
    }
    try {
      setSubmitting(true);
      const form = new FormData();
      form.append("foto_retrato", fotoRetrato);
      form.append("foto_bi_frente", fotoFrente);
      form.append("foto_bi_verso", fotoVerso);
      form.append("provincia", provincia);
      form.append("distrito", distrito);
      form.append("data_nascimento", dataNascimento);
      form.append("sexo", sexo);
      form.append("nacionalidade", nacionalidade);
      form.append("bairro", bairro);

      await api.post("/info_usuario/", form);
      alert("Documentos enviados com sucesso");
      router.back();
    } catch (e: any) {
      alert("Erro ao enviar documentos");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <button onClick={() => (step === 0 ? router.back() : prev())} className="mb-4 text-sm underline">
        Voltar
      </button>

      <p className="text-xs text-gray-500 mb-2">Estado da revisão: {user?.revisao || "desconhecido"}</p>

      {/* Estado pendente */}
      {(user?.revisao === "pendente") && (
        <div className="p-4 border rounded-md bg-blue-50">
          <h2 className="text-lg font-semibold">Olá {firstName}</h2>
          <p className="mt-2">Sua verificação está pendente. Aguarde análise.</p>
          <button
            onClick={() => router.back()}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md"
          >Voltar</button>
        </div>
      )}

      {user?.revisao !== "pendente" && (
        <>
          {step === 0 && (
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">Olá {firstName}</h2>
              <p>
                Para ter melhores experiências nos serviços SkyVenda/SkyWallet precisamos verificar sua conta.
              </p>

              <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                <p className="font-semibold text-amber-700">Vantagens:</p>
                <p>- Segurança</p>
                <p>- Limites aumentados</p>
                <p>- Mais confiança</p>
              </div>

              <label className="flex items-center gap-2">
                <input type="checkbox" checked={acceptedTerms} onChange={() => setAcceptedTerms(!acceptedTerms)} />
                <span>Aceito os termos</span>
              </label>

              <button onClick={next} className="bg-purple-600 text-white px-4 py-2 rounded-md">Começar</button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">1. Dados pessoais</h2>

              {/* Data */}
              <div>
                <p>Data de nascimento</p>
                <div className="flex gap-2">
                  <select value={birthDay} onChange={(e) => { setBirthDay(e.target.value); applyBirthDate(); }} className="border p-2 rounded">
                    <option value="">Dia</option>
                    {days.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>

                  <select value={birthMonth} onChange={(e) => { setBirthMonth(e.target.value); applyBirthDate(); }} className="border p-2 rounded">
                    <option value="">Mês</option>
                    {months.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>

                  <select value={birthYear} onChange={(e) => { setBirthYear(e.target.value); applyBirthDate(); }} className="border p-2 rounded flex-1">
                    <option value="">Ano</option>
                    {years.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              {/* Nacionalidade */}
              <div>
                <p>Nacionalidade</p>
                <select className="border p-2 rounded" value={nacionalidade} onChange={(e) => setNacionalidade(e.target.value)}>
                  {nacionalidades.map((n) => <option key={n}>{n}</option>)}
                </select>
              </div>

              {/* Sexo */}
              <div>
                <p>Sexo</p>
                <select className="border p-2 rounded" value={sexo} onChange={(e) => setSexo(e.target.value)}>
                  <option value="">Selecionar</option>
                  {sexoOptions.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              <button onClick={next} className="bg-purple-600 text-white px-4 py-2 rounded-md">Continuar</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">2. Localização</h2>

              <div>
                <p>Província</p>
                <select className="border p-2 rounded" value={provincia} onChange={(e) => { setProvincia(e.target.value); setDistrito(""); }}>
                  <option value="">Selecionar</option>
                  {provincias.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <p>Distrito</p>
                <select className="border p-2 rounded" disabled={!provincia} value={distrito} onChange={(e) => setDistrito(e.target.value)}>
                  <option value="">Selecionar</option>
                  {(distritosPorProvincia[provincia] || []).map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>

              <input placeholder="Bairro" className="border p-2 rounded w-full" value={bairro} onChange={(e) => setBairro(e.target.value)} />
              <input placeholder="Contacto" className="border p-2 rounded w-full" value={contacto} onChange={(e) => setContacto(e.target.value)} />

              <button onClick={next} className="bg-purple-600 text-white px-4 py-2 rounded-md">Continuar</button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">3. Documentos</h2>

              <div>
                <p>Foto do rosto</p>
                <input type="file" accept="image/*" onChange={(e) => setFotoRetrato(e.target.files?.[0] || null)} />
              </div>

              <div>
                <p>BI - Frente</p>
                <input type="file" accept="image/*" onChange={(e) => setFotoFrente(e.target.files?.[0] || null)} />
              </div>

              <div>
                <p>BI - Verso</p>
                <input type="file" accept="image/*" onChange={(e) => setFotoVerso(e.target.files?.[0] || null)} />
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-amber-600 text-white px-4 py-2 rounded-md"
              >
                {submitting ? "Enviando..." : "Enviar verificação"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
    }
