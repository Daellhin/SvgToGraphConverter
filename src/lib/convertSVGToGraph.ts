import type { JsonGraph, JsonNode } from 'ngraph.fromjson';

type IntermediateEdge = {
    startNode: {
        x: number
        y: number
    };
    endNode: {
        x: number
        y: number
    };
}

export function extractGraphDataFromSvg(svg: string) {
    const relativePathStrings = splitAndNormaliseRelativePaths(svg);
    const absolutePathStrings = splitAndNormaliseAbsolutePaths(svg);
    const relativePathNumbers = convertPathStringsToNumbers(relativePathStrings);
    const absolutePathNumbers = convertPathStringsToNumbers(absolutePathStrings);

    const edgeObjects = [...convertRelativePaths(relativePathNumbers), ...convertAbsolutePaths(absolutePathNumbers)];
    // console.log(edgeObjects);

    const graphData = convertEdgeObjectsToGraphData(edgeObjects);
    // console.log(graphData);

    return graphData;
}

function convertRelativePaths(paths: number[][][]): IntermediateEdge[] {
    return paths.map(e => ({
        startNode: { x: e[0][0], y: e[0][1] },
        endNode: { x: e[0][0] + e[1][0], y: e[0][1] + e[1][1] }
    }));
}

function convertAbsolutePaths(paths: number[][][]): IntermediateEdge[] {
    return paths.map(e => ({
        startNode: { x: e[0][0], y: e[0][1] },
        endNode: { x: e[1][0], y: e[1][1] }
    }));
}

function convertPathStringsToNumbers(paths: string[]) {
    paths.forEach((path) => {
        const occurences = (path.match(/ /g) || []).length;
        if (occurences !== 1) {
            console.error(`Invalid path found ${path}`);

        }

    })

    return paths
        .map(e => e.split(" ")
            .map(f => f.split(",")
                .map(g => Number(g))
            )
        )
}

function splitAndNormaliseRelativePaths(svg: string) {
    // m (relative)
    return [...svg.matchAll(/d="m (.*?)"/g)]
        .map((e) => e[1])
        .map((e) => {
            if (e.includes("v ")) {
                return e.replace("v ", "0,");
            }
            if (e.includes("h ")) {
                return e.replace("h ", "") + ",0";
            }
            return e;
        });
}

function splitAndNormaliseAbsolutePaths(svg: string) {
    // M (absolute)
    return [...svg.matchAll(/d="M (.*?)"/g)]
        .map((e) => e[1])
        .map((e) => {
            if (e.includes("V ")) {
                const startX = parseInt(e.split(",")[0])
                return e.replace("V ", `${startX},`);
            }
            if (e.includes("H ")) {
                const startY = parseInt(e.split(",")[1])
                return e.replace("H ", "") + `,${startY}`;
            }
            return e;
        });
}

function convertEdgeObjectsToGraphData(edgeObjects: IntermediateEdge[]) {
    const graphData = {
        nodes: [],
        links: []
    };

    let indexer = 0;

    edgeObjects.forEach(e => {
        const startId = indexer++;
        const endId = indexer++;

        graphData.nodes.push({
            id: startId, data: { x: e.startNode.x, y: e.startNode.y }
        });
        graphData.nodes.push({
            id: endId, data: { x: e.endNode.x, y: e.endNode.y }
        });

        graphData.links.push({
            fromId: startId, toId: endId
        });
    });

    removeNodesWhenOverlapping(graphData);

    return graphData;
}

function removeNodesWhenOverlapping(graphData: JsonGraph) {
    for (let i = graphData.nodes.length - 1; i >= 0; i--) {
        const node = graphData.nodes[i];
        const result = graphData.nodes.find((nodeToCompare) => doNodesOverlap(node, nodeToCompare))
        if (result) {
            // Replace id node to delete with overlapping node
            graphData.links = graphData.links.map(link => {
                if (link.fromId === node.id) {
                    link.fromId = result.id
                }
                if (link.toId === node.id) {
                    link.toId = result.id;
                }
                return link;
            })
            // Remove node that is overlapped
            graphData.nodes.splice(i, 1)
        }
    }
}

function doNodesOverlap(node1: JsonNode, node2: JsonNode) {
    if (node1.id !== node2.id) {
        const treashold = 2;
        const dx = Math.abs(node1.data.x - node2.data.x);
        const dy = Math.abs(node1.data.y - node2.data.y);
        return dx < treashold && dy < treashold;
    }
    return false;
}