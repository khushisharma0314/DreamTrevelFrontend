/**
 * Flight & Airport Utilities
 * Handles:
 * 1. Domestic vs International detection with comprehensive IATA airport database
 * 2. Session storage backup & recovery for seamless booking flow continuation
 */

// IATA Airport to Country ISO Code Map
export const AIRPORT_COUNTRY_MAP = {
    // INDIA (IN) - Major & Regional Airports
    DEL: "IN", BOM: "IN", BLR: "IN", MAA: "IN", CCU: "IN", HYD: "IN",
    AMD: "IN", PNQ: "IN", GOI: "IN", GOX: "IN", COK: "IN", JAI: "IN",
    LKO: "IN", GAU: "IN", IXC: "IN", IXB: "IN", PAT: "IN", BBI: "IN",
    TRV: "IN", CCJ: "IN", IDR: "IN", NAG: "IN", VNS: "IN", SXR: "IN",
    IXL: "IN", BDQ: "IN", UDR: "IN", RPR: "IN", IXR: "IN", CJB: "IN",
    IXM: "IN", VTZ: "IN", IXE: "IN", IMF: "IN", IXA: "IN", DIB: "IN",
    GAY: "IN", IXZ: "IN", STV: "IN", ATQ: "IN", BHO: "IN", DBG: "IN",
    DMU: "IN", GAY: "IN", GWL: "IN", HJR: "IN", JDH: "IN", JGA: "IN",
    JLR: "IN", KUU: "IN", RJA: "IN", SHL: "IN", TEZ: "IN", TIR: "IN",
    TCR: "IN", VIZ: "IN", MYQ: "IN", NDC: "IN", AJL: "IN", KNU: "IN",

    // UNITED STATES (US)
    JFK: "US", EWR: "US", LGA: "US", LAX: "US", SFO: "US", ORD: "US",
    DFW: "US", MIA: "US", ATL: "US", IAD: "US", DCA: "US", SEA: "US",
    BOS: "US", DEN: "US", LAS: "US", MCO: "US", CLT: "US", PHX: "US",
    IAH: "US", HOU: "US", SAN: "US", DTW: "US", MSP: "US", PHL: "US",
    TPA: "US", BWI: "US", SLC: "US", FLL: "US", PDX: "US", AUS: "US",

    // UNITED KINGDOM (GB)
    LHR: "GB", LGW: "GB", STN: "GB", LTN: "GB", LCY: "GB", MAN: "GB",
    EDI: "GB", BHX: "GB", GLA: "GB", BRS: "GB", NCL: "GB", BFS: "GB",

    // UAE (AE)
    DXB: "AE", DWC: "AE", AUH: "AE", SHJ: "AE", RKT: "AE",

    // QATAR (QA), SAUDI ARABIA (SA), KUWAIT (KW), OMAN (OM), BAHRAIN (BH)
    DOH: "QA", JED: "SA", RUH: "SA", DMM: "SA", MED: "SA",
    KWI: "KW", MCT: "OM", SLL: "OM", BAH: "BH",

    // SINGAPORE (SG), THAILAND (TH), MALAYSIA (MY), INDONESIA (ID)
    SIN: "SG", BKK: "TH", DMK: "TH", HKT: "TH", CNX: "TH",
    KUL: "MY", BKI: "MY", PEN: "MY", CGK: "ID", DPS: "ID", SUB: "ID",

    // JAPAN (JP), SOUTH KOREA (KR), CHINA (CN), HONG KONG (HK)
    HND: "JP", NRT: "JP", KIX: "JP", FUK: "JP", CTS: "JP",
    ICN: "KR", GMP: "KR", PUS: "KR",
    PEK: "CN", PKX: "CN", PVG: "CN", SHA: "CN", CAN: "CN", SZX: "CN",
    HKG: "HK", MFM: "MO", TPE: "TW", KHH: "TW",

    // AUSTRALIA (AU) & NEW ZEALAND (NZ)
    SYD: "AU", MEL: "AU", BNE: "AU", PER: "AU", ADL: "AU", CNS: "AU",
    AKL: "NZ", CHC: "NZ", WLG: "NZ",

    // CANADA (CA)
    YYZ: "CA", YVR: "CA", YUL: "CA", YYC: "CA", YEG: "CA", YOW: "CA",

    // EUROPE
    CDG: "FR", ORY: "FR", NCE: "FR", LYS: "FR", MRS: "FR", // France
    FRA: "DE", MUC: "DE", BER: "DE", HAM: "DE", DUS: "DE", // Germany
    AMS: "NL", BRU: "BE", // Netherlands, Belgium
    FCO: "IT", MXP: "IT", LIN: "IT", VCE: "IT", NAP: "IT", // Italy
    MAD: "ES", BCN: "ES", AGP: "ES", PMI: "ES", VLC: "ES", // Spain
    LIS: "PT", OPO: "PT", // Portugal
    ZRH: "CH", GVA: "CH", BSL: "CH", // Switzerland
    VIE: "AT", PRG: "CZ", BUD: "HU", WAW: "PL", // Austria, Czech, Hungary, Poland
    ATH: "GR", SKG: "GR", HER: "GR", // Greece
    IST: "TR", SAW: "TR", AYT: "TR", ESB: "TR", // Turkey
    CPH: "DK", ARN: "SE", OSL: "NO", HEL: "FI", // Scandinavia
    DUB: "IE", SNN: "IE", // Ireland

    // NEIGHBOURING & SOUTH ASIA
    CMB: "LK", KTM: "NP", DAC: "BD", CGP: "BD",
    ISB: "PK", KHI: "PK", LHE: "PK", MLE: "MV",

    // AFRICA & MIDDLE EAST
    CAI: "EG", JNB: "ZA", CPT: "ZA", DUR: "ZA",
    NBO: "KE", MBA: "KE", CMN: "MA", RAK: "MA",
    LOS: "NG", ACC: "GH", ADD: "ET", TLV: "IL",

    // LATIN AMERICA
    GRU: "BR", GIG: "BR", BSB: "BR", MEX: "MX", CUN: "MX", GDL: "MX",
    EZE: "AR", AEP: "AR", SCL: "CL", BOG: "CO", LIM: "PE"
};

/**
 * Extract Country (Name or Code) from city object or airport code
 */
export function getCountry(cityObj, fallbackCode) {
    if (cityObj) {
        // Direct country properties
        if (cityObj.countryName && typeof cityObj.countryName === "string") {
            return cityObj.countryName.trim();
        }
        if (cityObj.countryCode && typeof cityObj.countryCode === "string") {
            return cityObj.countryCode.trim().toUpperCase();
        }
        if (cityObj.country) {
            if (typeof cityObj.country === "string") {
                return cityObj.country.trim();
            }
            if (typeof cityObj.country === "object") {
                const nameOrCode = cityObj.country.name || cityObj.country.code || cityObj.country.iso_country_code;
                if (nameOrCode) return String(nameOrCode).trim();
            }
        }
    }

    // Lookup by Airport Code
    const code = (
        cityObj?.airportCode ||
        cityObj?.iataCode ||
        fallbackCode ||
        ""
    ).toString().trim().toUpperCase();

    if (code && AIRPORT_COUNTRY_MAP[code]) {
        return AIRPORT_COUNTRY_MAP[code];
    }

    return "";
}

/**
 * Detect whether a flight is Domestic or International
 * Returns true if international, false if domestic
 */
export function detectIsInternational(fromCity, toCity, searchData = null, selectedFlight = null) {
    const fromCode = (
        fromCity?.airportCode ||
        searchData?.fromCity ||
        searchData?.from ||
        selectedFlight?.from ||
        ""
    ).toString().trim().toUpperCase();

    const toCode = (
        toCity?.airportCode ||
        searchData?.toCity ||
        searchData?.to ||
        selectedFlight?.to ||
        ""
    ).toString().trim().toUpperCase();

    const fromCountry = getCountry(fromCity, fromCode).toUpperCase();
    const toCountry = getCountry(toCity, toCode).toUpperCase();

    // 1. Both countries identified
    if (fromCountry && toCountry) {
        // Handle common variations (e.g. INDIA vs IN)
        const isFromIndia = fromCountry === "IN" || fromCountry.includes("INDIA");
        const isToIndia = toCountry === "IN" || toCountry.includes("INDIA");
        if (isFromIndia && isToIndia) return false;

        const isFromUS = fromCountry === "US" || fromCountry.includes("UNITED STATES") || fromCountry.includes("USA");
        const isToUS = toCountry === "US" || toCountry.includes("UNITED STATES") || toCountry.includes("USA");
        if (isFromUS && isToUS) return false;

        return fromCountry !== toCountry;
    }

    // 2. Fallback check on known airport code map
    const mappedFrom = AIRPORT_COUNTRY_MAP[fromCode];
    const mappedTo = AIRPORT_COUNTRY_MAP[toCode];

    if (mappedFrom && mappedTo) {
        return mappedFrom !== mappedTo;
    }

    // 3. Heuristic: If one is Indian airport and other is known foreign airport or vice versa
    if ((mappedFrom === "IN" && mappedTo && mappedTo !== "IN") || (mappedTo === "IN" && mappedFrom && mappedFrom !== "IN")) {
        return true;
    }

    // 4. Default: If codes are valid and in India map
    if (mappedFrom === "IN" && (!mappedTo || mappedTo === "IN")) {
        return false;
    }

    return false;
}

// Session Storage Key
const BOOKING_SESSION_KEY = "dreamtravel_booking_session";

/**
 * Save active booking state to sessionStorage
 */
export function saveBookingSession(path, state) {
    try {
        if (!state) return;
        const payload = {
            path,
            state,
            timestamp: Date.now()
        };
        sessionStorage.setItem(BOOKING_SESSION_KEY, JSON.stringify(payload));
    } catch (e) {
        console.warn("Unable to save booking session to sessionStorage:", e);
    }
}

/**
 * Retrieve active booking state from sessionStorage
 */
export function getBookingSession() {
    try {
        const raw = sessionStorage.getItem(BOOKING_SESSION_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        // Expire session after 3 hours
        if (parsed.timestamp && Date.now() - parsed.timestamp > 3 * 60 * 60 * 1000) {
            sessionStorage.removeItem(BOOKING_SESSION_KEY);
            return null;
        }
        return parsed;
    } catch (e) {
        return null;
    }
}

/**
 * Clear booking session after payment / confirmation
 */
export function clearBookingSession() {
    try {
        sessionStorage.removeItem(BOOKING_SESSION_KEY);
    } catch (e) {
        // ignore
    }
}
