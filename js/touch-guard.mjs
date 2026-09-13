export function guardBrowserChrome(target = globalThis) {
  const stop = (e) => {
    e.preventDefault();
  };
  target.addEventListener?.("dblclick", stop);
  target.addEventListener?.("gesturestart", stop);
  target.addEventListener?.("gesturechange", stop);
  target.addEventListener?.("contextmenu", stop);
  const doc = target.document;
  if (doc) {
    doc.addEventListener("selectionchange", () => {
      const sel = target.getSelection?.();
      if (sel && sel.rangeCount) sel.removeAllRanges();
    });
  }
  return true;
}
