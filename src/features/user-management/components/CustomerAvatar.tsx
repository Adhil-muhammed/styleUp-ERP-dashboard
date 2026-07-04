import type React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export type CustomerAvatarProps = {
  name: string;
  avatarUrl?: string;
  size?: 'default' | 'sm' | 'lg';
};

export function CustomerAvatar({
  name,
  avatarUrl,
  size = 'default',
}: CustomerAvatarProps): React.ReactElement {
  return (
    <Avatar size={size}>
      {avatarUrl ? <AvatarImage src={avatarUrl} alt={name} /> : null}
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
}
