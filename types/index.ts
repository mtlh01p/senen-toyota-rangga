import { Time } from "@/lib/time";

export type Station = {
  id: string;
  name: string;
  codes: StationCode[];
  brtCorridorIds: number[];
  cbrtLineIds: string[];
  nbrtLineIds: string[];
  doorside: string;
};

export type BRTCorridor = {
  id: number;
  color: string;
  time: Time;
  stationIdsDir1: string[];
  stationIdsDir2: string[];
  stationIdsDir3?: string[];
  stationIdsDir4?: string[];
};

export type CBRTLine = {
  id: string;
  color: string;
  time: Time;
  stationIdsDir1: string[];
  stationIdsDir2: string[];
};

export type NBRTLine = {
  id: string;
  color: string;
  time: Time;
};

export type StationCode = {
  corridorId: number;
  code: number;
};

