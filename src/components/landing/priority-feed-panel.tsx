"use client";
import { useLifeOs } from "@/components/state/life-os-provider";
export function PriorityFeedPanel() {
  const { tasks } = useLifeOs();
  const reminders = tasks.filter((task) => task.alertEnabled && task.reminderAt && task.status !== "completed");
  return <aside className="p-5"><h2 className="font-semibold">Your reminders</h2>
    {reminders.length ? reminders.map((task) => <p key={task.id} className="mt-3">{task.title} ? {task.reminderAt}</p>) : <p className="mt-3">No reminders added.</p>}
  </aside>;
}
