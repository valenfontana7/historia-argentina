"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { INITIAL_EDITORIAL_ACTION_STATE, type EditorialActionState } from "./form-state";

type EditorialAction = (state: EditorialActionState, formData: FormData) => Promise<EditorialActionState>;

export function EditorialActionForm({ action, label, children, className = "space-y-3", resetOnSuccess = false }: {
  action: EditorialAction;
  label: string;
  children: React.ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
}) {
  const [state, formAction] = useActionState(action, INITIAL_EDITORIAL_ACTION_STATE);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok && resetOnSuccess) formRef.current?.reset();
  }, [state.ok, resetOnSuccess]);
  return (
    <form ref={formRef} action={formAction} className={className}>
      {children}
      <SubmitButton label={label} />
      {state.error ? <p role="alert" className="text-sm text-carmesi">{state.error}</p> : null}
      {state.ok && state.message ? <p role="status" className="text-sm text-oro-claro">{state.message}</p> : null}
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="pill disabled:cursor-wait disabled:opacity-50">{pending ? "Procesando…" : label}</button>;
}
