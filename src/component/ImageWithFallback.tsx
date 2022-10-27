import { useState } from "react";
import Image from "next/image";

const ImageWithFallback = (props: {
  [x: string]: any;
  src: any;
  fallbackSrc: any;
}) => {
  const { src, fallbackSrc, alt, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...rest}
      alt={alt ?? ""}
      src={imgSrc}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
};

export default ImageWithFallback;
