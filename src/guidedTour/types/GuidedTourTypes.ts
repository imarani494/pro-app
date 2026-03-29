export interface IDepatureListResponse {
    success:      boolean;
    response_ref: string;
    _data:        Data;
}

export interface Data {
    rsltA: RsltA[];
    page:  Page;
    fltrs: Fltrs;
    msg?:  string; // Message to display when rsltA is empty
}

export interface Fltrs {
    departuredates: Cityids;
    price:          Price;
    nights:         Cityids;
    excityid:       Cityids;
    starrate:       Cityids;
    cityids:        Cityids;
    fltrA:          string[];
    operatorname:   Cityids;
}

export interface Cityids {
    shw:  boolean;
    opts: Opt[];
    typ:  string;
    nm:   string;
    fld:  string;
}

export interface Opt {
    val: string;
    cnt: number;
    nm:  string;
}

export interface Price {
    shw:    boolean;
    opts:   any[];
    expRPx: string;
    iSngl:  boolean;
    ovlR:   OvlR;
    expR:   boolean;
    typ:    string;
    nm:     string;
    fld:    string;
}

export interface OvlR {
    min: number;
    max: number;
}

export interface Page {
    total: number;
    lstPg: number;
    pg:    number;
    pgSz:  number;
}

export interface RsltA {
    prc:      number;
    st:       number;
    img:      string;
    dscA:     string[];
    prcQ:     string;
    dyD:      string;
    url:      string;
    itnA:     string[];
    infA:     InfA[];
    dscN:     number;
    prcD:     string;
    id:       number;
    grpSize?: number;
    mktD?:    string;
    nm:       string;
    grpT?:    boolean;
    oprcD?:   string;
    incF?:    boolean;
}

export interface InfA {
    val: number | string;
    nm:  Nm;
}

export enum Nm {
    DepartureStarting = "Departure Starting",
    ExCities = "Ex-Cities",
    Experiences = "Experiences",
    GuideLanguages = "Guide Languages",
    MaxGroupSize = "Max. Group Size",
}