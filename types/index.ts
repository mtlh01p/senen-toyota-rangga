import { Time } from "@/lib/time";

export type Station = {
  id: string;
  name: string;
  codes: StationCode[];
  brtCorridorIds: number[];
  cbrtLineIds: string[];
  nbrtLineIds: string[];
  doorside: string;
  accessible?: boolean;
  payTransfer?: boolean;
  oneWay?: boolean;
  hasTrain?: boolean;
};

export type BRTCorridor = {
  id: number;
  color: string;
  time: Time;
  mainBRTC: number;
  stationIdsDir1: string[];
  stationIdsDir2: string[];
  stationIdsDir3?: string[];
  stationIdsDir4?: string[];
};

export type CBRTLine = {
  id: string;
  color: string;
  time: Time;
  mainBRTC: number;
  stationIdsDir1: string[];
  stationIdsDir2: string[];
};

export type NBRTLine = {
  id: string;
  color: string;
  time: Time;
  mainBRTC: number;
};

export type StationCode = {
  corridorId: number;
  code: number;
};

