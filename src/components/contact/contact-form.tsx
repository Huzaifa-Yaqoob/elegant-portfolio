import { useId, useRef } from "react"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useSkewScroll } from "@/components/animation/use-skew-scroll"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { InnerScrollbar } from "@/components/ui/inner-scrollbar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

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
  const formRef = useRef<HTMLFormElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)

  useSkewScroll(formRef)

  return (
    <form
      ref={formRef}
      action={endpoint}
      method={method}
      className="space-y-8 rounded-none border border-outline-variant p-6 md:p-8"
    >
      <div className="space-y-2 border-b border-outline-variant pb-4">
        <h3 className="h3-style text-on-surface uppercase">{title}</h3>
        <p className="body-sm-style text-on-surface-variant">{description}</p>
      </div>

      <FieldSet>
        <div className="border border-surface-variant p-6">
          <FieldLegend className="label-caps-style mb-6 border-b border-surface-variant pb-2 text-on-surface-variant">
            What do you need help with?
          </FieldLegend>
          <RadioGroup
            name="reason"
            defaultValue={reasons[0]?.value}
            className="flex flex-col gap-6 md:flex-row md:gap-12"
          >
            {reasons.map((reason) => (
              <div
                key={reason.value}
                className="group inline-flex items-center gap-3"
              >
                <RadioGroupItem
                  id={`reason-${reason.value}`}
                  value={reason.value}
                />
                <Label
                  htmlFor={`reason-${reason.value}`}
                  className="cursor-pointer body-sm-style tracking-normal text-on-surface normal-case transition-colors group-hover:text-inverse-surface"
                >
                  {reason.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </FieldSet>

      <FieldGroup className="gap-8">
        <Field>
          <div className="relative">
            <Input
              id={nameId}
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder=" "
              className="body-lg-style"
            />
            <label
              htmlFor={nameId}
              className="peer-focus:label-caps-style peer-not-placeholder-shown:label-caps-style pointer-events-none absolute top-4 left-0 body-lg-style text-on-surface-variant transition-all duration-200 peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-on-surface peer-focus:-top-4 peer-focus:text-on-surface"
            >
              Name
            </label>
          </div>
          <FieldError />
        </Field>

        <Field>
          <div className="relative">
            <Input
              id={emailId}
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder=" "
              className="body-lg-style"
            />
            <label
              htmlFor={emailId}
              className="peer-focus:label-caps-style peer-not-placeholder-shown:label-caps-style pointer-events-none absolute top-4 left-0 body-lg-style text-on-surface-variant transition-all duration-200 peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-on-surface peer-focus:-top-4 peer-focus:text-on-surface"
            >
              Identifier [Email]
            </label>
          </div>
          <FieldError />
        </Field>

        <Field>
          <div className="relative">
            <Input
              id={subjectId}
              name="subject"
              type="text"
              required
              placeholder=" "
              className="body-lg-style"
            />
            <label
              htmlFor={subjectId}
              className="peer-focus:label-caps-style peer-not-placeholder-shown:label-caps-style pointer-events-none absolute top-4 left-0 body-lg-style text-on-surface-variant transition-all duration-200 peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-on-surface peer-focus:-top-4 peer-focus:text-on-surface"
            >
              Subject Line
            </label>
          </div>
          <FieldError />
        </Field>

        <Field>
          <div className="relative">
            <Textarea
              ref={messageRef}
              id={messageId}
              name="message"
              rows={6}
              required
              placeholder=" "
              className="mt-2 body-lg-style"
            />
            <label
              htmlFor={messageId}
              className="peer-focus:label-caps-style peer-not-placeholder-shown:label-caps-style pointer-events-none absolute top-4 left-0 body-lg-style text-on-surface-variant transition-all duration-200 peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-on-surface peer-focus:-top-4 peer-focus:text-on-surface"
            >
              Data Payload [Message]
            </label>
            <InnerScrollbar targetRef={messageRef} position="right" />
          </div>
          <FieldError />
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        size="lg"
        className="h-16 w-full border-2 border-on-surface bg-transparent px-10 text-on-surface hover:bg-on-surface hover:text-primary-container md:w-auto"
      >
        {submitLabel}
        <ArrowRight className="size-4" />
      </Button>
    </form>
  )
}
