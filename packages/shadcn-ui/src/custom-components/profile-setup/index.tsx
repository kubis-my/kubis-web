"use client";

import { GalleryVerticalEnd, Loader2Icon } from "lucide-react";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../../components/field";
import { Input } from "../../components/input";
import { Button } from "../../components/button";
import { useCallback, useState } from "react";
import ShowErrorText from "../show-error-text";
import { toast } from "sonner";
import { hasGraphQLError } from "@repo/commons/utils/graphql";
import { convertErrorMessageListToObject } from "@repo/commons/utils/error-message";
import { gql, TypedDocumentNode } from "@apollo/client";
import { CompleteProfileInput, User } from "@repo/commons/types/account-service-schema.type";
import { useMutation } from "@apollo/client/react";

const COMPLETE_PROFILE: TypedDocumentNode<{ completeProfile: User }, { input: CompleteProfileInput }> = gql`
    mutation CompleteProfile($input: CompleteProfileInput!) {
        completeProfile(input: $input) {
            publicId
            firstName
            lastName
            nickname
            displayName
            profilePicture
            bod
            gender
            createdAt
            updatedAt
            companies {
                publicId
                name
                registrationNo
                isUnclassified
                logo
            }
        }
    }
`

interface ProfileSetupProps {
  onSuccess: (user: User) => void;
}

export default function ProfileSetup({ onSuccess }: ProfileSetupProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nickname, setNickname] = useState("");
  const [formValidation, setFormValidation] = useState<Record<string, string[]>>({});

  const [completeProfile, { loading }] = useMutation(COMPLETE_PROFILE);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setFormValidation({});

    try {
      const input: CompleteProfileInput = {
        firstName,
        lastName,
        nickname,
      };

      const { data, error } = await completeProfile({
        variables: { input },
        errorPolicy: "all",
      });

      if (hasGraphQLError(error)) {
        const gqlError = (error.errors?.[0] || error.graphQLErrors?.[0]);

        if (gqlError) {
          const err = gqlError.extensions?.originalError as Record<string, any> | undefined;

          if (err?.statusCode === 400 && Array.isArray(err?.message)) {
            setFormValidation(convertErrorMessageListToObject(Object.keys(input), err.message))

            return;
          }
        }
      }

      if (data) {
        onSuccess(data.completeProfile);
        toast.success("Profile setup completed successfully!", {
          position: "top-center"
        });

        return;
      }

      toast.error(
        "An unexpected error occurred. Please try again.",
        {
          position: "top-center",
        }
      );
    } catch (error) {
      toast.error(
        "Network error occurred. Please check your connection.",
        {
          position: "top-center",
        }
      );
    }
  }, [firstName, lastName, nickname, completeProfile, onSuccess]);

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <a
                  href="#"
                  className="flex flex-col items-center gap-2 font-medium"
                >
                  <div className="flex size-8 items-center justify-center rounded-md">
                    <GalleryVerticalEnd className="size-6" />
                  </div>
                  <span className="sr-only">Kubis</span>
                </a>
                <h1 className="text-xl font-bold">Welcome to Kubis</h1>
                <FieldDescription>
                  Complete your profile to continue
                </FieldDescription>
              </div>
              <Field>
                <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={loading}
                />
                <ShowErrorText error={formValidation} field="firstName" />
              </Field>
              <Field>
                <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={loading}
                />
                <ShowErrorText error={formValidation} field="lastName" />
              </Field>
              <Field>
                <FieldLabel htmlFor="nickname">Nickname</FieldLabel>
                <Input
                  id="nickname"
                  type="text"
                  placeholder="johndoe"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  disabled={loading}
                />
                <ShowErrorText error={formValidation} field="nickname" />
              </Field>
              <Field>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {
                    !loading
                      ? "Complete Profile"
                      : (
                        <>
                          <Loader2Icon className="animate-spin" />
                          Please wait
                        </>
                      )
                  }
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </div>
      </div>
    </div>
  );
}
