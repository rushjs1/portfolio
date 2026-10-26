import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.').max(100),
  email: z.string().trim().max(254).email('Please enter a valid email.'),
  message: z.string().trim().min(1, 'Please enter a message.').max(1024),
  website: z.string().max(2000),
})
