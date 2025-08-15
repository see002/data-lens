import PlaygroundClientWrapper from "./PlaygroundClientWrapper";
import PlaygroundPage from "./PlaygroundPage";

export default function PlaygroundRoute() {
  return (
    <PlaygroundClientWrapper>
      <PlaygroundPage />
    </PlaygroundClientWrapper>
  );
}
