import type { AnalysisEntry } from "./analysis";
import { migrateEntry } from "./analysis";

const STORAGE_KEY = "placement-analysis-history";

let _corruptionWarning = false;

export function hadCorruptEntries(): boolean {
  return _corruptionWarning;
}

export function clearCorruptionWarning(): void {
  _corruptionWarning = false;
}

export function getHistory(): AnalysisEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const valid: AnalysisEntry[] = [];
    for (const item of parsed) {
      const migrated = migrateEntry(item);
      if (migrated) {
        valid.push(migrated);
      } else {
        _corruptionWarning = true;
      }
    }
    // Re-save cleaned list if corruption was found
    if (_corruptionWarning) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(valid));
    }
    return valid;
  } catch {
    _corruptionWarning = true;
    return [];
  }
}

export function saveEntry(entry: AnalysisEntry): void {
  const history = getHistory();
  history.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function getEntryById(id: string): AnalysisEntry | undefined {
  return getHistory().find((e) => e.id === id);
}

export function deleteEntry(id: string): void {
  const history = getHistory().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function updateEntry(updated: AnalysisEntry): void {
  updated.updatedAt = new Date().toISOString();
  const history = getHistory().map((e) => (e.id === updated.id ? updated : e));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}
