import { useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import { getValidationReason, reportQuoteEvent } from './quoteTelemetry';

export function useQuoteDiagnostics(project?: string) {
  const viewed = useRef(false);
  const started = useRef(false);
  const fields = useRef(new Set<string>());

  useEffect(() => {
    if (viewed.current) return;
    viewed.current = true;
    reportQuoteEvent('quote_view');
  }, []);

  const fieldChanged = (field: string, value: string) => {
    if (!value.trim()) return;
    if (!started.current) {
      started.current = true;
      reportQuoteEvent('quote_form_start', { project });
    }
    if (!fields.current.has(field)) {
      fields.current.add(field);
      reportQuoteEvent('quote_field_started', { project, field });
    }
  };

  const invalid = (event: FormEvent<HTMLFormElement>) => {
    const field = event.target;
    if (
      field instanceof HTMLInputElement ||
      field instanceof HTMLSelectElement ||
      field instanceof HTMLTextAreaElement
    ) {
      reportQuoteEvent('quote_validation_error', {
        project,
        field: field.name,
        reason: getValidationReason(field.validity),
      });
    }
  };

  return { fieldChanged, invalid };
}
