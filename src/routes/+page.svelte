<script lang="ts">
    import type { Graph,Node } from "ngraph.graph";
    import { onMount } from "svelte";
    import Viva from "vivagraphjs";
    import { extractGraphDataFromSvg } from "../lib/convertSVGToGraph";
    import { newSvgPathGraph } from "../lib/data/svgs";
    import type { Renderer } from "../lib/types/types";
    import {
    createPathFinderForGraphWithCoordinates,
    fixNodePositions,
    reloadGraphData,
    replaceNodeId
    } from "../lib/util/graphUtils";
    import { download,isEventByKey } from "../lib/util/javasciptUtils";

    let graphJson;
    let graph: Graph;
    let renderer: Renderer;

    let selectedNode: Node;

    let inputFromId: string;
    let inputToId: string;
    let inputEditNodeId: string;
    let inputGraphJson: string;

    function onDownloadButtonClicked() {
        download(
            JSON.stringify(graphJson),
            "navigationGraph.json",
            "text/plain"
        );
    }

    function onPathfindingButtonClicked() {
        findPath(inputFromId, inputToId);
    }

    function onEditNodeSaveButtonClicked() {
        replaceNodeId(graphJson, selectedNode.id as string, inputEditNodeId);
        reloadGraphData(graph, graphJson);
        fixNodePositions(renderer, graphJson);
        inputEditNodeId = "";
        selectedNode = undefined;
    }

    function onLoadJsonButtonClicked() {
        graphJson = inputGraphJson;
        inputGraphJson = "";
        reloadGraphData(graph, graphJson);
        fixNodePositions(renderer, graphJson);
    }

    function findPath(fromId: string, toId: string) {
        const pathFinder = createPathFinderForGraphWithCoordinates(graph);
        const foundPath = pathFinder.find(fromId, toId);
        console.log(foundPath);
    }

    onMount(() => {
        // - Ngraph code -
        // -- Graph setup --
        graphJson = extractGraphDataFromSvg(newSvgPathGraph);
        graph = Viva.Graph.serializer().loadFromJSON(JSON.stringify(graphJson));

        // -- Renderer --
        const graphics = Viva.Graph.View.svgGraphics(),
            nodeSize = 24;
        graphics
            .node((node) => {
                const ui = Viva.Graph.svg("g");
                const svgText = Viva.Graph.svg("text")
                    .attr("y", "-4px")
                    .text(node.id);

                ui.addEventListener("click", () => {
                    selectedNode = node;
                    inputEditNodeId = node.id;
                });

                ui.append(svgText);
                return ui;
            })
            .placeNode((nodeUI, pos) => {
                nodeUI.attr(
                    "transform",
                    `translate(${pos.x - nodeSize / 2},${pos.y - nodeSize / 2})`
                );
            });

        const layout = Viva.Graph.Layout.forceDirected(graph, {
            springLength: 100,
            springCoeff: 0,
            dragCoeff: 0,
            gravity: 0,
        });

        renderer = Viva.Graph.View.renderer(graph, {
            graphics: graphics,
            layout: layout,
            container: document.getElementById("graphContainer"),
        });
        renderer.run();
        fixNodePositions(renderer, graphJson);
    });
</script>

<div class="container">
    <h5 class="mb-0">Graph Json</h5>
    <div class="mb-1">
        <input
            class="align-middle"
            type="text"
            placeholder="Json"
            bind:value={inputGraphJson}
            on:keypress={(e) =>
                isEventByKey(e, "Enter", onLoadJsonButtonClicked)}
        />
        <button class="btn btn-light" on:click={onLoadJsonButtonClicked}
            >Load Json as Graph</button
        >
        <button
            class="btn btn-light"
            on:click={onDownloadButtonClicked}
            disabled={!graphJson}>Download Current Graph Json</button
        >
    </div>

    <h5 class="mb-0">Edit node (Select a node)</h5>
    <div class="mb-1">
        <input
            class="align-middle"
            type="text"
            placeholder="NodeId"
            bind:value={inputEditNodeId}
            on:keypress={(e) =>
                isEventByKey(e, "Enter", onEditNodeSaveButtonClicked)}
            disabled={!selectedNode}
        />
        <button
            class="btn btn-light"
            on:click={onEditNodeSaveButtonClicked}
            disabled={!selectedNode}>Save changes</button
        >
    </div>

    <h5 class="mb-0">Pathfinder</h5>
    <div>
        <input
            class="align-middle"
            type="text"
            placeholder="From"
            bind:value={inputFromId}
        />
        <input
            class="align-middle"
            type="text"
            placeholder="To"
            bind:value={inputToId}
        />
        <button class="btn btn-light" on:click={onPathfindingButtonClicked}
            >Find path (console)</button
        >
    </div>

    <div id="graphContainer" class="mt-2" />
</div>

<style>
    :global(svg) {
        width: 100%;
        height: 75vh;
        overflow: hidden;
    }

    #graphContainer {
        border: 1px solid black;
        margin-right: 1em;
        height: 100%;
    }
</style>
