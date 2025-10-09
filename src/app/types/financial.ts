
export interface omiseFinancialEntity {
    object:         string;
    livemode?:       boolean;
    location?:       string;
    currency:       string;
    total:          number | string;
    transferable:   number | string;
    reserve:        number;
    created_at:     string | Date;
}