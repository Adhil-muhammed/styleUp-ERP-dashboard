import type React from 'react';
import { RouterProvider } from 'react-router-dom';

import { Providers } from '@/app/providers';
import { router } from '@/app/router';

export default function App(): React.ReactElement {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}
