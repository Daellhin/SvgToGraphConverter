import type { Graph } from "ngraph.graph"

export interface Renderer {
    dispose()
    getGraphics(): Graphics
    getLayout(): Layout
    getTransform(): { offsetX: number, offsetY: number, scale: number }
    moveTo(x, y)
    off(eventName, callback)
    on(eventName, callback)
    pause()
    rerender()
    reset()
    resume()
    run(iterationsCount?)
    zoomIn()
    zoomOut()
}


export interface Layout {
    dispose()
    fire(eventName)
    forEachBody(cb)
    getBody(nodeId)
    getGraphRect()
    getLinkPosition(linkId)
    getNodePosition(nodeId)
    getSpring(fromId, toId)
    graph: Graph
    off(eventName, callback)
    on(eventName, callback, ctx)
    pinNode(node, isPinned?: boolean)
    setNodePosition(nodeId, x, y) // not actual type but it works
    simulator
    step()
}

export interface Graphics {
    addLink(link, pos)
    addNode(node, pos)
    beginRender()
    endRender()
    fire(eventName)
    getGraphicsRoot(callbackWhenReady)
    getLinkUI(linkId)
    getNodeUI(nodeId)
    getSvgRoot()
    graphCenterChanged(x, y)
    init(container)
    domInputManager(graph, graphics)
    link(builderCallback)
    node(builderCallback)
    off(eventName, callback)
    on(eventName, callback, ctx)
    placeLink(newPlaceLinkCallback)
    placeNode(newPlaceCallback)
    release(container)
    releaseLink(link)
    releaseNode(node)
    renderLinks()
    renderNodes()
    resetScale()
    scale(scaleFactor, scrollPoint)
    translateRel(dx, dy)
}
