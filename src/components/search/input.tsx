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

function SearchInput() {
  const {
    isFilterOpen,
    toggleFilter,
    isSearching,
    setIsSearching,
    filters,
    setUsers,
    setIsSearchError,
    setSearchError,
  } = useSearchStore();
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
      if (isSearching) return;

      setIsSearching(true);

      const response = await Github.findUsers(values.username, {
        order: filters.orderBy,
        page: filters.page,
        per_page: filters.maxPerPage,
        sort: filters.sortBy === SortBy.BEST_MATCH ? undefined : filters.sortBy,
      });

      if (response.isSuccess) {
        setUsers(response.data.items);
      } else {
        setIsSearchError(true);

        if (response.error instanceof RequestError) {
          setSearchError(response.error.message);
        } else if (response.error instanceof Error) {
          setSearchError(response.error.message);
        } else {
          setSearchError('Something went wrong');
        }
      }

      setIsSearching(false);
    },
    [
      isSearching,
      setIsSearching,
      filters,
      setUsers,
      setIsSearchError,
      setSearchError,
    ]
  );

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction={'row'}>
        <Field.Root invalid={!!formState.errors?.username?.message}>
          <Input
            variant={'outline'}
            placeholder="Enter username"
            {...register('username')}
          />
          <Field.ErrorText>Username is required</Field.ErrorText>
        </Field.Root>
        <Button
          onClick={toggleFilter}
          variant={'surface'}
          color={'gray.500'}
          fontWeight={'bold'}
          bg={isFilterOpen ? 'gray.300' : 'whiteAlpha.300'}
          type="button"
          px={1}
        >
          <Icon size={'sm'}>
            <FaFilter />
          </Icon>
        </Button>
        <Button
          variant={'surface'}
          color={'gray.500'}
          fontWeight={'bold'}
          bg={'whiteAlpha.300'}
          type="submit"
          px={1}
        >
          <Icon size={'sm'}>
            <FaSearch />
          </Icon>
        </Button>
      </Stack>
    </Form>
  );
}

export default SearchInput;
