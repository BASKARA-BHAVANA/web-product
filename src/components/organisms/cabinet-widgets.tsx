import { Card } from '../atoms/card';
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
import { CabinetContact } from '@/generated/prisma';

interface CabinetContactCardProps {
  contact: CabinetContact;
}

const CabinetContactCard = ({ contact }: CabinetContactCardProps) => {
  const icon = useMemo(() => {
    const key = contact.key;

    if (key == 'alamat') return <MapPinIcon size={40} />;
    else if (key == 'email') return <MailIcon size={40} />;
    else if (key == 'whatsapp') return <PhoneIcon size={40} />;
    else if (key == 'instagram') return <InstagramIcon size={40} />;
    else if (key == 'tiktok') return <Music2Icon size={40} />;
    else if (key == 'youtube') return <YoutubeIcon size={40} />;
    else if (key == 'linkedin') return <LinkedinIcon size={40} />;
    else return <ContactIcon size={40} />;
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
    <Card className="hover:shadow-primary cursor-pointer p-6 transition-all hover:scale-105 hover:shadow-xl">
      <Link href={link ?? '#'} target="_blank">
        <div className="flex items-center gap-6">
          <div className="text-primary-foreground">{icon}</div>
          <div className="grid -space-y-1">
            <h4 className="typo-h4 whitespace-nowrap">{contact.value}</h4>
            <p className="typo-p text-muted-foreground">
              {contact.key} {contact.label ? `(${contact.label})` : ''}
            </p>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export { CabinetContactCard };
