declare namespace DataMall {
  interface BusStopInfo {
    BusStopCode: string;
    RoadName: string;
    Description: string;
    Latitude: number;
    Longitude: number;
  }

  interface BusServiceInfo {
    ServiceNo: string;
    Operator: string;
    Direction: 1 | 2;
    Category:
      | "EXPRESS"
      | "FEEDER"
      | "INDUSTRIAL"
      | "TOWNLINK"
      | "2 TIER FLAT FEE"
      | "FLAT FEE $1.10"
      | `FLAT FEE ${number}`
      | "TRUNK";
    OriginCode: string;
    DestinationCode: string;
    AM_Peak_Freq: string; // 0630H - 0830H
    AM_Offpeak_Freq: string; //0831H - 1659H
    PM_Peak_Freq: string; // 1700H - 1900H
    PM_Offpeak_Freq: string; // after 1900H
    LoopDesc: string;
  }

  interface BusRouteWaypoint {
    ServiceNo: string;
    Operator: string;
    Direction: 1 | 2;
    StopSequence: number;
    BusStopCode: string;
    Distance: number;
    WD_FirstBus: string;
    WD_LastBus: string;
    SAT_FirstBus: string;
    SAT_LastBus: string;
    SUN_FirstBus: string;
    SUN_LastBus: string;
  }

  interface BusArrivalInfo {
    OriginCode: string;
    DestinationCode: string;
    EstimatedArrival: string;
    Monitored: 0 | 1;
    Latitude: number;
    Longitude: number;
    VisitNumber: number;
    Load:
      | "SEA" //Seats Available
      | "SDA" // Standing Available
      | "LSD"; // Limited Standing
    Feature?: "WAB"; // Wheelchair accessible
    Type:
      | "SD" // Single-decked
      | "DD" // Double-decked
      | "BD"; // Bendy
  }

  interface BusServiceArrivalInfo {
    ServiceNo: string;
    Operator:
      | "SBST" // SBS Transit
      | "SMRT" // SMRT Corporation
      | "TTS" // Tower Transit Singapore
      | "GAS"; // Go Ahead Singapore
    NextBus?: BusArrivalInfo;
    NextBus2?: BusArrivalInfo;
    NextBus3?: BusArrivalInfo;
  }

  interface BusStopArrivalInfo {
    BusStopCode: string;
    Services: BusServiceArrivalInfo[];
  }
}
