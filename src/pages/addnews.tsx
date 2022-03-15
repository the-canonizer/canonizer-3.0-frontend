import FormData from "../components/addnewsformdata/formadd";
import { useRouter } from "next/router";

export default function Home() {
  return (
    <>
      <div style={{ maxWidth: "500px" }}>
        <h1>Add News</h1>
        <FormData />
      </div>
    </>
  );
}
