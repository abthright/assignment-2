import * as z from "zod";
import type { BookingStatus } from "../generated/prisma/enums";

const bookingStatus = ["PENDING", "PAID"] as const;
const bookingStatusEnum = z.enum(bookingStatus);

// User Schema
const CreateUserSchema = z.object({
  name: z.string().min(1),
});

// Event Schema
const CreateEventSchema = z.object({
  name: z.string().min(1),
  desc: z.string(),
});

// Booking Schema
const CreateBookingSchema = z.object({
  status: bookingStatusEnum.default("PAID"),
  tickets: z.array(z.number()).min(1),
  ownerId: z.number().min(1),
});

// Ticket Schema
const CreateTicketSchema = z.object({
  name: z.string(),
  desc: z.string().nullable(),
  type: z.string().nullable(),
  price: z.number().nullable(),
  availability: z.number().default(0),
  eventId: z.number().min(1),
});

export {
  CreateUserSchema,
  CreateEventSchema,
  CreateBookingSchema,
  CreateTicketSchema,
};

export type CreateUserType = z.infer<typeof CreateUserSchema>;
export type CreateEventType = z.infer<typeof CreateEventSchema>;
export type CreateBookingType = z.infer<typeof CreateBookingSchema>;
export type CreateTicketType = z.infer<typeof CreateTicketSchema>;
