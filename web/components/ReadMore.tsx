import React, { useState } from "react";
import { Box, Link, Text } from '@chakra-ui/react';
  
const ReadMore = ({ children }) => {
  const text = children;
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  return (
    <div style={{display: "inline-block"}}>
      <Text color={"#660000"} fontSize={"md"} as="b" display="inline-block">Course Description: </Text> {isReadMore ? text.slice(0, 150) : text}
      { children.length > 150 ?
        <Link onClick={toggleReadMore} color={"#660000"} as="b" className="read-or-hide">
          {isReadMore ? "...read more" : " show less"}
        </Link> :
        ''
      }
    </div>
  );
};

export default ReadMore;