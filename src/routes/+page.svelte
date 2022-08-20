<script lang="ts">
    import { json } from "@sveltejs/kit";

    import type { JsonGraph } from "ngraph.fromjson";

    import type { Graph, Node } from "ngraph.graph";
    import { onMount } from "svelte";

    import Viva from "vivagraphjs";
    import { extractGraphDataFromSvg } from "../lib/convertSVGToGraph";
    import { newSvgPathGraph } from "../lib/data/svgs";
    import type { Renderer } from "../lib/types/types";
    import {
        createPathFinderForGraphWithCoordinates,
        fixNodePositions,
        reloadGraphData,
        replaceNodeId,
    } from "../lib/util/graphUtils";
    import { download, isEventByKey } from "../lib/util/javasciptUtils";

    let graphJson: JsonGraph;
    let graph: Graph;
    let renderer: Renderer;

    let selectedNode: Node;

    let inputFromId: string;
    let inputToId: string;
    let inputEditNodeId: string;
    let inputGraphJson: string;
    let inputGraphSvg: string;

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
        graphJson = JSON.parse(inputGraphJson);
        reloadGraphData(graph, graphJson);
        fixNodePositions(renderer, graphJson);
        inputGraphJson = "";
    }

    function onLoadSvgButtonClicked() {
        graphJson = extractGraphDataFromSvg(inputGraphSvg);
        reloadGraphData(graph, graphJson);
        fixNodePositions(renderer, graphJson);
        inputGraphSvg = "";
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
                    .attr("class", "graph-label")
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

<div class="container flex flex-row h-screen py-3 lg:px-4 gap-x-8">
    <div class="flex-col w-full">
        <div id="graphContainer" class="border-solid border-2 h-full" />
    </div>
    <div class="flex-col">
        <h1 class="text-3xl font-bold mb-2">Svg</h1>
        <div class="flex flex-col mb-1 gap-4">
            <textarea
                class="textarea input-bordered"
                type="text"
                placeholder="Svg"
                bind:value={inputGraphSvg}
                on:keypress={(e) =>
                    isEventByKey(e, "Enter", onLoadSvgButtonClicked)}
            />
            <button class="btn btn-primary" on:click={onLoadSvgButtonClicked}
                >Load Graph as SVG</button
            >
        </div>

        <h1 class="text-3xl font-bold mt-2 mb-2">Json</h1>
        <div class="flex flex-col mb-1 gap-4">
            <textarea
                class="textarea input-bordered"
                type="text"
                placeholder="Json"
                bind:value={inputGraphJson}
                on:keypress={(e) =>
                    isEventByKey(e, "Enter", onLoadJsonButtonClicked)}
            />
            <button class="btn btn-primary" on:click={onLoadJsonButtonClicked}
                >Load Graph as Json</button
            >
            <button
                class="btn btn-primary"
                on:click={onDownloadButtonClicked}
                disabled={!graphJson}>Download Current Graph Json</button
            >
        </div>

        <h1 class="text-3xl font-bold mt-2 mb-2">Edit node (Select a node)</h1>
        <div class="mb-1">
            <div class="flex flex-row gap-2">
                <input
                    class="input input-bordered"
                    type="text"
                    placeholder="NodeId"
                    bind:value={inputEditNodeId}
                    on:keypress={(e) =>
                        isEventByKey(e, "Enter", onEditNodeSaveButtonClicked)}
                    disabled={!selectedNode}
                />
                <button
                    class="btn btn-primary"
                    on:click={onEditNodeSaveButtonClicked}
                    disabled={!selectedNode}>Save changes</button
                >
            </div>
        </div>

        <h5 class="text-3xl font-bold mt-2 mb-2">Pathfinder</h5>
        <div class="flex flex-col mb-1 gap-4">
            <div class="flex flex-row gap-2">
                <input
                    class="input input-bordered"
                    type="text"
                    placeholder="From"
                    bind:value={inputFromId}
                />
                <input
                    class="input input-bordered"
                    type="text"
                    placeholder="To"
                    bind:value={inputToId}
                />
            </div>
            <button class="btn btn-primary" on:click={onPathfindingButtonClicked}
                >Find path (console)</button
            >
        </div>
    </div>
</div>

<style>
    :global(svg) {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    .graph-label {
        color: theme('colors.primary');
    }
</style>
