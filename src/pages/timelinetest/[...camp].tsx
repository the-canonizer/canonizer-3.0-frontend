import Layout from "../../hoc/layout";

import TopicDetails from "../../components/ComponentPages/topicDetail2";
import { setCurrentDate } from "src/store/slices/filtersSlice";
import { useDispatch } from "react-redux";

// import { wrapper } from "src/store";

const TopicDetailsPage = ({ current_date }: any) => {
  const dispatch = useDispatch();

  dispatch(setCurrentDate(current_date));

  return (
    <>
      <Layout>
        <TopicDetails />
      </Layout>
    </>
  );
};

export async function getServerSideProps() {
  const currentDate = new Date().valueOf();

  return {
    props: {
      current_date: currentDate,
    },
  };
}

TopicDetailsPage.displayName = "TopicDetailsPage";

export default TopicDetailsPage;
