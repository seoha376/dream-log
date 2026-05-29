import { useParams } from "react-router-dom";
import { mockDreams } from "../data/mockDreams";

export default function DreamDetail() {
  const { id } = useParams();
  const dream = mockDreams.find((d) => d.dream_id === Number(id));

  if (!dream) {
    return <div>Dream not found.</div>;
  }

  return (
    <div>
      <h1>{dream.title}</h1>
      <p>{dream.dream_date}</p>
      <p>{dream.content}</p>
      <div>
        {dream.tags.map((tag) => (
          <span key={tag}>#{tag} </span>
        ))}
      </div>
      <p>⭐ {dream.is_favorite ? "Favorited" : "Not favorited"}</p>
      <p>{dream.ai_summary}</p>
    </div>
  );
}