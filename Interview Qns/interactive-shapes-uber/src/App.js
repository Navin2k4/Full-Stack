import Shape from "./Shape";

// Use this data to create the shape
const BOX_DATA = [
  [1, 1, 1],
  [1, 0, 0],
  [1, 1, 1],
];

export default function App() {
  return <main>
    <Shape data={BOX_DATA} />
  </main>;
}
