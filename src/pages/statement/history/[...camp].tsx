import { getCampStatementHistoryApi } from "src/network/api/campStatementHistory";
import CampHistory from "../../../components/ComponentPages/CampHistory";
import { setCampStatementHistory } from "src/store/slices/campDetailSlice";
import Layout from "../../../hoc/layout";
import { useDispatch } from "react-redux";

const CampHistoryPage = ({ history }) => {
  const dispatch = useDispatch();
  // dispatch(setCampStatementHistory(history));
  return (
    <>
      <Layout>
        <CampHistory />
      </Layout>
    </>
  );
};

// export async function getServerSideProps() {
//   const reqBody = {
//     topic_num: 75,
//     camp_num: 1,
//     type: "all",
//   };
//   const res = await getCampStatementHistoryApi(reqBody);
//   const history = res || [];

//   return {
//     props: {
//       history,
//     },
//   };
// }

CampHistoryPage.displayName = "CampHistoryPage";
export default CampHistoryPage;
