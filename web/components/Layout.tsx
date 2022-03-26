import React from 'react'
import { VStack } from '@chakra-ui/react'

const Layout: React.FC = ({ children }) => {
  return (
    <VStack background={'blackAlpha.200'} alignItems="stretch" w="100%" marginX="auto">
      {children}
    </VStack>
  );
};

export default Layout
