const listeners = new Set<() => void>();

export function suscribirCambiosStorage(callback: () => void) {
  listeners.add(callback);
  const onStorage = (event: StorageEvent) => {
    if (event.storageArea === localStorage) callback();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function notificarCambioStorage() {
  listeners.forEach((listener) => listener());
}
