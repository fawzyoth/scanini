"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CategoryFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  initialName?: string;
}

export function CategoryFormModal({ open, onClose, onSave, initialName }: CategoryFormModalProps) {
  const [name, setName] = useState(initialName ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(name);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={initialName ? "Edit category" : "New category"} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Appetizers, Main courses..."
          required
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{initialName ? "Save" : "Add category"}</Button>
        </div>
      </form>
    </Modal>
  );
}
