import { useState, useCallback, useRef } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "../components/ui/button";

// ─── Types ───────────────────────────────────────────────────────────────────

type ColType = "number" | "string" | "date";

interface ColMeta {
  name: string;
  type: ColType;
  sample: string[];
}

interface ParsedData {
  headers: string[];
  rows: Record<string, string>[];
  colMeta: ColMeta[];
}

type ChartType = "bar" | "line" | "pie" | "scatter";

interface ChartConfig {
  type: ChartType;
  xKey: string;
  yKey: string;
  label: string;
}

// Raw excel state sebelum user pilih sheet/header row
interface ExcelRaw {
  workbook: XLSX.WorkBook;
  sheetNames: string[];
  fileName: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const COLORS = [
  "#6366f1",
  "#14b8a6",
  "#f97316",
  "#ec4899",
  "#84cc16",
  "#eab308",
  "#06b6d4",
];

function detectColType(values: string[]): ColType {
  const nonEmpty = values.filter(
    (v) => v !== "" && v !== null && v !== undefined,
  );
  if (nonEmpty.length === 0) return "string";
  const numCount = nonEmpty.filter(
    (v) => !isNaN(Number(v)) && v.trim() !== "",
  ).length;
  if (numCount / nonEmpty.length > 0.8) return "number";
  const dateCount = nonEmpty.filter((v) => !isNaN(Date.parse(v))).length;
  if (dateCount / nonEmpty.length > 0.8) return "date";
  return "string";
}

function analyzeColumns(
  headers: string[],
  rows: Record<string, string>[],
): ColMeta[] {
  return headers.map((h) => {
    const values = rows.map((r) => r[h] ?? "");
    return { name: h, type: detectColType(values), sample: values.slice(0, 3) };
  });
}

function suggestCharts(colMeta: ColMeta[]): ChartConfig[] {
  const numCols = colMeta.filter((c) => c.type === "number");
  const strCols = colMeta.filter((c) => c.type === "string");
  const dateCols = colMeta.filter((c) => c.type === "date");
  const suggestions: ChartConfig[] = [];

  if (strCols.length > 0 && numCols.length > 0) {
    suggestions.push({
      type: "bar",
      xKey: strCols[0].name,
      yKey: numCols[0].name,
      label: `Bar — ${strCols[0].name} vs ${numCols[0].name}`,
    });
  }
  const xForLine = dateCols[0] || strCols[0];
  if (xForLine && numCols.length > 0) {
    suggestions.push({
      type: "line",
      xKey: xForLine.name,
      yKey: numCols[0].name,
      label: `Line — ${xForLine.name} vs ${numCols[0].name}`,
    });
  }
  if (strCols.length > 0 && numCols.length > 0) {
    suggestions.push({
      type: "pie",
      xKey: strCols[0].name,
      yKey: numCols[0].name,
      label: `Pie — ${strCols[0].name} (nilai: ${numCols[0].name})`,
    });
  }
  if (numCols.length >= 2) {
    suggestions.push({
      type: "scatter",
      xKey: numCols[0].name,
      yKey: numCols[1].name,
      label: `Scatter — ${numCols[0].name} vs ${numCols[1].name}`,
    });
  }
  return suggestions;
}

function cleanRows(
  rows: Record<string, string>[],
  yKey: string,
): Record<string, unknown>[] {
  return rows
    .filter((r) => r[yKey] !== "" && !isNaN(Number(r[yKey])))
    .map((r) => ({ ...r, [yKey]: parseFloat(r[yKey]) }));
}

// Parse sheet dengan header row yang dipilih user
function parseSheetWithHeaderRow(
  workbook: XLSX.WorkBook,
  sheetName: string,
  headerRow: number, // 1-based
): { headers: string[]; rows: Record<string, string>[] } {
  const ws = workbook.Sheets[sheetName];
  // Ambil semua data sebagai array of arrays
  const raw: string[][] = XLSX.utils.sheet_to_json(ws, {
    header: 1,
    defval: "",
  }) as string[][];

  if (raw.length === 0) return { headers: [], rows: [] };

  const headerIdx = headerRow - 1;
  const headers = raw[headerIdx]
    .map((h) => String(h).trim())
    .filter((h) => h !== ""); // buang kolom kosong

  const validHeaderIndices = raw[headerIdx]
    .map((h, i) => ({ h: String(h).trim(), i }))
    .filter(({ h }) => h !== "")
    .map(({ i }) => i);

  const rows: Record<string, string>[] = [];
  for (let r = headerIdx + 1; r < raw.length; r++) {
    const row = raw[r];
    // skip baris yang semua kolomnya kosong
    const hasData = validHeaderIndices.some(
      (i) => String(row[i] ?? "").trim() !== "",
    );
    if (!hasData) continue;

    const obj: Record<string, string> = {};
    validHeaderIndices.forEach((i, idx) => {
      obj[headers[idx]] = String(row[i] ?? "").trim();
    });
    rows.push(obj);
  }

  return { headers, rows };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ColBadge({ type }: { type: ColType }) {
  const styles: Record<ColType, string> = {
    number: "bg-indigo-100 text-indigo-700",
    string: "bg-teal-100 text-teal-700",
    date: "bg-amber-100 text-amber-700",
  };
  const labels: Record<ColType, string> = {
    number: "Angka",
    string: "Teks",
    date: "Tanggal",
  };
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[type]}`}
    >
      {labels[type]}
    </span>
  );
}

function ChartRenderer({
  config,
  data,
}: {
  config: ChartConfig;
  data: Record<string, string>[];
}) {
  const cleaned = cleanRows(data, config.yKey);

  if (cleaned.length === 0) {
    return (
      <div className='flex items-center justify-center h-64 text-muted-foreground text-sm'>
        Tidak ada data valid untuk kolom yang dipilih.
      </div>
    );
  }

  const commonProps = {
    data: cleaned,
    margin: { top: 10, right: 20, left: 0, bottom: 60 },
  };

  if (config.type === "bar") {
    return (
      <ResponsiveContainer width='100%' height={320}>
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
          <XAxis
            dataKey={config.xKey}
            tick={{ fontSize: 12 }}
            angle={-30}
            textAnchor='end'
            interval={0}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey={config.yKey} fill='#6366f1' radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  if (config.type === "line") {
    return (
      <ResponsiveContainer width='100%' height={320}>
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
          <XAxis
            dataKey={config.xKey}
            tick={{ fontSize: 12 }}
            angle={-30}
            textAnchor='end'
            interval={0}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line
            type='monotone'
            dataKey={config.yKey}
            stroke='#6366f1'
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }
  if (config.type === "pie") {
    const pieData = cleaned.map((r) => ({
      name: String(r[config.xKey]),
      value: Number(r[config.yKey]),
    }));
    return (
      <ResponsiveContainer width='100%' height={320}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey='value'
            nameKey='name'
            cx='50%'
            cy='50%'
            outerRadius={110}
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
            labelLine
          >
            {pieData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }
  if (config.type === "scatter") {
    const scatterData = cleaned
      .filter((r) => !isNaN(Number(r[config.xKey])))
      .map((r) => ({
        x: parseFloat(String(r[config.xKey])),
        y: Number(r[config.yKey]),
      }));
    return (
      <ResponsiveContainer width='100%' height={320}>
        <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
          <XAxis dataKey='x' name={config.xKey} tick={{ fontSize: 12 }} />
          <YAxis dataKey='y' name={config.yKey} tick={{ fontSize: 12 }} />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter
            name={`${config.xKey} vs ${config.yKey}`}
            data={scatterData}
            fill='#6366f1'
          />
        </ScatterChart>
      </ResponsiveContainer>
    );
  }
  return null;
}

// Preview sheet mentah (sebelum parse) — tampilkan 8 baris pertama
function SheetPreview({
  workbook,
  sheetName,
  headerRow,
}: {
  workbook: XLSX.WorkBook;
  sheetName: string;
  headerRow: number;
}) {
  const ws = workbook.Sheets[sheetName];
  const raw: string[][] = XLSX.utils.sheet_to_json(ws, {
    header: 1,
    defval: "",
  }) as string[][];
  const preview = raw.slice(0, 10);
  const maxCols = Math.min(Math.max(...preview.map((r) => r.length), 0), 8);

  return (
    <div className='overflow-x-auto rounded-lg border border-border'>
      <table className='w-full text-xs'>
        <tbody>
          {preview.map((row, ri) => {
            const isHeader = ri + 1 === headerRow;
            return (
              <tr
                key={ri}
                className={
                  isHeader ? "bg-primary/10" : ri % 2 === 0 ? "bg-muted/20" : ""
                }
              >
                <td className='px-2 py-1 text-muted-foreground border-r border-border font-mono w-8 text-center select-none'>
                  {ri + 1}
                </td>
                {Array.from({ length: maxCols }).map((_, ci) => (
                  <td
                    key={ci}
                    className={`px-2 py-1 border-r border-border/50 whitespace-nowrap max-w-[120px] truncate ${isHeader ? "font-semibold text-primary" : "text-foreground"}`}
                  >
                    {String(row[ci] ?? "")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className='text-xs text-muted-foreground px-3 py-2 border-t border-border'>
        Baris berwarna biru = header yang dipilih
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type AppState = "upload" | "configure" | "chart";

export const AutoChartGenerator = () => {
  const [appState, setAppState] = useState<AppState>("upload");
  const [excelRaw, setExcelRaw] = useState<ExcelRaw | null>(null);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [headerRow, setHeaderRow] = useState(1);

  const [parsed, setParsed] = useState<ParsedData | null>(null);
  const [suggestions, setSuggestions] = useState<ChartConfig[]>([]);
  const [activeChart, setActiveChart] = useState<ChartConfig | null>(null);
  const [customX, setCustomX] = useState("");
  const [customY, setCustomY] = useState("");
  const [customType, setCustomType] = useState<ChartType>("bar");
  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  // ── Handle file upload ──
  const handleFile = useCallback((file: File) => {
    setError("");
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const headers = result.meta.fields ?? [];
          const rows = result.data as Record<string, string>[];
          const colMeta = analyzeColumns(headers, rows);
          const sugg = suggestCharts(colMeta);
          setParsed({ headers, rows, colMeta });
          setSuggestions(sugg);
          setActiveChart(sugg[0] ?? null);
          setCustomX(headers[0] ?? "");
          setCustomY(
            headers.find(
              (h) => detectColType(rows.map((r) => r[h])) === "number",
            ) ??
              headers[1] ??
              "",
          );
          setAppState("chart");
        },
        error: () => setError("Gagal membaca file CSV."),
      });
    } else if (ext === "xlsx" || ext === "xls") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const wb = XLSX.read(e.target?.result, { type: "binary" });
          setExcelRaw({
            workbook: wb,
            sheetNames: wb.SheetNames,
            fileName: file.name,
          });
          setSelectedSheet(wb.SheetNames[0]);
          setHeaderRow(1);
          setAppState("configure");
        } catch {
          setError("Gagal membaca file Excel.");
        }
      };
      reader.readAsBinaryString(file);
    } else {
      setError("Format tidak didukung. Gunakan .csv, .xlsx, atau .xls");
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  // ── Konfirmasi pilihan sheet + header row ──
  const handleConfirmConfig = () => {
    if (!excelRaw) return;
    const { headers, rows } = parseSheetWithHeaderRow(
      excelRaw.workbook,
      selectedSheet,
      headerRow,
    );

    if (headers.length === 0) {
      setError(
        "Tidak ada kolom yang ditemukan. Coba pilih baris header yang berbeda.",
      );
      return;
    }

    const colMeta = analyzeColumns(headers, rows);
    const sugg = suggestCharts(colMeta);
    setParsed({ headers, rows, colMeta });
    setSuggestions(sugg);
    setActiveChart(sugg[0] ?? null);
    setCustomX(headers[0] ?? "");
    const firstNumCol = colMeta.find((c) => c.type === "number");
    setCustomY(firstNumCol?.name ?? headers[1] ?? "");
    setError("");
    setAppState("chart");
  };

  const handleCustomChart = () => {
    if (!customX || !customY) return;
    setActiveChart({
      type: customType,
      xKey: customX,
      yKey: customY,
      label: "Custom",
    });
  };

  const reset = () => {
    setAppState("upload");
    setExcelRaw(null);
    setParsed(null);
    setSuggestions([]);
    setActiveChart(null);
    setError("");
  };

  // ══════════════════════════════════════════════
  // RENDER: Upload
  // ══════════════════════════════════════════════
  if (appState === "upload") {
    return (
      <section className='py-20 px-4 min-h-screen'>
        <div className='container mx-auto max-w-2xl'>
          <h2 className='text-4xl md:text-5xl font-bold text-center mb-3 text-foreground'>
            Auto Chart Generator
          </h2>
          <p className='text-center text-muted-foreground mb-12'>
            Upload CSV atau Excel — pilih sheet, tentukan baris header, langsung
            jadi grafik.
          </p>

          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
            className='border-2 border-dashed border-border hover:border-primary rounded-2xl p-16 flex flex-col items-center gap-4 cursor-pointer transition-colors group'
          >
            <div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
              <svg
                className='w-8 h-8 text-primary'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5'
                />
              </svg>
            </div>
            <div className='text-center'>
              <p className='text-foreground font-medium'>
                Drag & drop file di sini
              </p>
              <p className='text-muted-foreground text-sm mt-1'>
                atau klik untuk pilih file
              </p>
            </div>
            <div className='flex gap-2 mt-2'>
              {[".csv", ".xlsx", ".xls"].map((ext) => (
                <span
                  key={ext}
                  className='text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full font-mono'
                >
                  {ext}
                </span>
              ))}
            </div>
          </div>

          <input
            ref={inputRef}
            type='file'
            accept='.csv,.xlsx,.xls'
            className='hidden'
            onChange={(e) =>
              e.target.files?.[0] && handleFile(e.target.files[0])
            }
          />

          {error && (
            <p className='text-center text-destructive mt-4 text-sm'>{error}</p>
          )}
        </div>
      </section>
    );
  }

  // ══════════════════════════════════════════════
  // RENDER: Configure (pilih sheet + header row)
  // ══════════════════════════════════════════════
  if (appState === "configure" && excelRaw) {
    return (
      <section className='py-12 px-4 min-h-screen'>
        <div className='container mx-auto max-w-3xl'>
          <div className='flex items-center gap-3 mb-2'>
            <button
              onClick={reset}
              className='text-muted-foreground hover:text-foreground transition-colors'
            >
              <svg
                className='w-5 h-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 19l-7-7 7-7'
                />
              </svg>
            </button>
            <h2 className='text-2xl font-bold text-foreground'>
              Konfigurasi Data
            </h2>
          </div>
          <p className='text-muted-foreground text-sm mb-8 ml-8'>
            📄 {excelRaw.fileName} — {excelRaw.sheetNames.length} sheet
            ditemukan
          </p>

          <div className='grid md:grid-cols-2 gap-6 mb-6'>
            {/* Pilih Sheet */}
            <div className='bg-card border border-border rounded-xl p-5'>
              <h3 className='font-semibold text-foreground mb-1'>
                1. Pilih Sheet
              </h3>
              <p className='text-xs text-muted-foreground mb-3'>
                Sheet mana yang berisi data tabel?
              </p>
              <div className='flex flex-col gap-2'>
                {excelRaw.sheetNames.map((name) => (
                  <button
                    key={name}
                    onClick={() => setSelectedSheet(name)}
                    className={`text-left px-4 py-2.5 rounded-lg text-sm transition-colors border ${
                      selectedSheet === name
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted text-foreground"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Pilih Header Row */}
            <div className='bg-card border border-border rounded-xl p-5'>
              <h3 className='font-semibold text-foreground mb-1'>
                2. Baris Header
              </h3>
              <p className='text-xs text-muted-foreground mb-3'>
                Baris ke berapa yang berisi nama kolom?
              </p>
              <div className='flex items-center gap-3 mb-4'>
                <button
                  onClick={() => setHeaderRow((r) => Math.max(1, r - 1))}
                  className='w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors text-foreground font-bold'
                >
                  −
                </button>
                <span className='text-2xl font-bold text-foreground w-12 text-center'>
                  {headerRow}
                </span>
                <button
                  onClick={() => setHeaderRow((r) => r + 1)}
                  className='w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors text-foreground font-bold'
                >
                  +
                </button>
                <span className='text-sm text-muted-foreground'>
                  baris ke-{headerRow}
                </span>
              </div>
              <p className='text-xs text-muted-foreground'>
                Data akan dibaca mulai baris ke-{headerRow + 1} ke bawah.
              </p>
            </div>
          </div>

          {/* Preview Sheet */}
          <div className='bg-card border border-border rounded-xl p-5 mb-6'>
            <h3 className='font-semibold text-foreground mb-3'>
              Preview: Sheet "{selectedSheet}"
            </h3>
            <SheetPreview
              workbook={excelRaw.workbook}
              sheetName={selectedSheet}
              headerRow={headerRow}
            />
          </div>

          {error && <p className='text-destructive text-sm mb-4'>{error}</p>}

          <div className='flex gap-3'>
            <Button variant='outline' onClick={reset} className='flex-1'>
              Ganti File
            </Button>
            <Button onClick={handleConfirmConfig} className='flex-1'>
              Lanjut → Generate Chart
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // ══════════════════════════════════════════════
  // RENDER: Chart
  // ══════════════════════════════════════════════
  if (!parsed) return null;

  const fileName = excelRaw?.fileName ?? "file.csv";

  return (
    <section className='py-12 px-4 min-h-screen'>
      <div className='container mx-auto max-w-5xl'>
        <div className='flex items-center justify-between mb-8 flex-wrap gap-4'>
          <div>
            <div className='flex items-center gap-3'>
              <button
                onClick={() => (excelRaw ? setAppState("configure") : reset())}
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
              </button>
              <h2 className='text-3xl font-bold text-foreground'>
                Auto Chart Generator
              </h2>
            </div>
            <p className='text-muted-foreground text-sm mt-1 ml-8'>
              📄 <span className='font-medium'>{fileName}</span>
              {excelRaw && (
                <span>
                  {" "}
                  · Sheet: <span className='font-medium'>
                    {selectedSheet}
                  </span>{" "}
                  · Header baris ke-{headerRow}
                </span>
              )}
              <span>
                {" "}
                · {parsed.rows.length} baris, {parsed.headers.length} kolom
              </span>
            </p>
          </div>
          <Button variant='outline' onClick={reset} className='gap-2'>
            <svg
              className='w-4 h-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-8-4-4m0 0L8 8m4-4v12'
              />
            </svg>
            Upload Ulang
          </Button>
        </div>

        <div className='grid lg:grid-cols-3 gap-6'>
          {/* Sidebar */}
          <div className='space-y-5'>
            <div className='bg-card border border-border rounded-xl p-5'>
              <h3 className='font-semibold text-foreground mb-3 text-sm uppercase tracking-wide'>
                Kolom Terdeteksi
              </h3>
              <div className='space-y-2'>
                {parsed.colMeta.map((col) => (
                  <div
                    key={col.name}
                    className='flex items-center justify-between gap-2'
                  >
                    <span
                      className='text-sm text-foreground truncate max-w-[120px]'
                      title={col.name}
                    >
                      {col.name}
                    </span>
                    <ColBadge type={col.type} />
                  </div>
                ))}
              </div>
            </div>

            <div className='bg-card border border-border rounded-xl p-5'>
              <h3 className='font-semibold text-foreground mb-3 text-sm uppercase tracking-wide'>
                Saran Chart
              </h3>
              <div className='space-y-2'>
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveChart(s)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                      activeChart?.label === s.label
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
                {suggestions.length === 0 && (
                  <p className='text-sm text-muted-foreground'>
                    Tidak ada saran. Atur manual di bawah.
                  </p>
                )}
              </div>
            </div>

            <div className='bg-card border border-border rounded-xl p-5'>
              <h3 className='font-semibold text-foreground mb-3 text-sm uppercase tracking-wide'>
                Atur Manual
              </h3>
              <div className='space-y-3'>
                <div>
                  <label className='text-xs text-muted-foreground mb-1 block'>
                    Tipe Chart
                  </label>
                  <select
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value as ChartType)}
                    className='w-full text-sm bg-background border border-border rounded-lg px-3 py-2 text-foreground'
                  >
                    <option value='bar'>Bar Chart</option>
                    <option value='line'>Line Chart</option>
                    <option value='pie'>Pie Chart</option>
                    <option value='scatter'>Scatter Plot</option>
                  </select>
                </div>
                <div>
                  <label className='text-xs text-muted-foreground mb-1 block'>
                    Sumbu X / Kategori
                  </label>
                  <select
                    value={customX}
                    onChange={(e) => setCustomX(e.target.value)}
                    className='w-full text-sm bg-background border border-border rounded-lg px-3 py-2 text-foreground'
                  >
                    {parsed.headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='text-xs text-muted-foreground mb-1 block'>
                    Sumbu Y / Nilai
                  </label>
                  <select
                    value={customY}
                    onChange={(e) => setCustomY(e.target.value)}
                    className='w-full text-sm bg-background border border-border rounded-lg px-3 py-2 text-foreground'
                  >
                    {parsed.headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
                <Button onClick={handleCustomChart} className='w-full'>
                  Terapkan
                </Button>
              </div>
            </div>
          </div>

          {/* Chart Area */}
          <div className='lg:col-span-2 space-y-5'>
            {activeChart && (
              <div className='bg-card border border-border rounded-xl p-6'>
                <h3 className='font-semibold text-foreground mb-6'>
                  {activeChart.label}
                </h3>
                <ChartRenderer config={activeChart} data={parsed.rows} />
              </div>
            )}

            <div className='bg-card border border-border rounded-xl p-5'>
              <h3 className='font-semibold text-foreground mb-3 text-sm uppercase tracking-wide'>
                Preview Data (5 baris pertama)
              </h3>
              <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                  <thead>
                    <tr className='border-b border-border'>
                      {parsed.headers.map((h) => (
                        <th
                          key={h}
                          className='text-left py-2 px-3 text-muted-foreground font-medium whitespace-nowrap'
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.rows.slice(0, 5).map((row, i) => (
                      <tr
                        key={i}
                        className='border-b border-border/50 hover:bg-muted/30 transition-colors'
                      >
                        {parsed.headers.map((h) => (
                          <td
                            key={h}
                            className='py-2 px-3 text-foreground whitespace-nowrap'
                          >
                            {row[h] ?? "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AutoChartGenerator;
