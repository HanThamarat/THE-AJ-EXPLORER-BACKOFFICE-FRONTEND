import z from "zod";

export const ImageDTOSchema = z.object({
    id:                z.string().min(0),
    base64:            z.string().min(1),
    fileName:          z.string().min(1),
    mainFile:          z.boolean(),    
});

export const ImageEntitySchema = z.object({
    file_name:              z.string().min(3),
    file_original_name:     z.string().min(3),
    file_path:              z.string().min(3),
    mainFile:               z.boolean(),
    base64:                 z.string().min(3).optional(),
});


export type ImageDTOSchemaType = z.infer<typeof ImageDTOSchema>;
export type ImageEntitySchemaType = z.infer<typeof ImageEntitySchema>;