export type Values<T> = {
  "odata.metadata": string;
  value: T[];
};

export interface BusStopInfo {
  BusStopCode: string;
  Description: string;
  Latitude: number;
  Longitude: number;
  RoadName: string;
}

export interface BusServiceInfo {
  AM_Offpeak_Freq: string;
  AM_Peak_Freq: string;
  Category: string;
  DestinationCode: string;
  Direction: number;
  LoopDesc: string;
  Operator: string;
  OriginCode: string;
  PM_Offpeak_Freq: string;
  PM_Peak_Freq: string;
  ServiceNo: string;
}

export interface BusRouteInfo {
  BusStopCode: string;
  Direction: number;
  Distance: number;
  Operator: string;
  SAT_FirstBus: string;
  SAT_LastBus: string;
  SUN_FirstBus: string;
  SUN_LastBus: string;
  ServiceNo: string;
  StopSequence: number;
  WD_FirstBus: string;
  WD_LastBus: string;
}

export interface BusArrivalInfo {
  DestinationCode: string
  EstimatedArrival: string
  Feature: string
  Latitude: string
  Load: string
  Longitude: string
  Monitored: number;
  OriginCode: string
  Type: string
  VisitNumber: string
}

export interface BusStopArrivalInfo {
  BusStopCode: string;
  Services: Array<{
    ServiceNo: string;
    Operator: string;
    NextBus: BusArrivalInfo;
    NextBus2: BusArrivalInfo;
    NextBus3: BusArrivalInfo;
  }>;
}
