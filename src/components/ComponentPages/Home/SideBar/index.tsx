import TopicsFilter from "../../../common/topicsFilter";

export default function HomeSideBar({ onCreateCamp = () => {} }) {
  return (
    <>
      <TopicsFilter onCreateCamp={onCreateCamp} />
    </>
  );
}
