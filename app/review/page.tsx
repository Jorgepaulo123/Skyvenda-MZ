"use client";
import React, { useState, useMemo, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/api";
import Header1 from "../../components/Header1";

export default function ReviewPage() {
  const router = useRouter();
  const auth = useContext(AuthContext) as any;
  const user = auth?.user;

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
    "Maputo Cidade", "Maputo", "Gaza", "Inhambane", "Sofala", "Manica", "Tete",
    "Zambézia", "Nampula", "Niassa", "Cabo Delgado"
  ];

  const distritosPorProvincia: Record<string, string[]> = {
    "Maputo Cidade": ["KaMpfumo", "Nlhamankulu", "KaMaxaquene", "KaMavota", "KaTembe", "KaNyaka"],
    "Maputo": ["Matola", "Boane", "Namaacha", "Manhiça"],
    "Gaza": ["Xai-Xai", "Chibuto", "Bilene"],
    "Inhambane": ["Inhambane", "Maxixe", "Vilankulo"],
    "Sofala": ["Beira", "Dondo", "Nhamatanda"],
    "Manica": ["Chimoio", "Gondola", "Manica"],
    "Tete": ["Tete", "Moatize", "Angónia"],
    "Zambézia": ["Quelimane", "Gurúè", "Mocuba"],
    "Nampula": ["Nampula", "Nacala", "Monapo"],
    "Niassa": ["Lichinga", "Cuamba"],
    "Cabo Delgado": ["Pemba", "Montepuez"],
  };

  // Date
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => String(currentYear - 13 - i));
  const months = ["01","02","03","04","05","06","07","08","09","10","11","12"];

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

  const next = () => validateStep(step) && setStep((s) => (s + 1) as Step);
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

    } catch (e) {
      alert("Erro ao enviar documentos");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------

  return (
    <>
      <Header1 />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => (step === 0 ? router.back() : prev())}
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              Voltar
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className={`px-2 py-1 rounded-full ${step >= 0 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>1</span>
              <span className={`px-2 py-1 rounded-full ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>2</span>
              <span className={`px-2 py-1 rounded-full ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>3</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 mb-3">
            Estado da revisão: {user?.revisao || "desconhecido"}
          </p>

          {user?.revisao === "pendente" && (
            <div className="p-5 border rounded-xl bg-blue-50 border-blue-100 shadow-sm">
              <h2 className="text-xl font-semibold">Olá {firstName}</h2>
              <p className="mt-2 text-gray-700">Sua verificação está pendente. Aguarde análise.</p>
              <button
                onClick={() => router.back()}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
              >
                Voltar
              </button>
            </div>
          )}

          {user?.revisao !== "pendente" && (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-5">
              {step === 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Olá {firstName}</h2>
                  <p className="text-gray-700">Para ter melhores experiências nos serviços SkyVenda/SkyWallet precisamos verificar sua conta.</p>

                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-amber-800">
                    <p className="font-semibold">Vantagens:</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Segurança</li>
                      <li>Limites aumentados</li>
                      <li>Mais confiança</li>
                    </ul>
                  </div>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={() => setAcceptedTerms(!acceptedTerms)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Aceito os termos</span>
                  </label>

                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg" onClick={next}>
                    Começar
                  </button>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">1. Dados pessoais</h2>

                  <div>
                    <p className="text-sm text-gray-700">Data de nascimento</p>
                    <div className="mt-1 grid grid-cols-3 gap-2">
                      <select
                        value={birthDay}
                        onChange={(e) => { setBirthDay(e.target.value); applyBirthDate(); }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Dia</option>
                        {days.map((d) => <option key={d}>{d}</option>)}
                      </select>

                      <select
                        value={birthMonth}
                        onChange={(e) => { setBirthMonth(e.target.value); applyBirthDate(); }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Mês</option>
                        {months.map((m) => <option key={m}>{m}</option>)}
                      </select>

                      <select
                        value={birthYear}
                        onChange={(e) => { setBirthYear(e.target.value); applyBirthDate(); }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Ano</option>
                        {years.map((y) => <option key={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-700">Nacionalidade</p>
                    <select
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={nacionalidade}
                      onChange={(e) => setNacionalidade(e.target.value)}
                    >
                      {nacionalidades.map((n) => <option key={n}>{n}</option>)}
                    </select>
                  </div>

                  <div>
                    <p className="text-sm text-gray-700">Sexo</p>
                    <select
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={sexo}
                      onChange={(e) => setSexo(e.target.value)}
                    >
                      <option value="">Selecionar</option>
                      {sexoOptions.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>

                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg" onClick={next}>
                    Continuar
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">2. Localização</h2>

                  <div>
                    <p className="text-sm text-gray-700">Província</p>
                    <select
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={provincia}
                      onChange={(e) => { setProvincia(e.target.value); setDistrito(""); }}
                    >
                      <option value="">Selecionar</option>
                      {provincias.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </div>

                  <div>
                    <p className="text-sm text-gray-700">Distrito</p>
                    <select
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      disabled={!provincia}
                      value={distrito}
                      onChange={(e) => setDistrito(e.target.value)}
                    >
                      <option value="">Selecionar</option>
                      {(distritosPorProvincia[provincia] || []).map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <input
                      placeholder="Bairro"
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={bairro}
                      onChange={(e) => setBairro(e.target.value)}
                    />
                  </div>

                  <div>
                    <input
                      placeholder="Contacto"
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={contacto}
                      onChange={(e) => setContacto(e.target.value)}
                    />
                  </div>

                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg" onClick={next}>
                    Continuar
                  </button>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">3. Documentos</h2>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-700">Foto do rosto</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFotoRetrato(e.target.files?.[0] || null)}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <p className="text-sm text-gray-700">BI - Frente</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFotoFrente(e.target.files?.[0] || null)}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <p className="text-sm text-gray-700">BI - Verso</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFotoVerso(e.target.files?.[0] || null)}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg"
                  >
                    {submitting ? "Enviando..." : "Enviar verificação"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
    }
        
