import { Time } from "@/lib/time";

export type Station = {
  id: string;
  name: string;
  codes: StationCode[];
  brtCorridorIds: string[];
  cbrtLineIds: string[];
  nbrtLineIds: string[];
  doorside: string;
  accessible?: boolean;
};

export type BRTCorridor = {
  id: string;
  color: string;
  time: Time;
  stationIdsDir1: string[];
  stationIdsDir2: string[];
  stationIdsDir3?: string[];
  stationIdsDir4?: string[];
  mainBRTC: number;
  lineType: string;
};

export type CBRTLine = {
  id: string;
  color: string;
  time: Time;
  mainBRTC: number;
  lineType: string;
  stationIdsDir1: string[];
  stationIdsDir2: string[];
};

export type NBRTLine = {
  id: string;
  color: string;
  time: Time;
  lineType: string;
  mainBRTC: number;
};

export type StationCode = {
  corridorId: number;
  code: number;
};

