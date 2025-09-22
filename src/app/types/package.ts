import z from "zod";

export const pkgTypeSchema = z.object({
    name: z.string().min(0).max(100),
}).superRefine((data, ctx) => {
    if (data.name.length === 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please complete all the required information.",
            path: ['name'],
        });
    }
});

export type pkgTypeSchemaType = z.infer<typeof pkgTypeSchema>;

export interface packageEntity {
    id:                 number;
    packageName:        string;
    packageType:        string;
    description:        string;
    province:           string;
    district:           string;
    subDistrict:        string;
    packageImage:       packageImageSave[] | [];
    depart_point_lon:   string;
    depart_point_lat:   string;
    end_point_lon:      string;
    end_point_lat:      string;
    benefit_include:    packageInclude[] | null;
    benefit_not_include:packageNotInclude[] | null;
    packageOption:      packageOptionEntity[] | null;
    pakcageAttraction : packageAttractionEntity[] | null; 
    status:             boolean | string;
    created_by:         string;
    updated_by:         string;
    created_at:         Date | string;
    updated_at:         Date | string;
}

export interface packageAttractionEntity {
    attractionName:     string;
    attractionTime:     Date;
    description?:       string;
    status:             boolean;
}

export interface packageOptionEntity {
    id:                 number;
    packageId:          number;
    pkgOptionType:      string;
    name:               string;
    description:        string;
    adultPrice?:        number;
    childPrice?:        number;
    groupPrice?:        number;
    created_at?:         Date;
    updated_at?:         Date;
}

export interface packageImageSave {
    file_name:          string;
    file_original_name: string;
    file_path:          string;
    mainFile:           boolean;
    base64?:            string | null;
}

export interface packageNotInclude {
    detail:      string;
}

export interface packageInclude {
    detail:      string;
}


export interface packageDataTable {
    index:              number;
    packageId:          number;
    packageName:        string;
    packageType:        string;
    status:             boolean | string;
    create_by:          string;
    lastupdated:        Date;
    updated_by:         string;
}


export interface packageTypeDTO {
    name:       string;
    status:     boolean;
}

export interface packageTypeEntity  {
    id:         number;
    name:       string;
    status:     boolean;
    created_by: string;
    created_at: Date | string;
    updated_by: string;
    updated_at: Date | string;
} 

export interface packageTypeDataTable {
    index:          number;
    id:             number;
    name:           string;
    status:         boolean;
    created_by:     string;
    created_at:     Date | string;
    updated_by:     string;
    updated_at:     Date | string;
}