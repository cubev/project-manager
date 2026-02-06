"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Project, ProjectMember } from "@/types";
import clsx from "clsx";

const PROJECT_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f59e0b",
  "#ef4444",
  "#22c55e",
  "#3b82f6",
  "#f97316",
  "#06b6d4",
];

interface ProjectFormProps {
  project?: Project;
  onSave: (data: Omit<Project, "id" | "createdAt" | "updatedAt">) => void;
  onClose: () => void;
}

export default function ProjectForm({
  project,
  onSave,
  onClose,
}: ProjectFormProps) {
  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [status, setStatus] = useState<Project["status"]>(
    project?.status ?? "active"
  );
  const [color, setColor] = useState(project?.color ?? PROJECT_COLORS[0]);
  const [members, setMembers] = useState<ProjectMember[]>(
    project?.members ?? []
  );
  const [newMemberName, setNewMemberName] = useState("");

  function addMember() {
    const trimmed = newMemberName.trim();
    if (!trimmed) return;
    const words = trimmed.split(" ");
    const initials =
      words.length >= 2
        ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
        : trimmed.slice(0, 2).toUpperCase();
    setMembers([...members, { name: trimmed, avatar: "", initials }]);
    setNewMemberName("");
  }

  function removeMember(index: number) {
    setMembers(members.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      description: description.trim(),
      status,
      color,
      progress: project?.progress ?? 0,
      taskCount: project?.taskCount ?? 0,
      completedTaskCount: project?.completedTaskCount ?? 0,
      members,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-xl bg-[#1a1a2e] border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">
            {project ? "Edit Project" : "New Project"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name..."
              className="w-full px-3 py-2 rounded-lg bg-[#0f0f10] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the project..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-[#0f0f10] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Project["status"])}
              className="w-full px-3 py-2 rounded-lg bg-[#0f0f10] border border-white/10 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            >
              <option value="active">Active</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={clsx(
                    "w-8 h-8 rounded-full transition-all",
                    color === c
                      ? "ring-2 ring-white ring-offset-2 ring-offset-[#1a1a2e] scale-110"
                      : "hover:scale-110"
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Members */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Team Members
            </label>
            <div className="space-y-2">
              {members.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0f0f10] border border-white/10"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ backgroundColor: color }}
                  >
                    {m.initials}
                  </div>
                  <span className="text-sm text-gray-300 flex-1">
                    {m.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeMember(i)}
                    className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addMember();
                    }
                  }}
                  placeholder="Add member name..."
                  className="flex-1 px-3 py-1.5 rounded-lg bg-[#0f0f10] border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={addMember}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-500 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-500 transition-colors font-medium"
            >
              {project ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
