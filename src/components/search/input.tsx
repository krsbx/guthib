import { useGithub } from '@/hooks/useGithub/index';
import { useGlobalStore } from '@/store/globals';
import { useSearchStore } from '@/store/search';
import { searchSchema, type SearchSchema } from '@/utils/validations';
import { Button, Field, Icon, Input, Stack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { FaFilter, FaMoon, FaSearch } from 'react-icons/fa';
import { MdOutlineWbSunny } from 'react-icons/md';
import { useShallow } from 'zustand/shallow';
import { useColorMode } from '../ui/color-mode';
import { Form } from '../ui/form';

function SearchInput() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { searchByUsernames } = useGithub();
  const { isFetching, toggleFilter } = useGlobalStore(
    useShallow((state) => ({
      isFetching: state.isSearching,
      toggleFilter: state.toggleFilter,
    }))
  );
  const { filters, setFilter } = useSearchStore(
    useShallow((state) => ({
      filters: state.filters,
      setFilter: state.setFilter,
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

      // Set the page to 1
      setFilter('page', 1);

      await searchByUsernames({
        username: values.username,
        filters: {
          ...filters,
          page: 1,
        },
        append: false,
        managed: true,
      });
    },
    [isFetching, searchByUsernames, filters, setFilter]
  );

  return (
    <Form
      pos={'fixed'}
      w={'vw'}
      onSubmit={handleSubmit(onSubmit)}
      zIndex={10}
      bg={colorMode === 'light' ? 'white' : 'black'}
      p={4}
    >
      <Stack direction={'row'}>
        <Field.Root invalid={!!formState.errors?.username?.message}>
          <Input
            variant={colorMode === 'light' ? 'outline' : 'subtle'}
            placeholder="Enter username"
            {...register('username')}
          />
          <Field.ErrorText>
            {formState.errors?.username?.message ?? ''}
          </Field.ErrorText>
        </Field.Root>
        <Button
          onClick={toggleColorMode}
          variant={'surface'}
          fontWeight={'bold'}
          type="button"
          px={1}
        >
          {colorMode === 'light' ? <MdOutlineWbSunny /> : <FaMoon />}
        </Button>
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
