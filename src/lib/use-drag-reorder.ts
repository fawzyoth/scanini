"use client";

import { useRef, useState, useCallback, DragEvent } from "react";

export interface DragProps {
  draggable: boolean;
  onDragStart: (e: DragEvent<HTMLElement>) => void;
  onDragOver: (e: DragEvent<HTMLElement>) => void;
  onDrop: (e: DragEvent<HTMLElement>) => void;
  onDragEnd: () => void;
  onDragLeave: () => void;
}

interface UseDragReorderOptions<T> {
  items: T[];
  getId: (item: T) => string;
  onReorder: (reordered: T[]) => void;
}

export function useDragReorder<T>({ items, getId, onReorder }: UseDragReorderOptions<T>) {
  const dragItemRef = useRef<string | null>(null);
  const dragOverItemRef = useRef<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const handleDragStart = useCallback((e: DragEvent<HTMLElement>, id: string) => {
    dragItemRef.current = id;
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    dragOverItemRef.current = id;
    setOverId(id);
  }, []);

  const performReorder = useCallback(() => {
    const fromId = dragItemRef.current;
    const toId = dragOverItemRef.current;

    if (fromId && toId && fromId !== toId) {
      const fromIndex = items.findIndex((item) => getId(item) === fromId);
      const toIndex = items.findIndex((item) => getId(item) === toId);

      if (fromIndex >= 0 && toIndex >= 0) {
        const reordered = [...items];
        const [moved] = reordered.splice(fromIndex, 1);
        reordered.splice(toIndex, 0, moved);
        onReorder(reordered);
      }
    }

    dragItemRef.current = null;
    dragOverItemRef.current = null;
    setDragId(null);
    setOverId(null);
  }, [items, getId, onReorder]);

  const handleDrop = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    performReorder();
  }, [performReorder]);

  const handleDragEnd = useCallback(() => {
    // Fallback: if onDrop didn't fire (e.g. dropped outside), just clean up
    if (dragItemRef.current !== null) {
      performReorder();
    }
  }, [performReorder]);

  const getDragProps = useCallback((id: string): DragProps => ({
    draggable: true,
    onDragStart: (e: DragEvent<HTMLElement>) => handleDragStart(e, id),
    onDragOver: (e: DragEvent<HTMLElement>) => handleDragOver(e, id),
    onDrop: handleDrop,
    onDragEnd: handleDragEnd,
    onDragLeave: () => {
      if (dragOverItemRef.current === id) {
        setOverId(null);
      }
    },
  }), [handleDragStart, handleDragOver, handleDrop, handleDragEnd]);

  const getItemStyle = useCallback((id: string): string => {
    if (dragId === id) return "opacity-50";
    if (overId === id && dragId !== null) return "border-t-2 border-indigo-400";
    return "";
  }, [dragId, overId]);

  return { getDragProps, getItemStyle, dragId };
}
