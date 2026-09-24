import React, { useState } from 'react';
import { Terminal, Send, Copy, Check, Server, FileCode, CheckCircle2 } from 'lucide-react';

export const ApiExplorer: React.FC = () => {
  const [endpoint, setEndpoint] = useState<'/api/render' | '/api/tones' | '/api/parse' | '/api/export/svg' | '/api/health'>('/api/render');
  const [requestBody, setRequestBody] = useState<string>(
    JSON.stringify(
      {
        code: `title: Tonus I (Dorian)\nkey: F\nlyrics: Her-ra on mi-nun pai-me-ne-ni, * ei mi-nul-ta mi-tään puu-tu.\n\n[Intonatio] F4 G4\n[Tenor] A4~\n[Mediatio] G4 A4 F4 |\n[Tenor] A4~\n[Terminatio] G4 F4 E4 D4 ||`,
        style: 'modern',
        clef: 'treble',
        transpose: 0,
        showLyrics: true,
        showSectionLabels: true
      },
      null,
      2
    )
  );

  const [loading, setLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseOutput, setResponseOutput] = useState<string | null>(null);
  const [responseSvgPreview, setResponseSvgPreview] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<'curl' | 'fetch' | 'python' | null>(null);

  const handleExecute = async () => {
    setLoading(true);
    setResponseStatus(null);
    setResponseOutput(null);
    setResponseSvgPreview(null);

    try {
      let res: Response;
      if (endpoint === '/api/tones' || endpoint === '/api/health') {
        res = await fetch(endpoint);
        const data = await res.json();
        setResponseStatus(res.status);
        setResponseOutput(JSON.stringify(data, null, 2));
      } else if (endpoint === '/api/export/svg') {
        res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: requestBody
        });
        setResponseStatus(res.status);
        const svgText = await res.text();
        setResponseOutput(svgText);
        setResponseSvgPreview(svgText);
      } else {
        res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: requestBody
        });
        setResponseStatus(res.status);
        const data = await res.json();
        setResponseOutput(JSON.stringify(data, null, 2));
        if (data.svg) {
          setResponseSvgPreview(data.svg);
        }
      }
    } catch (err: any) {
      setResponseStatus(500);
      setResponseOutput(`Virhe yhteydessä mikropalveluun: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getCurlSnippet = () => {
    const isGet = endpoint === '/api/tones' || endpoint === '/api/health';
    if (isGet) {
      return `curl -X GET https://your-service-domain${endpoint}`;
    }
    return `curl -X POST https://your-service-domain${endpoint} \\
  -H "Content-Type: application/json" \\
  -d '${requestBody.replace(/\n/g, '')}'`;
  };

  const getFetchSnippet = () => {
    const isGet = endpoint === '/api/tones' || endpoint === '/api/health';
    if (isGet) {
      return `const res = await fetch('${endpoint}');
const data = await res.json();
console.log(data);`;
    }
    return `const res = await fetch('${endpoint}', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(${requestBody})
});
const data = await res.json();
// data.svg sisältää valmiin skaalautuvan SVG-nuottikuvan`;
  };

  const copySnippet = (type: 'curl' | 'fetch' | 'python', text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="pb-4 border-b border-stone-200">
        <h2
          className="text-xl font-bold tracking-tight text-stone-900 font-serif"
          style={{ fontFamily: "'Cinzel', Georgia, serif" }}
        >
          REST-mikropalvelun rajapinta
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Tätä sovellusta voi käyttää sellaisenaan taustajärjestelmissä, seurakuntien verkkosivuilla, messuohjelmissa tai kuorosovelluksissa.
        </p>
      </div>

      {/* Interactive API Request Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Request Composer */}
        <div className="lg:col-span-6 flex flex-col bg-white border border-stone-200 rounded-lg shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-stone-100/70 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-stone-600" />
              <span className="text-xs font-bold text-stone-800">Pyyntö (Request)</span>
            </div>

            {/* Endpoint Selector Tabs */}
            <div className="flex items-center gap-1">
              <select
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value as any)}
                className="text-xs font-mono font-medium py-1 px-2.5 bg-white border border-stone-300 rounded text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-700 cursor-pointer"
              >
                <option value="/api/render">POST /api/render (SVG & Meta)</option>
                <option value="/api/parse">POST /api/parse (Musiikki-AST)</option>
                <option value="/api/export/svg">POST /api/export/svg (Tiedostolataus)</option>
                <option value="/api/tones">GET /api/tones (Kirjasto)</option>
                <option value="/api/health">GET /api/health (Palvelimen tila)</option>
              </select>
            </div>
          </div>

          <div className="p-4 flex-1 flex flex-col">
            {endpoint !== '/api/tones' && endpoint !== '/api/health' ? (
              <>
                <label className="text-[11px] font-medium text-stone-500 mb-1">
                  JSON-runko (Request Body):
                </label>
                <textarea
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  rows={10}
                  className="w-full flex-1 p-3 text-xs font-mono bg-stone-50 border border-stone-200 rounded focus:outline-none focus:ring-1 focus:ring-amber-700 leading-relaxed text-stone-900"
                  spellCheck={false}
                />
              </>
            ) : (
              <div className="p-6 bg-stone-50 border border-dashed border-stone-200 rounded text-center text-xs text-stone-500 my-auto">
                Tämä on HTTP GET -pyyntö. Ei vaadi erillistä JSON-runkoa.
              </div>
            )}

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[11px] text-stone-400">Content-Type: application/json</span>
              <button
                type="button"
                onClick={handleExecute}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded transition-colors shadow-xs cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Lähetetään...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Suorita mikropalvelukutsu</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Response Inspector */}
        <div className="lg:col-span-6 flex flex-col bg-white border border-stone-200 rounded-lg shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-stone-100/70 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-stone-600" />
              <span className="text-xs font-bold text-stone-800">Vastaus (Response)</span>
            </div>

            {responseStatus !== null && (
              <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
                responseStatus >= 200 && responseStatus < 300
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                HTTP {responseStatus}
              </span>
            )}
          </div>

          <div className="p-4 flex-1 flex flex-col">
            {responseOutput ? (
              <div className="flex-1 flex flex-col space-y-3">
                {/* SVG Visual preview if present */}
                {responseSvgPreview && (
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded overflow-x-auto">
                    <span className="text-[10px] font-semibold text-stone-400 block mb-1">VISUAALINEN RENDEROINTI:</span>
                    <div
                      className="w-full max-w-full"
                      dangerouslySetInnerHTML={{ __html: responseSvgPreview }}
                    />
                  </div>
                )}

                <div className="flex-1">
                  <span className="text-[10px] font-semibold text-stone-400 block mb-1">RAAKA PALVELINVASTAUS:</span>
                  <pre className="p-3 text-xs font-mono bg-stone-900 text-stone-100 rounded overflow-x-auto max-h-[300px] leading-relaxed">
                    {responseOutput}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-stone-400 my-auto">
                Paina "Suorita mikropalvelukutsu" nähdäksesi reaaliaikaisen vastauksen.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Code Integration Examples */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
        <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
          <FileCode className="w-4 h-4 text-stone-600" />
          <span>Käyttö omassa koodissasi (cURL & TypeScript fetch)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {/* cURL */}
          <div className="flex flex-col bg-stone-900 text-stone-200 rounded-md p-3">
            <div className="flex items-center justify-between text-stone-400 pb-2 border-b border-stone-800 mb-2">
              <span>cURL</span>
              <button
                type="button"
                onClick={() => copySnippet('curl', getCurlSnippet())}
                className="hover:text-white cursor-pointer"
              >
                {copiedCode === 'curl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <pre className="overflow-x-auto leading-relaxed text-[11px]">{getCurlSnippet()}</pre>
          </div>

          {/* TypeScript / JS Fetch */}
          <div className="flex flex-col bg-stone-900 text-stone-200 rounded-md p-3">
            <div className="flex items-center justify-between text-stone-400 pb-2 border-b border-stone-800 mb-2">
              <span>TypeScript / JavaScript fetch()</span>
              <button
                type="button"
                onClick={() => copySnippet('fetch', getFetchSnippet())}
                className="hover:text-white cursor-pointer"
              >
                {copiedCode === 'fetch' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <pre className="overflow-x-auto leading-relaxed text-[11px]">{getFetchSnippet()}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
