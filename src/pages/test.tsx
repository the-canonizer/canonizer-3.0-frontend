import CustomSkelton from "@/components/common/customSkelton";

const Test = () => {
  return (
    <CustomSkelton
      skeltonFor="card"
      count={3}
      stylingClass="test"
      button={false}
    />
  );
};

export default Test;
