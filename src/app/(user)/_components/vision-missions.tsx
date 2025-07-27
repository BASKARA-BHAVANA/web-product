import { Card, CardContent } from '@/components/atoms/card';

interface Props {
  vision: string;
  missions: string[];
}

const VisionMissions = ({ vision, missions }: Props) => {
  return (
    <>
      {/* vision  */}
      <div className="mb-12 max-w-3xl">
        <div className="bg-primary ms-3 flex w-fit items-center gap-3 rounded-t-lg p-3">
          <div className="bg-primary-foreground text-primary rounded-md px-3">
            <h3 className="typo-h3">Visi</h3>
          </div>
          <h3 className="typo-h3">Langkah Menuju Harapan</h3>
        </div>
        <Card>
          <CardContent>
            <h4 className="typo-p text-muted-foreground">{vision}</h4>
          </CardContent>
        </Card>
      </div>

      <div className="relative ms-auto max-w-3xl">
        <div className="bg-primary ms-auto me-3 flex w-fit items-center gap-3 rounded-t-lg p-3">
          <div className="bg-primary-foreground text-primary rounded-md px-3">
            <h3 className="typo-h3">Misi</h3>
          </div>
          <h3 className="typo-h3">Upaya Mewujudkan Visi</h3>
        </div>
        <Card>
          <CardContent>
            <div className="flex flex-col items-end gap-3">
              {missions.map((dat, i) => (
                <div key={i} className="flex items-center gap-6 border-b pb-3">
                  <p className="typo-p text-muted-foreground text-end">{dat}</p>
                  <h1 className="typo-h1 text-primary w-6 opacity-50">
                    {i + 1}
                  </h1>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default VisionMissions;
