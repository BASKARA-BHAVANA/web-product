'use client';

import { ComponentProps } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../atoms/card';
import { ScholarsFilter } from '@/lib/actions/scholar';
import InputField from '../atoms/input-field';
import { Input } from '../atoms/input';
import { Checkboxes } from '../atoms/checkboxes';
import { Option } from '@/utils/option';
import { Faculties } from '@/data/faculties';
import { Majors } from '@/data/majors';

interface ScholarsFilterProps extends ComponentProps<'div'> {
  value?: ScholarsFilter;
  onValueChange?: (v: ScholarsFilter) => void;
}

const ScholarsFilterForm = ({
  value,
  onValueChange,
  ...props
}: ScholarsFilterProps) => {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Filter Mahasiswa</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <InputField
          label="Angkatan"
          hint="Pisahkan dengan koma ',' tanpa spasi"
        >
          <Input
            placeholder="Cont: 23,24"
            value={value?.cohorts?.join(',')}
            onChange={(e) =>
              onValueChange?.({
                ...value,
                cohorts: e.target.value.split(','),
              })
            }
          />
        </InputField>
        <InputField label="Sarjana">
          <Checkboxes
            name="degrees"
            options={
              [
                { label: 'S1', value: 'S1' },
                { label: 'S2', value: 'S2' },
                { label: 'S3', value: 'S3' },
              ] as Option[]
            }
            keyValue={'value'}
            keyLabel={'label'}
            values={value?.degrees}
            onValuesChange={(v) =>
              onValueChange?.({
                ...value,
                degrees: v,
              })
            }
          />
        </InputField>
        <InputField label="Fakultas">
          <Checkboxes
            name="faculties"
            options={Faculties}
            keyValue={'value'}
            keyLabel={'label'}
            values={value?.faculties}
            onValuesChange={(v) => {
              onValueChange?.({
                ...value,
                majors: [],
                faculties: v,
              });
            }}
          />
        </InputField>
        <InputField label="Jurusan">
          <Checkboxes
            name="majors"
            options={Majors.filter((m) =>
              value?.faculties?.includes(m.meta?.facultyId ?? '')
            )}
            keyValue={'value'}
            keyLabel={'label'}
            values={value?.majors}
            onValuesChange={(v) =>
              onValueChange?.({
                ...value,
                majors: v,
              })
            }
          />
        </InputField>
      </CardContent>
    </Card>
  );
};

export { ScholarsFilterForm };
