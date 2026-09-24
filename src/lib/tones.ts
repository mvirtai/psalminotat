import { PsalmPreset } from '../types/music';

export const PSALM_TONE_PRESETS: PsalmPreset[] = [
  {
    id: 'tonus-1',
    name: 'Tonus I (1. sävelmä)',
    subtitle: 'Dorian - Juhlallinen ja vakaa alkusävelmä',
    category: 'gregorian',
    mode: '1. kirkkosävellaji (Doria)',
    finalis: 'D4',
    tuba: 'A4',
    description: 'Klassinen 1. kirkkosävellaji. Alkaa F-G-A -nousulla resitatiivisävelelle A. Mediatio tekee käännöksen G-A-F, ja loppukadenssi päättyy perussävelelle D.',
    code: `title: Tonus I (Dorian)
key: F
lyrics: Her-ra on mi-nun pai-me-ne-ni, * ei mi-nul-ta mi-tään puu-tu.

[Intonatio] F4 G4
[Tenor] A4~
[Mediatio] G4 A4 F4 |
[Tenor] A4~
[Terminatio] G4 F4 E4 D4 ||`,
    sampleVerse: 'Herra on minun paimeneni, * ei minulta mitään puutu.',
    liturgicalUse: 'Introitus-psalmit, vesper-psalmit, yleinen kirkkovuosi'
  },
  {
    id: 'tonus-2',
    name: 'Tonus II (2. sävelmä)',
    subtitle: 'Hypodorian - Syvällinen ja harras',
    category: 'gregorian',
    mode: '2. kirkkosävellaji (Hypodoria)',
    finalis: 'D4',
    tuba: 'F4',
    description: 'Matala ja levollinen sävelmä. Resitoi F-sävelellä, josta mediatio kääntyy D:hen ja terminatio päättyy sävelelle D.',
    code: `title: Tonus II (Hypodorian)
key: C
lyrics: Ar-mah-da mi-nua, Ju-ma-la, * suu-res-sa lau-peu-des-sa-si.

[Intonatio] C4 D4
[Tenor] F4~
[Mediatio] G4 F4 D4 |
[Tenor] F4~
[Terminatio] E4 D4 C4 D4 ||`,
    sampleVerse: 'Armahda minua, Jumala, * suuressa laupeudessasi.',
    liturgicalUse: 'Paastonaika, hautajaiset, katumuspsalmit'
  },
  {
    id: 'tonus-3',
    name: 'Tonus III (3. sävelmä)',
    subtitle: 'Phrygian - Intensiivinen ja särmikäs',
    category: 'gregorian',
    mode: '3. kirkkosävellaji (Fryygia)',
    finalis: 'E4',
    tuba: 'C5',
    description: 'Korkea resitaatio C-sävelellä. Fryyginen puolikasaskel luo omaleimaisen jännitteen päätöksessä.',
    code: `title: Tonus III (Phrygian)
key: C
lyrics: Kii-tet-ty ol-koon Her-ra, * hän kuu-lee ru-kouk-se-ni.

[Intonatio] G4 A4 C5
[Tenor] C5~
[Mediatio] D5 C5 |
[Tenor] C5~
[Terminatio] B4 A4 G4 A4 E4 ||`,
    sampleVerse: 'Kiitetty olkoon Herra, * hän kuulee rukoukseni.',
    liturgicalUse: 'Juhlapäivät, aamurukous (laudes)'
  },
  {
    id: 'tonus-4',
    name: 'Tonus IV (4. sävelmä)',
    subtitle: 'Hypophrygian - Lempeä ja mietiskelevä',
    category: 'gregorian',
    mode: '4. kirkkosävellaji (Hypofryygia)',
    finalis: 'E4',
    tuba: 'A4',
    description: 'Yksi kauneimmista sävelmistä. Resitaatio sävelellä A, hieno pehmeä poljento ja fryyginen loppukadenssi.',
    code: `title: Tonus IV (Hypophrygian)
key: C
lyrics: Mi-nun sie-lu-ni ja-noo Ju-ma-laa, * elä-vää Ju-ma-laa.

[Intonatio] A4 G4 A4
[Tenor] A4~
[Mediatio] G4 A4 F4 |
[Tenor] A4~
[Terminatio] G4 F4 E4 D4 E4 ||`,
    sampleVerse: 'Minun sieluni janoo Jumalaa, * elävää Jumalaa.',
    liturgicalUse: 'Vesper, kynttilänpäivä, hiljainen viikko'
  },
  {
    id: 'tonus-5',
    name: 'Tonus V (5. sävelmä)',
    subtitle: 'Lydian - Riemukas ja valoisa',
    category: 'gregorian',
    mode: '5. kirkkosävellaji (Lyydia)',
    finalis: 'F4',
    tuba: 'C5',
    description: 'Valoisa ja duurivoittoinen sävelmä. Nousu F-A-C johtaa korkeaan resitointiin, ja päätös laskeutuu vapaasti F-perussävelelle.',
    code: `title: Tonus V (Lydian)
key: F
lyrics: Kii-täk-kää Her-raa, sil-lä hän on hy-vä, * i-kui-nen on hä-nen ar-mon-sa.

[Intonatio] F4 A4 C5
[Tenor] C5~
[Mediatio] D5 C5 |
[Tenor] C5~
[Terminatio] D5 C5 Bb4 A4 F4 ||`,
    sampleVerse: 'Kiittäkää Herraa, sillä hän on hyvä, * ikuinen on hänen armonsa.',
    liturgicalUse: 'Pääsiäisaika, kiitospsalmit, häät'
  },
  {
    id: 'tonus-6',
    name: 'Tonus VI (6. sävelmä)',
    subtitle: 'Hypolydian - Luonteva ja kansanomainen',
    category: 'gregorian',
    mode: '6. kirkkosävellaji (Hypolyydia)',
    finalis: 'F4',
    tuba: 'A4',
    description: 'Helppo ja lämmin laulaa. Tuba sävelellä A, F-duuriin pohjautuva pehmeä harmonia.',
    code: `title: Tonus VI (Hypolydian)
key: F
lyrics: Au-tuas se, jo-ka Her-raa pel-kää * ja vael-taa hä-nen teil-lään.

[Intonatio] F4 G4 A4
[Tenor] A4~
[Mediatio] Bb4 A4 G4 A4 |
[Tenor] A4~
[Terminatio] G4 F4 G4 A4 F4 ||`,
    sampleVerse: 'Autuas se, joka Herraa pelkää * ja vaeltaa hänen teillään.',
    liturgicalUse: 'Arki-introitukset, kastejuhlat, vesper'
  },
  {
    id: 'tonus-7',
    name: 'Tonus VII (7. sävelmä)',
    subtitle: 'Mixolydian - Voimakas ja majesteettinen',
    category: 'gregorian',
    mode: '7. kirkkosävellaji (Miksolyydia)',
    finalis: 'G4',
    tuba: 'D5',
    description: 'Korkea ja loistokas sävelmä. Intonatio nousee C-D-E-tasolta D-resitaatioon, ja mediatio tekee uljaan käänteen.',
    code: `title: Tonus VII (Mixolydian)
key: C
lyrics: Ko-hot-kaa pään-ne, te por-tit, * kor-keut-tu-kaa, i-kui-set o-vet!

[Intonatio] C4 D4 E4
[Tenor] D5~
[Mediatio] E5 D5 C5 D5 |
[Tenor] D5~
[Terminatio] C5 D5 E5 D5 C5 ||`,
    sampleVerse: 'Kohottakaa päänne, te portit, * korkeuttukaa, ikuiset ovet!',
    liturgicalUse: 'Adventti, Kristuksen taivaaseenastuminen, kuninkuuspsalmit'
  },
  {
    id: 'tonus-8',
    name: 'Tonus VIII (8. sävelmä)',
    subtitle: 'Hypomixolydian - Tasapainoinen ja rauhoittava',
    category: 'gregorian',
    mode: '8. kirkkosävellaji (Hypomiksolyydia)',
    finalis: 'G4',
    tuba: 'C5',
    description: 'Yksi käytetyimmistä psalmisävelmistä koko läntisessä kirkossa. Tuba C:llä ja kaunis laskeutuva päätös G-perussävelelle.',
    code: `title: Tonus VIII (Hypomixolydian)
key: C
lyrics: Her-ra on mi-nun va-lo-ni ja a-pu-ni, * ke-tä mi-nä pel-käi-sin?

[Intonatio] G4 A4 C5
[Tenor] C5~
[Mediatio] C5 B4 C5 |
[Tenor] C5~
[Terminatio] A4 C5 B4 A4 G4 ||`,
    sampleVerse: 'Herra on minun valoni ja apuni, * ketä minä pelkäisin?',
    liturgicalUse: 'Completorium, iltarukoukset, yleinen messu'
  },
  {
    id: 'tonus-peregrinus',
    name: 'Tonus Peregrinus',
    subtitle: 'Vaeltava sävelmä - Kaksi eri resitatiivisäveltä',
    category: 'gregorian',
    mode: 'Vaeltava sävelmä (A4 -> G4)',
    finalis: 'D4',
    tuba: 'A4 / G4',
    description: 'Harvinainen ja kiehtova "vaeltaja": ensimmäinen puolikas resitoi sävelellä A, mutta toinen puolikas sävelellä G! Perinteisesti laulettu psalmissa 114 (In exitu Israel egypto).',
    code: `title: Tonus Peregrinus (Vaeltava sävelmä)
key: F
lyrics: Kun Is-ra-el läh-ti Egyp-tis-tä, * Jaa-ko-bin hei-mo vie-raan kan-san kes-kel-tä.

[Intonatio] F4 G4 A4
[Tenor] A4~
[Mediatio] G4 A4 F4 |
[Tenor] G4~
[Terminatio] F4 E4 D4 ||`,
    sampleVerse: 'Kun Israel lähti Egyptistä, * Jaakobin heimo vieraan kansan keskeltä.',
    liturgicalUse: 'Pääsiäisyö, kasteen muisto, vapautuksen psalmit'
  },
  {
    id: 'virsikirja-1',
    name: 'Suomalainen psalmisävelmä I',
    subtitle: 'Ev.lut. kirkon virsikirjan liite - Doria',
    category: 'finnish',
    mode: 'Suomen kirkon I psalmitonus (Doria)',
    finalis: 'D4',
    tuba: 'A4',
    description: 'Suomen evankelis-luterilaisen kirkon virsikirjan liitteen ja jumalanpalveluskäsikirjan perussävelmä päivän psalmille.',
    code: `title: Suomen ev.lut. psalmisävelmä I
key: F
lyrics: Ju-ma-la, si-nua mi-nä et-sin, * si-nua mi-nun sie-lu-ni ja-noo.

[Intonatio] F4 G4 A4
[Tenor] A4~
[Mediatio] G4 A4 F4 |
[Tenor] A4~
[Terminatio] G4 F4 E4 D4 ||`,
    sampleVerse: 'Jumala, sinua minä etsin, * sinua minun sieluni janoo.',
    liturgicalUse: 'Sunnuntain messun päivän psalmi'
  },
  {
    id: 'virsikirja-2',
    name: 'Suomalainen psalmisävelmä II (Valo)',
    subtitle: 'Ev.lut. kirkon virsikirjan liite - Duurisävelmä',
    category: 'finnish',
    mode: 'Suomen kirkon II psalmitonus (F-duuri)',
    finalis: 'F4',
    tuba: 'A4',
    description: 'Iloinen ja heleä sävelmä suomalaisiin jumalanpalveluksiin ja kirkollisiin toimituksiin.',
    code: `title: Suomen ev.lut. psalmisävelmä II (Valo)
key: F
lyrics: Tu-le Her-ran huo-nee-seen iloi-ten, * kii-tä hä-nen hy-vyyt-tään.

[Intonatio] F4 G4 A4
[Tenor] A4~
[Mediatio] Bb4 A4 G4 |
[Tenor] A4~
[Terminatio] G4 F4 G4 F4 ||`,
    sampleVerse: 'Tule Herran huoneeseen iloiten, * kiitä hänen hyvyyttään.',
    liturgicalUse: 'Juhlamessut, perhemessut, konfirmaatio'
  },
  {
    id: 'magnificat-solemnis',
    name: 'Magnificat (Marian kiitosvirsi)',
    subtitle: 'Tonus Solemnis - Juhlallinen laudes- ja vespersävelmä',
    category: 'canticle',
    mode: 'Tonus Solemnis I',
    finalis: 'D4',
    tuba: 'A4',
    description: 'Juhlallinen kiitosvirren sävelmä (Luuk. 1:46-55). Laajennettu koristeltu intonatio ja syvä päätöskadenssi.',
    code: `title: Magnificat (Marian kiitosvirsi)
key: F
lyrics: Mi-nun sie-lu-ni suu-ret-taa Her-raa, * ja mi-nun hen-ke-ni rie-muit-see Ju-ma-las-ta.

[Intonatio] D4 F4 G4 A4
[Tenor] A4~
[Mediatio] Bb4 A4 G4 A4 |
[Tenor] A4~
[Terminatio] G4 F4 E4 D4 ||`,
    sampleVerse: 'Minun sieluni suurettaa Herraa, * ja minun henkeni riemuitsee Jumalasta, Vapahtajastani.',
    liturgicalUse: 'Juhlavesper, Marian ilmestyspäivä, jouluaatto'
  },
  {
    id: 'taize-meditative',
    name: 'Taizé-resitaatio',
    subtitle: 'Rauhallinen mietiskelypsalmi',
    category: 'taize',
    mode: 'G-duuri / e-molli',
    finalis: 'G4',
    tuba: 'B4',
    description: 'Yksinkertainen, meditatiivinen rukoussävelmä Taizé-hengessä. Soveltuu hiljaisuuden messuun ja iltahartauteen.',
    code: `title: Taizé-rukoussävelmä
key: G
lyrics: Si-nun sa-na-si on lamp-pu, * va-lo mi-nun po-lul-la-ni.

[Intonatio] G4 A4 B4
[Tenor] B4~
[Mediatio] C5 B4 A4 |
[Tenor] B4~
[Terminatio] A4 G4 F#4 G4 ||`,
    sampleVerse: 'Sinun sanasi on lamppu, * valo minun polullani.',
    liturgicalUse: 'Taizé-rukoukset, iltahartaudet, tuomiokirkon viikkomessut'
  },
  { id: 'psalm-1', name: 'Psalmi 1', subtitle: 'Autuas se mies', category: 'finnish', mode: 'Tonus I', finalis: 'D4', tuba: 'A4', description: 'Oikeamielisen tie.', code: `title: Psalmi 1\nkey: F\nlyrics: Au-tuas se mies, jo-ka ei vael-la juo-telt-tu-jen neu-voss-sa... \n\n[Intonatio] F4 G4\n[Tenor] A4~\n[Mediatio] G4 A4 F4 |\n[Tenor] A4~\n[Terminatio] G4 F4 E4 D4 ||`, sampleVerse: 'Autuas se mies...', liturgicalUse: 'Yleinen' },
  { id: 'psalm-8', name: 'Psalmi 8', subtitle: 'Herra, meidän Herramme', category: 'finnish', mode: 'Tonus VIII', finalis: 'G4', tuba: 'C5', description: 'Luomakunnan ylistys.', code: `title: Psalmi 8\nkey: C\nlyrics: Her-ra, mei-dän Her-ram-me, * kui-nka kor-kea on-kaan ni-me-si... \n\n[Intonatio] G4 A4 C5\n[Tenor] C5~\n[Mediatio] C5 B4 C5 |\n[Tenor] C5~\n[Terminatio] A4 C5 B4 A4 G4 ||`, sampleVerse: 'Herra, meidän Herramme...', liturgicalUse: 'Luominen' },
  { id: 'psalm-18', name: 'Psalmi 18', subtitle: 'Minun turvani', category: 'finnish', mode: 'Tonus IV', finalis: 'E4', tuba: 'A4', description: 'Voimakas kiitosvirsi.', code: `title: Psalmi 18\nkey: C\nlyrics: Minä ra-kas-tan si-nua, Her-ra, mi-nun voi-ma-ni! * Her-ra on mi-nun kal-li-o-ni... \n\n[Intonatio] A4 G4 A4\n[Tenor] A4~\n[Mediatio] G4 A4 F4 |\n[Tenor] A4~\n[Terminatio] G4 F4 E4 D4 E4 ||`, sampleVerse: 'Minä rakastan sinua...', liturgicalUse: 'Kiitos' },
  { id: 'psalm-22', name: 'Psalmi 22', subtitle: 'Jumalani, Jumalani', category: 'finnish', mode: 'Tonus II', finalis: 'D4', tuba: 'F4', description: 'Kärsivän huuto.', code: `title: Psalmi 22\nkey: C\nlyrics: Ju-ma-la-ni, Ju-ma-la-ni, * mik-si hyl-kä-sit mi-nut? \n\n[Intonatio] C4 D4\n[Tenor] F4~\n[Mediatio] G4 F4 D4 |\n[Tenor] F4~\n[Terminatio] E4 D4 C4 D4 ||`, sampleVerse: 'Jumalani, Jumalani...', liturgicalUse: 'Pitkäperjantai' },
  { id: 'psalm-23', name: 'Psalmi 23', subtitle: 'Herra on minun paimeneni', category: 'finnish', mode: 'Tonus I', finalis: 'D4', tuba: 'A4', description: 'Lohdutuspsalmi.', code: `title: Psalmi 23\nkey: F\nlyrics: Her-ra on mi-nun pai-me-ne-ni, * ei mi-nul-ta mi-tään puu-tu. \n\n[Intonatio] F4 G4\n[Tenor] A4~\n[Mediatio] G4 A4 F4 |\n[Tenor] A4~\n[Terminatio] G4 F4 E4 D4 ||`, sampleVerse: 'Herra on minun paimeneni...', liturgicalUse: 'Hautajaiset' },
  { id: 'psalm-91', name: 'Psalmi 91', subtitle: 'Varjossa', category: 'finnish', mode: 'Tonus V', finalis: 'F4', tuba: 'C5', description: 'Suojelus.', code: `title: Psalmi 91\nkey: F\nlyrics: Se, jo-ka kor-keim-man suo-jas-sa is-tuu * ja Kaik-kival-tia-an va-rjoss-sa yö-pyy... \n\n[Intonatio] F4 A4 C5\n[Tenor] C5~\n[Mediatio] D5 C5 |\n[Tenor] C5~\n[Terminatio] D5 C5 Bb4 A4 F4 ||`, sampleVerse: 'Se, joka korkeimman suojassa...', liturgicalUse: 'Suojelu' },
  { id: 'psalm-116', name: 'Psalmi 116', subtitle: 'Mitä minä annan', category: 'finnish', mode: 'Tonus VI', finalis: 'F4', tuba: 'A4', description: 'Kiitollisuus.', code: `title: Psalmi 116\nkey: F\nlyrics: Mi-tä mi-nä an-nan Her-ral-le * kaik-es-ta siit-ä, mit-ä hän on mi-nul-le te-hnyt? \n\n[Intonatio] F4 G4 A4\n[Tenor] A4~\n[Mediatio] Bb4 A4 G4 A4 |\n[Tenor] A4~\n[Terminatio] G4 F4 G4 A4 F4 ||`, sampleVerse: 'Mitä minä annan Herralle...', liturgicalUse: 'Kiitos' },
  { id: 'psalm-120', name: 'Psalmi 120', subtitle: 'Hädässäni', category: 'finnish', mode: 'Tonus III', finalis: 'E4', tuba: 'C5', description: 'Matkailijan psalmi.', code: `title: Psalmi 120\nkey: C\nlyrics: Hädäs-sä-ni mi-nä huo-dan Her-raa, * ja hän vas-taa mi-nul-le. \n\n[Intonatio] G4 A4 C5\n[Tenor] C5~\n[Mediatio] D5 C5 |\n[Tenor] C5~\n[Terminatio] B4 A4 G4 A4 E4 ||`, sampleVerse: 'Hädässäni minä huodan Herraa...', liturgicalUse: 'Hätä' }
];
