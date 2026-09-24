import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { PSALM_TONE_PRESETS } from './src/lib/tones';
import { parsePsalmCode, transposeScore } from './src/lib/parser';
import { renderScoreToSvg } from './src/lib/engraver';
import { generateMidiFile } from './src/lib/midi';
import { ClefType, StaffStyle } from './src/types/music';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// --- Microservice REST API Routes ---

/**
 * Health check endpoint
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'PsalmiNotat Microservice',
    version: '1.0.0',
    capabilities: [
      'staff-engraving-svg',
      'gregorian-chant-notation',
      'midi-generation',
      'psalm-tone-database',
      'melody-dsl-parser'
    ]
  });
});

/**
 * List all preset psalm tones and formulas
 */
app.get('/api/tones', (_req: Request, res: Response) => {
  res.json({
    total: PSALM_TONE_PRESETS.length,
    tones: PSALM_TONE_PRESETS
  });
});

/**
 * Parse code DSL into musical score structure
 */
app.post('/api/parse', (req: Request, res: Response) => {
  try {
    const { code, transpose = 0 } = req.body;
    if (typeof code !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid "code" parameter in request body' });
    }

    let parsed = parsePsalmCode(code);
    if (transpose !== 0) {
      parsed = transposeScore(parsed, parseInt(transpose, 10));
    }

    res.json({
      score: parsed,
      notesCount: parsed.tokens.filter(t => t.type === 'note').length
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error parsing psalm code' });
  }
});

/**
 * Render psalm code to clean vector SVG
 */
app.post('/api/render', (req: Request, res: Response) => {
  try {
    const {
      code,
      style = 'modern',
      clef = 'treble',
      transpose = 0,
      showLyrics = true,
      showSectionLabels = true,
      activeNoteColor,
      activeNoteSize,
      highlightCadences = true,
      width
    } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid "code" parameter' });
    }

    let parsed = parsePsalmCode(code);
    if (transpose !== 0) {
      parsed = transposeScore(parsed, parseInt(transpose, 10));
    }

    const svg = renderScoreToSvg(parsed, {
      style: style as StaffStyle,
      clef: clef as ClefType,
      showLyrics: Boolean(showLyrics),
      showSectionLabels: Boolean(showSectionLabels),
      activeNoteColor,
      activeNoteSize,
      highlightCadences: Boolean(highlightCadences),
      width: width ? parseInt(width, 10) : undefined
    });

    res.json({
      svg,
      score: parsed,
      meta: {
        title: parsed.title,
        mode: parsed.mode,
        key: parsed.key,
        notesCount: parsed.tokens.filter(t => t.type === 'note').length,
        style
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error rendering score to SVG' });
  }
});

/**
 * Export directly as downloadable SVG file
 */
app.post('/api/export/svg', (req: Request, res: Response) => {
  try {
    const {
      code,
      style = 'modern',
      clef = 'treble',
      transpose = 0,
      showLyrics = true,
      showSectionLabels = true,
      activeNoteColor,
      activeNoteSize,
      highlightCadences = true
    } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).send('Missing code parameter');
    }

    let parsed = parsePsalmCode(code);
    if (transpose !== 0) {
      parsed = transposeScore(parsed, parseInt(transpose, 10));
    }

    const svg = renderScoreToSvg(parsed, {
      style: style as StaffStyle,
      clef: clef as ClefType,
      showLyrics: Boolean(showLyrics),
      showSectionLabels: Boolean(showSectionLabels),
      activeNoteColor,
      activeNoteSize,
      highlightCadences: Boolean(highlightCadences)
    });

    const filename = `${(parsed.title || 'psalmisavelma').toLowerCase().replace(/[^a-z0-9]/g, '_')}.svg`;
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(svg);
  } catch (err: any) {
    res.status(500).send(err.message || 'Export error');
  }
});

/**
 * Export as standard MIDI file (SMF format 0)
 */
app.post('/api/export/midi', (req: Request, res: Response) => {
  try {
    const { code, tempo = 70, transpose = 0 } = req.body;
    if (!code || typeof code !== 'string') {
      return res.status(400).send('Missing code parameter');
    }

    let parsed = parsePsalmCode(code);
    if (transpose !== 0) {
      parsed = transposeScore(parsed, parseInt(transpose, 10));
    }

    const midiBytes = generateMidiFile(parsed, parseInt(tempo, 10) || 70);
    const filename = `${(parsed.title || 'psalmisavelma').toLowerCase().replace(/[^a-z0-9]/g, '_')}.mid`;

    res.setHeader('Content-Type', 'audio/midi');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(Buffer.from(midiBytes));
  } catch (err: any) {
    res.status(500).send(err.message || 'MIDI export error');
  }
});

// --- Frontend Mounting (Vite in Dev / Static in Prod) ---

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`PsalmiNotat microservice running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
