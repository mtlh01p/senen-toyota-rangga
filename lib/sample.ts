import { Station, BRTCorridor, NBRTLine, CBRTLine, StationCode } from "@/types/index";

export const main_corridors: BRTCorridor[] = [
  {id: 1, color: "#d02127", stationIdsDir1: [], stationIdsDir2: []},
  {id: 2, color: "#294a99", stationIdsDir1: ["2-01", "2-02", "2-03", "2-04", "2-05", "2-06", "2-07", "2-08", "2-09", "2-10", "2-11", "2-12", "2-13", "2-14", "2-15", "2-16", "2-17", "2-18", "2-19", "1-14"], stationIdsDir2:["1-14", "2-22", "2-23", "2-24", "2-12", "2-11", "2-10", "2-09", "2-08", "2-07", "2-06", "2-05", "2-04", "2-03", "2-02", "2-01"]},
  {id: 3, color: "#fbc71f", stationIdsDir1: ["3-01", "3-02", "3-03", "3-04", "3-05", "3-06", "3-07", "3-08", "3-09", "3-10", "3-11", "3-12", "8-23", "1-14"], stationIdsDir2:["1-14", "8-23", "3-12", "3-11", "3-10", "3-09", "3-08", "3-07", "3-06", "3-05", "3-04", "3-03", "3-02", "3-01"]},
  {id: 4, color: "#502d5f", stationIdsDir1: [], stationIdsDir2: []},
  {id: 5, color: "#cc6128", stationIdsDir1: [], stationIdsDir2: []},
  {id: 8, color: "#d73492", stationIdsDir1: [], stationIdsDir2:[]},
  {id: 9, color: "#43a09a", stationIdsDir1: [], stationIdsDir2: []}, 
  {id: 10, color: "#961f22", stationIdsDir1: [], stationIdsDir2: []},
  {id: 14, color: "#ed882e", stationIdsDir1: [], stationIdsDir2: []},
]

export const cbrt_lines: CBRTLine[] = [
  {id: "2A", color: "#50a6e4", stationIdsDir1: ["2-01", "2-02", "2-03", "2-04", "2-05", "2-06", "2-07", "2-08", "2-09", "2-10", "2-11", "2-12", "2-24", "2-22", "8-23", "3-12", "3-11", "3-10", "3-09", "3-08", "3-07", "3-06", "3-05", "3-04"], stationIdsDir2: ["3-04", "3-05", "3-06", "3-07", "3-08", "3-09", "3-10", "3-11", "3-12", "8-23", "2-22", "2-23", "2-24", "2-12", "2-11", "2-10", "2-09", "2-08", "2-07", "2-06", "2-05", "2-04", "2-03", "2-02", "2-01"]}, 
  {id: "3H", color: "#e77721", stationIdsDir1: [], stationIdsDir2: []},
  {id: "3F", color: "#826a20", stationIdsDir1: [], stationIdsDir2: []},
  {id: "4D", color: "#ed8fc1", stationIdsDir1: [], stationIdsDir2: []},
  {id: "5C", color: "#95d8c6", stationIdsDir1: [], stationIdsDir2: []},
  {id: "6A", color: "#72c18b", stationIdsDir1: [], stationIdsDir2: []},
  {id: "6B", color: "#90b870", stationIdsDir1: [], stationIdsDir2: []},
  {id: "7F", color: "#fa2b75", stationIdsDir1: [], stationIdsDir2: []},
  {id: "9A", color: "#8fa03d", stationIdsDir1: [], stationIdsDir2: []},
  {id: "10D", color: "#9d3237", stationIdsDir1: [], stationIdsDir2: []},
  {id: "10H", color: "#9c050c", stationIdsDir1: [], stationIdsDir2: []},
]

export const stations: Station[] = [
  {
    id: "1-14",
    name: "Monumen Nasional",
    codes: [{ corridorId: 1, code: 14 }, { corridorId: 2, code: 21 }],
    brtCorridorIds: [1, 2, 3],
    cbrtLineIds: ["5C", "7F"],
    nbrtLineIds: []
  },
  {
    id: "2-01",
    name: "Pulo Gadung",
    codes: [{ corridorId: 2, code: 1 }, { corridorId: 4, code: 1 }],
    brtCorridorIds: [2, 4],
    cbrtLineIds: ["2A", "4D"],
    nbrtLineIds: []
  },
  {
    id: "2-02",
    name: "Bermis",
    codes: [{ corridorId: 2, code: 2 }],
    brtCorridorIds: [2],
    cbrtLineIds: ["2A"],
    nbrtLineIds: []
  },
  {
    id: "2-03",
    name: "Pulo Mas",
    codes: [{ corridorId: 2, code: 3 }],
    brtCorridorIds: [2],
    cbrtLineIds: ["2A"],
    nbrtLineIds: []
  },
  {
    id: "2-04",
    name: "Perintis Kemerdekaan",
    codes: [{ corridorId: 2, code: 4 }],
    brtCorridorIds: [2],
    cbrtLineIds: ["2A"],
    nbrtLineIds: []
  },
  {
    id: "2-05",
    name: "Pedongkelan",
    codes: [{ corridorId: 2, code: 5 }],
    brtCorridorIds: [2],
    cbrtLineIds: ["2A"],
    nbrtLineIds: []
  },
  {
    id: "2-06",
    name: "Cempaka Mas",
    codes: [{ corridorId: 2, code: 6 }, { corridorId: 10, code: 8 }],
    brtCorridorIds: [2, 10],
    cbrtLineIds: ["2A", "7F", "10D"],
    nbrtLineIds: []
  },
  {
    id: "2-07",
    name: "Sumur Batu",
    codes: [{ corridorId: 2, code: 7 }],
    brtCorridorIds: [2],
    cbrtLineIds: ["2A", "7F"],
    nbrtLineIds: []
  },
  {
    id: "2-08",
    name: "Cempaka Baru",
    codes: [{ corridorId: 2, code: 8 }],
    brtCorridorIds: [2],
    cbrtLineIds: ["2A", "7F"],
    nbrtLineIds: []
  },
  {
    id: "2-09",
    name: "Pasar Cempaka Putih",
    codes: [{ corridorId: 2, code: 9 }],
    brtCorridorIds: [2],
    cbrtLineIds: ["2A", "7F"],
    nbrtLineIds: []
  },
  {
    id: "2-10",
    name: "Rawa Selatan",
    codes: [{ corridorId: 2, code: 10 }],
    brtCorridorIds: [2],
    cbrtLineIds: ["2A", "7F"],
    nbrtLineIds: []
  },
  {
    id: "2-11",
    name: "Galur",
    codes: [{ corridorId: 2, code: 11 }],
    brtCorridorIds: [2],
    cbrtLineIds: ["2A", "7F"],
    nbrtLineIds: []
  },
  {
    id: "2-12",
    name: "Senen TOYOTA Rangga",
    codes: [{ corridorId: 2, code: 12 }, { corridorId: 5, code: 7 }, { corridorId: 14, code: 1 }],
    brtCorridorIds: [2, 5, 14],
    cbrtLineIds: ["2A", "7F"],
    nbrtLineIds: []
  },
  {
    id: "2-13",
    name: "Senen Raya",
    codes: [{ corridorId: 2, code: 13 }, { corridorId: 14, code: 2 }],
    brtCorridorIds: [2, 14],
    cbrtLineIds: [],
    nbrtLineIds: []
  },
  {
    id: "2-14",
    name: "RSPAD",
    codes: [{ corridorId: 2, code: 14 }],
    brtCorridorIds: [2],
    cbrtLineIds: [],
    nbrtLineIds: []
  },
  {
    id: "2-15",
    name: "Pejambon",
    codes: [{ corridorId: 2, code: 15 }],
    brtCorridorIds: [2],
    cbrtLineIds: [],
    nbrtLineIds: []
  },
  {
    id: "2-16",
    name: "Gambir",
    codes: [{ corridorId: 2, code: 16 }],
    brtCorridorIds: [2],
    cbrtLineIds: [],
    nbrtLineIds: []
  },
  {
    id: "2-17",
    name: "Istiqlal",
    codes: [{ corridorId: 2, code: 17 }],
    brtCorridorIds: [2],
    cbrtLineIds: [],
    nbrtLineIds: []
  },
  {
    id: "2-18",
    name: "Juanda",
    codes: [{ corridorId: 2, code: 18 }, { corridorId: 3, code: 15 }],
    brtCorridorIds: [2, 8],
    cbrtLineIds: ["5C", "7F", "10H"],
    nbrtLineIds: []
  },
  {
    id: "2-19",
    name: "Pecenongan",
    codes: [{ corridorId: 2, code: 19 }, { corridorId: 3, code: 14 }],
    brtCorridorIds: [2, 8],
    cbrtLineIds: ["5C", "7F", "10H"],
    nbrtLineIds: []
  },
  {
    id: "2-22",
    name: "Balai Kota",
    codes: [{ corridorId: 2, code: 22 }],
    brtCorridorIds: [2],
    cbrtLineIds: ["2A", "5C", "6A", "6B", "7F"],
    nbrtLineIds: []
  },
  {
    id: "2-23",
    name: "Gambir 2",
    codes: [{ corridorId: 2, code: 23 }],
    brtCorridorIds: [2],
    cbrtLineIds: ["2A"],
    nbrtLineIds: []
  },
  {
    id: "2-24",
    name: "Kwitang",
    codes: [{ corridorId: 2, code: 24 }],
    brtCorridorIds: [2],
    cbrtLineIds: ["2A", "5C", "7F"],
    nbrtLineIds: []
  },
  {
    id: "3-01",
    name: "Kalideres",
    codes: [{ corridorId: 3, code: 1 }],
    brtCorridorIds: [3],
    cbrtLineIds: ["3F"],
    nbrtLineIds: []
  },
  {
    id: "3-02",
    name: "Pesakih",
    codes: [{ corridorId: 3, code: 2 }],
    brtCorridorIds: [3],
    cbrtLineIds: ["3F"],
    nbrtLineIds: []
  },
  {
    id: "3-03",
    name: "Sumur Bor",
    codes: [{ corridorId: 3, code: 3 }],
    brtCorridorIds: [3],
    cbrtLineIds: ["3F"],
    nbrtLineIds: []
  },
  {
    id: "3-04",
    name: "Rawa Buaya",
    codes: [{ corridorId: 3, code: 4 }],
    brtCorridorIds: [3],
    cbrtLineIds: ["2A", "3F"],
    nbrtLineIds: []
  },
  {
    id: "3-05",
    name: "Jembatan Baru",
    codes: [{ corridorId: 3, code: 5 }],
    brtCorridorIds: [3],
    cbrtLineIds: ["2A", "3F"],
    nbrtLineIds: []
  },
  {
    id: "3-06",
    name: "Pulo Nangka",
    codes: [{ corridorId: 3, code: 6 }],
    brtCorridorIds: [3],
    cbrtLineIds: ["2A", "3F"],
    nbrtLineIds: []
  },
  {
    id: "3-07",
    name: "Jembatan Gantung",
    codes: [{ corridorId: 3, code: 7 }],
    brtCorridorIds: [3],
    cbrtLineIds: ["2A", "3F"],
    nbrtLineIds: []
  },
  {
    id: "3-08",
    name: "Taman Kota",
    codes: [{ corridorId: 3, code: 8 }],
    brtCorridorIds: [3],
    cbrtLineIds: ["2A", "3F"],
    nbrtLineIds: []
  },
  {
    id: "3-09",
    name: "Damai",
    codes: [{ corridorId: 3, code: 9 }, { corridorId: 8, code: 17}],
    brtCorridorIds: [3, 8],
    cbrtLineIds: ["2A", "3F", "3H"],
    nbrtLineIds: []
  },
  {
    id: "3-10",
    name: "Jelambar",
    codes: [{ corridorId: 3, code: 10 }, { corridorId: 8, code: 18}],
    brtCorridorIds: [3, 8],
    cbrtLineIds: ["2A", "3F", "3H"],
    nbrtLineIds: []
  },
  {
    id: "3-11",
    name: "Grogol",
    codes: [{ corridorId: 3, code: 11 }, { corridorId: 8, code: 19 }, { corridorId: 9, code: 20 }],
    brtCorridorIds: [3, 8, 9],
    cbrtLineIds: ["2A", "3F", "3H", "9A"],
    nbrtLineIds: []
  },
  {
    id: "3-12",
    name: "Roxy",
    codes: [{ corridorId: 3, code: 12 }],
    brtCorridorIds: [3],
    cbrtLineIds: ["2A", "3H"],
    nbrtLineIds: []
  },
  {
    id: "8-23",
    name: "Petojo",
    codes: [{ corridorId: 8, code: 23 }],
    brtCorridorIds: [3, 8],
    cbrtLineIds: ["2A", "3H"],
    nbrtLineIds: []
  },
];
