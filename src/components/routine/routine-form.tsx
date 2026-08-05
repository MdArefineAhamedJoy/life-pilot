"use client";

import { useLifeOs } from "@/components/state/life-os-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldShell, SelectInput, TextArea, TextInput } from "@/components/ui/field";

export function RoutineForm() {
  const { addTask } = useLifeOs();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    addTask({
      title: String(data.get("title") ?? ""),
      category: String(data.get("category") ?? "Personal"),
      priority: String(data.get("priority") ?? "medium") as "low" | "medium" | "high",
      plannedStart: String(data.get("plannedStart") ?? "09:00"),
      plannedEnd: String(data.get("plannedEnd") ?? "10:00"),
      reminderAt: String(data.get("reminderAt") ?? ""),
      note: String(data.get("note") ?? ""),
      repeatRule: String(data.get("repeatRule") ?? "daily") as "daily" | "weekly" | "custom" | "once",
    });

    form.reset();
  }

  return (
    <Card title="Add Routine Task" eyebrow="Plan task">
      <form className="grid min-w-0 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <FieldShell label="Task title">
          <TextInput name="title" placeholder="Bajar list review" required />
        </FieldShell>
        <FieldShell label="Category">
          <SelectInput name="category">
            <option>Personal</option>
            <option>Work</option>
            <option>Home</option>
            <option>Family</option>
            <option>Health</option>
            <option>Learning</option>
          </SelectInput>
        </FieldShell>
        <FieldShell label="Start time">
          <TextInput name="plannedStart" type="time" required />
        </FieldShell>
        <FieldShell label="End time">
          <TextInput name="plannedEnd" type="time" required />
        </FieldShell>
        <FieldShell label="Priority">
          <SelectInput name="priority">
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </SelectInput>
        </FieldShell>
        <FieldShell label="Repeat">
          <SelectInput name="repeatRule">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="custom">Custom</option>
            <option value="once">Once</option>
          </SelectInput>
        </FieldShell>
        <FieldShell label="Reminder">
          <TextInput name="reminderAt" type="time" />
        </FieldShell>
        <div className="md:col-span-2">
          <FieldShell label="Note">
            <TextArea name="note" placeholder="Optional task details" />
          </FieldShell>
        </div>
        <div className="md:col-span-2">
          <Button className="w-full sm:w-auto" type="submit">Add task</Button>
        </div>
      </form>
    </Card>
  );
}
