import FilterDrawer from '@/components/filters/drawer';
import InspectionModal from '@/components/inspection/modal';
import SearchContainer from '@/components/search/container';
import SearchError from '@/components/search/error';
import SearchInput from '@/components/search/input';
import { Stack } from '@chakra-ui/react';

function App() {
  return (
    <Stack p={4} w={'vw'} h={'vh'}>
      <FilterDrawer />
      <SearchError />
      <SearchInput />
      <SearchContainer />
      <InspectionModal />
    </Stack>
  );
}

export default App;
