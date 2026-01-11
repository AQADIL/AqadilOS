import React, { useEffect, useState } from 'react';
import { RESUME_CONTENT } from '../../data/resumeText';

const STORAGE_KEY = 'aqadil-os-notepad-resume-content';
const STORAGE_META_KEY = 'aqadil-os-notepad-resume-meta';

export default function Notepad() {
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('RESUME.txt');
  const [isDirty, setIsDirty] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {

    if (typeof window === 'undefined') {
      setContent(RESUME_CONTENT);
      return;
    }

    try {
      const storedContent = window.localStorage.getItem(STORAGE_KEY);
      const storedMeta = window.localStorage.getItem(STORAGE_META_KEY);

      if (storedMeta) {
        try {
          const meta = JSON.parse(storedMeta);
          if (meta && typeof meta.fileName === 'string') {
            setFileName(meta.fileName);
          }
        } catch {

        }
      }

      if (storedContent !== null && storedContent.trim() !== '') {
        setContent(storedContent);
      } else {
        setContent(RESUME_CONTENT);
      }
    } catch (e) {
      console.error('Failed to load Notepad content from storage', e);
      setContent(RESUME_CONTENT);
    }
  }, []);

  const showStatus = (message) => {
    setStatusMessage(message);
    if (!message) return;


    setTimeout(() => {
      setStatusMessage((current) => (current === message ? '' : current));
    }, 2000);
  };

  const handleSave = () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, content);
        window.localStorage.setItem(
          STORAGE_META_KEY,
          JSON.stringify({ fileName })
        );
      }
      setIsDirty(false);
      showStatus('Saved');
    } catch (e) {
      console.error('Failed to save Notepad content', e);
      showStatus('Save failed');
    }
    setShowFileMenu(false);
  };

  const handleNew = () => {
    if (isDirty && typeof window !== 'undefined') {
      const discard = window.confirm('Discard unsaved changes and create a new file?');
      if (!discard) return;
    }
    setContent('');
    setFileName('Untitled.txt');
    setIsDirty(false);
    showStatus('New file');
    setShowFileMenu(false);
  };

  const handleSaveAsTxt = () => {
    if (typeof window === 'undefined') return;
    const newName = window.prompt('Save As', fileName.replace(/\.[^./]+$/, '') + '.txt');
    if (!newName) return;
    try {
      const blob = new Blob([content || ''], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = newName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showStatus('TXT file downloaded');
    } catch (e) {
      console.error('Failed to download TXT', e);
      showStatus('Download failed');
    }
    setShowFileMenu(false);
  };

  const handleRestoreOriginal = () => {
    if (isDirty && typeof window !== 'undefined') {
      const discard = window.confirm(
        'Discard unsaved changes and restore original RESUME.txt?'
      );
      if (!discard) return;
    }
    setContent(RESUME_CONTENT);
    setFileName('RESUME.txt');
    setIsDirty(false);
    showStatus('Restored RESUME.txt');
    setShowFileMenu(false);
  };

  const handleClickEditMenu = () => {
    showStatus('Edit via keyboard: Ctrl+Z, Ctrl+Y, Ctrl+C, Ctrl+V');
  };

  const handleClickFormatMenu = () => {
    showStatus('Format: Monospace font, wrapping enabled');
  };

  const handleClickViewMenu = () => {
    showStatus('View: Status bar is always visible');
  };

  const handleClickHelpMenu = () => {
    showStatus('This Notepad shows your resume text');
  };

  const handleDownloadStyledPdf = () => {
    if (typeof window === 'undefined') return;

    const baseName = (fileName || 'RESUME')
      .replace(/\\/g, '')
      .replace(/\//g, '')
      .replace(/\s+/g, '-')
      .replace(/\.[^./]+$/, '') || 'RESUME';

    const escapedContent = (content || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showStatus('Allow popups to print PDF');
      setShowFileMenu(false);
      return;
    }

    printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${baseName}</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: #020617;
        color: #f9fafb;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 32px 16px;
      }
      .card {
        width: 100%;
        max-width: 920px;
        border-radius: 24px;
        padding: 40px 48px;
        background: linear-gradient(145deg, #020617ee, #020617aa);
        border: 1px solid rgba(148, 163, 184, 0.35);
        box-shadow:
          0 22px 45px rgba(15, 23, 42, 0.85),
          0 0 0 1px rgba(15, 23, 42, 0.9);
        position: relative;
      }
      .pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 14px;
        border-radius: 999px;
        font-size: 10px;
        letter-spacing: .12em;
        text-transform: uppercase;
        color: #a5b4fc;
        background: linear-gradient(135deg, rgba(37, 99, 235, 0.18), rgba(37, 99, 235, 0.08));
        border: 1px solid rgba(59, 130, 246, 0.4);
        margin-bottom: 20px;
        backdrop-filter: blur(8px);
      }
      .pill-dot {
        width: 6px;
        height: 6px;
        border-radius: 999px;
        background: linear-gradient(135deg, #22c55e, #16a34a);
        box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.22);
      }
      .title {
        font-size: clamp(28px, 3vw, 36px);
        font-weight: 800;
        letter-spacing: .05em;
        text-transform: uppercase;
        margin: 0 0 8px;
        background: linear-gradient(135deg, #f9fafb, #e5e7eb);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .subtitle {
        margin: 0 0 24px;
        font-size: 14px;
        color: #9ca3af;
        font-weight: 400;
        letter-spacing: .01em;
      }
      .divider {
        height: 1px;
        width: 100%;
        background: linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.6), transparent);
        margin: 20px 0 24px;
      }
      .content {
        white-space: pre-wrap;
        font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
        font-size: 13px;
        line-height: 1.7;
        letter-spacing: .03em;
        color: #e5e7eb;
      }
      .footer {
        margin-top: 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 11px;
        color: #6b7280;
      }
      .badge {
        padding: 4px 10px;
        border-radius: 999px;
        border: 1px solid rgba(148, 163, 184, 0.4);
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05));
        color: #93c5fd;
        font-weight: 500;
      }
      .photo-container {
        position: absolute;
        top: 24px;
        right: 24px;
      }
      .photo {
        width: 140px;
        height: auto;
        border-radius: 12px;
        border: 2px solid transparent;
        background: linear-gradient(#020617, #020617) padding-box,
                    linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899) border-box;
        padding: 2px;
      }
      .photo img {
        border-radius: 10px;
        width: 100%;
        height: auto;
        display: block;
      }
      @media print {
        @page { margin: 12mm; size: A4; }
        * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
        body { 
          background: white !important; 
          color: black !important;
          margin: 0;
          padding: 0;
        }
        .card {
          background: white !important;
          box-shadow: none !important;
          border: 1px solid #e5e7eb !important;
          max-width: 100%;
          width: 100%;
          padding: 24px 28px !important;
          border-radius: 12px !important;
        }
        .pill { 
          color: #3730a3 !important; 
          background: linear-gradient(135deg, rgba(55, 48, 163, 0.12), rgba(55, 48, 163, 0.06)) !important; 
          border-color: #c7d2fe !important;
          font-size: 9px !important;
          padding: 4px 10px !important;
          margin-bottom: 16px !important;
        }
        .pill-dot { 
          background: linear-gradient(135deg, #16a34a, #15803d) !important; 
          box-shadow: none !important; 
        }
        .title { 
          color: black !important;
          font-size: 22px !important;
          margin: 0 0 6px !important;
          background: none !important;
          -webkit-text-fill-color: black !important;
        }
        .subtitle { 
          color: #6b7280 !important;
          font-size: 12px !important;
          margin: 0 0 16px !important;
        }
        .divider { 
          background: linear-gradient(90deg, transparent, #d1d5db, transparent) !important;
          margin: 16px 0 20px !important;
        }
        .content { 
          color: #111827 !important;
          font-size: 10px !important;
          line-height: 1.5 !important;
          white-space: pre-wrap !important;
          word-wrap: break-word !important;
        }
        .footer { 
          color: #6b7280 !important;
          margin-top: 20px !important;
          font-size: 9px !important;
        }
        .badge { 
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(59, 130, 246, 0.03)) !important; 
          border-color: #d1d5db !important; 
          color: #374151 !important;
          font-size: 9px !important;
          padding: 3px 8px !important;
        }
        .photo-container {
          position: absolute !important;
          top: 20px !important;
          right: 20px !important;
        }
        .photo {
          width: 100px !important;
          height: auto !important;
          border-radius: 8px !important;
          border: 1px solid #d1d5db !important;
          background: none !important;
          padding: 0 !important;
        }
      }
    </style>
  </head>
  <body>
    <main class="card" aria-label="Resume document">
      <div class="pill">
        <span class="pill-dot"></span>
        <span>AqadilOS · Resume Export</span>
      </div>
      <h1 class="title">${baseName}</h1>
      <p class="subtitle">Exported from your AqadilOS Notepad</p>
      <div class="photo-container">
        <div class="photo">
          <img src="/me.jpg" alt="Profile photo" onerror="this.src='/me.jpg'" />
        </div>
      </div>
      <div class="divider"></div>
      <section class="content">${escapedContent}</section>
      <div class="footer">
        <span class="badge">Local export · No data leaves your browser</span>
        <span>Designed in AqadilOS</span>
      </div>
    </main>
    <script>
      window.onload = () => {
        setTimeout(() => {
          window.print();
          window.close();
        }, 300);
      };
    </script>
  </body>
</html>`);
    printWindow.document.close();
    showStatus('Print dialog opened – save as PDF');
    setShowFileMenu(false);
  };

  return (
    <div
      className='h-full bg-[#1e1e1e] text-[#d4d4d4] font-mono text-[13px] flex flex-col'
      onClick={() => setShowFileMenu(false)}
    >
      {}
      <div className='flex items-center gap-4 px-4 py-1 text-xs bg-[#2d2d2d] border-b border-[#1e1e1e] text-[#cccccc] relative select-none'>
        <button
          type='button'
          className='hover:text-white cursor-default'
          onClick={(e) => {
            e.stopPropagation();
            setShowFileMenu((prev) => !prev);
          }}
        >
          File
        </button>
        <button
          type='button'
          className='hover:text-white cursor-default'
          onClick={(e) => {
            e.stopPropagation();
            handleClickEditMenu();
          }}
        >
          Edit
        </button>
        <button
          type='button'
          className='hover:text-white cursor-default'
          onClick={(e) => {
            e.stopPropagation();
            handleClickFormatMenu();
          }}
        >
          Format
        </button>
        <button
          type='button'
          className='hover:text-white cursor-default'
          onClick={(e) => {
            e.stopPropagation();
            handleClickViewMenu();
          }}
        >
          View
        </button>
        <button
          type='button'
          className='hover:text-white cursor-default'
          onClick={(e) => {
            e.stopPropagation();
            handleClickHelpMenu();
          }}
        >
          Help
        </button>

        {showFileMenu && (
          <div className='absolute top-full left-2 mt-1 w-44 bg-[#2d2d2d] border border-[#1e1e1e] rounded shadow-lg z-20 py-1'>
            <button
              type='button'
              className='w-full text-left px-3 py-1.5 text-xs text-[#eeeeee] hover:bg-[#3a3a3a]'
              onClick={(e) => {
                e.stopPropagation();
                handleNew();
              }}
            >
              New
            </button>
            <button
              type='button'
              className='w-full text-left px-3 py-1.5 text-xs text-[#eeeeee] hover:bg-[#3a3a3a]'
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
            >
              Save
            </button>
            <button
              type='button'
              className='w-full text-left px-3 py-1.5 text-xs text-[#eeeeee] hover:bg-[#3a3a3a]'
              onClick={(e) => {
                e.stopPropagation();
                handleSaveAsTxt();
              }}
            >
              Save As TXT
            </button>
            <button
              type='button'
              className='w-full text-left px-3 py-1.5 text-xs text-[#eeeeee] hover:bg-[#3a3a3a]'
              onClick={(e) => {
                e.stopPropagation();
                handleDownloadStyledPdf();
              }}
            >
              Download PDF
            </button>
            <div className='border-t border-[#1e1e1e] my-1' />
            <button
              type='button'
              className='w-full text-left px-3 py-1.5 text-xs text-[#eeeeee] hover:bg-[#3a3a3a]'
              onClick={(e) => {
                e.stopPropagation();
                handleRestoreOriginal();
              }}
            >
              Restore RESUME.txt
            </button>
          </div>
        )}
      </div>

      {}
      <div className='flex-1 p-6 md:p-8 flex justify-center overflow-auto'>
        <div className='w-full max-w-3xl bg-[#1b1b1b] border border-[#2a2a2a] rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col'>
          <div className='px-5 py-3 border-b border-[#2a2a2a] bg-[#222222] text-xs text-[#999999] flex justify-between items-center'>
            <span>
              {fileName} - Notepad{isDirty ? ' *' : ''}
            </span>
            <span className='hidden sm:inline'>UTF-8 | Windows (CRLF)</span>
          </div>

          <textarea
            className='w-full flex-1 min-h-[260px] bg-[#1b1b1b] text-[#d4d4d4] px-5 py-4 leading-relaxed tracking-[0.03em] selection:bg-blue-500/40 selection:text-white text-[13px] outline-none border-none resize-none'
            spellCheck={false}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setIsDirty(true);
            }}
          />

          <div className='px-5 py-2 border-t border-[#2a2a2a] bg-[#202020] text-xs text-[#888888] flex justify-between items-center'>
            <span>
              {statusMessage
                ? statusMessage
                : isDirty
                  ? 'Unsaved changes'
                  : 'All changes saved'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

