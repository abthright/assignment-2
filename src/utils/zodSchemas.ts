import * as z from "zod";
import type { BookingStatus } from "../generated/prisma/enums";

const bookingStatus = ["PENDING", "PAID", "CANCELLED"] as const;
const bookingStatusEnum = z.enum(bookingStatus);

// User Schema
const CreateUserSchema = z.object({
  name: z.string().min(1),
});
const UpdateUserSchema = z.object({
  name: z.string().optional(),
});

// Event Schema
const CreateEventSchema = z.object({
  name: z.string().min(1),
  desc: z.string(),
});

// Ticket Schema
const CreateTicketSchema = z.object({
  name: z.string(),
  desc: z.string().nullable(),
  type: z.string().nullable(),
  price: z.number().positive().nullable(),
  availability: z.number().positive().default(0),
  eventId: z.number().min(1).positive(),
});

const UpdateTicketSchema = z.object({
  name: z.string().optional(),
  desc: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  price: z.number().positive().nullable().optional(),
  availability: z.number().positive().default(0).optional(),
  eventId: z.number().min(1).positive().optional(),
});

// Booking Schema
const bookingTicketInputSchema = z.object({
  ticketId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

const CreateBookingSchema = z.object({
  status: bookingStatusEnum.default("PAID"),
  tickets: z.array(bookingTicketInputSchema).min(1),
  ownerId: z.number().positive().min(1),
});

export {
  CreateUserSchema,
  CreateEventSchema,
  CreateBookingSchema,
  CreateTicketSchema,
  UpdateUserSchema,
  UpdateTicketSchema,
};

export type CreateUserType = z.infer<typeof CreateUserSchema>;
export type CreateEventType = z.infer<typeof CreateEventSchema>;
export type CreateBookingType = z.infer<typeof CreateBookingSchema>;
export type CreateTicketType = z.infer<typeof CreateTicketSchema>;
