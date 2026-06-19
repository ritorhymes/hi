"use client";

import { FormEvent, useState } from "react";

type UnlockState = "idle" | "loading" | "error" | "unlocked";

export default function Home() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<UnlockState>("idle");
  const [error, setError] = useState("");

  async function unlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = (await response.json()) as { message?: string; error?: string };

      if (!response.ok || !result.message) {
        setStatus("error");
        setError(result.error ?? "That did not open it.");
        return;
      }

      setStatus("unlocked");
      setMessage(result.message);
      setPassword("");
    } catch {
      setStatus("error");
      setError("The gate is not answering right now.");
    }
  }

  return (
    <main className="stage">
      <section className="gate" aria-labelledby="gate-title">
        <p className="eyebrow">private transmission</p>
        <h1 id="gate-title">hi</h1>
        <p className="subtitle">There is something on the other side.</p>

        {status === "unlocked" ? (
          <div className="secret" role="status">
            <span className="secret-label">unlocked</span>
            <p>{message}</p>
            <button className="secondary-button" onClick={() => setStatus("idle")} type="button">
              lock it again
            </button>
          </div>
        ) : (
          <form className="unlock-form" onSubmit={unlock}>
            <label htmlFor="password">password</label>
            <div className="input-row">
              <input
                autoComplete="current-password"
                id="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="say the magic thing"
                required
                type="password"
                value={password}
              />
              <button disabled={status === "loading"} type="submit">
                {status === "loading" ? "checking…" : "unlock"}
              </button>
            </div>
            {status === "error" && <p className="error" role="alert">{error}</p>}
          </form>
        )}
      </section>
    </main>
  );
}
