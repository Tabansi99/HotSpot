import { CheckCircleIcon, CheckIcon, InfoIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import { Alert, AlertIcon, Badge, Box, Button, Checkbox, Collapse, Flex, FormControl, FormLabel, Icon, Input, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Radio, RadioGroup, Stack, Text, Tooltip, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { IoAlertCircle } from "react-icons/io5";
import { ProgressBar } from 'react-bootstrap'
import { RiCloseCircleFill } from "react-icons/ri";

import ReadMore from './ReadMore';
import { CreatableSelect } from 'chakra-react-select';

export interface RecCourse {
  course: string;
  rating: number;
  tag: string;
  courseName: string;
  courseDescription: string;
  sections: Sections[];
  credit: number;
  feedback: (res: string) => void;
  recommendations: (res: string) => void;
}

export interface Sections {
  capacity: number;
  actual: number;
  section: number;
  days: String;
  start: String;
  stop: String;
  professor: Professor;
}

export interface Professor {
  name: String;
  A: number;
  B: number;
  C: number;
  D: number;
  F: number;
  Q: number;
}

function ratingColor(rate) {
  if (rate > 80) {
    return 'teal'
  }
  else if ((rate > 60) && (rate <= 80)) {
    return 'yellow';
  }
  else if ((rate > 40) && (rate <= 60)) {
    return 'orange';
  }
  else {
    return 'red'
  }
}

const tagMap = new Map();
tagMap.set('required', 'red');
tagMap.set('optional', 'gray');
tagMap.set('Information and Intelligent Systems', 'purple');
tagMap.set('untracked', 'gray');
tagMap.set('Systems', 'twitter');
tagMap.set('Software', 'pink');
tagMap.set('Algorithms and Theory', 'orange');

const tagNameMap = new Map();
tagNameMap.set('required', 'Required');
tagNameMap.set('optional', 'Optional Elective');
tagNameMap.set('Information and Intelligent Systems', 'Info Systems Elective');
tagNameMap.set('untracked', 'Optional Elective');
tagNameMap.set('Systems', 'Systems Elective');
tagNameMap.set('Software', 'Software Elective');
tagNameMap.set('Algorithms and Theory', 'Theory Elective');

export const RecommendationCard = ({
  course,
  courseName,
  courseDescription,
  sections,
  credit,
  feedback,
  rating,
  tag,
  recommendations
}: RecCourse,
) => {
  const [isClicked, setIsClicked] = useState(false);
  const [notif, setNotif] = useState('Click to show Grade Distribution');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const more = sections.slice(1);
  var available = true;
  var nosections = false;

  const sects = [];

  function gradePercent(grade: number, dist: Professor) {
    const total = dist.A + dist.B + dist.C + dist.D + dist.F + dist.Q;

    return (grade/total) * 100;
  }

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

  function changeScene() {
    setIsClicked(!isClicked);

    if (isClicked) {
      setNotif('Click to show Grade Distribution');
    }
    else {
      setNotif('Click to hide Grade Distribution');
    }
  }

  return (
    <Box textAlign={'left'} background="white" w={"sm"} borderWidth="1px" borderRadius="3xl" overflow="hidden" shadow={"xl"}>
      <Box p={4} pb={0}>
        <Box as='b'>
          Score: &nbsp;
          <Badge borderRadius="full" px="3" fontSize={'md'} py='1' colorScheme={ratingColor(rating)}>
            {rating}
          </Badge>

          <Flex justify={'end'} mt='-8'>
            <Badge borderRadius="full" px="3" fontSize={'md'} py='1' variant={'solid'} colorScheme={tagMap.get(tag)} >
              {tagNameMap.get(tag)}
            </Badge>
          </Flex>
        </Box>
        
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
          <Collapse in={false} animateOpacity>
            <Alert pt={2} status="info">
              
              Based on users with similiar climate preferences, we thought you would also like
              these destinations...
            </Alert>
          </Collapse>
          <Text color={"#660000"} as="b"> Section(s): </Text>
          { sections.length < 1 ?
            <Text fontSize="sm" display="inline"> No sections for this class are offered this semester </Text> :
            <Tooltip hasArrow placement='top' label={notif} closeOnClick={false}>
              <Link style={{ textDecoration: 'none' }} onClick={() => {changeScene()}}>
                <Text display="inline">
                  <Text display="inline"><b>{sections.at(0).section} [{sections.at(0).days} {sections.at(0).start} - {sections.at(0).stop}]</b> <InfoOutlineIcon /></Text>
                  { isClicked ?
                    <Box>
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
                    </Box> :
                    ''
                  }
                  {more.map((section) => (
                    <Text>&emsp;&emsp;&emsp;&emsp;&emsp; <b>{section.section} [{section.days} {section.start} - {section.stop}]</b>
                      { isClicked ?
                        <Box>
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
                        </Box> :
                        ''
                      }
                    </Text>
                  ))}
                </Text>
              </Link>
            </Tooltip>
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

        <Text fontWeight="bold">
          <Text color={"#660000"} as="b" display="inline-block"> Have you previously taken this course? </Text> &ensp;
          <Checkbox colorScheme={'red'} onChange={() => {feedback(`done/${course}`)}} size='lg' outline='bold'/>
        </Text>

        <Text fontWeight="bold">
          <Text color={"#660000"} as="b" display="inline-block"> Is this recommendation helpful? </Text> &ensp;
          <Link borderRadius='100'><CheckCircleIcon boxSize={'8'} onClick={() => {feedback(`pos/${course}`)}}/></Link> &ensp;
          <Link borderRadius='100'><Icon as={RiCloseCircleFill} boxSize={'10'} onClick={() => {feedback(`neg/${course}`)}}/></Link>
        </Text>

        <Box mt={'2'} textAlign={'center'}>
          <Button
            color={"black"}
            background='yellow.200'
            borderColor={'black'}
            borderWidth='thick'
            borderRadius={10}
            onClick={() => {recommendations(course)}}
          >
            See Recommendations for {course}
          </Button>
        </Box>
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
  );
};