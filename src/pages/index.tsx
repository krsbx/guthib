import FilterDrawer from '@/components/filters/drawer';
import InspectionModal from '@/components/inspection/modal';
import SearchContainer from '@/components/search/container';
import SearchError from '@/components/search/error';
import SearchInput from '@/components/search/input';
import { Box, Stack } from '@chakra-ui/react';

function App() {
  return (
    <Stack w={'vw'} h={'vh'}>
      <FilterDrawer />
      <SearchError />
      <SearchInput />
      <Box p={4} mt={14} pb={{ base: 10, md: 0 }}>
        <SearchContainer />
      </Box>
      <InspectionModal />
    </Stack>
  );
}

export default App;
