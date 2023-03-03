export interface IFlight {
    icao24: string;
    callsign: string;
    origin: string;
    time_pos: number;
    last_contact: number;
    longitude: number;
    latitude: number;
    baro_altitude: number;
    on_ground: boolean;
    velocity: number;
    true_track: number;
    vertical_rate: number;
    sensors: number[];
    geo_altitude: number;
    squawk: string;
    spi: boolean;
    position_source: number;
    category: number;
}

export interface IFLightAPIResponse {
    time: string;
    states: (string | number | boolean | number[])[][];
}

export interface IISSAPIResponse {
    name: string;
    id: number;
    latitude: number;
    longitude: number;
    altitude: number;
    velocity: number;
    visibility: string;
    footprint: number;
    timestamp: number;
    daynum: number;
    solar_lat: number;
    solar_lon: number;
    units: string;
}

export interface IFlightMarker {
    planeMarker: L.Marker;
    plane: IFlight;
}
