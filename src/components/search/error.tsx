import { useGlobalStore } from '@/store/globals';
import { Button, CloseButton, Dialog, Text } from '@chakra-ui/react';
import { useShallow } from 'zustand/shallow';

function SearchError() {
  const { isError, setIsError, error } = useGlobalStore(
    useShallow((state) => ({
      isError: state.isError,
      setIsError: state.setIsError,
      error: state.error,
    }))
  );

  return (
    <Dialog.Root
      open={isError}
      onOpenChange={(e) => setIsError(e.open)}
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
            <Text>{error}</Text>
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
