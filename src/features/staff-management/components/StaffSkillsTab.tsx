import type React from 'react';
import { useTranslation } from 'react-i18next';

import { STAFF_SKILL_CATALOG } from '@/features/staff-management/api/fixtures/staff.fixture';
import {
  useStaffSkillsQuery,
  useUpdateStaffSkillsMutation,
} from '@/features/staff-management/hooks/use-staff-management-queries';
import { QuerySection } from '@/shared/components/query/QuerySection';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { PERMISSIONS } from '@/shared/config/permissions';
import { Can } from '@/shared/lib/casl-context';
import { cn } from '@/shared/lib/utils';

type StaffSkillsTabProps = {
  staffId: string;
};

export function StaffSkillsTab({ staffId }: StaffSkillsTabProps): React.ReactElement {
  const { t } = useTranslation('staff-management');
  const { data, isPending, isError } = useStaffSkillsQuery(staffId);
  const updateMutation = useUpdateStaffSkillsMutation(staffId);

  const assignedIds = new Set(data?.map((skill) => skill.id) ?? []);

  const toggleSkill = (skillId: string): void => {
    const next = assignedIds.has(skillId)
      ? [...assignedIds].filter((id) => id !== skillId)
      : [...assignedIds, skillId];
    updateMutation.mutate(next);
  };

  return (
    <QuerySection
      isPending={isPending}
      isError={isError}
      skeleton={<Skeleton className="h-32 w-full" />}
      isEmpty={!data?.length}
      emptyMessage={t('empty.skills')}
    >
      {data ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{t('skills.description')}</p>
          <div className="flex flex-wrap gap-2">
            {data.map((skill) => (
              <Badge key={skill.id} variant="default">
                {skill.name}
              </Badge>
            ))}
          </div>
          <Can I="manage" a={PERMISSIONS.staff.manage}>
            <div className="space-y-2">
              <p className="text-sm font-medium">{t('skills.manage')}</p>
              <div className="flex flex-wrap gap-2">
                {STAFF_SKILL_CATALOG.map((skill) => {
                  const active = assignedIds.has(skill.id);
                  return (
                    <Button
                      key={skill.id}
                      type="button"
                      size="sm"
                      variant={active ? 'default' : 'outline'}
                      className={cn(active && 'ring-2 ring-primary/30')}
                      disabled={updateMutation.isPending}
                      onClick={() => toggleSkill(skill.id)}
                    >
                      {skill.name}
                    </Button>
                  );
                })}
              </div>
            </div>
          </Can>
        </div>
      ) : null}
    </QuerySection>
  );
}
