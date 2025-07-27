import { CabinetContactCardDefault } from '@/components/molecules/cabinetcontact-cards';
import { CabinetContact } from '@/generated/prisma';

interface Props {
  contacts: CabinetContact[];
}

const ContactList = ({ contacts }: Props) => {
  return (
    <>
      <div className="mb-12 flex flex-col items-center">
        <div className="bg-primary rounded-t-lg px-3 pt-3">
          <p className="typo-large bg-primary-foreground text-primary rounded-sm px-2">
            Kontak Kami
          </p>
        </div>
        <h1 className="typo-h1 bg-primary w-fit rounded-lg p-3">
          Jangkau Kami Sekarang
        </h1>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6">
        {contacts.map((dat, i) => (
          <CabinetContactCardDefault key={i} contact={dat} />
        ))}
      </div>
    </>
  );
};

export default ContactList;
