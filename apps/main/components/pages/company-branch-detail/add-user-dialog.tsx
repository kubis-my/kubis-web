'use client';

import { Button } from '@repo/shadcn-ui/components/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@repo/shadcn-ui/components/dialog';
import { Input } from '@repo/shadcn-ui/components/input';
import { Label } from '@repo/shadcn-ui/components/label';
import { IconPlus, IconCheck } from '@tabler/icons-react';
import { Loader2Icon, SearchIcon } from 'lucide-react';
import { useCallback, useState, useEffect, useRef } from 'react';
import { useCompanyBranchDetail } from './company-branch-detail-container';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/shadcn/components/input-group';
import { Avatar, AvatarFallback, AvatarImage } from '@/shadcn/components/avatar';
import { cn } from '@repo/shadcn-ui/lib/utils';
import { gql, TypedDocumentNode } from '@apollo/client';
import { useLazyQuery, useMutation, useApolloClient } from '@apollo/client/react';
import {
    User,
    SearchCredentialsForBranchInput,
    CreateUserAccountInput,
    UserAccount,
} from '@repo/commons/types/account-service-schema.type';
import { toast } from 'sonner';
import { hasGraphQLError } from '@repo/commons/utils/graphql';

const SEARCH_CREDENTIALS_FOR_BRANCH: TypedDocumentNode<
    { searchCredentialsForBranch: User[] },
    { input: SearchCredentialsForBranchInput }
> = gql`
    query SearchCredentialsForBranch($input: SearchCredentialsForBranchInput!) {
        searchCredentialsForBranch(input: $input) {
            publicId
            firstName
            lastName
            nickname
            displayName
            profilePicture
            credential {
                publicId
            }
        }
    }
`;

const CREATE_USER_ACCOUNTS: TypedDocumentNode<
    { createUserAccounts: UserAccount[] },
    { input: CreateUserAccountInput }
> = gql`
    mutation CreateUserAccounts($input: CreateUserAccountInput!) {
        createUserAccounts(input: $input) {
            publicId
            status
            joinedAt
        }
    }
`;

interface SelectedUser {
    publicId: string;
    displayName: string;
    profilePicture?: string | null;
}

export default function AddUserDialog() {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchedEmail, setSearchedEmail] = useState('');
    const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);
    const [position, setPosition] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const ctx = useCompanyBranchDetail();
    const client = useApolloClient();

    const [searchCredentials, { loading: isSearching, data: searchData }] = useLazyQuery(
        SEARCH_CREDENTIALS_FOR_BRANCH,
        {
            fetchPolicy: 'network-only',
        },
    );

    useEffect(() => {
        if (searchData?.searchCredentialsForBranch) {
            setSearchResults(searchData.searchCredentialsForBranch);
        }
    }, [searchData]);

    const [createUserAccounts, { loading: isCreating }] = useMutation(CREATE_USER_ACCOUNTS);

    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (!searchQuery.trim() || !ctx.branch?.publicId) {
            setSearchResults([]);
            setSearchedEmail('');
            return;
        }

        debounceRef.current = setTimeout(() => {
            setSearchedEmail(searchQuery.trim());
            searchCredentials({
                variables: {
                    input: {
                        branchPublicId: ctx.branch?.publicId ?? '',
                        email: searchQuery.trim(),
                    },
                },
            });
        }, 300);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [searchQuery, ctx.branch?.publicId, searchCredentials]);

    const selectUser = (user: User) => {
        setSelectedUser({
            publicId: user.publicId,
            displayName:
                user.displayName ||
                `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() ||
                'User',
            profilePicture: user.profilePicture,
        });
        setSearchQuery('');
        setSearchResults([]);
    };

    const clearSelection = () => {
        setSelectedUser(null);
        setPosition('');
    };

    const resetForm = useCallback(() => {
        setSearchQuery('');
        setSearchedEmail('');
        setSelectedUser(null);
        setPosition('');
        setSearchResults([]);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser || !position.trim() || !ctx.branch?.publicId) return;

        try {
            const { data, error } = await createUserAccounts({
                variables: {
                    input: {
                        accounts: [
                            {
                                branchPublicId: ctx.branch.publicId,
                                userPublicId: selectedUser.publicId,
                                position: position.trim(),
                            },
                        ],
                    },
                },
                errorPolicy: 'all',
            });

            if (hasGraphQLError(error)) {
                const gqlError = error.errors?.[0] || error.graphQLErrors?.[0];

                if (gqlError) {
                    const err = gqlError.extensions?.originalError as
                        | Record<string, unknown>
                        | undefined;

                    if (err?.statusCode === 409) {
                        toast.error('This user is already added to the branch.', {
                            position: 'top-center',
                        });
                        return;
                    }
                }

                toast.error('Failed to add user. Please try again.', {
                    position: 'top-center',
                });
                return;
            }

            if (data) {
                client.refetchQueries({ include: 'active' });
                toast.success('User added successfully!', {
                    position: 'top-center',
                });
                resetForm();
                setOpen(false);
            }
        } catch {
            toast.error('Network error occurred. Please check your connection.', {
                position: 'top-center',
            });
        }
    };

    const getInitials = (name: string) => {
        if (!name) return 'U';
        const parts = name.split(' ');
        if (parts.length >= 2 && parts[0]?.[0] && parts[1]?.[0]) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const getDisplayName = (user: User) => {
        return (
            user.displayName || `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'User'
        );
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                setOpen(value);
                if (!value) resetForm();
            }}
        >
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <IconPlus />
                    <span className="hidden lg:inline">Add User</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="text-center">
                        <DialogTitle>Add people to {ctx.branch?.code.slice(0, 8)}</DialogTitle>
                        <DialogDescription>Search by email address</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {selectedUser ? (
                            <div className="border-border bg-muted/30 flex items-center gap-3 rounded-lg border p-3">
                                <Avatar className="size-10 rounded-full">
                                    <AvatarImage
                                        src={selectedUser.profilePicture ?? undefined}
                                        alt={selectedUser.displayName}
                                    />
                                    <AvatarFallback className="bg-muted rounded-full">
                                        {getInitials(selectedUser.displayName)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex min-w-0 flex-1 flex-col">
                                    <span className="truncate text-sm font-semibold">
                                        {selectedUser.displayName}
                                    </span>
                                    <span className="text-muted-foreground text-xs">
                                        Selected user
                                    </span>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearSelection}
                                    disabled={isCreating}
                                >
                                    Change
                                </Button>
                            </div>
                        ) : (
                            <>
                                <InputGroup>
                                    <InputGroupAddon>
                                        {isSearching ? (
                                            <Loader2Icon className="animate-spin" />
                                        ) : (
                                            <SearchIcon />
                                        )}
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        placeholder="Enter email address..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        autoComplete="off"
                                    />
                                </InputGroup>

                                <div className="border-border flex max-h-[250px] w-full flex-col overflow-y-auto rounded-lg border">
                                    {searchQuery.trim() === '' ? (
                                        <div className="text-muted-foreground flex h-[150px] items-center justify-center text-sm">
                                            Enter an email to search for users
                                        </div>
                                    ) : isSearching ? (
                                        <div className="text-muted-foreground flex h-[150px] items-center justify-center text-sm">
                                            <Loader2Icon className="mr-2 size-4 animate-spin" />
                                            Searching...
                                        </div>
                                    ) : searchResults.length === 0 ? (
                                        <div className="text-muted-foreground flex h-[150px] items-center justify-center text-sm">
                                            No users found matching &quot;{searchedEmail}&quot;
                                        </div>
                                    ) : (
                                        searchResults.map((user) => (
                                            <button
                                                key={user.publicId}
                                                type="button"
                                                onClick={() => selectUser(user)}
                                                className={cn(
                                                    'flex w-full items-center gap-3 p-3 text-left transition-colors',
                                                    'hover:bg-muted/50 focus:bg-muted/50 focus:outline-none',
                                                    'border-border border-b last:border-b-0',
                                                )}
                                            >
                                                <Avatar className="size-10 rounded-full">
                                                    <AvatarImage
                                                        src={user.profilePicture ?? undefined}
                                                        alt={getDisplayName(user)}
                                                    />
                                                    <AvatarFallback className="bg-muted rounded-full">
                                                        {getInitials(getDisplayName(user))}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex min-w-0 flex-1 flex-col">
                                                    <span className="truncate text-sm font-semibold">
                                                        {getDisplayName(user)}
                                                    </span>
                                                    <span className="text-muted-foreground truncate text-sm">
                                                        {user.nickname ?? 'Add user'}
                                                    </span>
                                                </div>
                                                <IconCheck className="group-hover:text-muted-foreground size-5 shrink-0 text-transparent" />
                                            </button>
                                        ))
                                    )}
                                </div>
                            </>
                        )}

                        {selectedUser && (
                            <div className="grid gap-2">
                                <Label htmlFor="position">Position</Label>
                                <Input
                                    id="position"
                                    placeholder="e.g. Manager, Developer, etc."
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}
                                    disabled={isCreating}
                                    autoComplete="off"
                                />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={isCreating}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={!selectedUser || !position.trim() || isCreating}
                        >
                            {isCreating ? (
                                <>
                                    <Loader2Icon className="animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                'Add to branch'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
