import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type React from 'react';
import { useTranslation } from 'react-i18next';

import {
  useShopProfileQuery,
  useUpdateShopGeneralMutation,
} from '@/features/merchant-management/hooks/use-merchant-management-queries';
import { UpdateShopGeneralSchema, type UpdateShopGeneralInput } from '@/features/merchant-management/types/shop';
import { ShopStatusBadge } from '@/features/merchant-management/components/ShopStatusBadge';
import { QuerySection } from '@/shared/components/query/QuerySection';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Textarea } from '@/shared/components/ui/textarea';
import { Can } from '@/shared/lib/casl-context';
import { PERMISSIONS } from '@/shared/config/permissions';

type ShopGeneralInfoTabProps = { merchantId: string };

export function ShopGeneralInfoTab({ merchantId }: ShopGeneralInfoTabProps): React.ReactElement {
  const { t } = useTranslation('merchant-management');
  const { data, isPending, isError } = useShopProfileQuery(merchantId);
  const updateMutation = useUpdateShopGeneralMutation(merchantId);

  const form = useForm<UpdateShopGeneralInput>({
    resolver: zodResolver(UpdateShopGeneralSchema),
    defaultValues: {
      shopName: '',
      ownerName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      description: '',
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        shopName: data.shopName,
        ownerName: data.ownerName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        description: data.description,
      });
    }
  }, [data, form]);

  const onSubmit = form.handleSubmit((values) => {
    updateMutation.mutate(values);
  });

  return (
    <QuerySection
      isPending={isPending}
      isError={isError}
      skeleton={<Skeleton className="h-64 w-full" />}
    >
      {data ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('general.title')}</CardTitle>
            <ShopStatusBadge status={data.status} />
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(event) => {
                void onSubmit(event);
              }}
              className="grid gap-4 sm:grid-cols-2"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('columns.shopName')}</label>
                <Input {...form.register('shopName')} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('columns.owner')}</label>
                <Input {...form.register('ownerName')} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('general.email')}</label>
                <Input type="email" {...form.register('email')} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('general.phone')}</label>
                <Input {...form.register('phone')} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">{t('general.address')}</label>
                <Input {...form.register('address')} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('columns.city')}</label>
                <Input {...form.register('city')} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">{t('general.description')}</label>
                <Textarea rows={3} {...form.register('description')} />
              </div>
              <Can I="manage" a={PERMISSIONS.merchants.manage}>
                <div className="sm:col-span-2">
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {t('form.save')}
                  </Button>
                </div>
              </Can>
            </form>
          </CardContent>
        </Card>
      ) : null}
    </QuerySection>
  );
}
