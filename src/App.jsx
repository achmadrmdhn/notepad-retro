import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  FileText, 
  FolderOpen, 
  Save, 
  Download, 
  Printer, 
  Search, 
  Clock, 
  Settings, 
  HelpCircle, 
  Info, 
  Trash2, 
  Copy, 
  Clipboard, 
  Maximize2, 
  Minus, 
  X, 
  Check, 
  FileSpreadsheet, 
  Code, 
  FileCode, 
  Volume2, 
  VolumeX,
  HardDrive,
  Plus,
  Monitor,
  RefreshCw,
  Power,
  Play,
  Pause,
  Type,
  AlignLeft,
  Sparkles,
  Hash
} from 'lucide-react';

const DEFAULT_INITIAL_DOCS = [
  {
    id: 'doc-1',
    title: 'Catatan1.txt',
    content: `Selamat datang di Windows 98 Notepad (React Edition)!

Aplikasi web ini menghadirkan kembali memori klasik Windows 98 dengan fungsionalitas modern:
1. Ekspor Multi-Format:
   - File Teks Polos (.TXT)
   - Tabel Spreadsheet / Excel (.CSV)
   - Berkas Data (.JSON)
   - Dokumen Markdown (.MD)
   - Halaman Web Mandiri (.HTML)
2. Dukungan Multi-Tab: Buka banyak berkas sekaligus.
3. Fitur Find & Replace (Cari & Ganti) ala dialog jadul.
4. Auto-Save ke LocalStorage browser.
5. Shortcut Keyboard: Ctrl+S (Simpan), Ctrl+O (Buka), Ctrl+F (Cari), F5 (Tanggal/Waktu).

Contoh format data siap ekspor ke CSV:
Nama,Peran,Kota,Gaji
Budi Hartono,Frontend Developer,Jakarta,15000000
Siti Nurhaliza,UI/UX Designer,Bandung,14000000
Agus Prasetyo,Backend Engineer,Surabaya,16000000

Coba klik tombol ".CSV" di toolbar atau menu Export!`,
    updatedAt: Date.now()
  },
  {
    id: 'doc-2',
    title: 'Panduan_Markdown.md',
    content: `# Panduan Singkat Markdown

Selamat berkarya dengan Notepad 98!

## Fitur Utama
- **Tebal (Bold)** dan *Miring (Italic)*
- Fitur pencarian kata yang presisi
- Pembuat tabel data otomatis

### Langkah Ekspor ke HTML
1. Ketik catatan Anda
2. Buka menu **Export** -> **Ekspor ke Dokumen .HTML**
3. Buka hasil ekspor di browser apa saja!`,
    updatedAt: Date.now() - 100000
  }
];

// Web Audio API Retro Sound Effects Synthesizer
const playRetroSound = (type = 'click', soundEnabled = true) => {
  if (!soundEnabled) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'startup') {
      // Classic Win98 Arpeggio Chime
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const noteOsc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        noteOsc.type = 'triangle';
        noteOsc.frequency.setValueAtTime(freq, now + idx * 0.08);
        noteGain.gain.setValueAtTime(0.15, now + idx * 0.08);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
        noteOsc.connect(noteGain);
        noteGain.connect(ctx.destination);
        noteOsc.start(now + idx * 0.08);
        noteOsc.stop(now + idx * 0.08 + 0.45);
      });
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch {
    // Audio Context blocked or unavailable
  }
};

export default function App() {
  // Documents State
  const [documents, setDocuments] = useState(() => {
    try {
      const saved = localStorage.getItem('react_win98_docs');
      return saved ? JSON.parse(saved) : DEFAULT_INITIAL_DOCS;
    } catch {
      return DEFAULT_INITIAL_DOCS;
    }
  });

  const [activeDocId, setActiveDocId] = useState(() => {
    try {
      const savedId = localStorage.getItem('react_win98_active');
      return savedId || 'doc-1';
    } catch {
      return 'doc-1';
    }
  });

  // Settings State
  const [wordWrap, setWordWrap] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(false);
  const [fontFamily, setFontFamily] = useState("'Courier Prime', monospace");
  const [fontSize, setFontSize] = useState("13px");
  const [fontStyle, setFontStyle] = useState("normal"); // normal, bold, italic
  const [saveStatus, setSaveStatus] = useState('Tersimpan');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentTheme, setCurrentTheme] = useState('classic'); // classic, 95, matrix, dark

  // Window System State
  const [windowPos, setWindowPos] = useState({ x: 110, y: 30 });
  const [windowSize, setWindowSize] = useState({ width: 820, height: 530 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [savedBounds, setSavedBounds] = useState({ x: 110, y: 30, width: 820, height: 530 });

  // Navigation & Start Menu
  const [activeMenu, setActiveMenu] = useState(null);
  const [isStartOpen, setIsStartOpen] = useState(false);

  // Modals
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isFindOpen, setIsFindOpen] = useState(false);
  const [isFontOpen, setIsFontOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isShutdownOpen, setIsShutdownOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  // Alert/Confirm Dialog State
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info', // info, warning, error, question
    onConfirm: null
  });

  // Cursor & Status Stats
  const [cursorInfo, setCursorInfo] = useState({ line: 1, col: 1, words: 0, chars: 0, linesTotal: 1 });
  const [clockText, setClockText] = useState('');

  // Export Modal Config
  const [exportConfig, setExportConfig] = useState({
    filename: 'catatan_saya',
    format: 'txt',
    delimiter: ',',
    encoding: 'utf-8'
  });

  // Find & Replace Form State
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matchCase, setMatchCase] = useState(false);

  // Font Modal Temporary State
  const [tempFontFamily, setTempFontFamily] = useState(fontFamily);
  const [tempFontSize, setTempFontSize] = useState(fontSize);
  const [tempFontStyle, setTempFontStyle] = useState(fontStyle);

  // DOM Refs
  const editorRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const fileInputRef = useRef(null);
  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, winX: 0, winY: 0, winW: 0, winH: 0 });

  const currentDoc = documents.find(d => d.id === activeDocId) || documents[0] || { id: 'temp', title: 'Untitled.txt', content: '' };

  // Sync Body Theme Class
  useEffect(() => {
    document.body.className = `theme-${currentTheme}`;
  }, [currentTheme]);

  // Window position responsiveness
  useEffect(() => {
    const handlePlacement = () => {
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      
      if (screenW < 768) {
        const newW = screenW;
        const newH = Math.max(300, screenH - 36);
        setWindowPos({ x: 0, y: 0 });
        setWindowSize({ width: newW, height: newH });
        setSavedBounds({ x: 0, y: 0, width: newW, height: newH });
      } else {
        setWindowPos(prev => {
          const initW = Math.min(880, Math.max(540, screenW - 140));
          const initH = Math.min(560, Math.max(400, screenH - 80));
          const maxX = Math.max(0, screenW - initW);
          const maxY = Math.max(0, screenH - 36 - initH);
          const nextX = Math.max(90, Math.min(maxX, prev.x));
          const nextY = Math.max(15, Math.min(maxY, prev.y));
          setWindowSize({ width: initW, height: initH });
          setSavedBounds({ x: nextX, y: nextY, width: initW, height: initH });
          return { x: nextX, y: nextY };
        });
      }
    };

    handlePlacement();
    window.addEventListener('resize', handlePlacement);
    return () => window.removeEventListener('resize', handlePlacement);
  }, []);

  // Save documents to local storage
  useEffect(() => {
    try {
      localStorage.setItem('react_win98_docs', JSON.stringify(documents));
      localStorage.setItem('react_win98_active', activeDocId);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [documents, activeDocId]);

  // Clock in system tray
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setClockText(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate cursor line/col & word count
  const updateStats = useCallback(() => {
    if (!editorRef.current) return;
    const text = editorRef.current.value;
    const selStart = editorRef.current.selectionStart || 0;

    const lines = text.substring(0, selStart).split('\n');
    const currentLine = lines.length;
    const currentCol = lines[lines.length - 1].length + 1;

    const allLines = text.split('\n');
    const linesTotal = allLines.length;

    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;

    setCursorInfo({ line: currentLine, col: currentCol, words, chars, linesTotal });
  }, []);

  useEffect(() => {
    updateStats();
  }, [currentDoc.content, updateStats]);

  // Sync scroll for line numbers gutter
  const handleEditorScroll = () => {
    if (editorRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = editorRef.current.scrollTop;
    }
  };

  const handleContentChange = (e) => {
    const val = e.target.value;
    setDocuments(prev => prev.map(doc => doc.id === activeDocId ? { ...doc, content: val, updatedAt: Date.now() } : doc));
    setSaveStatus('Mengetik...');
    setTimeout(() => setSaveStatus('Tersimpan'), 1200);
    updateStats();
  };

  const handleCreateDocument = () => {
    playRetroSound('click', soundEnabled);
    const newId = `doc-${Date.now()}`;
    const newName = `Catatan${documents.length + 1}.txt`;
    const newNote = { id: newId, title: newName, content: '', updatedAt: Date.now() };
    setDocuments(prev => [...prev, newNote]);
    setActiveDocId(newId);
    setActiveMenu(null);
    setIsStartOpen(false);
    setTimeout(() => {
      if (editorRef.current) editorRef.current.focus();
    }, 50);
  };

  const handleCloseDocument = (idToClose, e) => {
    if (e) e.stopPropagation();
    playRetroSound('click', soundEnabled);
    if (documents.length <= 1) {
      triggerDialog('Pemberitahuan', 'Satu dokumen minimal harus tetap dibuka dalam sesi kerja.', 'info');
      return;
    }
    const filtered = documents.filter(d => d.id !== idToClose);
    setDocuments(filtered);
    if (activeDocId === idToClose) {
      setActiveDocId(filtered[0].id);
    }
  };

  const handleOpenFileClick = () => {
    playRetroSound('click', soundEnabled);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    setActiveMenu(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileData = event.target.result;
      const newDoc = {
        id: `doc-${Date.now()}`,
        title: file.name,
        content: String(fileData),
        updatedAt: Date.now()
      };
      setDocuments(prev => [...prev, newDoc]);
      setActiveDocId(newDoc.id);
      triggerDialog('Sukses Membuka Berkas', `File "${file.name}" berhasil dimuat ke editor.`, 'info');
    };
    reader.onerror = () => {
      triggerDialog('Kesalahan Berkas', 'Gagal membaca berkas dari media penyimpanan Anda.', 'error');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Drag and Drop File Upload
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileData = event.target.result;
        const newDoc = {
          id: `doc-${Date.now()}`,
          title: file.name,
          content: String(fileData),
          updatedAt: Date.now()
        };
        setDocuments(prev => [...prev, newDoc]);
        setActiveDocId(newDoc.id);
        triggerDialog('Berkas Diterima', `File "${file.name}" berhasil di-drop dan dimuat.`, 'info');
      };
      reader.readAsText(file);
    }
  };

  const openExportModalWithFormat = (format = 'txt') => {
    playRetroSound('click', soundEnabled);
    const cleanTitle = (currentDoc.title || 'catatan').replace(/\.[^/.]+$/, "");
    setExportConfig(prev => ({ ...prev, filename: cleanTitle, format }));
    setIsExportOpen(true);
    setActiveMenu(null);
  };

  const processTextToCSV = (text, delimiter) => {
    if (!text.trim()) return `Kolom1${delimiter}Kolom2\r\nData1${delimiter}Data2`;
    const lines = text.split('\n');
    return lines.map(line => {
      let tokens;
      if (line.includes(delimiter)) {
        tokens = line.split(delimiter);
      } else if (line.includes('\t')) {
        tokens = line.split('\t');
      } else if (line.includes('  ')) {
        tokens = line.split(/\s{2,}/);
      } else {
        tokens = [line];
      }
      return tokens.map(cell => {
        let clean = (cell || '').trim();
        if (clean.includes(delimiter) || clean.includes('"') || clean.includes('\n')) {
          clean = `"${clean.replace(/"/g, '""')}"`;
        }
        return clean;
      }).join(delimiter);
    }).join('\r\n');
  };

  const createHTMLExport = (title, text) => {
    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: 'Courier Prime', 'Courier New', monospace; background: #fafafa; color: #111; padding: 30px; line-height: 1.6; max-width: 800px; margin: 0 auto; }
    h1 { border-bottom: 3px solid #000080; color: #000080; padding-bottom: 8px; font-size: 22px; }
    .header-bar { background: #000080; color: white; padding: 8px 14px; font-weight: bold; font-size: 13px; margin-bottom: 20px; }
    pre { background: #f4f4f4; border: 2px solid #808080; padding: 16px; white-space: pre-wrap; font-size: 13px; box-shadow: 2px 2px 0 #808080; }
    footer { margin-top: 30px; font-size: 11px; color: #555; border-top: 1px solid #ccc; padding-top: 10px; }
  </style>
</head>
<body>
  <div class="header-bar">📝 Windows 98 Notepad Document</div>
  <h1>${title}</h1>
  <pre>${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  <footer>Diekspor dari Windows 98 Notepad Web Edition pada ${new Date().toLocaleString('id-ID')}</footer>
</body>
</html>`;
  };

  const handleExecuteExport = () => {
    playRetroSound('click', soundEnabled);
    let baseName = exportConfig.filename.trim() || 'catatan';
    const { format, delimiter } = exportConfig;
    let textBody = currentDoc.content || '';
    let mime = 'text/plain;charset=utf-8';

    if (format === 'csv') {
      textBody = processTextToCSV(textBody, delimiter);
      mime = 'text/csv;charset=utf-8';
    } else if (format === 'json') {
      const payload = {
        title: baseName,
        exportedAt: new Date().toISOString(),
        characterCount: textBody.length,
        lineCount: textBody.split('\n').length,
        wordCount: textBody.trim() ? textBody.trim().split(/\s+/).length : 0,
        content: textBody
      };
      textBody = JSON.stringify(payload, null, 2);
      mime = 'application/json;charset=utf-8';
    } else if (format === 'md') {
      mime = 'text/markdown;charset=utf-8';
    } else if (format === 'html') {
      textBody = createHTMLExport(baseName, textBody);
      mime = 'text/html;charset=utf-8';
    }

    if (!baseName.toLowerCase().endsWith('.' + format)) {
      baseName += '.' + format;
    }

    const blob = new Blob([textBody], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = baseName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setIsExportOpen(false);
    setSaveStatus('Terekspor!');
    setTimeout(() => setSaveStatus('Tersimpan'), 2000);
  };

  const handleFindNext = () => {
    playRetroSound('click', soundEnabled);
    if (!findText || !editorRef.current) return;
    const textarea = editorRef.current;
    const content = textarea.value;
    const startIndex = textarea.selectionEnd || 0;

    const source = matchCase ? content : content.toLowerCase();
    const query = matchCase ? findText : findText.toLowerCase();

    let pos = source.indexOf(query, startIndex);
    if (pos === -1 && startIndex > 0) {
      pos = source.indexOf(query, 0);
    }

    if (pos !== -1) {
      textarea.focus();
      textarea.setSelectionRange(pos, pos + query.length);
      updateStats();
    } else {
      triggerDialog('Pencarian Selesai', `Tidak menemukan kata "${findText}" di dalam dokumen ini.`, 'info');
    }
  };

  const handleReplaceCurrent = (replaceAll = false) => {
    playRetroSound('click', soundEnabled);
    if (!findText || !editorRef.current) return;
    const textarea = editorRef.current;
    let content = textarea.value;

    if (replaceAll) {
      const flags = matchCase ? 'g' : 'gi';
      const safe = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(safe, flags);
      const occurrences = (content.match(regex) || []).length;
      const updated = content.replace(regex, replaceText);
      
      setDocuments(prev => prev.map(d => d.id === activeDocId ? { ...d, content: updated } : d));
      triggerDialog('Hasil Penggantian', `Berhasil mengganti ${occurrences} kata di dalam dokumen.`, 'info');
    } else {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = content.substring(start, end);
      const isMatch = matchCase ? (selected === findText) : (selected.toLowerCase() === findText.toLowerCase());

      if (isMatch) {
        textarea.setRangeText(replaceText, start, end, 'select');
        const updated = textarea.value;
        setDocuments(prev => prev.map(d => d.id === activeDocId ? { ...d, content: updated } : d));
        handleFindNext();
      } else {
        handleFindNext();
      }
    }
  };

  const handleApplyFont = () => {
    playRetroSound('click', soundEnabled);
    setFontFamily(tempFontFamily);
    setFontSize(tempFontSize);
    setFontStyle(tempFontStyle);
    setIsFontOpen(false);
  };

  const handleInsertDateTime = () => {
    playRetroSound('click', soundEnabled);
    if (!editorRef.current) return;
    const stamp = new Date().toLocaleString('id-ID');
    const start = editorRef.current.selectionStart;
    const end = editorRef.current.selectionEnd;
    editorRef.current.setRangeText(stamp, start, end, 'end');
    const newContent = editorRef.current.value;
    setDocuments(prev => prev.map(d => d.id === activeDocId ? { ...d, content: newContent } : d));
    updateStats();
  };

  const handleTransformCase = (type) => {
    playRetroSound('click', soundEnabled);
    if (!editorRef.current) return;
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const isSelection = start !== end;
    const target = isSelection ? text.substring(start, end) : text;

    let res = target;
    if (type === 'upper') res = target.toUpperCase();
    if (type === 'lower') res = target.toLowerCase();
    if (type === 'title') res = target.replace(/\b\w/g, c => c.toUpperCase());

    if (isSelection) {
      textarea.setRangeText(res, start, end, 'select');
    } else {
      textarea.value = res;
    }
    const updated = textarea.value;
    setDocuments(prev => prev.map(d => d.id === activeDocId ? { ...d, content: updated } : d));
    setActiveMenu(null);
    updateStats();
  };

  const handleClearNote = () => {
    playRetroSound('error', soundEnabled);
    triggerConfirm(
      'Konfirmasi Kosongkan Catatan', 
      'Apakah Anda yakin ingin menghapus seluruh isi teks pada dokumen saat ini?',
      () => {
        setDocuments(prev => prev.map(d => d.id === activeDocId ? { ...d, content: '' } : d));
        updateStats();
      }
    );
  };

  // Window Drag Handler
  const handleTitlePointerDown = (e) => {
    if (isMaximized || window.innerWidth < 768) return;
    if (e.target.closest('button')) return;
    isDraggingRef.current = true;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      winX: windowPos.x,
      winY: windowPos.y,
      winW: windowSize.width,
      winH: windowSize.height
    };

    const handlePointerMove = (event) => {
      if (!isDraggingRef.current) return;
      const dx = event.clientX - dragStartRef.current.mouseX;
      const dy = event.clientY - dragStartRef.current.mouseY;
      const maxX = Math.max(0, window.innerWidth - 120);
      const maxY = Math.max(0, window.innerHeight - 70);
      const newX = Math.max(0, Math.min(maxX, dragStartRef.current.winX + dx));
      const newY = Math.max(0, Math.min(maxY, dragStartRef.current.winY + dy));
      setWindowPos({ x: newX, y: newY });
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Window Resize Handler
  const handleResizePointerDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isMaximized || window.innerWidth < 768) return;
    isResizingRef.current = true;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      winX: windowPos.x,
      winY: windowPos.y,
      winW: windowSize.width,
      winH: windowSize.height
    };

    const handleResizeMove = (event) => {
      if (!isResizingRef.current) return;
      const dx = event.clientX - dragStartRef.current.mouseX;
      const dy = event.clientY - dragStartRef.current.mouseY;
      const newW = Math.max(340, Math.min(window.innerWidth - dragStartRef.current.winX - 4, dragStartRef.current.winW + dx));
      const newH = Math.max(240, Math.min(window.innerHeight - dragStartRef.current.winY - 40, dragStartRef.current.winH + dy));
      setWindowSize({ width: newW, height: newH });
    };

    const handleResizeUp = () => {
      isResizingRef.current = false;
      window.removeEventListener('pointermove', handleResizeMove);
      window.removeEventListener('pointerup', handleResizeUp);
    };

    window.addEventListener('pointermove', handleResizeMove);
    window.addEventListener('pointerup', handleResizeUp);
  };

  const toggleMaximize = () => {
    playRetroSound('click', soundEnabled);
    if (!isMaximized) {
      setSavedBounds({ ...windowPos, ...windowSize });
      setIsMaximized(true);
    } else {
      setIsMaximized(false);
      setWindowPos({ x: savedBounds.x, y: savedBounds.y });
      setWindowSize({ width: savedBounds.width, height: savedBounds.height });
    }
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F5') {
        e.preventDefault();
        handleInsertDateTime();
      }
      if (e.key === 'F1') {
        e.preventDefault();
        setIsHelpOpen(true);
      }
      if (e.key === 'F12') {
        e.preventDefault();
        openExportModalWithFormat('txt');
      }
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 's':
            e.preventDefault();
            setSaveStatus('Tersimpan!');
            playRetroSound('click', soundEnabled);
            setTimeout(() => setSaveStatus('Tersimpan'), 1500);
            break;
          case 'o':
            e.preventDefault();
            handleOpenFileClick();
            break;
          case 'n':
            e.preventDefault();
            handleCreateDocument();
            break;
          case 'f':
            e.preventDefault();
            setIsFindOpen(true);
            break;
          case 'p':
            e.preventDefault();
            window.print();
            break;
          default:
            break;
        }
      }
    };

    const handleGlobalClick = (e) => {
      if (!e.target.closest('.win-menu-item')) {
        setActiveMenu(null);
      }
      if (!e.target.closest('#start-btn') && !e.target.closest('#start-menu-panel')) {
        setIsStartOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleGlobalClick);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [activeDocId, documents, soundEnabled]);

  const triggerDialog = (title, message, type = 'info') => {
    playRetroSound(type === 'error' ? 'error' : 'click', soundEnabled);
    setDialogState({
      isOpen: true,
      title,
      message,
      type,
      onConfirm: null
    });
  };

  const triggerConfirm = (title, message, onConfirm) => {
    playRetroSound('warning', soundEnabled);
    setDialogState({
      isOpen: true,
      title,
      message,
      type: 'question',
      onConfirm
    });
  };

  const closeDialog = () => {
    playRetroSound('click', soundEnabled);
    setDialogState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div 
      className="win-desktop w-screen h-[100dvh] relative select-none overflow-hidden flex flex-col font-sans"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".txt,.csv,.json,.md,.html,.log,.js,.css" />

      {/* Desktop Icons Grid */}
      <div className="absolute inset-0 p-2 sm:p-3 flex flex-row flex-wrap md:flex-col items-start gap-3 sm:gap-4 z-0 max-w-full md:w-28 pointer-events-auto overflow-hidden">
        
        {/* Desktop Icon: Notepad.exe */}
        <div 
          className="flex flex-col items-center gap-1 w-16 sm:w-20 p-1.5 cursor-pointer text-white text-center hover:bg-[#000080]/60 border border-transparent hover:border-dotted hover:border-white group rounded-none"
          onClick={() => { setIsMinimized(false); editorRef.current?.focus(); }}
          onDoubleClick={() => { setIsMinimized(false); editorRef.current?.focus(); }}
        >
          <div className="w-10 h-10 bg-yellow-50 border-2 border-black flex items-center justify-center shadow-md">
            <FileText className="w-6 h-6 text-blue-900" />
          </div>
          <span className="text-[11px] drop-shadow-md leading-tight px-1 font-medium group-hover:bg-[#000080] bg-black/20">
            Notepad.exe
          </span>
        </div>

        {/* Desktop Icon: Catatan Baru */}
        <div 
          className="flex flex-col items-center gap-1 w-16 sm:w-20 p-1.5 cursor-pointer text-white text-center hover:bg-[#000080]/60 border border-transparent hover:border-dotted hover:border-white group"
          onClick={handleCreateDocument}
          onDoubleClick={handleCreateDocument}
        >
          <div className="w-10 h-10 bg-amber-100 border-2 border-amber-900 flex items-center justify-center shadow-md">
            <FolderOpen className="w-6 h-6 text-amber-700" />
          </div>
          <span className="text-[11px] drop-shadow-md leading-tight px-1 font-medium group-hover:bg-[#000080] bg-black/20">
            Catatan Baru
          </span>
        </div>

        {/* Desktop Icon: Ekspor CSV */}
        <div 
          className="flex flex-col items-center gap-1 w-16 sm:w-20 p-1.5 cursor-pointer text-white text-center hover:bg-[#000080]/60 border border-transparent hover:border-dotted hover:border-white group"
          onClick={() => openExportModalWithFormat('csv')}
          onDoubleClick={() => openExportModalWithFormat('csv')}
        >
          <div className="w-10 h-10 bg-emerald-100 border-2 border-emerald-900 flex items-center justify-center shadow-md">
            <FileSpreadsheet className="w-6 h-6 text-emerald-800" />
          </div>
          <span className="text-[11px] drop-shadow-md leading-tight px-1 font-medium group-hover:bg-[#000080] bg-black/20">
            Ekspor CSV
          </span>
        </div>

        {/* Desktop Icon: Tema / Tampilan */}
        <div 
          className="flex flex-col items-center gap-1 w-16 sm:w-20 p-1.5 cursor-pointer text-white text-center hover:bg-[#000080]/60 border border-transparent hover:border-dotted hover:border-white group"
          onClick={() => setIsThemeOpen(true)}
          onDoubleClick={() => setIsThemeOpen(true)}
        >
          <div className="w-10 h-10 bg-indigo-100 border-2 border-indigo-900 flex items-center justify-center shadow-md">
            <Monitor className="w-6 h-6 text-indigo-800" />
          </div>
          <span className="text-[11px] drop-shadow-md leading-tight px-1 font-medium group-hover:bg-[#000080] bg-black/20">
            Pilih Tema
          </span>
        </div>

        {/* Desktop Icon: Recycle Bin */}
        <div 
          className="flex flex-col items-center gap-1 w-16 sm:w-20 p-1.5 cursor-pointer text-white text-center hover:bg-[#000080]/60 border border-transparent hover:border-dotted hover:border-white group"
          onClick={handleClearNote}
          onDoubleClick={handleClearNote}
        >
          <div className="w-10 h-10 bg-gray-200 border-2 border-gray-700 flex items-center justify-center shadow-md">
            <Trash2 className="w-6 h-6 text-gray-700" />
          </div>
          <span className="text-[11px] drop-shadow-md leading-tight px-1 font-medium group-hover:bg-[#000080] bg-black/20">
            Recycle Bin
          </span>
        </div>

        {/* Desktop Icon: Panduan / Help */}
        <div 
          className="flex flex-col items-center gap-1 w-16 sm:w-20 p-1.5 cursor-pointer text-white text-center hover:bg-[#000080]/60 border border-transparent hover:border-dotted hover:border-white group"
          onClick={() => setIsHelpOpen(true)}
          onDoubleClick={() => setIsHelpOpen(true)}
        >
          <div className="w-10 h-10 bg-blue-100 border-2 border-blue-900 flex items-center justify-center shadow-md">
            <HelpCircle className="w-6 h-6 text-blue-800" />
          </div>
          <span className="text-[11px] drop-shadow-md leading-tight px-1 font-medium group-hover:bg-[#000080] bg-black/20">
            Bantuan F1
          </span>
        </div>
      </div>

      {/* Main Notepad Window */}
      {!isMinimized && (
        <div 
          className="win-outset bg-[#c0c0c0] absolute z-20 flex flex-col shadow-2xl transition-none"
          style={{
            left: (isMaximized || window.innerWidth < 768) ? 0 : `${windowPos.x}px`,
            top: (isMaximized || window.innerWidth < 768) ? 0 : `${windowPos.y}px`,
            width: (isMaximized || window.innerWidth < 768) ? '100vw' : `${windowSize.width}px`,
            height: (isMaximized || window.innerWidth < 768) ? 'calc(100dvh - 36px)' : `${windowSize.height}px`,
            minWidth: '320px',
            minHeight: '220px',
            maxHeight: 'calc(100dvh - 36px)'
          }}
        >
          {/* Window Title Bar */}
          <div 
            className="win-titlebar px-2 py-1 flex items-center justify-between cursor-move select-none shrink-0"
            onPointerDown={handleTitlePointerDown}
            onDoubleClick={toggleMaximize}
          >
            <div className="flex items-center gap-1.5 overflow-hidden pointer-events-none pr-1">
              <FileText className="w-4 h-4 text-blue-200 shrink-0" />
              <span className="truncate font-bold tracking-wide text-xs">
                {currentDoc.title || 'Catatan1.txt'} - Notepad 98 Web Edition
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button 
                className="win-title-btn" 
                title="Minimize"
                onClick={() => { playRetroSound('click', soundEnabled); setIsMinimized(true); }}
              >
                _
              </button>
              <button 
                className="win-title-btn hidden sm:flex" 
                title="Maximize / Restore"
                onClick={toggleMaximize}
              >
                {isMaximized ? '❐' : '□'}
              </button>
              <button 
                className="win-title-btn hover:bg-red-400 font-bold" 
                title="Close"
                onClick={() => { playRetroSound('click', soundEnabled); setIsMinimized(true); }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Menubar */}
          <div className="bg-[#c0c0c0] border-b border-[#808080] px-1 py-0.5 flex items-center gap-1 relative text-[11px] shrink-0 z-40 select-none overflow-x-auto win-scrollbar">
            {/* File Menu */}
            <div className={`win-menu-item shrink-0 ${activeMenu === 'file' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'file' ? null : 'file'); }}>
              <span className="underline">F</span>ile
              {activeMenu === 'file' && (
                <div className="win-dropdown">
                  <div className="win-dropdown-option" onClick={handleCreateDocument}>
                    <span className="flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-blue-800" /> Dokumen Baru</span>
                    <span className="text-gray-600 text-[10px] hidden sm:inline">Ctrl+N</span>
                  </div>
                  <div className="win-dropdown-option" onClick={handleOpenFileClick}>
                    <span className="flex items-center gap-2"><FolderOpen className="w-3.5 h-3.5 text-amber-700" /> Buka Berkas...</span>
                    <span className="text-gray-600 text-[10px] hidden sm:inline">Ctrl+O</span>
                  </div>
                  <div className="win-dropdown-option" onClick={() => { setSaveStatus('Tersimpan!'); setActiveMenu(null); }}>
                    <span className="flex items-center gap-2"><Save className="w-3.5 h-3.5 text-slate-700" /> Simpan</span>
                    <span className="text-gray-600 text-[10px] hidden sm:inline">Ctrl+S</span>
                  </div>
                  <div className="win-dropdown-option font-semibold text-blue-900" onClick={() => openExportModalWithFormat('txt')}>
                    <span className="flex items-center gap-2"><Download className="w-3.5 h-3.5 text-emerald-700" /> Simpan Sebagai / Export...</span>
                    <span className="text-gray-600 text-[10px] hidden sm:inline">F12</span>
                  </div>
                  <div className="win-separator" />
                  <div className="win-dropdown-option" onClick={() => { window.print(); setActiveMenu(null); }}>
                    <span className="flex items-center gap-2"><Printer className="w-3.5 h-3.5 text-gray-700" /> Cetak (Print)...</span>
                    <span className="text-gray-600 text-[10px] hidden sm:inline">Ctrl+P</span>
                  </div>
                  <div className="win-separator" />
                  <div className="win-dropdown-option" onClick={() => { setIsMinimized(true); setActiveMenu(null); }}>
                    <span>Keluar (Exit)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Edit Menu */}
            <div className={`win-menu-item shrink-0 ${activeMenu === 'edit' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'edit' ? null : 'edit'); }}>
              <span className="underline">E</span>dit
              {activeMenu === 'edit' && (
                <div className="win-dropdown">
                  <div className="win-dropdown-option" onClick={() => { document.execCommand('undo'); setActiveMenu(null); }}>
                    <span>Urungkan (Undo)</span>
                    <span className="text-gray-600 text-[10px] hidden sm:inline">Ctrl+Z</span>
                  </div>
                  <div className="win-separator" />
                  <div className="win-dropdown-option" onClick={() => { document.execCommand('copy'); setActiveMenu(null); }}>
                    <span className="flex items-center gap-2"><Copy className="w-3.5 h-3.5" /> Salin (Copy)</span>
                    <span className="text-gray-600 text-[10px] hidden sm:inline">Ctrl+C</span>
                  </div>
                  <div className="win-dropdown-option" onClick={() => { document.execCommand('paste'); setActiveMenu(null); }}>
                    <span className="flex items-center gap-2"><Clipboard className="w-3.5 h-3.5" /> Tempel (Paste)</span>
                    <span className="text-gray-600 text-[10px] hidden sm:inline">Ctrl+V</span>
                  </div>
                  <div className="win-dropdown-option" onClick={() => { editorRef.current?.select(); setActiveMenu(null); }}>
                    <span>Pilih Semua</span>
                    <span className="text-gray-600 text-[10px] hidden sm:inline">Ctrl+A</span>
                  </div>
                  <div className="win-separator" />
                  <div className="win-dropdown-option" onClick={() => { setIsFindOpen(true); setActiveMenu(null); }}>
                    <span className="flex items-center gap-2"><Search className="w-3.5 h-3.5" /> Cari & Ganti...</span>
                    <span className="text-gray-600 text-[10px] hidden sm:inline">Ctrl+F</span>
                  </div>
                  <div className="win-dropdown-option" onClick={() => { handleInsertDateTime(); setActiveMenu(null); }}>
                    <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Waktu / Tanggal</span>
                    <span className="text-gray-600 text-[10px] hidden sm:inline">F5</span>
                  </div>
                </div>
              )}
            </div>

            {/* Format Menu */}
            <div className={`win-menu-item shrink-0 ${activeMenu === 'format' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'format' ? null : 'format'); }}>
              <span className="underline">F</span>ormat
              {activeMenu === 'format' && (
                <div className="win-dropdown">
                  <div className="win-dropdown-option" onClick={() => { setWordWrap(!wordWrap); setActiveMenu(null); }}>
                    <span className="flex items-center gap-2">
                      <Check className={`w-3.5 h-3.5 text-green-700 ${wordWrap ? 'opacity-100' : 'opacity-0'}`} />
                      Bungkus Teks (Word Wrap)
                    </span>
                  </div>
                  <div className="win-dropdown-option" onClick={() => { setShowLineNumbers(!showLineNumbers); setActiveMenu(null); }}>
                    <span className="flex items-center gap-2">
                      <Check className={`w-3.5 h-3.5 text-green-700 ${showLineNumbers ? 'opacity-100' : 'opacity-0'}`} />
                      Nomor Baris (Line Numbers)
                    </span>
                  </div>
                  <div className="win-separator" />
                  <div className="win-dropdown-option" onClick={() => { setTempFontFamily(fontFamily); setTempFontSize(fontSize); setTempFontStyle(fontStyle); setIsFontOpen(true); setActiveMenu(null); }}>
                    <span className="flex items-center gap-2"><Settings className="w-3.5 h-3.5" /> Pengaturan Font...</span>
                  </div>
                  <div className="win-separator" />
                  <div className="win-dropdown-option" onClick={() => handleTransformCase('upper')}>
                    <span>Jadikan UPPERCASE</span>
                  </div>
                  <div className="win-dropdown-option" onClick={() => handleTransformCase('lower')}>
                    <span>Jadikan lowercase</span>
                  </div>
                  <div className="win-dropdown-option" onClick={() => handleTransformCase('title')}>
                    <span>Jadikan Title Case</span>
                  </div>
                </div>
              )}
            </div>

            {/* Export Menu */}
            <div className={`win-menu-item shrink-0 font-bold text-blue-900 ${activeMenu === 'export' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'export' ? null : 'export'); }}>
              <span className="underline">E</span>xport
              {activeMenu === 'export' && (
                <div className="win-dropdown">
                  <div className="win-dropdown-option" onClick={() => openExportModalWithFormat('txt')}>
                    <span className="flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-blue-700" /> Ekspor ke .TXT</span>
                  </div>
                  <div className="win-dropdown-option font-semibold text-green-900" onClick={() => openExportModalWithFormat('csv')}>
                    <span className="flex items-center gap-2"><FileSpreadsheet className="w-3.5 h-3.5 text-green-700" /> Ekspor ke .CSV (Spreadsheet)</span>
                  </div>
                  <div className="win-dropdown-option" onClick={() => openExportModalWithFormat('json')}>
                    <span className="flex items-center gap-2"><Code className="w-3.5 h-3.5 text-amber-700" /> Ekspor ke .JSON</span>
                  </div>
                  <div className="win-dropdown-option" onClick={() => openExportModalWithFormat('md')}>
                    <span className="flex items-center gap-2"><FileCode className="w-3.5 h-3.5 text-purple-700" /> Ekspor ke .MD (Markdown)</span>
                  </div>
                  <div className="win-dropdown-option" onClick={() => openExportModalWithFormat('html')}>
                    <span className="flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-red-600" /> Ekspor ke Dokumen .HTML</span>
                  </div>
                </div>
              )}
            </div>

            {/* Help Menu */}
            <div className={`win-menu-item shrink-0 ${activeMenu === 'help' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'help' ? null : 'help'); }}>
              <span className="underline">H</span>elp
              {activeMenu === 'help' && (
                <div className="win-dropdown">
                  <div className="win-dropdown-option" onClick={() => { setIsHelpOpen(true); setActiveMenu(null); }}>
                    <span className="flex items-center gap-2"><HelpCircle className="w-3.5 h-3.5 text-amber-700" /> Bantuan & Panduan</span>
                    <span className="text-gray-600 text-[10px] hidden sm:inline">F1</span>
                  </div>
                  <div className="win-separator" />
                  <div className="win-dropdown-option" onClick={() => { setIsAboutOpen(true); setActiveMenu(null); }}>
                    <span className="flex items-center gap-2"><Info className="w-3.5 h-3.5 text-blue-800" /> Tentang Notepad 98</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Toolbar */}
          <div className="bg-[#c0c0c0] px-2 py-1 flex items-center justify-between border-b border-[#808080] text-[11px] gap-2 shrink-0 overflow-x-auto win-scrollbar">
            <div className="flex items-center gap-1.5 shrink-0 py-0.5">
              <button className="win-btn px-2 py-1 flex items-center gap-1 shrink-0" onClick={handleCreateDocument} title="Catatan Baru (Ctrl+N)">
                <Plus className="w-3.5 h-3.5 text-blue-800" /> Baru
              </button>
              <button className="win-btn px-2 py-1 flex items-center gap-1 shrink-0" onClick={handleOpenFileClick} title="Buka Dokumen (Ctrl+O)">
                <FolderOpen className="w-3.5 h-3.5 text-amber-800" /> Buka
              </button>
              <button className="win-btn px-2 py-1 flex items-center gap-1 shrink-0" onClick={() => { setSaveStatus('Tersimpan!'); playRetroSound('click', soundEnabled); }} title="Simpan Dokumen (Ctrl+S)">
                <Save className="w-3.5 h-3.5 text-slate-700" /> Simpan
              </button>

              <div className="w-[2px] h-4 bg-gray-400 border-r border-white mx-0.5 shrink-0" />

              <button 
                className="win-btn px-2 py-1 font-bold text-green-900 flex items-center gap-1 shrink-0" 
                onClick={() => openExportModalWithFormat('csv')}
                title="Ekspor Cepat format CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-green-700" /> .CSV
              </button>
              <button 
                className="win-btn px-2 py-1 font-bold text-blue-900 flex items-center gap-1 shrink-0" 
                onClick={() => openExportModalWithFormat('txt')}
                title="Ekspor Cepat format TXT"
              >
                <FileText className="w-3.5 h-3.5 text-blue-700" /> .TXT
              </button>
              <button 
                className="win-btn px-2 py-1 flex items-center gap-1 shrink-0" 
                onClick={() => openExportModalWithFormat('json')}
                title="Format Lainnya"
              >
                <Download className="w-3.5 h-3.5 text-purple-700" /> Ekspor...
              </button>

              <div className="w-[2px] h-4 bg-gray-400 border-r border-white mx-0.5 shrink-0" />

              <button className="win-btn px-2 py-1 flex items-center gap-1 shrink-0" onClick={() => setIsFindOpen(true)} title="Cari & Ganti Kata (Ctrl+F)">
                <Search className="w-3.5 h-3.5 text-indigo-800" /> Cari
              </button>
              <button className="win-btn px-2 py-1 flex items-center gap-1 shrink-0" onClick={handleInsertDateTime} title="Sisipkan Waktu Saat Ini (F5)">
                <Clock className="w-3.5 h-3.5 text-gray-800" /> F5
              </button>
            </div>

            <div className="flex items-center gap-1 text-[10px] pr-1 shrink-0">
              <span className={`px-1.5 py-0.5 border text-[10px] font-mono whitespace-nowrap ${saveStatus === 'Tersimpan' ? 'bg-green-100 border-green-700 text-green-900' : 'bg-blue-100 border-blue-700 text-blue-900'}`}>
                {saveStatus}
              </span>
            </div>
          </div>

          {/* Document Tabs Bar */}
          <div className="bg-[#c0c0c0] px-1 pt-1 flex items-end gap-1 border-b border-[#808080] text-[11px] overflow-x-auto shrink-0 win-scrollbar select-none">
            {documents.map((doc) => {
              const isActive = doc.id === activeDocId;
              return (
                <div
                  key={doc.id}
                  onClick={() => { playRetroSound('click', soundEnabled); setActiveDocId(doc.id); }}
                  className={`px-2.5 py-1 border-t border-l border-r border-[#808080] flex items-center gap-1.5 cursor-pointer text-[11px] shrink-0 whitespace-nowrap ${
                    isActive 
                      ? 'bg-white font-bold border-t-2 border-t-[#000080] shadow-sm translate-y-[1px]' 
                      : 'bg-[#c0c0c0] hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <FileText className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-800' : 'text-gray-500'}`} />
                  <span className="truncate max-w-[100px] sm:max-w-[140px]">{doc.title}</span>
                  {documents.length > 1 && (
                    <span 
                      className="hover:text-red-700 hover:font-bold text-xs px-1 ml-0.5 leading-none p-0.5"
                      onClick={(e) => handleCloseDocument(doc.id, e)}
                      title="Tutup Dokumen Ini"
                    >
                      ✕
                    </span>
                  )}
                </div>
              );
            })}
            <button 
              className="win-btn px-2 py-0.5 text-blue-900 font-bold ml-1 mb-0.5 shrink-0" 
              onClick={handleCreateDocument} 
              title="Buka Dokumen Baru (Ctrl+N)"
            >
              +
            </button>
          </div>

          {/* Main Editing Canvas */}
          <div className="flex-1 p-1 bg-[#c0c0c0] relative flex flex-col overflow-hidden min-h-0">
            <div className="win-inset w-full h-full flex flex-row relative overflow-hidden bg-white">
              
              {/* Optional Retro Line Numbers Gutter */}
              {showLineNumbers && (
                <div 
                  ref={lineNumbersRef}
                  className="bg-gray-100 border-r border-gray-300 py-2 px-1 text-right select-none overflow-hidden font-mono text-xs text-gray-500 min-w-[36px]"
                  style={{
                    fontFamily: fontFamily,
                    fontSize: fontSize,
                    lineHeight: '1.6'
                  }}
                >
                  {Array.from({ length: cursorInfo.linesTotal }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
              )}

              {/* Main Textarea */}
              <textarea
                ref={editorRef}
                value={currentDoc.content}
                onChange={handleContentChange}
                onScroll={handleEditorScroll}
                onKeyUp={updateStats}
                onClick={updateStats}
                onSelect={updateStats}
                spellCheck={false}
                style={{
                  fontFamily: fontFamily,
                  fontSize: fontSize,
                  fontWeight: fontStyle.includes('bold') ? 'bold' : 'normal',
                  fontStyle: fontStyle.includes('italic') ? 'italic' : 'normal',
                  whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
                  overflowX: wordWrap ? 'hidden' : 'auto'
                }}
                className="w-full h-full p-2 outline-none resize-none bg-white text-black font-mono leading-relaxed win-scrollbar text-xs sm:text-sm flex-1"
                placeholder="Ketik catatan di sini... (Drag & Drop file teks untuk membuka)"
              />
            </div>
          </div>

          {/* Retro Status Bar */}
          <div className="bg-[#c0c0c0] p-1 flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-900 select-none shrink-0 overflow-hidden">
            <div className="win-inset flex-1 px-1.5 py-0.5 truncate bg-[#c0c0c0] text-gray-800 min-w-0">
              Siap
            </div>
            <div className="win-inset px-2 py-0.5 shrink-0 bg-[#c0c0c0] font-mono text-[10px] whitespace-nowrap">
              Ln {cursorInfo.line}, Col {cursorInfo.col}
            </div>
            <div className="win-inset px-2 py-0.5 shrink-0 bg-[#c0c0c0] font-mono text-[10px] whitespace-nowrap">
              {cursorInfo.words} Kata
            </div>
            <div className="win-inset px-2 py-0.5 shrink-0 bg-[#c0c0c0] font-mono text-[10px] hidden sm:block whitespace-nowrap">
              {cursorInfo.chars} Karakter
            </div>
            <div className="win-inset px-2 py-0.5 shrink-0 bg-[#c0c0c0] font-mono text-[10px] hidden md:block whitespace-nowrap">
              UTF-8
            </div>
          </div>

          {/* Corner Resizer */}
          {!isMaximized && window.innerWidth >= 768 && (
            <div 
              className="win-resize-handle" 
              onPointerDown={handleResizePointerDown}
              title="Tarik untuk mengubah ukuran jendela"
            />
          )}
        </div>
      )}

      {/* Taskbar */}
      <div className="win-outset bg-[#c0c0c0] h-9 fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-1 select-none">
        <div className="flex items-center gap-1 h-full py-0.5 min-w-0 flex-1">
          {/* Start Menu Button */}
          <button 
            id="start-btn"
            className={`win-btn font-bold px-2 py-1 h-full flex items-center gap-1.5 shrink-0 ${isStartOpen ? 'pressed' : ''}`}
            onClick={(e) => { 
              e.stopPropagation(); 
              playRetroSound('click', soundEnabled);
              setIsStartOpen(!isStartOpen); 
            }}
          >
            <div className="w-4 h-4 bg-gradient-to-tr from-blue-700 via-yellow-400 to-red-600 flex items-center justify-center text-[10px] font-black text-white rounded-none">
              ❖
            </div>
            <span className="tracking-wide text-xs">Start</span>
          </button>

          <div className="w-[2px] h-5 bg-gray-400 border-r border-white mx-0.5 shrink-0" />

          {/* Active Window Button on Taskbar */}
          <button 
            className={`win-btn h-full px-2 sm:px-3 text-left max-w-[180px] sm:max-w-[220px] truncate flex items-center gap-1.5 text-xs ${!isMinimized ? 'pressed font-bold' : ''}`}
            onClick={() => { 
              playRetroSound('click', soundEnabled);
              setIsMinimized(!isMinimized); 
            }}
          >
            <FileText className="w-3.5 h-3.5 text-blue-900 shrink-0" />
            <span className="truncate">{currentDoc.title || 'Notepad 98'}</span>
          </button>
        </div>

        {/* System Tray */}
        <div className="win-inset px-2 py-0.5 h-full flex items-center gap-2 bg-[#c0c0c0] text-[11px] shrink-0 font-mono">
          <button 
            className="hover:text-blue-900 p-0.5" 
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Matikan Suara Retro" : "Aktifkan Suara Retro"}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-gray-800" /> : <VolumeX className="w-3.5 h-3.5 text-red-700" />}
          </button>
          <span>{clockText}</span>
        </div>
      </div>

      {/* Start Menu Popup */}
      {isStartOpen && (
        <div 
          id="start-menu-panel"
          className="win-outset bg-[#c0c0c0] fixed bottom-9 left-1 w-64 z-50 flex shadow-2xl overflow-hidden border-2 border-white"
        >
          {/* Win98 Vertical Sidebar */}
          <div className="w-7 bg-gradient-to-b from-[#000080] via-[#0000a0] to-[#1084d0] text-white flex items-end justify-center pb-3 font-bold tracking-widest text-sm writing-mode-vertical">
            <span className="-rotate-90 transform whitespace-nowrap text-gray-200 font-serif tracking-wider">
              Windows<span className="font-sans font-normal ml-1">98</span>
            </span>
          </div>

          {/* Start Menu Items */}
          <div className="flex-1 py-1 text-xs">
            <div className="px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2.5 cursor-pointer" onClick={handleCreateDocument}>
              <FileText className="w-4 h-4 text-blue-800" />
              <span>Dokumen Baru (Ctrl+N)</span>
            </div>
            <div className="px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2.5 cursor-pointer" onClick={handleOpenFileClick}>
              <FolderOpen className="w-4 h-4 text-amber-700" />
              <span>Buka Berkas (Ctrl+O)</span>
            </div>
            <div className="px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2.5 cursor-pointer" onClick={() => openExportModalWithFormat('csv')}>
              <FileSpreadsheet className="w-4 h-4 text-emerald-800" />
              <span>Ekspor ke CSV</span>
            </div>

            <div className="win-separator" />

            <div className="px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2.5 cursor-pointer" onClick={() => { setIsThemeOpen(true); setIsStartOpen(false); }}>
              <Monitor className="w-4 h-4 text-indigo-800" />
              <span>Ganti Tema Tampilan</span>
            </div>

            <div className="px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2.5 cursor-pointer" onClick={() => { setSoundEnabled(!soundEnabled); setIsStartOpen(false); }}>
              {soundEnabled ? <Volume2 className="w-4 h-4 text-gray-800" /> : <VolumeX className="w-4 h-4 text-red-700" />}
              <span>{soundEnabled ? "Matikan Efek Suara" : "Aktifkan Efek Suara"}</span>
            </div>

            <div className="win-separator" />

            <div className="px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2.5 cursor-pointer" onClick={() => { setIsHelpOpen(true); setIsStartOpen(false); }}>
              <HelpCircle className="w-4 h-4 text-amber-700" />
              <span>Bantuan & Panduan</span>
            </div>
            <div className="px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2.5 cursor-pointer" onClick={() => { setIsAboutOpen(true); setIsStartOpen(false); }}>
              <Info className="w-4 h-4 text-blue-800" />
              <span>Tentang Aplikasi</span>
            </div>

            <div className="win-separator" />

            <div className="px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2.5 cursor-pointer font-bold text-red-900 hover:text-white" onClick={() => { setIsShutdownOpen(true); setIsStartOpen(false); }}>
              <Power className="w-4 h-4 text-red-700" />
              <span>Shut Down...</span>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {isExportOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-3">
          <div className="win-outset bg-[#c0c0c0] w-full max-w-md shadow-2xl flex flex-col">
            <div className="win-titlebar px-2 py-1 flex items-center justify-between">
              <span className="font-bold text-xs flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-blue-200" /> Ekspor & Simpan Dokumen
              </span>
              <button className="win-title-btn" onClick={() => setIsExportOpen(false)}>✕</button>
            </div>
            <div className="p-3 text-xs space-y-3">
              <div>
                <label className="block mb-1 font-bold">Nama File:</label>
                <input 
                  type="text" 
                  value={exportConfig.filename}
                  onChange={(e) => setExportConfig(prev => ({ ...prev, filename: e.target.value }))}
                  className="win-inset w-full px-2 py-1 bg-white outline-none font-mono text-xs"
                />
              </div>

              <div>
                <label className="block mb-1 font-bold">Pilih Format Berkas:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    className={`win-btn p-2 text-left flex items-center gap-2 ${exportConfig.format === 'txt' ? 'pressed bg-blue-100 font-bold' : ''}`}
                    onClick={() => setExportConfig(prev => ({ ...prev, format: 'txt' }))}
                  >
                    <FileText className="w-4 h-4 text-blue-700" /> .TXT (Teks Polos)
                  </button>
                  <button 
                    className={`win-btn p-2 text-left flex items-center gap-2 ${exportConfig.format === 'csv' ? 'pressed bg-green-100 font-bold' : ''}`}
                    onClick={() => setExportConfig(prev => ({ ...prev, format: 'csv' }))}
                  >
                    <FileSpreadsheet className="w-4 h-4 text-green-700" /> .CSV (Spreadsheet)
                  </button>
                  <button 
                    className={`win-btn p-2 text-left flex items-center gap-2 ${exportConfig.format === 'json' ? 'pressed bg-amber-100 font-bold' : ''}`}
                    onClick={() => setExportConfig(prev => ({ ...prev, format: 'json' }))}
                  >
                    <Code className="w-4 h-4 text-amber-700" /> .JSON (Data JSON)
                  </button>
                  <button 
                    className={`win-btn p-2 text-left flex items-center gap-2 ${exportConfig.format === 'md' ? 'pressed bg-purple-100 font-bold' : ''}`}
                    onClick={() => setExportConfig(prev => ({ ...prev, format: 'md' }))}
                  >
                    <FileCode className="w-4 h-4 text-purple-700" /> .MD (Markdown)
                  </button>
                </div>
              </div>

              {exportConfig.format === 'csv' && (
                <div className="p-2 bg-emerald-50 border border-emerald-300 rounded-none text-[11px]">
                  <label className="block mb-1 font-bold text-emerald-900">Pemisah Kolom (Delimiter CSV):</label>
                  <select 
                    value={exportConfig.delimiter} 
                    onChange={(e) => setExportConfig(prev => ({ ...prev, delimiter: e.target.value }))}
                    className="win-inset px-2 py-0.5 bg-white font-mono text-xs w-full"
                  >
                    <option value=",">Koma ( , ) - Standar Internasional</option>
                    <option value=";">Titik Koma ( ; ) - Standar Indonesia/Excel</option>
                    <option value="\t">Tab ( \t ) - TSV Format</option>
                    <option value="|">Pipa ( | ) - Format Piping</option>
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-400">
                <button className="win-btn px-4 py-1 font-bold text-blue-900" onClick={handleExecuteExport}>
                  Unduh / Ekspor
                </button>
                <button className="win-btn px-3 py-1" onClick={() => setIsExportOpen(false)}>
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Find & Replace Modal */}
      {isFindOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-3">
          <div className="win-outset bg-[#c0c0c0] w-full max-w-sm shadow-2xl flex flex-col">
            <div className="win-titlebar px-2 py-1 flex items-center justify-between">
              <span className="font-bold text-xs flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-blue-200" /> Cari & Ganti (Find & Replace)
              </span>
              <button className="win-title-btn" onClick={() => setIsFindOpen(false)}>✕</button>
            </div>
            <div className="p-3 text-xs space-y-2.5">
              <div>
                <label className="block mb-0.5 font-bold">Cari Kata:</label>
                <input 
                  type="text"
                  value={findText}
                  onChange={(e) => setFindText(e.target.value)}
                  className="win-inset w-full px-2 py-1 bg-white outline-none font-mono text-xs"
                  placeholder="Ketik teks yang dicari..."
                  autoFocus
                />
              </div>

              <div>
                <label className="block mb-0.5 font-bold">Ganti Dengan:</label>
                <input 
                  type="text"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  className="win-inset w-full px-2 py-1 bg-white outline-none font-mono text-xs"
                  placeholder="Ketik teks pengganti..."
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input 
                  type="checkbox" 
                  id="matchCase" 
                  checked={matchCase} 
                  onChange={(e) => setMatchCase(e.target.checked)} 
                  className="cursor-pointer"
                />
                <label htmlFor="matchCase" className="cursor-pointer">Cocokkan Huruf Besar/Kecil (Match case)</label>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-400">
                <button className="win-btn px-2 py-1 font-bold" onClick={handleFindNext}>
                  Cari Berikutnya
                </button>
                <button className="win-btn px-2 py-1" onClick={() => handleReplaceCurrent(false)}>
                  Ganti Ini
                </button>
                <button className="win-btn px-2 py-1 font-bold text-emerald-900" onClick={() => handleReplaceCurrent(true)}>
                  Ganti Semua
                </button>
                <button className="win-btn px-2 py-1" onClick={() => setIsFindOpen(false)}>
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Font Settings Modal */}
      {isFontOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-3">
          <div className="win-outset bg-[#c0c0c0] w-full max-w-md shadow-2xl flex flex-col">
            <div className="win-titlebar px-2 py-1 flex items-center justify-between">
              <span className="font-bold text-xs flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-blue-200" /> Pengaturan Font (Font Picker)
              </span>
              <button className="win-title-btn" onClick={() => setIsFontOpen(false)}>✕</button>
            </div>
            <div className="p-3 text-xs space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block mb-1 font-bold">Font:</label>
                  <select 
                    value={tempFontFamily} 
                    onChange={(e) => setTempFontFamily(e.target.value)}
                    className="win-inset w-full p-1 bg-white font-mono text-xs"
                  >
                    <option value="'Courier Prime', monospace">Courier Prime</option>
                    <option value="'VT323', monospace">VT323 (Retro Terminal)</option>
                    <option value="'Space Mono', monospace">Space Mono</option>
                    <option value="'Fira Code', monospace">Fira Code</option>
                    <option value="Tahoma, sans-serif">Tahoma (Win98 Default)</option>
                    <option value="monospace">Standard Monospace</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-bold">Gaya Font:</label>
                  <select 
                    value={tempFontStyle} 
                    onChange={(e) => setTempFontStyle(e.target.value)}
                    className="win-inset w-full p-1 bg-white text-xs"
                  >
                    <option value="normal">Biasa (Regular)</option>
                    <option value="bold">Cetak Tebal (Bold)</option>
                    <option value="italic">Cetak Miring (Italic)</option>
                    <option value="bold-italic">Tebal & Miring</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-bold">Ukuran (Size):</label>
                  <select 
                    value={tempFontSize} 
                    onChange={(e) => setTempFontSize(e.target.value)}
                    className="win-inset w-full p-1 bg-white font-mono text-xs"
                  >
                    <option value="11px">11 px</option>
                    <option value="12px">12 px</option>
                    <option value="13px">13 px</option>
                    <option value="14px">14 px</option>
                    <option value="16px">16 px</option>
                    <option value="18px">18 px</option>
                    <option value="20px">20 px</option>
                  </select>
                </div>
              </div>

              {/* Sample Box */}
              <div>
                <label className="block mb-1 font-bold">Contoh Hasil Pratinjau (Preview):</label>
                <div 
                  className="win-inset p-3 bg-white h-20 flex items-center justify-center overflow-hidden"
                  style={{
                    fontFamily: tempFontFamily,
                    fontSize: tempFontSize,
                    fontWeight: tempFontStyle.includes('bold') ? 'bold' : 'normal',
                    fontStyle: tempFontStyle.includes('italic') ? 'italic' : 'normal'
                  }}
                >
                  AaBbYyZz 12345 (Windows 98 Notepad)
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-400">
                <button className="win-btn px-4 py-1 font-bold text-blue-900" onClick={handleApplyFont}>
                  Terapkan / OK
                </button>
                <button className="win-btn px-3 py-1" onClick={() => setIsFontOpen(false)}>
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Theme Picker Modal */}
      {isThemeOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-3">
          <div className="win-outset bg-[#c0c0c0] w-full max-w-sm shadow-2xl flex flex-col">
            <div className="win-titlebar px-2 py-1 flex items-center justify-between">
              <span className="font-bold text-xs flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-blue-200" /> Pilih Tema Desktop
              </span>
              <button className="win-title-btn" onClick={() => setIsThemeOpen(false)}>✕</button>
            </div>
            <div className="p-3 text-xs space-y-2">
              <button 
                className={`win-btn w-full p-2 text-left flex items-center gap-3 ${currentTheme === 'classic' ? 'pressed font-bold border-blue-800' : ''}`}
                onClick={() => { setCurrentTheme('classic'); setIsThemeOpen(false); }}
              >
                <div className="w-5 h-5 bg-[#008080] border border-black shrink-0" />
                <div>
                  <div className="font-bold">Standard Windows 98 (Teal)</div>
                  <div className="text-[10px] text-gray-600">Warna klasik Windows 98 SE</div>
                </div>
              </button>

              <button 
                className={`win-btn w-full p-2 text-left flex items-center gap-3 ${currentTheme === '95' ? 'pressed font-bold border-blue-800' : ''}`}
                onClick={() => { setCurrentTheme('95'); setIsThemeOpen(false); }}
              >
                <div className="w-5 h-5 bg-[#000080] border border-black shrink-0" />
                <div>
                  <div className="font-bold">Windows 95 Solid Blue</div>
                  <div className="text-[10px] text-gray-600">Nuansa biru solid klasik Windows 95</div>
                </div>
              </button>

              <button 
                className={`win-btn w-full p-2 text-left flex items-center gap-3 ${currentTheme === 'matrix' ? 'pressed font-bold border-blue-800' : ''}`}
                onClick={() => { setCurrentTheme('matrix'); setIsThemeOpen(false); }}
              >
                <div className="w-5 h-5 bg-[#0d1b1e] border border-emerald-500 shrink-0" />
                <div>
                  <div className="font-bold">Matrix Cyber Green</div>
                  <div className="text-[10px] text-gray-600">Nuansa hijau hacker terminal</div>
                </div>
              </button>

              <button 
                className={`win-btn w-full p-2 text-left flex items-center gap-3 ${currentTheme === 'dark' ? 'pressed font-bold border-blue-800' : ''}`}
                onClick={() => { setCurrentTheme('dark'); setIsThemeOpen(false); }}
              >
                <div className="w-5 h-5 bg-[#1e1e2e] border border-gray-400 shrink-0" />
                <div>
                  <div className="font-bold">Retro Dark Mode</div>
                  <div className="text-[10px] text-gray-600">Tampilan gelap yang nyaman di mata</div>
                </div>
              </button>

              <div className="pt-2 flex justify-end">
                <button className="win-btn px-4 py-1" onClick={() => setIsThemeOpen(false)}>
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal (F1) */}
      {isHelpOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-3">
          <div className="win-outset bg-[#c0c0c0] w-full max-w-lg shadow-2xl flex flex-col max-h-[85vh]">
            <div className="win-titlebar px-2 py-1 flex items-center justify-between">
              <span className="font-bold text-xs flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-blue-200" /> Bantuan & Shortcut Windows 98 Notepad
              </span>
              <button className="win-title-btn" onClick={() => setIsHelpOpen(false)}>✕</button>
            </div>
            <div className="p-3 text-xs overflow-y-auto win-scrollbar space-y-3">
              <div className="win-inset bg-white p-3 font-mono text-xs leading-relaxed space-y-2">
                <h3 className="font-bold text-blue-900 border-b pb-1 font-sans">Daftar Tombol Pintas (Keyboard Shortcuts):</h3>
                <ul className="list-disc pl-4 space-y-1">
                  <li><b className="text-gray-900">Ctrl + S</b>: Simpan dokumen ke penyimpanan lokal</li>
                  <li><b className="text-gray-900">Ctrl + O</b>: Buka berkas dari komputer (TXT, CSV, JSON, MD)</li>
                  <li><b className="text-gray-900">Ctrl + N</b>: Buat tab dokumen baru</li>
                  <li><b className="text-gray-900">Ctrl + F</b>: Buka dialog Cari & Ganti</li>
                  <li><b className="text-gray-900">F5</b>: Sisipkan Tanggal & Waktu saat ini</li>
                  <li><b className="text-gray-900">F12</b>: Buka dialog Simpan Sebagai / Ekspor</li>
                  <li><b className="text-gray-900">Ctrl + P</b>: Cetak dokumen (Print)</li>
                  <li><b className="text-gray-900">F1</b>: Buka menu Bantuan ini</li>
                </ul>
              </div>

              <div className="win-inset bg-white p-3 font-mono text-xs leading-relaxed space-y-2">
                <h3 className="font-bold text-green-900 border-b pb-1 font-sans">Fitur Utama Ekspor CSV:</h3>
                <p className="font-sans">
                  Anda bisa mengetik data berformat teks sederhana dengan pemisah koma atau tab, lalu menekan tombol <b>.CSV</b> di toolbar untuk mengunduh tabel spreadsheet yang langsung bisa dibuka di Microsoft Excel / Google Sheets!
                </p>
              </div>

              <div className="flex justify-end pt-1">
                <button className="win-btn px-4 py-1 font-bold text-blue-900" onClick={() => setIsHelpOpen(false)}>
                  Tutup Bantuan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {isAboutOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-3">
          <div className="win-outset bg-[#c0c0c0] w-full max-w-sm shadow-2xl flex flex-col">
            <div className="win-titlebar px-2 py-1 flex items-center justify-between">
              <span className="font-bold text-xs flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-200" /> Tentang Windows 98 Notepad
              </span>
              <button className="win-title-btn" onClick={() => setIsAboutOpen(false)}>✕</button>
            </div>
            <div className="p-4 text-xs space-y-3">
              <div className="flex items-center gap-3 bg-white p-3 win-inset">
                <div className="w-12 h-12 bg-yellow-100 border-2 border-black flex items-center justify-center shrink-0">
                  <FileText className="w-8 h-8 text-blue-900" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-blue-900">Notepad 98 Web Edition</h2>
                  <p className="text-[11px] text-gray-600">Versi 4.1.1998 (Build 2026)</p>
                  <p className="text-[10px] text-gray-500">React + Vite + TailwindCSS</p>
                </div>
              </div>

              <p className="text-[11px] leading-relaxed">
                Aplikasi ini dikembangkan untuk menghadirkan keindahan antarmuka klasik Windows 98 yang dipadukan dengan fungsionalitas modern seperti multi-tab, ekspor CSV/JSON/MD/HTML, dan auto-save local storage.
              </p>

              <div className="flex justify-end pt-2">
                <button className="win-btn px-4 py-1 font-bold" onClick={() => setIsAboutOpen(false)}>
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shutdown Modal */}
      {isShutdownOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3">
          <div className="win-outset bg-[#c0c0c0] w-full max-w-sm shadow-2xl flex flex-col">
            <div className="win-titlebar px-2 py-1 flex items-center justify-between">
              <span className="font-bold text-xs flex items-center gap-1.5">
                <Power className="w-3.5 h-3.5 text-red-200" /> Shut Down Windows
              </span>
              <button className="win-title-btn" onClick={() => setIsShutdownOpen(false)}>✕</button>
            </div>
            <div className="p-4 text-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 border border-red-800 flex items-center justify-center shrink-0">
                  <Power className="w-6 h-6 text-red-700" />
                </div>
                <div>
                  <p className="font-bold">Apa yang ingin Anda lakukan?</p>
                  <p className="text-gray-600 text-[11px]">Pilih tindakan sistem Windows 98:</p>
                </div>
              </div>

              <div className="space-y-1.5 pl-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="shutdown" defaultChecked className="cursor-pointer" />
                  <span>Matikan komputer (Shut down)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="shutdown" className="cursor-pointer" />
                  <span>Mulai ulang komputer (Restart)</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-400">
                <button 
                  className="win-btn px-4 py-1 font-bold text-red-900"
                  onClick={() => {
                    playRetroSound('error', soundEnabled);
                    alert('Terima kasih telah menggunakan Windows 98 Notepad Web Edition!');
                    setIsShutdownOpen(false);
                  }}
                >
                  Ya (Yes)
                </button>
                <button className="win-btn px-3 py-1" onClick={() => setIsShutdownOpen(false)}>
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Retro Dialog / Alert / Confirm */}
      {dialogState.isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-3">
          <div className="win-outset bg-[#c0c0c0] w-full max-w-sm shadow-2xl flex flex-col">
            <div className="win-titlebar px-2 py-1 flex items-center justify-between">
              <span className="font-bold text-xs">{dialogState.title}</span>
              <button className="win-title-btn" onClick={closeDialog}>✕</button>
            </div>
            <div className="p-4 text-xs space-y-3">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-black text-white text-base ${
                  dialogState.type === 'error' ? 'bg-red-600' :
                  dialogState.type === 'question' ? 'bg-blue-600' :
                  dialogState.type === 'warning' ? 'bg-amber-500' : 'bg-blue-800'
                }`}>
                  {dialogState.type === 'error' ? '✕' : dialogState.type === 'question' ? '?' : 'i'}
                </div>
                <div className="text-gray-900 leading-relaxed font-sans">
                  {dialogState.message}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-400">
                {dialogState.onConfirm ? (
                  <>
                    <button 
                      className="win-btn px-4 py-1 font-bold text-blue-900" 
                      onClick={() => {
                        closeDialog();
                        dialogState.onConfirm();
                      }}
                    >
                      Ya (Yes)
                    </button>
                    <button className="win-btn px-3 py-1" onClick={closeDialog}>
                      Tidak (No)
                    </button>
                  </>
                ) : (
                  <button className="win-btn px-4 py-1 font-bold" onClick={closeDialog}>
                    OK
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
