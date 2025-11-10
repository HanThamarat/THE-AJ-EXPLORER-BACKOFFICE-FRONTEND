import z from "zod";
import { ImageDTOSchema, ImageDTOSchemaType, ImageEntitySchema } from "./image";

export const BlogEntitySchema = z.object({
    id:             z.number().optional(),
    title:          z.string().min(3),
    blogtype:       z.string().min(3).optional(),
    blogtypeId:     z.number().min(1).optional().nullable(),
    thumnbnail:     z.array(ImageDTOSchema).min(1).max(1),
    descrition:     z.string().min(3),
    status:         z.boolean(),
    created_at:     z.string().optional(),
    created_by:     z.string().optional(),
    updated_at:     z.string().optional(),
    updated_by:     z.string().optional(),
});

export const BlogResponseEntitySchema = z.object({
    id:             z.number().optional(),
    title:          z.string().min(3),
    blogtype:       z.string().min(3).optional(),
    blogtype_id:    z.number().min(1).optional().nullable(),
    thumnbnail:     ImageEntitySchema,
    descrition:     z.string().min(3),
    status:         z.boolean(),
    created_at:     z.string().optional(),
    created_by:     z.string().optional(),
    updated_at:     z.string().optional(),
    updated_by:     z.string().optional(),
});

export const BlogTypeEntitySchema = z.object({
    id:             z.number(),
    name:           z.string(),
    created_at:     z.string().optional(),
    updated_at:     z.string().optional(),
});

export type BlogEntitySchemaType = z.infer<typeof BlogEntitySchema>;
export type BlogTypeEntitySchemaType = z.infer<typeof BlogTypeEntitySchema>;
export type BlogResponseEntitySchemaType = z.infer<typeof BlogResponseEntitySchema>;

export interface BlogDataTableType {
    index:          number;
    id?:            number;
    blogName:       string;
    type:           string;
    status:         boolean;
    createdBy:      string;
    updatedAt?:     string;     
    updatedBy:      string;
}

export interface blogDTO {
    title:          string;
    blogType:       number;
    thumnbnail:     ImageDTOSchemaType;
    descrition:     string;
    status:         boolean;
}
