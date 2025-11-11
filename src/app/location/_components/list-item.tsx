import Link, { type LinkProps } from "next/link";
import { PropsWithChildren } from "react";

function Container({ children }: PropsWithChildren) {
  return <li className="px-6 py-2 my-3 flex flex-col gap-2">{children}</li>;
}

function Title(props: PropsWithChildren<LinkProps>) {
  return <Link className="text-lg text-ellipsis overflow-hidden hover:text-blue-300 hover:underline" {...props} />;
}

function TitleSkeleton() {
  return (
    <p className="w-max bg-neutral-400 text-neutral-400 text-lg rounded animate-pulse">
      LOADING
    </p>
  );
}

function Description({ children }: PropsWithChildren) {
  return (
    <p className="text-white/67 text-ellipsis overflow-hidden">{children}</p>
  );
}

function DescriptionSkeleton() {
  return (
    <p className="w-max bg-neutral-400 text-neutral-400 rounded animate-pulse">
      LOADING
    </p>
  );
}

function TagContainer({ children }: PropsWithChildren) {
  return <aside className="flex flex-row items-center gap-2">{children}</aside>;
}

function Tag({ children }: PropsWithChildren) {
  return <p className="text-sm">{children}</p>;
}

function TagSkeleton() {
  return (
    <p className="text-sm bg-neutral-400 text-neutral-400 rounded animate-pulse">
      LOADING
    </p>
  );
}

export function ListItem({
  description,
  href,
  title,
  tags,
}: {
  href: string;
  title: string;
  description: string;
  tags?: string[];
}) {
  return (
    <Container>
      <Title href={href}>{title}</Title>
      <Description>{description}</Description>
      {!!tags && (
        <TagContainer>
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </TagContainer>
      )}
    </Container>
  );
}

export function ListItemSkeleton() {
  return (
    <Container>
      <TitleSkeleton />
      <DescriptionSkeleton />
      <TagContainer>
        <TagSkeleton />
        <TagSkeleton />
        <TagSkeleton />
      </TagContainer>
    </Container>
  );
}
