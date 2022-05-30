import { json } from "@remix-run/node";
import { ObjectInspector } from "react-inspector";
import { useLoaderData } from "@remix-run/react";
import { loadData } from './data.server';
import type { Graph, Vertex } from '@frontside/graphgen';

export const loader = async function () {
  let graph = await loadData();
  return json<Graph>(JSON.parse(graph));
};

export default function Index() {
  const graph = useLoaderData<Graph>();
  return (
    <main className="relative min-h-screen bg-white sm:flex">
        <ObjectInspector data={createView(graph)}/>
    </main>
  );
}

function createView(graph: Graph) {
  return Object.entries(graph.roots).reduce((view, [name, root]) => {
    return {
      ...view,
      [name]: Object.values(root).reduce((entries, v) => {
        return {
          ...entries,
          [v.id]: createVertexView(v, graph),
        }
      }, {} as Record<number, VertexView>)
    };
  }, {});
}


interface VertexView {
  id: number;
  attributes: Record<string, unknown>;
  relationships?: Record<string, VertexView[]>
}


function createVertexView(vertex: Vertex, graph: Graph) {
  let view = {
    id: vertex.id,
    attributes: vertex.data,
  };

  let edges = graph.from[vertex.id];
  if (edges) {
    return {
      ...view,
      relationships: Object.create({}, edges.reduce((properties, edge) => {
        if (!properties[edge.type]) {
          return {
            ...properties,
            [edge.type]: {
              enumerable: true,
              get(): VertexView[] {
                return edges.filter(e => e.type === edge.type).map(({ to }) => createVertexView(graph.vertices[to], graph));
              }
            }
          }
        } else {
          return properties
        }
      }, {} as Record<string, PropertyDescriptor>)),
    };
  } else {
    return view;
  }
}
