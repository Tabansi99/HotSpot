import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, CircularProgress, CSSReset, Flex, Grid, Input, InputGroup, InputLeftAddon, Link, Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout'
import { Course, CourseCard, Professor, Sections } from '../components/CourseCard';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RecCourse, RecommendationCard } from '../components/RecCard';
import { Search2Icon } from '@chakra-ui/icons';

const IndexPage = () => {
  const rout = useRouter();
  const { courseNo } = rout.query;
  const course = String(courseNo);
  const [data, setData] = useState<any>();
  const [recs, setRecs] = useState<any>();
  const [indRecs, setIndRecs] = useState<any>();
  const [recfeedbackURL, setRecFeedbackURL] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [indivCourse, setIndivCourse] = useState('');
  const [taken, setTaken] = useState<String[]>([]);
  const [positive, setPositive] = useState<String[]>([]);
  const [negative, setNegative] = useState<String[]>([]);
  const [searchTags, setSearchTags] = useState<String[]>([]);

  useEffect(() => {
    const fetchStuff = async () => {
      await fetch('/api/courses/')
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error('Failed');
          }
        })
        .then((data) => {
          setData(data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchStuff();
  }, [course]);

  useEffect(() => {
    const fetchStuff = async () => {
      await fetch('/api/recommendations/' + recfeedbackURL)
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error('Failed');
          }
        })
        .then((data) => {
          setRecs(data);
          if (data.Error) {
            window.alert('Sorry! your session has expired. Please search for a valid course on the homepage');
            window.location.href = '/'
          }
        })
        .catch((error) => {
          console.log(error);
        });

        await fetch('/api/courses/session')
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error('Failed');
          }
        })
        .then((data) => {
          setTaken(data.done);
          setPositive(data.pos);
          setNegative(data.neg);
          setSearchTags(data.tags);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchStuff();
  }, [recfeedbackURL]);

  const courseCards: Array<Course> = [];
  
  if (data) {

    if (!data[course]) {
      window.alert('Error: Sorry this course does not exist in our system. Please search for a valid course on the homepage');
      window.location.href = '/'
    }

    const sections: Array<Sections> = [];

    for(let i = 0; i < data[course].sections.length; ++i) {
      const prof: Professor = {
        name: data[course].sections[i].class['Prof Name'],
        A: data[course].sections[i].prof['A'],
        B: data[course].sections[i].prof['B'],
        C: data[course].sections[i].prof['C'],
        D: data[course].sections[i].prof['D'],
        F: data[course].sections[i].prof['F'],
        Q: data[course].sections[i].prof['Q']
      }

      sections.push({
        capacity: Number(data[course].sections[i].class['Max Capacity']),
        actual: Number(data[course].sections[i].class['Current Enrollment']),
        section: Number(data[course].sections[i].class['Course Section']),
        days: data[course].sections[i].class['Class Timing'].DaysOfWeek,
        start: data[course].sections[i].class['Class Timing'].BeginTime,
        stop: data[course].sections[i].class['Class Timing'].EndTime,
        professor: prof
      });
    }

    courseCards.push({
      course: course,
      courseName: data[course].info['Course Name'],
      courseDescription: data[course].info['Course Description'],
      sections: sections,
      credit: Number(data[course].info['Course Credit Hours (u)'])
    });
    // console.log(data['CSCE 110']);
  }

  const recCards: Array<RecCourse> = [];

  if (recs && data) {
    let len = 4;

    if (recs.length < 4) {
      len = recs.length;
    }

    for (let i = 0; i < len; ++i) {
      const temp = recs.at(i).at(0);

      const sections: Array<Sections> = [];
      
      for(let i = 0; i < data[temp].sections.length; ++i) {
        const prof: Professor = {
          name: data[temp].sections[i].class['Prof Name'],
          A: data[temp].sections[i].prof['A'],
          B: data[temp].sections[i].prof['B'],
          C: data[temp].sections[i].prof['C'],
          D: data[temp].sections[i].prof['D'],
          F: data[temp].sections[i].prof['F'],
          Q: data[temp].sections[i].prof['Q']
        }

        sections.push({
          capacity: Number(data[temp].sections[i].class['Max Capacity']),
          actual: Number(data[temp].sections[i].class['Current Enrollment']),
          section: Number(data[temp].sections[i].class['Course Section']),
          days: data[temp].sections[i].class['Class Timing'].DaysOfWeek,
          start: data[temp].sections[i].class['Class Timing'].BeginTime,
          stop: data[temp].sections[i].class['Class Timing'].EndTime,
          professor: prof
        });
      }

      recCards.push({
        course: temp,
        tag: data[temp].info.Tag,
        rating: Number(recs.at(i).at(1)),
        courseName: data[temp].info['Course Name'],
        courseDescription: data[temp].info['Course Description'],
        sections: sections,
        credit: Number(data[temp].info['Course Credit Hours (u)']),
        feedback: getRecs,
        recommendations: indivRecs,
      });
    }
  }

  const getIndivRecs = async (courseSelected: string) => {
    await fetch('/api/recommendations/modal/' + courseSelected)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Failed');
        }
      })
      .then((data) => {
        setIndRecs(data);
        if (data.Error) {
          window.alert('Sorry! your session has expired. Please search for a valid course on the homepage');
          window.location.href = '/'
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const indRecCards: Array<Course> = [];

  if (indRecs) {
    let len = 3;

    if (indRecs.length < 3) {
      len = indRecs.length;
    }

    for (let i = 0; i < len; ++i) {
      const temp = indRecs.at(i).at(0);

      const sections: Array<Sections> = [];
      
      for(let i = 0; i < data[temp].sections.length; ++i) {
        const prof: Professor = {
          name: data[temp].sections[i].class['Prof Name'],
          A: data[temp].sections[i].prof['A'],
          B: data[temp].sections[i].prof['B'],
          C: data[temp].sections[i].prof['C'],
          D: data[temp].sections[i].prof['D'],
          F: data[temp].sections[i].prof['F'],
          Q: data[temp].sections[i].prof['Q']
        }

        sections.push({
          capacity: Number(data[temp].sections[i].class['Max Capacity']),
          actual: Number(data[temp].sections[i].class['Current Enrollment']),
          section: Number(data[temp].sections[i].class['Course Section']),
          days: data[temp].sections[i].class['Class Timing'].DaysOfWeek,
          start: data[temp].sections[i].class['Class Timing'].BeginTime,
          stop: data[temp].sections[i].class['Class Timing'].EndTime,
          professor: prof
        });
      }

      indRecCards.push({
        course: temp,
        courseName: data[temp].info['Course Name'],
        courseDescription: data[temp].info['Course Description'],
        sections: sections,
        credit: Number(data[temp].info['Course Credit Hours (u)'])
      });
    }
  }

  function indivRecs(courseSelected: string) {
    setIndivCourse(courseSelected);
    getIndivRecs(courseSelected);
    onOpen();
  }

  function getRecs(feedbackURL: string) {
    setRecFeedbackURL(feedbackURL);
  }
  
  return (
    <Layout>
      <CSSReset />
      <SearchBar />
      <Box p='4' minH={'100vh'} overflow="hidden">
        <Box>
          <Box position={'fixed'} display={'inline-flex'} textAlign={'left'} background="white" w={"sm"} borderWidth="1px" borderRadius="3xl" overflow="hidden" shadow={"xl"}>
            <Accordion allowMultiple allowToggle w={"sm"} p='4'>
              <Text textAlign={'center'} fontWeight='bold' color={"#660000"}>USER SESSION INFORMATION</Text>
              <AccordionItem>
                <AccordionButton>
                  <Box flex={'1'} fontWeight='bold' fontSize={'lg'} textAlign='left'>
                    Courses Taken: 
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <Text fontSize={'md'}>{taken.sort().toString().replaceAll(',',', ')}</Text>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box flex={'1'} fontWeight='bold' fontSize={'lg'} textAlign='left'>
                    Search Topics: 
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <Text fontSize={'md'}>{searchTags.sort().toString().replaceAll(',',', ')}</Text>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box flex={'1'} fontWeight='bold' fontSize={'lg'} textAlign='left'>
                    Positive Feedback: 
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <Text fontSize={'md'}>{positive.sort().toString().replaceAll(',',', ')}</Text>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box flex={'1'} fontWeight='bold' fontSize={'lg'} textAlign='left'>
                    Negative Feedback: 
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <Text fontSize={'md'}>{negative.sort().toString().replaceAll(',',', ')}</Text>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>
          <Box p={4} align='center'>
            { data ?
              <CourseCard
                key={1}
                course={courseCards.at(0).course}
                courseName={courseCards.at(0).courseName}
                courseDescription={courseCards.at(0).courseDescription}
                sections={courseCards.at(0).sections}
                credit={courseCards.at(0).credit}
              /> :
              <CircularProgress isIndeterminate  size="200px" />
            }
          </Box>
        </Box>
        <Text p={4} fontSize='3xl' ><b>Recommended Similar Courses...</b></Text>
        <Box p={4}>
          { data ?
            <Grid templateColumns="repeat(4, 1fr)" gap={6}>
              {recCards.map((rec) => (
                <RecommendationCard
                  key={rec.course + '_key'}
                  rating={rec.rating}
                  tag={rec.tag}
                  course={rec.course}
                  courseName={rec.courseName}
                  courseDescription={rec.courseDescription}
                  sections={rec.sections}
                  credit={rec.credit}
                  feedback={rec.feedback}
                  recommendations={rec.recommendations}
                />
              ))}
            </Grid> :
            <CircularProgress isIndeterminate  size='200px' />
          }
        </Box>

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent maxWidth={'1250'} background={''} shadow={'none'}>
            <ModalHeader textAlign={'center'} color='white' fontSize={'4xl'}>Recomendations for {indivCourse}</ModalHeader>
            <ModalCloseButton background={'red.500'} onClick={onClose} />
            { indRecs ?
              <Box p={4}>
                <Grid templateColumns="repeat(3, 1fr)">
                {indRecCards.map((rec) => (
                  <CourseCard
                    key={rec.course + '_key'}
                    course={rec.course}
                    courseName={rec.courseName}
                    courseDescription={rec.courseDescription}
                    sections={rec.sections}
                    credit={rec.credit}
                  />
                ))}
              </Grid>
              </Box> :
              <Flex justify={'center'}>
                <CircularProgress isIndeterminate  size="100px" />
              </Flex>
            }
          </ModalContent>
        </Modal>
      </Box>
    </Layout>
  );
};

const SearchBar = () => {

  return(
    <Box mt={-4} mb={4}>
      <Link
        href='/'
        style={{ textDecoration: 'none' }}
      >
        <Text color={"#660000"} fontSize="6xl" pb={'-16'}>
          <b>HotSpot</b>
        </Text>
      </Link>
    
      <Flex justify={'center'} mt={-12}>      
        <form action='api/courses/search' method='post'>
          <InputGroup color={"#660000"} variant='unstyled'>
            <InputLeftAddon pointerEvents='none' children = {<Search2Icon />} />
            <p>&emsp;</p>
            <Input
              focusBorderColor="#660000"
              _placeholder={{color: '#A17C73'}}
              borderColor={'black'}
              name='course'
              type="text"
              color={"#660000"}
              variant='flushed'
              placeholder='ex. CSCE 121'
              required
            />
          </InputGroup>
        </form>
      </Flex>
    </Box>
  );
};



export default IndexPage;