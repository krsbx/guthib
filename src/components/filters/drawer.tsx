import { useSearchStore } from '@/store/search';
import {
  ORDER_BY_OPTIONS,
  OrderBy,
  REPO_TYPE_OPTIONS,
  RepoType,
  SORT_BY_OPTIONS,
  SortBy,
} from '@/utils/constants';
import { filterSchema } from '@/utils/validations';
import {
  Button,
  CloseButton,
  Drawer,
  Field,
  Input,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useShallow } from 'zustand/shallow';
import { useForm } from 'react-hook-form';
import { useColorMode } from '../ui/color-mode';
import { useGlobalStore } from '@/store/globals';
import { useReposStore } from '@/store/repos';

function FilterDrawer() {
  const { colorMode } = useColorMode();
  const { isFiltering, toggleFilter } = useGlobalStore(
    useShallow((state) => ({
      isFiltering: state.isFilterOpen,
      toggleFilter: state.toggleFilter,
    }))
  );
  const { userFilters, resetUserFilters, setUserFilter } = useSearchStore(
    useShallow((state) => ({
      userFilters: state.filters,
      resetUserFilters: state.resetFilters,
      setUserFilter: state.setFilter,
    }))
  );
  const { repoFilters, resetRepoFilters, setRepoFilter } = useReposStore(
    useShallow((state) => ({
      repoFilters: state.filters,
      resetRepoFilters: state.resetFilters,
      setRepoFilter: state.setFilter,
    }))
  );
  const { register, formState, getValues } = useForm({
    defaultValues: {
      maxPerPage: (userFilters.maxPerPage || repoFilters.maxPerPage).toString(),
    },
    mode: 'onBlur',
    resolver: zodResolver(filterSchema),
  });

  const onCancel = useCallback(() => {
    resetUserFilters();
    resetRepoFilters();
    toggleFilter();
  }, [resetUserFilters, resetRepoFilters, toggleFilter]);

  const onSave = useCallback(() => {
    const currentMaxPerPage = userFilters.maxPerPage || repoFilters.maxPerPage;
    const newMaxPerPage = parseInt(getValues('maxPerPage'), 10);

    if (!Number.isNaN(newMaxPerPage) && currentMaxPerPage !== newMaxPerPage) {
      setUserFilter('maxPerPage', newMaxPerPage);
      setRepoFilter('maxPerPage', newMaxPerPage);
    }

    toggleFilter();
  }, [
    getValues,
    repoFilters.maxPerPage,
    setRepoFilter,
    setUserFilter,
    toggleFilter,
    userFilters.maxPerPage,
  ]);

  return (
    <Drawer.Root
      open={isFiltering}
      closeOnEscape
      closeOnInteractOutside
      onOpenChange={toggleFilter}
    >
      <Drawer.Backdrop />
      <Drawer.Trigger />
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.CloseTrigger />
          <Drawer.Header>
            <Drawer.Title>Filters</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <Stack pl={2} gap={4}>
              <Stack gap={2}>
                <Text fontWeight={'bold'} fontSize={'sm'}>
                  Sort By
                </Text>
                <RadioGroup.Root
                  value={userFilters.sortBy}
                  /* v8 ignore start */
                  onValueChange={(e) =>
                    setUserFilter(
                      'sortBy',
                      (e.value || SortBy.BEST_MATCH) as SortBy
                    )
                  }
                  /* v8 ignore stop */
                >
                  <Stack pl={2}>
                    {SORT_BY_OPTIONS.map((item) => (
                      <RadioGroup.Item
                        key={item.value}
                        /* v8 ignore start */
                        value={item.value || ''}
                        /* v8 ignore stop */ _hover={{
                          cursor: 'pointer',
                        }}
                      >
                        <RadioGroup.ItemHiddenInput />
                        <RadioGroup.ItemIndicator />
                        <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
                      </RadioGroup.Item>
                    ))}
                  </Stack>
                </RadioGroup.Root>
              </Stack>
              <Stack gap={2}>
                <Text fontWeight={'bold'} fontSize={'sm'}>
                  Order User By
                </Text>
                <RadioGroup.Root
                  value={userFilters.orderBy}
                  /* v8 ignore start */
                  onValueChange={(e) =>
                    setUserFilter(
                      'orderBy',
                      (e.value || OrderBy.DESC) as OrderBy
                    )
                  }
                  /* v8 ignore stop */
                >
                  <Stack pl={2}>
                    {ORDER_BY_OPTIONS.map((item) => (
                      <RadioGroup.Item
                        key={item.value}
                        /* v8 ignore start */
                        value={item.value || ''}
                        /* v8 ignore stop */ _hover={{
                          cursor: 'pointer',
                        }}
                      >
                        <RadioGroup.ItemHiddenInput />
                        <RadioGroup.ItemIndicator />
                        <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
                      </RadioGroup.Item>
                    ))}
                  </Stack>
                </RadioGroup.Root>
              </Stack>
              <Stack gap={2}>
                <Text fontWeight={'bold'} fontSize={'sm'}>
                  User Repository Type
                </Text>
                <RadioGroup.Root
                  value={repoFilters.type}
                  /* v8 ignore start */
                  onValueChange={(e) =>
                    setRepoFilter('type', (e.value || RepoType.ALL) as RepoType)
                  }
                  /* v8 ignore stop */
                >
                  <Stack pl={2}>
                    {REPO_TYPE_OPTIONS.map((item) => (
                      <RadioGroup.Item
                        key={item.value}
                        /* v8 ignore start */
                        value={item.value || ''}
                        /* v8 ignore stop */
                        _hover={{
                          cursor: 'pointer',
                        }}
                      >
                        <RadioGroup.ItemHiddenInput />
                        <RadioGroup.ItemIndicator />
                        <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
                      </RadioGroup.Item>
                    ))}
                  </Stack>
                </RadioGroup.Root>
              </Stack>
              <Stack gap={2}>
                <Text fontWeight={'bold'} fontSize={'sm'}>
                  Max Items
                </Text>
                <Field.Root invalid={!!formState.errors?.maxPerPage?.message}>
                  <Input
                    variant={colorMode === 'light' ? 'outline' : 'subtle'}
                    placeholder="Enter max items to show"
                    type="number"
                    {...register('maxPerPage')}
                  />
                  <Field.ErrorText>
                    {formState.errors?.maxPerPage?.message}
                  </Field.ErrorText>
                </Field.Root>
              </Stack>
              <Stack px={2}></Stack>
            </Stack>
          </Drawer.Body>
          <Drawer.Footer>
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="button" onClick={onSave}>
              Save
            </Button>
          </Drawer.Footer>
          <Drawer.CloseTrigger asChild>
            <CloseButton size="sm" />
          </Drawer.CloseTrigger>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
}

export default FilterDrawer;
