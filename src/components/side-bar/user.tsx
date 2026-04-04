import { Show, SignInButton, SignOutButton, UserAvatar } from "@clerk/nextjs";
import { User2Icon } from "lucide-react";

function Container({ children }: React.PropsWithChildren) {
  return (
    <div className="flex flex-row items-center-safe">
      {children}
    </div>
  );
}

function Text({ children }: React.PropsWithChildren) {
  return <p className="text-sm">{children}</p>;
}

export function User() {
  return (
    <Show
      when="signed-in"
      fallback={
        <Container>
          <div className="p-3">
            <User2Icon className="text-white block size-6" />
          </div>
          <div className="flex flex-col">
            <Text>Guest</Text>
            <SignInButton>
              <button className="hover:underline" type="button">
                <Text>
                  <em className="underline">Sign in</em> for full access
                </Text>
              </button>
            </SignInButton>
          </div>
        </Container>
      }
    >
      <Container>
        <UserAvatar />
        <div className="flex flex-col">
          <Text>Session active</Text>
          <SignOutButton>
            <Text>
              <em className="text-red-400">Sign out</em>
            </Text>
          </SignOutButton>
        </div>
      </Container>
    </Show>
  );
}
