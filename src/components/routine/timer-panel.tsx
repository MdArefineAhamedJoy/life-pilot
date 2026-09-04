"use client";

import { useEffect, useMemo, useState } from "react";
import { useLifeOs } from "@/components/state/life-os-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldShell, SelectInput, TextInput } from "@/components/ui/field";

function formatTimer(seconds: number) {
  const hours = Math.floor(seconds / 3600).toString().padStart(2, "0");
  const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${secs}`;
}

export function TimerPanel() {
  const { addTimerSession } = useLifeOs();
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [mode, setMode] = useState("stopwatch");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timerId = window.setInterval(() => setSeconds((current) => current + 1), 1000);
    return () => window.clearInterval(timerId);
  }, [isRunning]);

  const status = useMemo(() => (isRunning ? "Running" : seconds > 0 ? "Paused" : "Ready"), [isRunning, seconds]);

  return (
    <Card title="Timer And Focus" eyebrow="Time tracking" id="timer">
      <div className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1fr)_auto] 2xl:items-end">
        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          <FieldShell label="Session title">
            <TextInput onChange={(event) => setTitle(event.target.value)} placeholder="What are you tracking?" value={title} />
          </FieldShell>
          <FieldShell label="Category">
            <SelectInput onChange={(event) => setCategory(event.target.value)} value={category}>
              <option>General</option>
              <option>Work</option>
              <option>Personal</option>
              <option>Home</option>
              <option>Family</option>
              <option>Learning</option>
              <option>Health</option>
            </SelectInput>
          </FieldShell>
          <FieldShell label="Mode">
            <SelectInput onChange={(event) => setMode(event.target.value)} value={mode}>
              <option value="stopwatch">Stopwatch</option>
              <option value="timer">Timer</option>
              <option value="focus">Focus</option>
            </SelectInput>
          </FieldShell>
        </div>
        <div className="min-w-0 rounded-md border border-slate-200 bg-slate-50 p-4 text-center">
          <p className="text-sm font-medium text-slate-500">{status} | {mode}</p>
          <p className="mt-2 break-words font-mono text-3xl font-semibold text-slate-800 sm:text-4xl">{formatTimer(seconds)}</p>
          <div className="mt-4 grid gap-2 min-[420px]:grid-cols-3">
            <Button onClick={() => setIsRunning((current) => !current)} type="button">
              {isRunning ? "Pause" : "Start"}
            </Button>
            <Button
              onClick={() => {
                setIsRunning(false);
                setSeconds(0);
                setSavedMessage("");
              }}
              type="button"
              variant="secondary"
            >
              Reset
            </Button>
            <Button
              disabled={seconds === 0 || !title.trim()}
              onClick={() => {
                addTimerSession({
                  title,
                  category,
                  durationSeconds: seconds,
                  mode: mode as "timer" | "stopwatch" | "focus",
                });
                setIsRunning(false);
                setSavedMessage("Timer session saved.");
              }}
              type="button"
              variant="secondary"
            >
              Save
            </Button>
          </div>
          {savedMessage && <p className="mt-3 text-sm font-medium text-green-500">{savedMessage}</p>}
        </div>
      </div>
    </Card>
  );
}
