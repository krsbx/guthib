import { useSearchStore } from '@/store/search';
import { Github } from '@/utils/github';
import { searchSchema, type SearchSchema } from '@/utils/validations';
import { Button, Field, Icon, Input, Stack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { FaFilter, FaSearch } from 'react-icons/fa';
import { Form } from '../ui/form';
import { SortBy } from '@/utils/constants';
import { RequestError } from 'octokit';
import { useShallow } from 'zustand/shallow';
import { useGlobalStore } from '@/store/globals';

function SearchInput() {
  const { isFetching, setIsFetching, setError, setIsError } = useGlobalStore(
    useShallow((state) => ({
      isFetching: state.isSearching,
      setIsFetching: state.setIsSearching,
      setIsError: state.setIsError,
      setError: state.setError,
    }))
  );
  const { toggleFilter, filters, setUsers, setUsername } = useSearchStore(
    useShallow((state) => ({
      isFiltering: state.isFilterOpen,
      toggleFilter: state.toggleFilter,
      filters: state.filters,
      setUsers: state.setUsers,
      setUsername: state.setUsername,
    }))
  );
  const { register, handleSubmit, formState } = useForm<SearchSchema>({
    defaultValues: {
      username: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(searchSchema),
  });

  const onSubmit = useCallback(
    async (values: SearchSchema) => {
      // Prevent multiple requests
      /* v8 ignore start */
      if (isFetching) return;
      /* v8 ignore stop */

      setIsFetching(true);

      const response = await Github.findUsers(values.username, {
        order: filters.orderBy,
        page: filters.page,
        per_page: filters.maxPerPage,
        /* v8 ignore start */
        sort: filters.sortBy === SortBy.BEST_MATCH ? undefined : filters.sortBy,
        /* v8 ignore stop */
      });

      if (response.isSuccess) {
        setUsername(values.username);
        setUsers(response.data.items);
      } else {
        setIsError(true);

        if (response.error instanceof RequestError) {
          setError(response.error.message);
        } else if (response.error instanceof Error) {
          setError(response.error.message);
        } else {
          setError('Something went wrong');
        }
      }

      setIsFetching(false);
    },
    [
      isFetching,
      setIsFetching,
      filters.orderBy,
      filters.page,
      filters.maxPerPage,
      filters.sortBy,
      setUsername,
      setUsers,
      setIsError,
      setError,
    ]
  );

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction={'row'}>
        <Field.Root invalid={!!formState.errors?.username?.message}>
          <Input placeholder="Enter username" {...register('username')} />
          <Field.ErrorText>
            {formState.errors?.username?.message ?? ''}
          </Field.ErrorText>
        </Field.Root>
        <Button
          onClick={toggleFilter}
          variant={'surface'}
          fontWeight={'bold'}
          type="button"
          px={1}
        >
          <Icon size={'sm'}>
            <FaFilter />
          </Icon>
        </Button>
        <Button variant={'surface'} fontWeight={'bold'} type="submit" px={1}>
          <Icon size={'sm'}>
            <FaSearch />
          </Icon>
        </Button>
      </Stack>
    </Form>
  );
}

export default SearchInput;
