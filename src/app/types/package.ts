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

export const packageAttractionSchema = z.object({
    attractionName:     z.string().min(3),
    attractionTime:     z.date().min(3),
    description:       z.string(),
    status:             z.boolean(),
});

export const packageOptionSchema = z.object({
    pkgOptionTypeId:    z.number().int().min(1),
    name:               z.string().min(3),
    description:        z.string(),
    adultPrice:        z.number().min(1),
    childPrice:        z.number().min(1),
    groupPrice:        z.number().min(1),
});

export const packageIncludeSchema = z.object({
    detail: z.string(),
});

export const packageNotIncludeSchema = z.object({
    detail: z.string(),
});

export const packageSchema = z.object({
    packageTypeId: z.number({ message: "Please complete all the required information." }).int({ message: "Please complete all the required information." }).min(1, { message: "Please complete all the required information." }),
    packageName: z.string().min(3, { message: "Please complete all the required information." }).max(100),
    description: z.string({ message: "Please complete all the required information." }).min(10, { message: "Please complete all the required information." }).max(6000),
    additional_description: z.string().min(0),
    provinceId: z.number({ message: "Please complete all the required information." }).int({ message: "Please complete all the required information." }).min(1, { message: "Please complete all the required information." }),
    districtId: z.number({ message: "Please complete all the required information." }).int({ message: "Please complete all the required information." }).min(1, { message: "Please complete all the required information." }),
    subDistrictId: z.number({ message: "Please complete all the required information." }).int({ message: "Please complete all the required information." }).min(1, { message: "Please complete all the required information." }),
    depart_point_lon: z.string().min(0).max(100),
    depart_point_lat: z.string().min(0).max(100),
    end_point_lon: z.string().min(0).max(100),
    end_point_lat: z.string().min(0).max(100),
    benefit_include: z.array(packageIncludeSchema).min(1).max(20),
    benefit_not_include: z.array(packageNotIncludeSchema).min(1).max(20),
    status: z.boolean(),
    packageImage: z.string(),
    packageOption: z.array(packageOptionSchema).min(1).max(20),
    packageAttraction: z.array(packageAttractionSchema).min(1).max(20)
});

export type pkgTypeSchemaType = z.infer<typeof pkgTypeSchema>;
export type PackageDTO = z.infer<typeof packageSchema>;
export type PackageOptionDTO = z.infer<typeof packageOptionSchema>;
export type PackageAttractionDTO = z.infer<typeof packageAttractionSchema>;

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
    attractionTime:     Date| string;
    description?:       string;
    status?:             boolean;
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