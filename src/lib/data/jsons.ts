import type { JsonGraph } from "ngraph.fromjson";

export const json: JsonGraph = {
    nodes: [
        { id: "a", data: { x: 0, y: 0 } },
        { id: "b", data: { x: 100, y: 0 } },
        { id: "c", data: { x: 200, y: 0 } },
        { id: "d", data: { x: 0, y: 50 } },
        { id: "e", data: { x: 100, y: 100 } },
        { id: "f", data: { x: 200, y: 50 } }
    ],
    links: [
        { fromId: "a", toId: "b" },
        { fromId: "b", toId: "c" },
        { fromId: "d", toId: "e" },
        { fromId: "e", toId: "f" },
        { fromId: "a", toId: "d" },
        { fromId: "b", toId: "e" },
        { fromId: "c", toId: "f" }
    ]
}

export const floorPlanJson: JsonGraph = { "nodes": [{ "id": 0, "data": { "x": 175.68799, "y": 1025.8145 } }, { "id": 1, "data": { "x": 175.68799, "y": 1113.6585 } }, { "id": 2, "data": { "x": 302.0091, "y": 1021.4587 } }, { "id": 3, "data": { "x": 384.77121, "y": 1021.4587 } }, { "id": 5, "data": { "x": 468.98528999999996, "y": 1021.4587 } }, { "id": "wc", "data": { "x": 380.41531, "y": 861.74228 } }, { "id": 7, "data": { "x": 380.41531, "y": 948.13435 } }, { "id": 13, "data": { "x": 469.71127, "y": 828.34712 } }, { "id": "verdieping_2", "data": { "x": 630.1536100000001, "y": 825.44311 } }, { "id": 16, "data": { "x": 725.98342, "y": 104.54161 } }, { "id": "teras", "data": { "x": 867.5502200000001, "y": 104.54161 } }, { "id": "eetkamer", "data": { "x": 516.17421, "y": 203.27536 } }, { "id": 19, "data": { "x": 500.92856, "y": 658.46696 } }, { "id": "traphal", "data": { "x": 577.15682, "y": 1022.9106 } }, { "id": 23, "data": { "x": 709.4466600000001, "y": 1019.5088000000001 } }, { "id": "inkom", "data": { "x": 537.2277300000001, "y": 1331.4536 } }, { "id": 26, "data": { "x": 839.83699, "y": 1019.5088 } }, { "id": "apotheek", "data": { "x": 964.06715, "y": 1017.4553 } }, { "id": 28, "data": { "x": 932.23956, "y": 1534.9099 } }, { "id": "straat_apotheek", "data": { "x": 932.23956, "y": 1627.3125 } }, { "id": "keuken", "data": { "x": 242.47845999999998, "y": 659.19295 } }, { "id": 34, "data": { "x": 690.41023, "y": 440.67193 } }, { "id": "bureau", "data": { "x": 694.0401499999999, "y": 509.64036 } }, { "id": "straat_garage", "data": { "x": 271.5178, "y": 1602.2454 } }, { "id": 37, "data": { "x": 271, "y": 1481.7322 } }, { "id": "garage", "data": { "x": 271, "y": 1314.756 } }, { "id": "berging", "data": { "x": 211.26118, "y": 902.39738 } }, { "id": 44, "data": { "x": 694.04015, "y": 658.46696 } }, { "id": 45, "data": { "x": 694, "y": 842.14077 } }, { "id": 51, "data": { "x": 845.0447, "y": 440 } }, { "id": 53, "data": { "x": 690.41023, "y": 317.25476 } }, { "id": "straat_voordeur", "data": { "x": 556.1033, "y": 1616.0391 } }, { "id": 59, "data": { "x": 556, "y": 1501.3337 } }], "links": [{ "fromId": 0, "toId": 1 }, { "fromId": 2, "toId": 3 }, { "fromId": 3, "toId": 5 }, { "fromId": "wc", "toId": 7 }, { "fromId": 7, "toId": 3 }, { "fromId": 0, "toId": 2 }, { "fromId": 5, "toId": 13 }, { "fromId": 13, "toId": "verdieping_2" }, { "fromId": 16, "toId": "teras" }, { "fromId": "eetkamer", "toId": 19 }, { "fromId": 5, "toId": "traphal" }, { "fromId": "traphal", "toId": 23 }, { "fromId": "traphal", "toId": "inkom" }, { "fromId": 26, "toId": "apotheek" }, { "fromId": 28, "toId": "straat_apotheek" }, { "fromId": 28, "toId": "apotheek" }, { "fromId": 19, "toId": "keuken" }, { "fromId": 34, "toId": "bureau" }, { "fromId": "straat_garage", "toId": 37 }, { "fromId": 37, "toId": "garage" }, { "fromId": 1, "toId": "garage" }, { "fromId": 0, "toId": "berging" }, { "fromId": 44, "toId": 45 }, { "fromId": 44, "toId": 19 }, { "fromId": 44, "toId": "bureau" }, { "fromId": 34, "toId": 51 }, { "fromId": 16, "toId": 53 }, { "fromId": 53, "toId": "eetkamer" }, { "fromId": "eetkamer", "toId": 16 }, { "fromId": "straat_voordeur", "toId": 59 }, { "fromId": 59, "toId": "inkom" }, { "fromId": 23, "toId": 26 }, { "fromId": 45, "toId": "traphal" }, { "fromId": 51, "toId": "apotheek" }, { "fromId": 53, "toId": 34 }] };