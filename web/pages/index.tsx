import { Search2Icon } from '@chakra-ui/icons';
import { Box, Button, Center, CSSReset, Flex, FormControl, FormLabel, Input, InputGroup, InputLeftAddon, Select, InputLeftElement, Stack, Text } from '@chakra-ui/react';
import { MdUploadFile } from "react-icons/md";
import React, { useState } from 'react';
import Layout from '../components/Layout'
import ReactSelect, { components } from "react-select";
import FormData from 'form-data';
import { sampleCourses } from '../utils/courses';
import { CreatableSelect } from 'chakra-react-select';

const IndexPage = () => {
  return (
    <Layout>
      <CSSReset />
      <Flex minH={'100vh'} align={'center'} justify={'center'}>
        <Box p={4}>
          <Text color={"#660000"} fontSize="6xl" pb={8} textAlign={'center'}>
            <b>HotSpot</b>
          </Text>
          <ClassForm />
        </Box>
      </Flex>
    </Layout>
  );
};

const ClassForm = () => {

  return (
    <Box width={400}>
      <form action='api/courses' method='post'>
        <Stack>
          <FormControl id="major">
            <FormLabel>What's your major?</FormLabel>
            <InputGroup color={"#660000"} variant='unstyled'>
              <InputLeftAddon pointerEvents='none' children = {<Search2Icon />} />
              <p>&emsp;</p>
              <Select
                focusBorderColor="#660000"
                borderColor={'black'}
                name='major'
                variant='flushed'
                placeholder='Select Major'
                required
              >
                <option value='Aerospace Engineering'>Aerospace Engineering</option>
                <option value='Architectural Engineering'>Architectural Engineering</option>
                <option value='Biomedical Engineering'>Biomedical Engineering</option>
                <option value='Chemical Engineering'>Chemical Engineering</option>
                <option value='Civil Engineering'>Civil Engineering</option>
                <option value='Computer Engineering - CECN'>Computer Engineering - CECN</option>
                <option value='Computer Engineering - CEEN'>Computer Engineering - CEEN</option>
                <option value='Computer Engineering - CEPN'>Computer Engineering - CEPN</option>
                <option value='Computer Science'>Computer Science</option>
                <option value='Electrical Engineering'>Electrical Engineering</option>
                <option value='Electronic Systems Engineering Technology'>Electronic Systems Engineering Technology</option>
                <option value='Environmental Engineering'>Environmental Engineering</option>
                <option value='Industrial Distribution'>Industrial Distribution</option>
                <option value='Industrial Engineering'>Industrial Engineering</option>
                <option value='Materials Science and Engineering'>Materials Science and Engineering</option>
                <option value='Mechanical Engineering'>Mechanical Engineering</option>
                <option value='Multidisciplinary Engineering Technology'>Multidisciplinary Engineering Technology</option>
                <option value='Nuclear Engineering'>Nuclear Engineering</option>
                <option value='Ocean Engineering'>Ocean Engineering</option>
                <option value='Petroleum Engineering'>Petroleum Engineering</option>
              </Select>
            </InputGroup>
          </FormControl>
          <FormControl id="class">
            <FormLabel>What class do you want to take?</FormLabel>
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
          </FormControl>
          <FormControl id="tags">
            <FormLabel>Areas of interest?</FormLabel>
            <CreatableSelect
              focusBorderColor='#660000'
              tagVariant='solid'
              colorScheme='gray'
              isMulti
              name='tags'
              options={[
                {
                  label: "Web Development",
                  value: "Web Development",
                  colorScheme: "red"
                },
                {
                  label: "Artificial Intelligence",
                  value: "Artificial Intelligence",
                  colorScheme: "green"
                },
                {
                  label: "Database",
                  value: "Database",
                  colorScheme: "blue"
                },
                {
                  label: "User Interface",
                  value: "User Interface",
                  colorScheme: 'gray'
                },
                {
                  label: "Recommender Sytems",
                  value: "Recommender Sytems",
                  colorScheme: "pink"
                },
                {
                  label: "Machine Learning",
                  value: "Machine Learning",
                  colorScheme: "orange"
                },
                {
                  label: "Software Development",
                  value: "Software Development",
                  colorScheme: "yellow"
                },
                {
                  label: "Systems",
                  value: "Systems",
                  colorScheme: "teal"
                },
                {
                  label: "Distributed Sytems",
                  value: "Distributed Sytems",
                  colorScheme: "cyan"
                },
                {
                  label: "Financial Systems",
                  value: "Financial Systems",
                  colorScheme: "purple"
                }
              ]} 
            />
          </FormControl>
          <FormControl borderRadius={0} id="transcript">
            <FormLabel> For better recommendations please list some course you've previously taken e.g. CSCE 121 </FormLabel>
            <CreatableSelect
              focusBorderColor='#660000'
              tagVariant='solid'
              colorScheme='gray'
              isMulti
              // onBlur={(event) => {
              //   console.log(event.target);
              // }}
              name='prevClasses'
            />
          </FormControl>
          <Stack spacing={10}>
            <Button
              type="submit"
              bg={'#660000'}
              color={'white'}
              _hover={{
                bg: 'red.600',
              }}
              width="full"
              mt={4}
              p={5}
              borderColor={'black'}
              borderWidth='thick'
              borderRadius={15}
            >
              Get Recommendations
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};

export default IndexPage
