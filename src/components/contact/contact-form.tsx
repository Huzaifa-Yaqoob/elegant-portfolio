import { useId } from "react"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"

interface ContactReason {
  label: string
  value: string
}

interface ContactFormProps {
  endpoint: string
  method: "POST" | "GET"
  title: string
  description: string
  submitLabel: string
  reasons: ContactReason[]
}

export function ContactForm({
  endpoint,
  method,
  title,
  description,
  submitLabel,
  reasons,
}: ContactFormProps) {
  const nameId = useId()
  const emailId = useId()
  const subjectId = useId()
  const messageId = useId()

  return (
    <form action={endpoint} method={method} className="space-y-8 rounded-none border border-outline-variant bg-surface-container-low p-6 md:p-8">
      <div className="space-y-2 border-b border-outline-variant pb-4">
        <h3 className="h3-style text-on-surface uppercase">{title}</h3>
        <p className="body-sm-style text-on-surface-variant">{description}</p>
      </div>

      <FieldSet>
        <FieldLegend className="label-caps-style text-on-surface-variant">What do you need help with?</FieldLegend>
        <FieldGroup className="gap-4 md:grid md:grid-cols-3 md:gap-3">
          {reasons.map((reason, index) => (
            <Field key={reason.value} orientation="horizontal" className="items-center gap-2 rounded-none border border-outline-variant px-3 py-2">
              <input
                type="radio"
                id={`reason-${reason.value}`}
                name="reason"
                value={reason.value}
                defaultChecked={index === 0}
                className="h-4 w-4 accent-primary"
              />
              <FieldLabel htmlFor={`reason-${reason.value}`} className="body-sm-style cursor-pointer text-on-surface normal-case tracking-normal">
                {reason.label}
              </FieldLabel>
            </Field>
          ))}
        </FieldGroup>
      </FieldSet>

      <FieldGroup className="gap-6">
        <Field>
          <FieldLabel htmlFor={nameId} className="label-caps-style text-on-surface-variant">Name</FieldLabel>
          <input
            id={nameId}
            name="name"
            type="text"
            required
            autoComplete="name"
            className="body-lg-style h-11 w-full rounded-none border border-outline-variant bg-surface px-3 text-on-surface outline-none focus:border-primary"
          />
          <FieldError />
        </Field>

        <Field>
          <FieldLabel htmlFor={emailId} className="label-caps-style text-on-surface-variant">Email</FieldLabel>
          <input
            id={emailId}
            name="email"
            type="email"
            required
            autoComplete="email"
            className="body-lg-style h-11 w-full rounded-none border border-outline-variant bg-surface px-3 text-on-surface outline-none focus:border-primary"
          />
          <FieldError />
        </Field>

        <Field>
          <FieldLabel htmlFor={subjectId} className="label-caps-style text-on-surface-variant">Subject</FieldLabel>
          <input
            id={subjectId}
            name="subject"
            type="text"
            required
            className="body-lg-style h-11 w-full rounded-none border border-outline-variant bg-surface px-3 text-on-surface outline-none focus:border-primary"
          />
          <FieldError />
        </Field>

        <Field>
          <FieldLabel htmlFor={messageId} className="label-caps-style text-on-surface-variant">Message</FieldLabel>
          <textarea
            id={messageId}
            name="message"
            rows={6}
            required
            className="body-lg-style w-full rounded-none border border-outline-variant bg-surface px-3 py-2 text-on-surface outline-none focus:border-primary"
          />
          <FieldError />
        </Field>
      </FieldGroup>

      <Button type="submit" size="lg" className="w-full md:w-auto">
        {submitLabel}
        <ArrowRight className="size-4" />
      </Button>
    </form>
  )
}
