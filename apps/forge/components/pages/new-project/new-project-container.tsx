'use client';

import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { gql, TypedDocumentNode } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { useAuth } from '@/shadcn/providers/auth-provider';
import { hasGraphQLError } from '@repo/commons/utils/graphql';
import { Company } from '@repo/commons/types/account-service-schema.type';
import { CreateProjectInput } from '@repo/commons/types/forge-service-schema.type';
import { ROUTE } from '@/root/libs/constants';

type ProjectForm = {
    name: string;
    background: string;
    problem: object | null;
    systemNeeds: object | null;
    references: string;
    expectedUsers: string;
    notes: object | null;
    companyIds: string[];
};

type NewProjectContextType = {
    form: ProjectForm;
    availableCompanies: Company[];
    isSubmitting: boolean;
    onChange: (field: keyof Omit<ProjectForm, 'companyIds'>, value: string | object | null) => void;
    onToggleCompany: (publicId: string) => void;
    onSubmit: () => void;
};

const NewProjectContext = createContext<NewProjectContextType | undefined>(undefined);

export function useNewProject() {
    const context = useContext(NewProjectContext);

    if (context === undefined) {
        throw new Error('useNewProject must be used within a NewProjectContainer');
    }

    return context;
}

interface CreateProjectResponse {
    createProjectForForge: { publicId: string };
}

interface CreateProjectVariables {
    input: CreateProjectInput;
}

const CREATE_PROJECT: TypedDocumentNode<CreateProjectResponse, CreateProjectVariables> = gql`
    mutation CreateProjectForForge($input: CreateProjectInput!) {
        createProjectForForge(input: $input) {
            publicId
        }
    }
`;

export default function NewProjectContainer({ children }: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter();
    const { authUser } = useAuth();

    const availableCompanies = (authUser?.companies ?? []) as Company[];

    const [form, setForm] = useState<ProjectForm>({
        name: '',
        background: '',
        problem: null,
        systemNeeds: null,
        references: '',
        expectedUsers: '',
        notes: null,
        companyIds: [],
    });

    const [createProject, { loading: isSubmitting }] = useMutation(CREATE_PROJECT);

    function onChange(field: keyof Omit<ProjectForm, 'companyIds'>, value: string | object | null) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    function onToggleCompany(publicId: string) {
        setForm((prev) => {
            const already = prev.companyIds.includes(publicId);

            return {
                ...prev,
                companyIds: already
                    ? prev.companyIds.filter((id) => id !== publicId)
                    : [...prev.companyIds, publicId],
            };
        });
    }

    async function onSubmit() {
        try {
            const { data, error } = await createProject({
                variables: {
                    input: {
                        name: form.name,
                        companyIds: form.companyIds,
                        background: form.background || undefined,
                        problem: form.problem,
                        systemNeeds: form.systemNeeds,
                        references: form.references || undefined,
                        expectedUsers: form.expectedUsers || undefined,
                        notes: form.notes || undefined,
                    },
                },
                errorPolicy: 'all',
            });

            if (hasGraphQLError(error)) {
                toast.error('Failed to create project. Please try again.', {
                    position: 'top-center',
                });
                return;
            }

            const publicId = data?.createProjectForForge.publicId;

            if (publicId) {
                router.push(ROUTE.FORGE.PROJECT_DETAIL(publicId));
            }
        } catch {
            toast.error('Network error occurred. Please check your connection.', {
                position: 'top-center',
            });
        }
    }

    return (
        <NewProjectContext.Provider
            value={{ form, availableCompanies, isSubmitting, onChange, onToggleCompany, onSubmit }}
        >
            {children}
        </NewProjectContext.Provider>
    );
}
