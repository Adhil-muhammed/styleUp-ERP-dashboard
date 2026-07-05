import type { StaffProfile } from '@/features/staff-management/types/staff-profile';
import { staffFixture } from '@/features/staff-management/api/fixtures/staff.fixture';

const bios: Record<string, string> = {
  'stf-001': 'Senior stylist with 8 years of experience in premium salon services.',
  'stf-002': 'Specialist in classic and modern barbering techniques.',
  'stf-003': 'Certified beautician focused on skincare and bridal packages.',
};

function defaultBio(name: string): string {
  return `${name} is a dedicated team member at StyleQuest partner salons.`;
}

export const staffProfilesFixture: Record<string, StaffProfile> = Object.fromEntries(
  staffFixture.map((member, index) => [
    member.id,
    {
      ...member,
      bio: bios[member.id] ?? defaultBio(member.name),
      joinedAt: `202${(index % 4) + 2}-0${(index % 9) + 1}-15T00:00:00Z`,
      skillIds: [
        'skl-001',
        ...(index % 2 === 0 ? ['skl-002'] : []),
        ...(index % 3 === 0 ? ['skl-003'] : []),
        ...(member.role === 'beautician' ? ['skl-004', 'skl-006'] : []),
      ],
    } satisfies StaffProfile,
  ]),
);

export function getProfileForStaff(staffId: string): StaffProfile {
  const profile = staffProfilesFixture[staffId];
  if (!profile) {
    throw new Error(`Staff profile not found: ${staffId}`);
  }
  return profile;
}
