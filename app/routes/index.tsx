import { ObjectInspector } from "react-inspector";

export default function Index() {
  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
        <ObjectInspector data={"hi"}/>
    </main>
  );
}
