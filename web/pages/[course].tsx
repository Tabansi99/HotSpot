import { Search2Icon } from '@chakra-ui/icons';
import { Box, Button, Center, CSSReset, Flex, FormControl, FormLabel, Input, InputGroup, InputLeftAddon, InputLeftElement, Select, Stack, Text } from '@chakra-ui/react';
import { MdUploadFile } from "react-icons/md";
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout'
import { GetStaticPaths, GetStaticProps } from 'next';
import { useCollection } from 'react-firebase-hooks/firestore';
import { CourseCard } from '../components/CourseCard';
import { useRouter } from 'next/router';

const IndexPage = () => {
  const rout = useRouter();
  const { course } = rout.query;
  const [first, setFirst] = useState(false);
  const [c, setC] = useState<any>();
  const [test, setTest] = useState<any>();
  useEffect(() => {
    const fetchStuff = async () => {
      await fetch('/api/course/')
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error('Failed');
          }
        })
        .then((data) => {
          setC(data);
          console.log(data);
          setTest(data[course].info['Course Name']);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchStuff();
  }, [course]);

  // const [courses, coursesLoading, coursesError] = useCollection(
  //   firebase.firestore
  // );
  
  return (
    <Layout>
      <CSSReset />
      <Flex minH={'100vh'} align={'center'} justify={'center'}>
        <Box p={4}>
          <Text>{test}</Text>
          <CourseCard
          key={1}
          courseNo={String(course)}
          courseName="Introduction to Computer Science Concepts and Programming"
          courseDescription="Computation to enhance problem solving abilities; understanding how people communicate with computers, and how computing affects society; computational thinking; software design principles, including algorithm design, data representation, abstraction, modularity, structured and object oriented programming, documentation, testing, portability, and maintenance; understanding programs’ abilities and limitations; development and execution programs."
          sections='600'
          availability='600 - 0 open seats'
          credit={3}
          />
        </Box>
      </Flex>
    </Layout>
  );
};



export default IndexPage;