export type Station = {
  id: string;
  name: string;
  codes: StationCode[];
  brtCorridorIds: number[];
  cbrtLineIds: string[];
  nbrtLineIds: string[];
};

export type BRTCorridor = {
  id: number;
  color: string;
  stationIdsDir1: string[];
  stationIdsDir2: string[];
};

export type CBRTLine = {
  id: string;
  color: string;
  stationIdsDir1: string[];
  stationIdsDir2: string[];
};

export type NBRTLine = {
  id: string;
  color: string;
  stationIds: string[];
};

export type StationCode = {
  corridorId: number;
  code: number;
};

