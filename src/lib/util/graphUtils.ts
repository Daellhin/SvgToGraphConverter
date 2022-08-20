import type { JsonGraph } from "ngraph.fromjson";
import type { Graph } from "ngraph.graph";
import { aStar } from "ngraph.path";
import type { Renderer } from "../types/types";

export function replaceNodeId(graphData: JsonGraph, oldId: string, newId: string) {
    graphData.nodes = graphData.nodes.map((node) => {
        if (node.id === oldId) {
            node.id = newId;
        }
        return node
    })

    graphData.links = graphData.links.map(link => {
        if (link.fromId === oldId) {
            link.fromId = newId;
        }
        if (link.toId === oldId) {
            link.toId = newId;
        }
        return link;
    })
}

export function reloadGraphData(graph: Graph, graphJson: JsonGraph) {
    graph.clear();
    graphJson.nodes.forEach((node) => {
        graph.addNode(node.id, node.data)
    });
    graphJson.links.forEach((link) => {
        graph.addLink(link.fromId, link.toId, link.data)
    });
}

export function fixNodePositions(renderer: Renderer, graphJson: JsonGraph) {
    if (graphJson) {
        graphJson.nodes.forEach(node => {
            renderer.getLayout().pinNode(node);
            renderer.getLayout().setNodePosition(node.id, node.data.x, node.data.y);
        });
    }
    renderer.zoomOut();
    renderer.zoomIn();
    renderer.getGraphics().graphCenterChanged(0, 0)
}

export function zoomOut(renderer: Renderer, iterations: number) {
    for (let index = 0; index < iterations; index++) {
        renderer.zoomOut();
    }
}

export function createPathFinderForGraphWithCoordinates(graph: Graph) {
    return aStar(graph, {
        distance(fromNode, toNode, link) {
            return Math.hypot(
                toNode.data.x - fromNode.data.x,
                toNode.data.y - fromNode.data.y
            );
        },
        heuristic(fromNode, toNode) {
            return Math.hypot(
                toNode.data.x - fromNode.data.x,
                toNode.data.y - fromNode.data.y
            );
        },
    });
}