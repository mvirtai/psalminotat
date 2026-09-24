import React from 'react';
import { BookOpen, Music, Sparkles, CheckCircle2 } from 'lucide-react';

export const LiturgicalGuide: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto py-2">
      {/* Introduction */}
      <div>
        <h2
          className="text-2xl font-bold tracking-tight text-stone-900 font-serif"
          style={{ fontFamily: "'Cinzel', Georgia, serif" }}
        >
          Psalmisävelmien rakenne ja laulamisen periaatteet
        </h2>
        <p className="text-sm text-stone-600 mt-2 leading-relaxed">
          Psalmodia eli psalmien resitointi on kirkon vanhinta jatkuvaa musiikkiperinnettä. Yksinkertaisen sävelmäkoodin avulla voit mallintaa ja kokeilla minkä tahansa psalmin laulamista ja sovittamista.
        </p>
      </div>

      {/* Anatomy of a Psalm Tone */}
      <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs space-y-6">
        <h3
          className="text-base font-bold text-stone-900 font-serif pb-2 border-b border-stone-100"
          style={{ fontFamily: "'Cinzel', Georgia, serif" }}
        >
          Psalmitonuksen viisi perusosaa
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs leading-relaxed">
          <div className="p-4 bg-stone-50 border border-stone-200/80 rounded-md">
            <h4 className="font-bold text-stone-900 text-sm mb-1 text-amber-900">1. Intonatio (Initium / Alkusävelmä)</h4>
            <p className="text-stone-600">
              1–3 sävelen mittainen nousu perussäveleltä resitatiivisävelelle (esim. <code className="font-mono font-semibold">F4 G4</code>). Lauletaan yleensä vain psalmin ensimmäisessä säkeistössä tai juhlallisesti jokaisessa säkeessä (Tonus Solemnis).
            </p>
            <div className="mt-2 text-[11px] font-mono text-stone-500 bg-white p-1.5 rounded border border-stone-200">
              Koodissa: [Intonatio] F4 G4
            </div>
          </div>

          <div className="p-4 bg-stone-50 border border-stone-200/80 rounded-md">
            <h4 className="font-bold text-stone-900 text-sm mb-1 text-amber-900">2. Tenor / Tuba (Resitatiivisävel)</h4>
            <p className="text-stone-600">
              Sävelmän sydän: vakaa, toistuva sävel, jolla suurin osa säkeen tekstistä lausutaan luonnollisen puherytmin mukaan. Nuotinnuksessa merkitään brevis-nuottipäällä.
            </p>
            <div className="mt-2 text-[11px] font-mono text-stone-500 bg-white p-1.5 rounded border border-stone-200">
              Koodissa: [Tenor] A4~ tai A4(rec)
            </div>
          </div>

          <div className="p-4 bg-stone-50 border border-stone-200/80 rounded-md">
            <h4 className="font-bold text-stone-900 text-sm mb-1 text-amber-900">3. Flexa (Valinnainen taite †)</h4>
            <p className="text-stone-600">
              Jos ensimmäinen säepuolisko on poikkeuksellisen pitkä, tehdään pieni huokauslasku (esim. sekunti tai terssi alaspäin), jotta laulaja ehtii ottaa kevyesti happea.
            </p>
            <div className="mt-2 text-[11px] font-mono text-stone-500 bg-white p-1.5 rounded border border-stone-200">
              Koodissa: † tai [Flexa]
            </div>
          </div>

          <div className="p-4 bg-stone-50 border border-stone-200/80 rounded-md">
            <h4 className="font-bold text-stone-900 text-sm mb-1 text-amber-900">4. Mediatio (Puolivälin kadenssi *)</h4>
            <p className="text-stone-600">
              Keskikadenssi säepuoliskojen välissä (merkitty teksteissä tähdellä <code className="font-serif font-bold">*</code>). Sävelmä tekee melodisen käännöksen ja pysähtyy lyhyeen huokaukseen.
            </p>
            <div className="mt-2 text-[11px] font-mono text-stone-500 bg-white p-1.5 rounded border border-stone-200">
              Koodissa: [Mediatio] G4 A4 F4 |
            </div>
          </div>

          <div className="p-4 bg-stone-50 border border-stone-200/80 rounded-md md:col-span-2">
            <h4 className="font-bold text-stone-900 text-sm mb-1 text-amber-900">5. Terminatio (Loppukadenssi / Päätös ||)</h4>
            <p className="text-stone-600">
              Säkeistön päättävä melodiakuvio, joka johdattaa sävelen perussävelelle (finalis) tai seuraavan antifonin alkusävelelle (differentia).
            </p>
            <div className="mt-2 text-[11px] font-mono text-stone-500 bg-white p-1.5 rounded border border-stone-200">
              Koodissa: [Terminatio] G4 F4 E4 D4 ||
            </div>
          </div>
        </div>
      </div>

      {/* Code DSL Syntax Quick Reference */}
      <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-xs space-y-4">
        <h3
          className="text-base font-bold text-stone-900 font-serif pb-2 border-b border-stone-100"
          style={{ fontFamily: "'Cinzel', Georgia, serif" }}
        >
          Sävelmäkoodin pikaohje (DSL-syntaksi)
        </h3>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500">
                <th className="py-2 pr-4 font-semibold">Syntaksi</th>
                <th className="py-2 pr-4 font-semibold">Esimerkki</th>
                <th className="py-2 font-semibold">Merkitys</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700 font-mono text-[11px]">
              <tr>
                <td className="py-2 pr-4 text-amber-900 font-bold">title: ...</td>
                <td className="py-2 pr-4">title: Tonus I</td>
                <td className="py-2 font-sans text-stone-600">Asettaa kappaleen nimen</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-amber-900 font-bold">key: ...</td>
                <td className="py-2 pr-4">key: F</td>
                <td className="py-2 font-sans text-stone-600">Sävellaji ja etumerkinnät (C, F, G, D)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-amber-900 font-bold">lyrics: ...</td>
                <td className="py-2 pr-4">lyrics: Her-ra on mi-nun pai-me-ne-ni</td>
                <td className="py-2 font-sans text-stone-600">Tavutettu sanoitus nuottien alle (välilyönnit tai tavuviivat)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-amber-900 font-bold">Sävel + oktaavi</td>
                <td className="py-2 pr-4">F4, G4, A4, Bb4, C5</td>
                <td className="py-2 font-sans text-stone-600">Perussävel korkeuksineen</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-amber-900 font-bold">Resitaatio (~)</td>
                <td className="py-2 pr-4">A4~ tai [A4]</td>
                <td className="py-2 font-sans text-stone-600">Piirtää liturgisen brevis-nuotin ja pidentää sointia</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-amber-900 font-bold">Puolivälin viiva (|)</td>
                <td className="py-2 pr-4">G4 A4 F4 |</td>
                <td className="py-2 font-sans text-stone-600">Puolivälin jakoviiva ja mediatio-tähti (*)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-amber-900 font-bold">Päätösviiva (||)</td>
                <td className="py-2 pr-4">E4 D4 ||</td>
                <td className="py-2 font-sans text-stone-600">Lopullinen kaksoisviiva</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-amber-900 font-bold">Otsikot [...]</td>
                <td className="py-2 pr-4">[Intonatio], [Tenor], [Mediatio]</td>
                <td className="py-2 font-sans text-stone-600">Ryhmittelee nuotit visuaalisesti nuottiviivaston ylle</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
