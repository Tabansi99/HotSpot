import { Box, Badge, Button, Link, Text } from '@chakra-ui/react';
import { useState } from 'react';
import ReadMore from './ReadMore';

export interface Course {
  courseNo: string;
  courseName: string;
  courseDescription: string;
  sections: string;
  availability: string;
  credit: number;
}


export const CourseCard = ({
  courseNo,
  courseName,
  courseDescription,
  sections,
  availability,
  credit
}: Course) => {

  return (
    <Box background="white" w={"sm"} borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Box p={4}>
        <Text color={"#660000"} fontSize="4xl" as="h1" fontWeight="bold" textAlign={'center'}>
          {courseNo}
        </Text>

        <Box color={"#660000"} textAlign="center" fontWeight={"medium"} lineHeight="tight">
          <i>{courseName.toUpperCase()}</i>
        </Box>

        <Box fontSize={"sm"} display="inline-block">
          <ReadMore>{courseDescription}</ReadMore>
        </Box>

        <Box >
          {sections}
        </Box>
        {availability}
        {credit}

        <Box pt={2}>
          <Link
            target="_blank"
            style={{ textDecoration: 'none' }}
          >
            <Button>Notify Me</Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};
