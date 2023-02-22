import Layout from "../../hoc/layout";

import EventLine from "../../components/ComponentPages/eventLine";
import { setCurrentDate } from "src/store/slices/filtersSlice";
import { useDispatch } from "react-redux";

// import { wrapper } from "src/store";

const EventLinePage = ({ current_date }: any) => {
  const dispatch = useDispatch();

  dispatch(setCurrentDate(current_date));

  return (
    <>
      <Layout>
        <EventLine />
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

EventLinePage.displayName = "EventLinePage";

export default EventLinePage;
