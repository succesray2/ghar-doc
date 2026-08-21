import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateFamilyMemberSchema, FamilyRelation, type CreateFamilyMemberInput } from '@ghar-doc/shared';
import { useCreateFamilyMember, useDeleteFamilyMember, useFamilyMembers } from '../../hooks/useFamilyMembers';
import { Card } from '../ui/Card';
import { Field } from '../ui/Field';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const RELATION_LABEL: Record<FamilyRelation, string> = {
  PARENT: 'Parent',
  SPOUSE: 'Spouse',
  CHILD: 'Child',
  OTHER: 'Other',
};

export function FamilyMembersSection() {
  const { data: members, isLoading } = useFamilyMembers();
  const createMember = useCreateFamilyMember();
  const deleteMember = useDeleteFamilyMember();
  const [showForm, setShowForm] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateFamilyMemberInput>({ resolver: zodResolver(CreateFamilyMemberSchema), defaultValues: { relation: 'OTHER' } });

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">Family members</h2>
        <Button variant="secondary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : 'Add member'}
        </Button>
      </div>

      {showForm && (
        <form
          className="mb-4 space-y-3 rounded-md border border-slate-100 p-3"
          onSubmit={handleSubmit((data) => {
            createMember.mutate(data, { onSuccess: () => { reset(); setShowForm(false); } });
          })}
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name" error={errors.name?.message}>
              <Input {...register('name')} />
            </Field>
            <Field label="Relation">
              <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" {...register('relation')}>
                {Object.values(FamilyRelation).map((r) => (
                  <option key={r} value={r}>
                    {RELATION_LABEL[r]}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Age (optional)" error={errors.age?.message}>
              <Input type="number" {...register('age')} />
            </Field>
            <Field label="Phone (optional)" error={errors.phone?.message}>
              <Input {...register('phone')} />
            </Field>
          </div>
          <Button type="submit" disabled={createMember.isPending}>
            {createMember.isPending ? 'Adding…' : 'Add family member'}
          </Button>
        </form>
      )}

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : !members || members.length === 0 ? (
        <p className="text-sm text-slate-500">No family members added yet.</p>
      ) : (
        <ul className="space-y-2">
          {members.map((m) => (
            <li key={m.id} className="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2 text-sm">
              <span className="text-slate-700">
                {m.name} · {RELATION_LABEL[m.relation]}
                {m.age ? `, ${m.age}` : ''}
              </span>
              <button
                onClick={() => deleteMember.mutate(m.id)}
                className="text-xs font-medium text-red-600 hover:underline"
                disabled={deleteMember.isPending}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
