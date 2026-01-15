import z from "zod";

export interface bookingEntity {
    index?:             number;
    id?:                number;
    bookingId?:         string;
    paymentRef?:        string | null;
    paymentStatus:      "panding" | "paid" | "failed";
    bookingStatus:      "panding" | "confirmed" | "failed";
    packageName:        string | null;
    name:               string | null;
    trip_at:            Date | string;
    created_at:         Date | string;
    updated_at:         Date | string;
}

export const bookingAvgDataSchema = z.object({
    name: z.string(),
    avg: z.number()
})

export type bookingAvgDataType = z.infer<typeof bookingAvgDataSchema>;

export const bookingAvgSchema = z.object({
    type: z.string(),
    data: z.array(bookingAvgDataSchema),
});

export type bookingAvgEntity = z.infer<typeof bookingAvgSchema>;

export const bookerInfoSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phoneNumber: z.string().email(),
    country: z.string(),
});

export type bookerInfoType = z.infer<typeof bookerInfoSchema>;

export const bookingDetailEntitySchema = z.object({
    bookingId: z.string(),
    packageName: z.string(),
    amount: z.number(),
    pickUpLocation: z.string(),
    paymentStatus: z.string(),
    bookingStatus: z.string(),
    booker: bookerInfoSchema,
});

export type bookingDetailEntityType = z.infer<typeof bookingDetailEntitySchema>;