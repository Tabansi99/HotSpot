import { Search2Icon } from '@chakra-ui/icons';
import { Box, Button, CSSReset, Flex, FormControl, FormLabel, Input, InputGroup, InputLeftAddon, InputLeftElement, Select, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import Layout from '../components/Layout'

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

  function validateForm(event: React.SyntheticEvent) {

  }

  return (
    <Box>
      <form action='/api/recommendation' onSubmit={validateForm} method="post">
        <Stack>
          <FormControl id="major">
            <FormLabel>What's your major?</FormLabel>
            <InputGroup color={"#660000"} variant='unstyled'>
              <InputLeftAddon pointerEvents='none' children = {<Search2Icon />} />
              <p>&emsp;</p>
              <Select focusBorderColor="#660000" borderColor={'black'} name='transcript' variant='flushed' placeholder='Select Major' required>
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
              <Input focusBorderColor="#660000" _placeholder={{color: '#A17C73'}} borderColor={'black'} name='class' type="text" color={"#660000"} variant='flushed' placeholder='ex. CSCE 121' required />
            </InputGroup>
          </FormControl>
          <FormControl borderRadius={0} id="transcript">
            <FormLabel>Upload unofficial transcript</FormLabel>
            <Input name='major' type="file" variant='unstyled' p={2}placeholder='Select Major' required />
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
