import { useSearchStore } from '@/store/search';
import { Button, CloseButton, Dialog, Text } from '@chakra-ui/react';

function SearchError() {
  const { isSearchError, setIsSearchError, searchError } = useSearchStore();

  return (
    <Dialog.Root
      open={isSearchError}
      onOpenChange={(e) => setIsSearchError(e.open)}
      closeOnEscape
      closeOnInteractOutside
      placement={'center'}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Error</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Text>{searchError}</Text>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.ActionTrigger asChild>
              <Button>Close</Button>
            </Dialog.ActionTrigger>
          </Dialog.Footer>
          <Dialog.CloseTrigger asChild>
            <CloseButton size="sm" />
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}

export default SearchError;
