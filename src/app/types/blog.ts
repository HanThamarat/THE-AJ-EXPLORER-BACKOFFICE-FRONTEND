import z from "zod";
import { ImageDTOSchema } from "./image";

export const BlogEntitySchema = z.object({
    id:             z.number().optional(),
    title:          z.string().min(3),
    blogtype:       z.string().min(3).optional(),
    blogtypeId:     z.number().min(1).optional(),
    thumnbnail:     z.array(ImageDTOSchema).min(1).max(1),
    descrition:     z.string().min(3),
    status:         z.boolean(),
    created_at:     z.string().optional(),
    created_by:     z.string(),
    updated_at:     z.string().optional(),
    updated_by:     z.string(),
});

export const BlogTypeEntitySchema = z.object({
    id:             z.number(),
    name:           z.string(),
    created_at:     z.string().optional(),
    updated_at:     z.string().optional(),
});

export type BlogEntitySchemaType = z.infer<typeof BlogEntitySchema>;
export type BlogTypeEntitySchemaType = z.infer<typeof BlogTypeEntitySchema>;

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
