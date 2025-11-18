import z from "zod";

export const PromotionLinkSchema = z.object({
    packageLink:        z.number(),
    percentage:         z.number(),
});

export const PromotionSchema = z.object({
    promoName:          z.string().min(3).max(100),
    couponCode:         z.string().max(100).optional(),
    description:        z.string().min(0).max(2000),
    date:               z
                        .tuple([
                        z.string().nullable(),
                        z.string().nullable(), 
                        ])
                        .refine(([start, end]) => !!start && !!end, {
                        message: "Start and end date are required",
                        }),
    status:             z.boolean(),
    packagePromoLink:   z.array(PromotionLinkSchema).min(1)
});

export type promotionType = z.infer<typeof PromotionSchema>;
export type promotionLinkType = z.infer<typeof PromotionLinkSchema>;

export interface PromotionDTO {
    promoName:          string;
    type:               'promotion' | 'coupon',
    couponCode?:        string;
    description?:       string;
    startDate:          string;
    endDate:            string;
    status:             boolean;
    PromoLink:          PromotionLinkDTO[];
}

export interface PromotionLinkDTO {
    id?:            number;
    promoId?:       number;
    percentage:     number;
    packageLink:    number;
}

export interface PromotionEntity {
    id:                 number;
    promoName:          string;
    type:               'promotion' | 'coupon',
    couponCode?:        string;
    description?:       string;
    startDate:          Date | string;
    endDate:            Date | string;
    status:             boolean | string;
    packagePromoLink:   PromotionLink[];
    created_by:         number | string;
    created_at:         Date | string;
    updated_by:         number | string;
    updated_at:         Date | string;
}

export interface PromotionLink {
    id:             number;
    packageLink:    string;
    pakcageId:      number;
    percentage:     number;
}

export interface PromotionTablePropsType {
    index:              number;
    id:                 number;
    promoName:          string;
    packagePromoLink:   PromotionLink[];
    type:               string;
    description?:       string;
    couponCode?:        string;
    startDate:          Date | string;
    endDate:            Date | string;
    status:             boolean;
    created_by:         number | string;
    created_at:         Date | string;
    updated_by:         number | string;
    updated_at:         Date | string;
}

export interface promotionLinkTableType {
    index:          number;
    packageLink:    string;
    percentage:     number;
}

export interface promotionDay {
    id:             number;
    startDate:      string | Date;
    endDate:        string | Date;
    type:           'promotion' | 'coupon',
}