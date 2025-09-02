import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box, Button, CircularProgress, Container, IconButton, Typography
} from "@mui/material";
import { Delete, Edit } from '@mui/icons-material';
import UserCreateDialog from './UserCreateDialog';
import UserUpdateDialog from './UserUpdateDialog';
import UserDetailsDialog from './UserDetailsDialog';
import ConfirmDialog from '../shared/ConfirmDialog';
import SearchInput from '../shared/SearchInput';
import IntersectionTrigger from '../shared/IntersectionTrigger';
import { CreateUserInput, UpdateUserInput, useCreateUserMutation, useDeleteUserMutation, useGetUsersQuery, useUpdateUserMutation } from '../../__generated__/graphql';
import toast, { Toaster } from 'react-hot-toast';

function UserList() {
  const [limit] = useState(10);
  const [search, setSearch] = useState<string>("");
  const [hasMore, setHasMore] = useState(false); 

  const { data, previousData, loading, fetchMore } = useGetUsersQuery({
    variables: {
      limit,
      filter: {
        search
      }
    },
  });
  const refetchAllUsers = () => {
    if(loading) return;

    fetchMore({
      variables: {
        limit: data?.users?.length,
      },
      updateQuery: (_, { variables, fetchMoreResult })  => {
        if (fetchMoreResult.users) {
          setHasMore(fetchMoreResult.users.length == variables.limit);
        }
        return fetchMoreResult;
      }
    });
  }

  useEffect(() => {
    const loaded = data?.users?.length || 0;
    if(loaded == limit){
      setHasMore(true);
    } else if (loaded < limit){
      setHasMore(false);
    }
  }, [data])
  const loadMore = () => {
    if(loading || !hasMore) return;
    fetchMore({ 
      variables: {
        skip: data?.users?.length,
      },
      updateQuery: (prev, { variables, fetchMoreResult: more }) => {
        if(more.users){
          setHasMore(more.users.length == variables.limit);
        }
        more.users = [
          ...(prev.users || []), 
          ...(more.users || [])
        ];
        return more;
      }
    });
  }

  const [createUserMutation] = useCreateUserMutation({
    onCompleted: (data) => {
      toast.success(`User ${data.createUser.name} successfuly created` ),
      refetchAllUsers();
    },
    onError: (error) => toast.error(error.message),
  });
  const [updateUserMutation] = useUpdateUserMutation({
    onCompleted: (data) => {
      toast.success(`User ${data.updateUser.name} successfuly updated` );
      refetchAllUsers();
    },
    onError: (error) => toast.error(error.message),
  });
  const [deleteUserMutation] = useDeleteUserMutation({
    onCompleted: (data) => {
      toast.success(`User ${data.deleteUser.name} successfuly deleted` );
      refetchAllUsers();
    },
    onError: (error) => toast.error(error.message),
  });

  const [modalState, setModalState] = useState<{ type: string, userId?: string }>({ type: 'none' });
  const closeModal = () => setModalState({ type: 'none' });

  const createUser = (input: CreateUserInput) => createUserMutation({ variables: { input } }).then(closeModal);
  const updateUser = (id: string, input: UpdateUserInput) => updateUserMutation({ variables: { id, input } }).then(closeModal);
  const deleteUser = (id: string) => deleteUserMutation({ variables: { id }}).then(closeModal);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>  
        USERS
      </Typography>

      <Box sx={{ my: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" color="primary" onClick={() => setModalState({ type: "create" })}>
          Add User
        </Button>
        <SearchInput onSubmit={setSearch}/>
      </Box>

      {
        !data && loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        )
      }

      {
        data && data.users!.length == 0 && (
          <Typography>Users not found</Typography>
        )
      }

      {
        data && data.users!.length > 0 && (
            <TableContainer component={Paper} sx={{ my: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'center', width: 20 }}>#</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell sx={{ textAlign: 'center', width: 120 }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(data || previousData)?.users?.map((user, index) => (
                    <TableRow key={user!.id} hover onClick={() => setModalState({ type: 'details', userId: user!.id })}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell sx={{ textAlign: 'center' }}>{index + 1}</TableCell>
                      <TableCell>{user!.name}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <IconButton onClick={(e) => { e.stopPropagation(); setModalState({ type: 'update', userId: user!.id })}}>
                          <Edit/>
                        </IconButton>
                        <IconButton onClick={(e) => { e.stopPropagation(); setModalState({ type: 'delete', userId: user!.id })}}>
                          <Delete/>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <IntersectionTrigger enabled={hasMore && !loading} onIntersecting={loadMore}/>
            </TableContainer>
          )
        }

      <UserCreateDialog
        open={modalState.type == 'create'}
        onSubmit={createUser}
        onClose={closeModal}
      />

      <UserDetailsDialog
        open={modalState.type == 'details'}
        userId={modalState.userId!}
        onClose={closeModal}
      />

      <UserUpdateDialog
        open={modalState.type == 'update'}
        userId={modalState.userId!}
        onSubmit={(input) => updateUser(modalState.userId!, input)}
        onClose={closeModal}
      />

      <ConfirmDialog
        open={modalState.type == 'delete'}
        title="DELETE USER"
        message="Are you sure you want to delete this user?"
        confirmText="Delete"
        onConfirm={() => deleteUser(modalState.userId!)}
        onCancel={closeModal}
      />

      <Toaster position="bottom-center" />
    </Container>
  )
}

export default UserList
