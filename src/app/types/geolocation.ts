export interface provinceEntiry {
    id:        number;
    code:      number;
    nameTh:    string;
    nameEn:    string;
    district?:  districtEntity[];
}

export interface districtEntity {
    id:        number;
    code:      number;
    nameTh:    string;
    nameEn:    string;
    subdistricts?: subDistrictEntity[]
}

export interface subDistrictEntity {
    id:        number;
    code:      number;
    nameTh:    string;
    nameEn:    string;
}