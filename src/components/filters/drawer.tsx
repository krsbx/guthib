import { useSearchStore } from '@/store/search';
import {
  ORDER_BY_OPTIONS,
  OrderBy,
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

function FilterDrawer() {
  const { isFiltering, toggleFilter, filters, resetFilters, setFilter } =
    useSearchStore(
      useShallow((state) => ({
        isFiltering: state.isFilterOpen,
        toggleFilter: state.toggleFilter,
        filters: state.filters,
        resetFilters: state.resetFilters,
        setFilter: state.setFilter,
      }))
    );
  const { register, formState, getValues } = useForm({
    defaultValues: {
      maxPerPage: filters.maxPerPage.toString(),
    },
    mode: 'onBlur',
    resolver: zodResolver(filterSchema),
  });

  const onCancel = useCallback(() => {
    resetFilters();
    toggleFilter();
  }, [resetFilters, toggleFilter]);

  const onSave = useCallback(() => {
    const currentMaxPerPage = filters.maxPerPage;
    const newMaxPerPage = parseInt(getValues('maxPerPage'), 10);

    if (!Number.isNaN(newMaxPerPage) && currentMaxPerPage !== newMaxPerPage) {
      setFilter('maxPerPage', newMaxPerPage);
    }

    toggleFilter();
  }, [filters.maxPerPage, getValues, setFilter, toggleFilter]);

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
                  value={filters.sortBy}
                  onValueChange={(e) =>
                    setFilter(
                      'sortBy',
                      (e.value || SortBy.BEST_MATCH) as SortBy
                    )
                  }
                >
                  <Stack pl={2}>
                    {SORT_BY_OPTIONS.map((item) => (
                      <RadioGroup.Item
                        key={item.value}
                        value={item.value || ''}
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
                  Order By
                </Text>
                <RadioGroup.Root
                  value={filters.orderBy}
                  onValueChange={(e) =>
                    setFilter('orderBy', (e.value || OrderBy.DESC) as OrderBy)
                  }
                >
                  <Stack pl={2}>
                    {ORDER_BY_OPTIONS.map((item) => (
                      <RadioGroup.Item
                        key={item.value}
                        value={item.value || ''}
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
                    variant={'outline'}
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
