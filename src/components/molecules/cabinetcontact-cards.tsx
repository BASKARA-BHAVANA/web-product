import { CabinetContact } from '@/generated/prisma';
import { Card, CardTitle, CardDescription } from '../atoms/card';
import { useMemo } from 'react';
import {
  ContactIcon,
  InstagramIcon,
  LinkedinIcon,
  MailIcon,
  MapPinIcon,
  Music2Icon,
  PhoneIcon,
  YoutubeIcon,
} from 'lucide-react';
import Link from 'next/link';

interface CabinetContactCardDefaultProps {
  contact: CabinetContact;
}

const CabinetContactCardDefault = ({
  contact,
}: CabinetContactCardDefaultProps) => {
  const icon = useMemo(() => {
    const key = contact.key;

    if (key == 'alamat') return <MapPinIcon size={32} />;
    else if (key == 'email') return <MailIcon size={32} />;
    else if (key == 'whatsapp') return <PhoneIcon size={32} />;
    else if (key == 'instagram') return <InstagramIcon size={32} />;
    else if (key == 'tiktok') return <Music2Icon size={32} />;
    else if (key == 'youtube') return <YoutubeIcon size={32} />;
    else if (key == 'linkedin') return <LinkedinIcon size={32} />;
    else return <ContactIcon size={32} />;
  }, [contact.key]);

  const link = useMemo(() => {
    const key = contact.key;
    const v = contact.value;

    if (key == 'email') return 'mailto:' + v;
    else if (key == 'whatsapp') return 'https://wa.me/' + v;
    else if (key == 'instagram') return 'https://instagram.com/' + v;
    else if (key == 'tiktok') return 'https://tiktok.com/' + v;
    else if (key == 'youtube') return 'https://youtube.com/' + v;
    else if (key == 'linkedin') return 'https://linkedin.com/' + v;
  }, [contact]);

  return (
    <Card className="shadow-primary cursor-pointer p-6 transition-all hover:scale-105 hover:shadow-xl">
      <Link href={link ?? '#'} target="_blank">
        <div className="flex gap-3">
          <div className="text-muted-foreground">{icon}</div>
          <div>
            <CardTitle className="mb-1 whitespace-nowrap">
              {contact.value}
            </CardTitle>
            <CardDescription>{contact.key}</CardDescription>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export { CabinetContactCardDefault };
