import Image from "next/image";

export default function Fav() {
  return (
    <Image
      src={`${process.env.NEXT_PUBLIC_BASE_IMAGES_URL}/images/canonizer-fav.png`}
      alt="fav-icon"
      width={30}
      height={30}
    />
  );
}
