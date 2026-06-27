/**
 * Language store — persists the user's chosen UI language (no/en) in localStorage.
 *
 * Usage:
 *   import { useLang } from "@/lib/kj/lang-store";
 *   const { lang, setLang, t } = useLang();
 *   <h1>{t("shop.title")}</h1>
 *
 * Hydration safety: the store starts with `lang: "no"` and `_hydrated: false`.
 * After mount, `useEffect` calls `useLang.persist.rehydrate()` to load the
 * saved language from localStorage, then sets `_hydrated: true`. Components
 * that need to avoid SSR/Client text mismatch can check `hydrated`.
 */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { translate, type Lang, type TranslationKey } from "./i18n";

interface LangState {
  lang: Lang;
  _hydrated: boolean;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  setHydrated: () => void;
  /** Translate a key in the current language. */
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

export const useLang = create<LangState>()(
  persist(
    (set, get) => ({
      lang: "no",
      _hydrated: false,
      setLang: (lang) => set({ lang }),
      toggle: () => set((s) => ({ lang: s.lang === "no" ? "en" : "no" })),
      setHydrated: () => set({ _hydrated: true }),
      t: (key, vars) => translate(get().lang, key, vars),
    }),
    {
      name: "kj-lang",
      storage: createJSONStorage(() => localStorage),
      // CRITICAL: skip auto-rehydration so the first client render matches
      // the server render (both use lang="no"). The page.tsx useEffect
      // calls useLang.persist.rehydrate() AFTER mount, which then switches
      // to the saved language. Without this, the client reads localStorage
      // synchronously during store creation and renders English on first
      // paint while the server sent Norwegian — causing hydration mismatch.
      skipHydration: true,
      partialize: (s) => ({ lang: s.lang }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

