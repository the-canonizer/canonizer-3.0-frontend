import Trees from "../components/ComponentPages/Trees";
import LoggedInLayout from "../hoc/loggedInLayout";
import { getTreesApi } from "../network/api/treeApi";

const TreesPage = ({ result }) => {
  return (
    <LoggedInLayout>
      <Trees treesData={result} />
    </LoggedInLayout>
  );
};

// export async function getServerSideProps(context: any) {
//   // const result = await getTreesApi();
//   console.log("//////server///////");
//   return {
//     props: {
//       // result,
//     },
//   };
// }

export default TreesPage;
