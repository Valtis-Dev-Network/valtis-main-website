"use client";

import { useEffect, useState } from "react";
import { saveCookieConsentAction } from "@/app/actions";
import { Button } from "@/components/ui/button";

type Preferences = {
  necessary: boolean;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
};

const key = "valtis_cookie_consent";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [customising, setCustomising] = useState(false);
  const [prefs, setPrefs] = useState<Preferences>({ necessary: true, preferences: false, analytics: false, marketing: false });

  useEffect(() => {
    setVisible(!localStorage.getItem(key));
    const handler = () => {
      setCustomising(true);
      setVisible(true);
    };
    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (target.closest("[data-cookie-settings]")) handler();
    });
  }, []);

  async function save(next: Preferences) {
    const consentId = crypto.randomUUID();
    localStorage.setItem(key, JSON.stringify({ consentId, ...next, savedAt: new Date().toISOString() }));
    setVisible(false);
    await saveCookieConsentAction({ consentId, ...next });
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-lg border border-white/12 bg-surface/95 p-5 shadow-glow backdrop-blur">
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h2 className="font-semibold">Cookie preferences</h2>
          <p className="mt-1 text-sm leading-6 text-muted">
            Valtis uses essential cookies for staff login and consent. Analytics and marketing stay off unless you choose them.
          </p>
          {customising && (
            <div className="mt-4 grid gap-2 text-sm">
              {(["preferences", "analytics", "marketing"] as const).map((item) => (
                <label key={item} className="flex items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-2 capitalize">
                  {item} cookies
                  <input type="checkbox" checked={prefs[item]} onChange={(event) => setPrefs((current) => ({ ...current, [item]: event.target.checked }))} />
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 md:justify-end">
          <Button variant="secondary" type="button" className="min-h-10" onClick={() => save({ necessary: true, preferences: false, analytics: false, marketing: false })}>
            Reject non-essential
          </Button>
          <Button variant="secondary" type="button" className="min-h-10" onClick={() => setCustomising(true)}>
            Customise
          </Button>
          <Button type="button" className="min-h-10" onClick={() => save(customising ? prefs : { necessary: true, preferences: true, analytics: true, marketing: true })}>
            {customising ? "Save preferences" : "Accept all"}
          </Button>
        </div>
      </div>
    </div>
  );
}
