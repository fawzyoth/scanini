"use client";

import { useState, useEffect } from "react";
import { Modal, Input, Button } from "@/components/ui";

interface RenameModalProps {
  open: boolean;
  onClose: () => void;
  currentName: string;
  onRename: (name: string) => void;
}

export function RenameModal({ open, onClose, currentName, onRename }: RenameModalProps) {
  const [name, setName] = useState(currentName);

  useEffect(() => {
    if (open) setName(currentName);
  }, [open, currentName]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim()) {
      onRename(name.trim());
      onClose();
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Rename menu" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Menu name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!name.trim()}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}
