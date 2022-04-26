import { Box, Badge, Button, Link, Text, Progress, HStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Stack, Input, FormControl, FormLabel, Checkbox, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { ProgressBar } from 'react-bootstrap'

import ReadMore from './ReadMore';

export interface Course {
  course: string;
  courseName: string;
  courseDescription: string;
  sections: Sections[];
  credit: number;
}

export interface Sections {
  capacity: number;
  actual: number;
  section: number;
  days: string;
  start: string;
  stop: string;
  professor: Professor;
}

export interface Professor {
  name: string;
  A: number;
  B: number;
  C: number;
  D: number;
  F: number;
  Q: number;
}

export const CourseCard = ({
  course,
  courseName,
  courseDescription,
  sections,
  credit
}: Course) => {
  //const [isClicked, setIsClicked] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  var nosections = false;
  var available = true;

  const more = sections.slice(1);

  function gradePercent(grade: number, dist: Professor) {
    const total = dist.A + dist.B + dist.C + dist.D + dist.F + dist.Q;

    return (grade/total) * 100;
  }

  const sects = [];

  for (let i = 0; i < sections.length; ++i) {
    const temp = sections.at(i);

    if ((temp.capacity - temp.actual) <= 0) {
      available = false;
      sects.push(temp.section);
    } 
    else {
      nosections = true;
    }
  }

  return (
    <Box textAlign={'left'} background="white" w={"sm"} borderWidth="1px" borderRadius="3xl" overflow="hidden" shadow={"xl"}>
      <Box p={4} pb={0}>
        <Text color={"#660000"} fontSize="4xl" as="h1" fontWeight="bold" textAlign={'center'}>
          {course}
        </Text>

        <Box color={"#660000"} textAlign="center" fontWeight={"medium"} lineHeight="tight">
          <i>{courseName.toUpperCase()}</i>
        </Box>

        <Box fontSize={"sm"} display="inline-block">
          <ReadMore>{courseDescription}</ReadMore>
        </Box>

        <Box>
          <Text color={"#660000"} as="b"> Section(s): </Text>
          { sections.length < 1 ?
            <Text fontSize="sm" display="inline"> No sections for this class are offered this semester </Text> :
            <Text display="inline">
              <Text display="inline"><b>{sections.at(0).section} [{sections.at(0).days} {sections.at(0).start} - {sections.at(0).stop}]</b></Text>
              <Text ><Text display="inline" color={"#660000"}>&emsp;<b>Professor:</b></Text> {sections.at(0).professor.name}</Text>
              <Text display="inline" color={"#660000"}>&emsp;<b>Grade Distribution:</b></Text>
              <ProgressBar>
                <ProgressBar variant="success" striped now={gradePercent(sections.at(0).professor.A, sections.at(0).professor)} label={'A'} key={1} />
                <ProgressBar striped now={gradePercent(sections.at(0).professor.B, sections.at(0).professor)} label={'B'} key={2} />
                <ProgressBar striped variant="info" now={gradePercent(sections.at(0).professor.C, sections.at(0).professor)} label={'C'} key={3} />
                <ProgressBar variant="warning" striped now={gradePercent(sections.at(0).professor.D, sections.at(0).professor)} label={'D'} key={1} />
                <ProgressBar striped variant="danger" now={gradePercent(sections.at(0).professor.F, sections.at(0).professor)} label={'F'} key={2} />
                <ProgressBar now={gradePercent(sections.at(0).professor.Q, sections.at(0).professor)} label={'Q'} key={3} />
              </ProgressBar>
              {more.map((section) => (
                <Text>&emsp;&emsp;&emsp;&emsp;&emsp; <b>{section.section} [{section.days} {section.start} - {section.stop}]</b>
                  <Text ><Text display="inline" color={"#660000"}>&emsp;<b>Professor:</b></Text> {section.professor.name}</Text>
                  <Text display="inline" color={"#660000"}>&emsp;<b>Grade Distribution:</b></Text>
                  <ProgressBar>
                    <ProgressBar variant="success" striped now={gradePercent(section.professor.A, section.professor)} label={'A'} key={1} />
                    <ProgressBar striped now={gradePercent(section.professor.B, section.professor)} label={'B'} key={2} />
                    <ProgressBar striped variant="info" now={gradePercent(section.professor.C, section.professor)} label={'C'} key={3} />
                    <ProgressBar variant="warning" striped now={gradePercent(section.professor.D, section.professor)} label={'D'} key={1} />
                    <ProgressBar striped variant="danger" now={gradePercent(section.professor.F, section.professor)} label={'F'} key={2} />
                    <ProgressBar now={gradePercent(section.professor.Q, section.professor)} label={'Q'} key={3} />
                  </ProgressBar>
                </Text>
              ))}
            </Text>
          }
        </Box>

        <Text color={"#660000"} as="b"> Availability: </Text>
        { sections.length < 1 ?
          <Text fontSize="sm" display="inline"> No sections for this class are offered this semester </Text> :
          <Text display="inline">
            <Text display="inline">{sections.at(0).section} - <b>{sections.at(0).capacity - sections.at(0).actual}</b> open seats</Text>
            {more.map((section) => (
              <Text>&emsp;&emsp;&emsp;&emsp;&emsp;&ensp; {section.section}  - <b>{section.capacity - section.actual}</b> open seats</Text>
            ))}
          </Text>
        }

        <Text fontWeight="bold">
          <Text color={"#660000"} as="b" display="inline-block"> Credits: </Text> {credit}
        </Text>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent >
          <ModalHeader textAlign={'center'} >Notification Information</ModalHeader>
          <ModalCloseButton background={'red.500'} onClick={onClose} />
          <Box>
            <ModalBody mb='2'>
              { nosections ?
                <Box>
                  <Text as='b' fontSize={'md'}>Would you like to register for the open section ?</Text>
                  <Box textAlign={'center'}>
                    <Link
                      target="_blank"
                      style={{ textDecoration: 'none' }}
                      href='https://compassxe-ssb.tamu.edu/StudentRegistrationSsb/ssb/registration'
                    >
                      <Button
                        bg={'#660000'}
                        color={'white'}
                        _hover={{
                          bg: 'red.600',
                        }}
                        mt={2}
                        width="72"
                        p={5}
                        borderColor={'black'}
                        borderWidth='thick'
                        borderRadius={15}
                      >
                        Register
                      </Button>
                    </Link>
                  </Box>
                  <Text textAlign={'center'} p='4' fontSize={'2xl'} fontWeight='bold'> OR </Text>
                </Box>
                : ''
              }
              <form method='post' action='api/courses/notification'>
                <Stack spacing={4}>
                  <Text as='b' fontSize={'md'}>Be notified when sections for {course} become available</Text>
                  <Input name='course' value={course} hidden/>
                  
                  <FormControl>
                    <FormLabel>
                      Would you like to be notiified for a specific section?
                    </FormLabel>
                    <Stack>
                      { sects.map((s) => (
                        <Checkbox name='sections' value={s}>{s}</Checkbox>
                      ))}
                    </Stack>
                  </FormControl>

                  <FormControl>
                    <FormLabel>
                      Please provide an email for the notification
                    </FormLabel>
                    <Input name='email' type='email' borderColor={'maroon'} borderWidth='medium' required/>
                  </FormControl>

                  <Box textAlign={'center'}>
                    <Button
                      type="submit"
                      bg={'#660000'}
                      color={'white'}
                      _hover={{
                        bg: 'red.600',
                      }}
                      mt={2}
                      width="72"
                      p={5}
                      borderColor={'black'}
                      borderWidth='thick'
                      borderRadius={15}
                    >
                      Notify Me
                    </Button>
                  </Box>
                </Stack>
              </form>
            </ModalBody>
          </Box>
        </ModalContent>
      </Modal>

      <Box>
        { sections.length > 0 ?
          <Box pb={4} textAlign={'center'}>
          { available ? 
            <Link
              target="_blank"
              style={{ textDecoration: 'none' }}
              href='https://compassxe-ssb.tamu.edu/StudentRegistrationSsb/ssb/registration'
            >
              <Button
                bg={'#660000'}
                color={'white'}
                _hover={{
                  bg: 'red.600',
                }}
                mt={2}
                width="72"
                p={5}
                borderColor={'black'}
                borderWidth='thick'
                borderRadius={15}
              >
                Register
              </Button>
            </Link>
            :
            <Button
              bg={'#660000'}
              color={'white'}
              onClick={onOpen}
              _hover={{
                bg: 'red.600',
              }}
              mt={2}
              width="72"
              p={5}
              borderColor={'black'}
              borderWidth='thick'
              borderRadius={15}
            >
              Notify Me
            </Button>
          }
        </Box> :
        <Box pb={4} textAlign={'center'}>
          <Link
            target="_blank"
            style={{ textDecoration: 'none' }}
          >
            <Button
              bg={'#660000'}
              color={'white'}
              _hover={{
                bg: '#660000',
              }}
              disabled
              mt={2}
              width="72"
              p={5}
              borderColor={'black'}
              borderWidth='thick'
              borderRadius={15}
            >
              Notify Me
            </Button>
          </Link>
        </Box>
        }
      </Box>
    </Box>
  );
};
