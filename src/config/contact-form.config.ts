import { z } from "astro/zod"

const contactReasonSchema = z.object({
  label: z.string(),
  value: z.string(),
})

export const contactFormSchema = z.object({
  form: z.object({
    title: z.string(),
    description: z.string(),
    endpoint: z.string(),
    method: z.enum(["POST", "GET"]).default("POST"),
    submit_label: z.string(),
    response_time: z.string(),
    reasons: z.array(contactReasonSchema).min(1),
  }),
})
